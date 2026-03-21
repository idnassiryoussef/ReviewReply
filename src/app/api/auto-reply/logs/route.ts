import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ items: [], pagination: { page: 1, totalPages: 1, total: 0 } });
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get("pageSize") ?? "20")));

  const [total, items] = await Promise.all([
    prisma.jobLog.count({ where: { businessId: userId } }),
    prisma.jobLog.findMany({
      where: { businessId: userId },
      include: {
        review: {
          select: {
            id: true,
            rating: true,
            reviewText: true,
            classification: true,
          },
        },
        reply: {
          select: {
            publicReply: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    items: items.map((item) => ({
      id: item.id,
      reviewId: item.reviewId,
      status: item.status,
      generatedReply: item.reply?.publicReply ?? "",
      skipReason: item.skipReason,
      reviewStars: item.review.rating,
      reviewSnippet:
        item.review.reviewText.length > 120
          ? `${item.review.reviewText.slice(0, 119)}...`
          : item.review.reviewText,
      detectedLanguage: "en",
      createdAt: item.createdAt,
      classification: item.review.classification,
    })),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
}
