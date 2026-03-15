import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  buildPlanSnapshot,
  buildUpdatedPublicMetadata,
  toUsagePayload,
} from "@/lib/plan";

type RequestBody = {
  review: string;
  tone: string;
  businessType: string;
  extraInstructions?: string;
};

function buildPrompt({ review, tone, businessType, extraInstructions }: RequestBody) {
  const base = `You are an assistant that writes short, professional business replies to customer reviews.
Write a response that is polite, natural, and ready to post publicly.
Do not mention AI.
Do not invent facts.
If the review is negative, acknowledge the concern and respond calmly.
If the review is positive, thank the customer warmly.
Keep the response between 40 and 90 words unless the user instructions request otherwise.

Business type: ${businessType}
Tone: ${tone}
Review: "${review}"
`;

  const extra = extraInstructions ? `Additional instructions: ${extraInstructions}
` : "";

  return `${base}${extra}`;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to generate replies." },
        { status: 401 }
      );
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const currentMetadata = (user.publicMetadata ?? {}) as Record<string, unknown>;
    const planSnapshot = buildPlanSnapshot(currentMetadata);

    if (planSnapshot.limitReached) {
      return NextResponse.json(
        {
          error: "Free plan limit reached for this month. Upgrade to Pro for unlimited replies.",
          usage: toUsagePayload(planSnapshot),
        },
        { status: 429 }
      );
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!anthropicKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as RequestBody;

    if (!body?.review || !body?.businessType || !body?.tone) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const prompt = buildPrompt(body);
    let reply = "";

    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL ?? "claude-haiku-4-5-20251001",
      max_tokens: 250,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    reply = Array.isArray(response.content)
      ? response.content
          .map(block => ("text" in block && typeof block.text === "string" ? block.text : ""))
          .filter(Boolean)
          .join(" ")
          .trim()
      : "";

    if (!reply) {
      return NextResponse.json(
        { error: "Unable to generate a reply with Anthropic." },
        { status: 500 }
      );
    }

    let finalSnapshot = planSnapshot;

    if (planSnapshot.plan === "free") {
      finalSnapshot = {
        ...planSnapshot,
        usage: {
          month: planSnapshot.usage.month,
          count: planSnapshot.usage.count + 1,
        },
      };

      finalSnapshot = buildPlanSnapshot(
        buildUpdatedPublicMetadata(currentMetadata, finalSnapshot),
        finalSnapshot.usage.month
      );
    }

    if (planSnapshot.needsMetadataUpdate || finalSnapshot.usage.count !== planSnapshot.usage.count) {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: buildUpdatedPublicMetadata(currentMetadata, finalSnapshot),
      });
    }

    return NextResponse.json({
      reply,
      usage: toUsagePayload(finalSnapshot),
    });
  } catch (err) {
    console.error(err);
    let errorMessage = "Internal server error. Please try again later.";
    if (err instanceof Anthropic.APIError) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
