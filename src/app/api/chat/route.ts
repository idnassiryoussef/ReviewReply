import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getCurrentMonthKey, getPlanFromMetadata } from "@/lib/plan";

const SYSTEM_PROMPT =
  "You are ReviewReply AI Assistant. You help business owners write professional replies to customer reviews on Google. You specialize in polite communication, handling negative feedback, improving tone, writing apologies, and keeping responses professional and friendly. Your responses should be concise, clear, and suitable for public business communication.";

const FREE_CHAT_MONTHLY_LIMIT = 5;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_TURNS = 20; // keep last 20 turns to limit context size

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  message?: unknown;
  history?: unknown;
};

function sanitizeText(value: string): string {
  // Strip control chars, normalize newlines, and trim noisy whitespace.
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .trim();
}

function sanitizeHistory(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is ChatMessage =>
        typeof item === "object" &&
        item !== null &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        sanitizeText(item.content).length > 0
    )
    .map((item) => ({
      role: item.role,
      content: sanitizeText(item.content).slice(0, MAX_MESSAGE_LENGTH),
    }))
    .slice(-MAX_HISTORY_TURNS);
}

function getChatUsageFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
  currentMonth: string
): { month: string; count: number } {
  const usage =
    typeof metadata?.chatUsage === "object" && metadata?.chatUsage !== null
      ? (metadata.chatUsage as Record<string, unknown>)
      : {};

  const month = typeof usage.month === "string" ? usage.month : currentMonth;
  const count =
    typeof usage.count === "number" && Number.isFinite(usage.count)
      ? Math.max(0, Math.floor(usage.count))
      : 0;

  if (month !== currentMonth) {
    return { month: currentMonth, count: 0 };
  }

  return { month, count };
}

function toChatUsagePayload(plan: "free" | "pro", month: string, count: number) {
  if (plan === "pro") {
    return {
      plan,
      month,
      usedThisMonth: count,
      monthlyLimit: null,
      remaining: null,
      limitReached: false,
    };
  }

  const remaining = Math.max(FREE_CHAT_MONTHLY_LIMIT - count, 0);
  return {
    plan,
    month,
    usedThisMonth: count,
    monthlyLimit: FREE_CHAT_MONTHLY_LIMIT,
    remaining,
    limitReached: count >= FREE_CHAT_MONTHLY_LIMIT,
  };
}

function looksLikeRawReview(text: string): boolean {
  const hasQuestion = text.includes("?");
  const words = text.split(/\s+/).filter(Boolean).length;
  return !hasQuestion && words >= 8;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    let body: RequestBody;
    try {
      body = (await request.json()) as RequestBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const message = typeof body?.message === "string" ? sanitizeText(body.message) : "";

    if (!message) {
      return NextResponse.json(
        { error: "Please enter a message before sending." },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }

    const history = sanitizeHistory(body?.history);

    let metadata: Record<string, unknown> | null | undefined;
    let plan: "free" | "pro" = "free";
    let currentMonth = getCurrentMonthKey();
    let currentCount = 0;

    if (userId) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      metadata = (user.publicMetadata ?? {}) as Record<string, unknown>;
      plan = getPlanFromMetadata(metadata);
      const usage = getChatUsageFromMetadata(metadata, currentMonth);
      currentMonth = usage.month;
      currentCount = usage.count;

      if (plan === "free" && currentCount >= FREE_CHAT_MONTHLY_LIMIT) {
        return NextResponse.json(
          {
            error:
              "You reached your free assistant limit. Upgrade to Pro for unlimited AI assistance.",
            usage: toChatUsagePayload(plan, currentMonth, currentCount),
          },
          { status: 429 }
        );
      }
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const reviewModeInstruction = looksLikeRawReview(message)
      ? "The user may have pasted a raw review. Start with 'Sentiment: <Positive|Neutral|Negative>', then 'Strategy: <1-2 concise lines>', then 'Suggested reply:' with a polished response ready to post publicly."
      : "If helpful, offer a concise improved reply example for the user to copy.";

    const preparedUserMessage = `${reviewModeInstruction}\n\nUser message:\n${message}`;

    const messages: Anthropic.MessageParam[] = [
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: preparedUserMessage },
    ];

    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL ?? "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    });

    const reply = Array.isArray(response.content)
      ? response.content
          .map((block) =>
            "text" in block && typeof block.text === "string" ? block.text : ""
          )
          .filter(Boolean)
          .join(" ")
          .trim()
      : "";

    if (!reply) {
      return NextResponse.json(
        { error: "The AI returned an empty response. Please try again." },
        { status: 500 }
      );
    }

    if (userId && plan === "free") {
      const client = await clerkClient();
      const nextCount = currentCount + 1;

      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...(metadata ?? {}),
          plan,
          chatUsage: {
            month: currentMonth,
            count: nextCount,
          },
        },
      });

      return NextResponse.json({
        reply,
        usage: toChatUsagePayload(plan, currentMonth, nextCount),
      });
    }

    return NextResponse.json({
      reply,
      usage: userId ? toChatUsagePayload(plan, currentMonth, currentCount) : null,
    });
  } catch (err) {
    console.error("[/api/chat]", err);
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
