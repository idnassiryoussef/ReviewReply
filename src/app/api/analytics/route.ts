import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkPlanLimit } from "@/lib/planGuard";

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const analyticsAllowed = await checkPlanLimit(userId, "analytics");
  if (!analyticsAllowed) {
    return NextResponse.json(
      {
        error: "Analytics is a Pro feature.",
        code: "UPGRADE_REQUIRED",
      },
      { status: 403 }
    );
  }

  const now = new Date();
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [reviews, replies] = await Promise.all([
    prisma.review.findMany({
      where: { businessId: userId, createdAt: { gte: last30 } },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        rating: true,
        classification: true,
        createdAt: true,
        state: true,
      },
    }),
    prisma.reply.findMany({
      where: { businessId: userId, createdAt: { gte: last30 } },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        reviewId: true,
        createdAt: true,
        sentAt: true,
        status: true,
      },
    }),
  ]);

  const replyByReviewId = new Map<string, Date>();
  for (const reply of replies) {
    const current = replyByReviewId.get(reply.reviewId);
    const candidate = reply.sentAt ?? reply.createdAt;
    if (!current || candidate < current) {
      replyByReviewId.set(reply.reviewId, candidate);
    }
  }

  const totalReviews = reviews.length;
  const repliedReviews = reviews.filter((review) => replyByReviewId.has(review.id)).length;
  const repliedReviewsPercent =
    totalReviews > 0 ? Math.round((repliedReviews / totalReviews) * 100) : 0;

  const responseDurationsMinutes: number[] = [];
  for (const review of reviews) {
    const sentAt = replyByReviewId.get(review.id);
    if (!sentAt) continue;
    const diff = Math.max(0, sentAt.getTime() - review.createdAt.getTime()) / 60000;
    responseDurationsMinutes.push(diff);
  }

  const averageResponseTimeMinutes =
    responseDurationsMinutes.length > 0
      ? Math.max(
          1,
          Math.round(
            responseDurationsMinutes.reduce((sum, value) => sum + value, 0) /
              responseDurationsMinutes.length
          )
        )
      : 0;

  const sentimentDistribution = {
    positive: reviews.filter((r) => r.classification === "positive").length,
    neutral: reviews.filter((r) => r.classification === "neutral").length,
    negative: reviews.filter((r) => r.classification === "negative").length,
    danger: reviews.filter((r) => r.classification === "danger").length,
  };

  const reviewsPerDayMap: Record<string, number> = {};
  const negativeDangerTrendMap: Record<string, number> = {};

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = dayKey(date);
    reviewsPerDayMap[key] = 0;
    negativeDangerTrendMap[key] = 0;
  }

  for (const review of reviews) {
    const key = dayKey(review.createdAt);
    if (!(key in reviewsPerDayMap)) continue;
    reviewsPerDayMap[key] += 1;
    if (review.classification === "negative" || review.classification === "danger") {
      negativeDangerTrendMap[key] += 1;
    }
  }

  const reviewsPerDay = Object.entries(reviewsPerDayMap).map(([date, count]) => ({ date, count }));
  const negativeDangerTrend = Object.entries(negativeDangerTrendMap).map(([date, count]) => ({
    date,
    count,
  }));

  return NextResponse.json({
    totalReviews,
    repliedReviewsPercent,
    averageResponseTimeMinutes,
    sentimentDistribution,
    reviewsPerDay,
    negativeDangerTrend,
  });
}
