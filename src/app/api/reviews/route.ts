import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { googleReviewsService } from "@/services/googleReviewsService";
import { classifyReview, generateReplyPair } from "@/lib/reputationShield";
import { createPendingAutomationJob, queueReviewJob } from "@/lib/autoReplyProcessor";
import { checkPlanLimit } from "@/lib/planGuard";

function normalizeTone(value: unknown): "friendly" | "professional" | "apologetic" {
  if (value === "friendly" || value === "professional" || value === "apologetic") {
    return value;
  }
  return "professional";
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  // Bootstrap with mocked provider reviews when inbox is empty.
  const existingCount = await prisma.review.count({ where: { businessId: userId } });
  if (existingCount === 0) {
    const externalReviews = await googleReviewsService.fetchReviews(userId);
    for (const external of externalReviews) {
      await queueReviewJob({
        businessId: userId,
        externalId: external.externalId,
        source: external.source,
        authorName: external.authorName,
        rating: external.rating,
        reviewText: external.reviewText,
      });
    }
  }

  const reviews = await prisma.review.findMany({
    where: { businessId: userId },
    include: {
      replies: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    reviews: reviews.map((review) => {
      const latest = review.replies[0] ?? null;
      return {
        id: review.id,
        externalId: review.externalId,
        source: review.source,
        authorName: review.authorName,
        rating: review.rating,
        reviewText: review.reviewText,
        classification: review.classification,
        needsAttention: review.needsAttention,
        state: review.state,
        receivedAt: review.receivedAt,
        publicReply: latest?.publicReply ?? null,
        privateResolutionMessage: latest?.privateResolutionMessage ?? null,
        replyStatus: latest?.status ?? null,
        tone: (latest?.tone as "friendly" | "professional" | "apologetic" | undefined) ??
          "professional",
      };
    }),
  });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        action?: unknown;
        reviewId?: unknown;
        tone?: unknown;
        publicReply?: unknown;
        privateResolutionMessage?: unknown;
      }
    | null;

  if (!body || typeof body.action !== "string" || typeof body.reviewId !== "string") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const review = await prisma.review.findFirst({
    where: {
      id: body.reviewId,
      businessId: userId,
    },
    include: {
      replies: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!review) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }

  if (body.action === "generate") {
    const allowed = await checkPlanLimit(userId, "reply_generation");
    if (!allowed) {
      return NextResponse.json(
        { error: "Free plan daily limit reached (10 replies/day).", code: "UPGRADE_REQUIRED" },
        { status: 429 }
      );
    }

    const shield = await classifyReview(review.reviewText, review.rating);
    const tone = normalizeTone(body.tone);

    const pair = await generateReplyPair({
      reviewText: review.reviewText,
      rating: review.rating,
      classification: shield.classification,
      tone,
    });

    const reply = await prisma.reply.create({
      data: {
        reviewId: review.id,
        businessId: userId,
        tone,
        publicReply: pair.publicReply,
        privateResolutionMessage: pair.privateResolutionMessage,
        status: "SUGGESTED",
      },
    });

    await createPendingAutomationJob({
      businessId: userId,
      reviewId: review.id,
      delayMinutes: 0,
    });

    await prisma.review.update({
      where: { id: review.id },
      data: {
        classification: shield.classification,
        needsAttention: shield.classification === "danger",
        state: shield.classification === "danger" ? "NEEDS_ATTENTION" : "DRAFT_READY",
      },
    });

    return NextResponse.json({
      reply,
      classification: shield.classification,
      needsAttention: shield.classification === "danger",
    });
  }

  if (body.action === "approve-send") {
    const latest = review.replies[0];
    if (!latest) {
      return NextResponse.json({ error: "Generate a reply first." }, { status: 400 });
    }

    const nextPublicReply =
      typeof body.publicReply === "string" && body.publicReply.trim().length > 0
        ? body.publicReply.trim()
        : latest.publicReply;

    const nextPrivate =
      typeof body.privateResolutionMessage === "string" &&
      body.privateResolutionMessage.trim().length > 0
        ? body.privateResolutionMessage.trim()
        : latest.privateResolutionMessage;

    const updated = await prisma.reply.update({
      where: { id: latest.id },
      data: {
        publicReply: nextPublicReply,
        privateResolutionMessage: nextPrivate,
        status: "SENT",
        approvedAt: new Date(),
        sentAt: new Date(),
      },
    });

    await prisma.review.update({
      where: { id: review.id },
      data: {
        state: "SENT",
      },
    });

    if (review.externalId) {
      await googleReviewsService.postReply({
        externalReviewId: review.externalId,
        publicReply: nextPublicReply,
      });
    }

    return NextResponse.json({ reply: updated });
  }

  if (body.action === "resolve") {
    const resolved = await prisma.review.update({
      where: { id: review.id },
      data: {
        state: "RESOLVED",
      },
    });

    return NextResponse.json({ review: resolved });
  }

  return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
}
