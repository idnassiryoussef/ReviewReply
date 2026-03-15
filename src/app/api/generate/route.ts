import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  buildPlanSnapshot,
  buildUpdatedPublicMetadata,
  toUsagePayload,
} from "@/lib/plan";

const MAX_REVIEW_LENGTH = 1000;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to generate replies." },
        { status: 401 }
      );
    }

    // Parse and validate input
    let body: { review?: unknown };
    try {
      body = (await request.json()) as { review?: unknown };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const review = typeof body?.review === "string" ? body.review.trim() : "";

    if (!review) {
      return NextResponse.json(
        { error: "Review text is required." },
        { status: 400 }
      );
    }

    if (review.length > MAX_REVIEW_LENGTH) {
      return NextResponse.json(
        { error: `Review must be ${MAX_REVIEW_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }

    // Check plan and usage
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const currentMetadata = (user.publicMetadata ?? {}) as Record<string, unknown>;
    const planSnapshot = buildPlanSnapshot(currentMetadata);

    if (planSnapshot.limitReached) {
      return NextResponse.json(
        {
          error:
            "You've reached the free limit. Upgrade to Pro for unlimited replies.",
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

    // Build prompt per spec
    const prompt = `You are a professional business owner replying to customer reviews on Google. Write a polite, professional, public-ready response to the following review. Keep it friendly and concise. The reply should be between 40 and 90 words.

Review: "${review}"`;

    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL ?? "claude-haiku-4-5-20251001",
      max_tokens: 250,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
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
        { error: "Unable to generate a reply. Please try again." },
        { status: 500 }
      );
    }

    // Increment usage count for free plan users
    let finalSnapshot = planSnapshot;
    if (planSnapshot.plan === "free") {
      const updatedMetadata = buildUpdatedPublicMetadata(currentMetadata, {
        ...planSnapshot,
        usage: {
          month: planSnapshot.usage.month,
          count: planSnapshot.usage.count + 1,
        },
      });
      finalSnapshot = buildPlanSnapshot(updatedMetadata);
    }

    if (
      planSnapshot.needsMetadataUpdate ||
      finalSnapshot.usage.count !== planSnapshot.usage.count
    ) {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: buildUpdatedPublicMetadata(currentMetadata, finalSnapshot),
      });
    }

    return NextResponse.json({
      reply,
      usage: toUsagePayload(finalSnapshot),
    });
  } catch (err) {
    console.error("[/api/generate]", err);
    const message =
      err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
