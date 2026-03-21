import Anthropic from "@anthropic-ai/sdk";

export type ReviewClassification = "positive" | "neutral" | "negative" | "danger";

export type ReputationShieldResult = {
  classification: ReviewClassification;
  confidence: number;
  reason: string;
};

export type ReplyPair = {
  publicReply: string;
  privateResolutionMessage: string;
};

const DANGER_KEYWORDS = [
  "legal",
  "lawyer",
  "sue",
  "lawsuit",
  "fraud",
  "scam",
  "unsafe",
  "poison",
  "emergency",
  "police",
  "complaint",
];

function heuristicClassification(reviewText: string, rating: number): ReputationShieldResult {
  const text = reviewText.toLowerCase();
  const hasDangerKeyword = DANGER_KEYWORDS.some((keyword) => text.includes(keyword));
  const angrySignals = /(worst|never again|disgusting|terrible|awful|furious|angry)/.test(text);

  if (hasDangerKeyword || (rating <= 2 && angrySignals)) {
    return {
      classification: "danger",
      confidence: 0.72,
      reason: "Detected legal-risk or escalated complaint language.",
    };
  }

  if (rating >= 4) {
    return {
      classification: "positive",
      confidence: 0.68,
      reason: "Mostly positive sentiment and high star rating.",
    };
  }

  if (rating === 3) {
    return {
      classification: "neutral",
      confidence: 0.62,
      reason: "Mixed sentiment with moderate rating.",
    };
  }

  return {
    classification: "negative",
    confidence: 0.65,
    reason: "Low rating and complaint-oriented wording.",
  };
}

export async function classifyReview(
  reviewText: string,
  rating: number
): Promise<ReputationShieldResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return heuristicClassification(reviewText, rating);
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL ?? "claude-haiku-4-5-20251001",
      max_tokens: 220,
      temperature: 0,
      messages: [
        {
          role: "user",
          content:
            "Classify this customer review for reputation management. " +
            "Output valid JSON only: {\"classification\":\"positive|neutral|negative|danger\",\"confidence\":0-1,\"reason\":\"...\"}. " +
            "Danger means legal risk, threats, severe complaint, or potentially harmful incident. " +
            `Rating: ${rating}. Review: ${reviewText}`,
        },
      ],
    });

    const text = Array.isArray(response.content)
      ? response.content
          .map((block) => ("text" in block && typeof block.text === "string" ? block.text : ""))
          .join(" ")
          .trim()
      : "";

    if (!text) {
      return heuristicClassification(reviewText, rating);
    }

    const parsed = JSON.parse(text) as {
      classification?: unknown;
      confidence?: unknown;
      reason?: unknown;
    };

    const classification =
      parsed.classification === "positive" ||
      parsed.classification === "neutral" ||
      parsed.classification === "negative" ||
      parsed.classification === "danger"
        ? parsed.classification
        : heuristicClassification(reviewText, rating).classification;

    const confidence =
      typeof parsed.confidence === "number" && Number.isFinite(parsed.confidence)
        ? Math.max(0, Math.min(1, parsed.confidence))
        : 0.7;

    const reason =
      typeof parsed.reason === "string" && parsed.reason.trim().length > 0
        ? parsed.reason.trim()
        : "Classified by AI sentiment policy.";

    return { classification, confidence, reason };
  } catch {
    return heuristicClassification(reviewText, rating);
  }
}

export async function generateReplyPair(input: {
  reviewText: string;
  rating: number;
  classification: ReviewClassification;
  tone: "friendly" | "professional" | "apologetic";
  businessType?: string;
}): Promise<ReplyPair> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const fallback: ReplyPair = {
    publicReply:
      "Thank you for your feedback. We appreciate you sharing your experience and we are committed to improving every visit.",
    privateResolutionMessage:
      "Hi, thank you for sharing this. We would like to understand what happened and resolve this directly. Please contact us so we can make this right.",
  };

  if (!apiKey) {
    return fallback;
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL ?? "claude-haiku-4-5-20251001",
      max_tokens: 450,
      temperature: 0.55,
      messages: [
        {
          role: "user",
          content:
            "Create two outputs for reputation management. Output valid JSON only: " +
            '{"publicReply":"...","privateResolutionMessage":"..."}. ' +
            "Rules: publicReply should be concise, ready for Google, and never mention legal liability. " +
            "privateResolutionMessage should be empathetic and action-oriented for DM/email follow-up. " +
            `Classification: ${input.classification}. Tone: ${input.tone}. Rating: ${input.rating}. ` +
            `Business type: ${input.businessType ?? "local business"}. Review: ${input.reviewText}`,
        },
      ],
    });

    const text = Array.isArray(response.content)
      ? response.content
          .map((block) => ("text" in block && typeof block.text === "string" ? block.text : ""))
          .join(" ")
          .trim()
      : "";

    if (!text) {
      return fallback;
    }

    const parsed = JSON.parse(text) as {
      publicReply?: unknown;
      privateResolutionMessage?: unknown;
    };

    const publicReply =
      typeof parsed.publicReply === "string" && parsed.publicReply.trim().length > 0
        ? parsed.publicReply.trim()
        : fallback.publicReply;

    const privateResolutionMessage =
      typeof parsed.privateResolutionMessage === "string" &&
      parsed.privateResolutionMessage.trim().length > 0
        ? parsed.privateResolutionMessage.trim()
        : fallback.privateResolutionMessage;

    return {
      publicReply,
      privateResolutionMessage,
    };
  } catch {
    return fallback;
  }
}
