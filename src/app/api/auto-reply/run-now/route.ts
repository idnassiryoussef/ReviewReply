import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { processDueJobs, queueReviewJob } from "@/lib/autoReplyProcessor";
import { checkPlanLimit } from "@/lib/planGuard";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const allowed = await checkPlanLimit(userId, "automation");
  if (!allowed) {
    return NextResponse.json(
      { error: "Automation is a Pro feature.", code: "UPGRADE_REQUIRED" },
      { status: 403 }
    );
  }

  const body = (await request.json().catch(() => null)) as
    | {
        externalId?: unknown;
        source?: unknown;
        authorName?: unknown;
        stars?: unknown;
        reviewText?: unknown;
      }
    | null;

  const reviewText = typeof body?.reviewText === "string" ? body.reviewText.trim() : "";
  const stars = Number(body?.stars);

  if (!reviewText || !Number.isFinite(stars) || stars < 1 || stars > 5) {
    return NextResponse.json(
      { error: "reviewText and stars (1-5) are required." },
      { status: 400 }
    );
  }

  const queued = await queueReviewJob({
    businessId: userId,
    externalId: typeof body?.externalId === "string" ? body.externalId : null,
    source: typeof body?.source === "string" ? body.source : "google",
    authorName: typeof body?.authorName === "string" ? body.authorName : null,
    rating: Math.floor(stars),
    reviewText,
  });

  const processing = await processDueJobs(userId);

  return NextResponse.json({
    queuedReviewId: queued.review.id,
    queuedJobId: queued.job.id,
    classification: queued.shield.classification,
    processedNow: processing,
  });
}
