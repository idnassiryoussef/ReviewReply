import { prisma } from "@/lib/prisma";
import {
  classifyReview,
  generateReplyPair,
  type ReviewClassification,
} from "@/lib/reputationShield";
import { googleReviewsService } from "@/services/googleReviewsService";

type ToneOption = "friendly" | "professional" | "apologetic";

function mapToneFromClassification(classification: ReviewClassification): ToneOption {
  if (classification === "danger") return "apologetic";
  if (classification === "negative") return "apologetic";
  if (classification === "neutral") return "professional";
  return "friendly";
}

function defaultStateForClassification(classification: ReviewClassification) {
  return classification === "danger" ? "NEEDS_ATTENTION" : "NEW";
}

export async function getOrCreateAutomationSettings(businessId: string) {
  return prisma.automationSettings.upsert({
    where: { businessId },
    update: {},
    create: {
      businessId,
      isEnabled: false,
      autoReplyStarRatings: [4, 5],
      delayMinutes: 5,
      dailyReplyLimit: 10,
      dryRunMode: true,
    },
  });
}

export async function createPendingAutomationJob(input: {
  businessId: string;
  reviewId: string;
  delayMinutes?: number;
}) {
  const settings = await getOrCreateAutomationSettings(input.businessId);
  const delayMinutes =
    typeof input.delayMinutes === "number"
      ? Math.max(0, Math.floor(input.delayMinutes))
      : settings.delayMinutes;

  const runAt = new Date(Date.now() + delayMinutes * 60 * 1000);

  return prisma.jobLog.create({
    data: {
      businessId: input.businessId,
      reviewId: input.reviewId,
      status: "PENDING",
      runAt,
    },
  });
}

export async function queueReviewJob(input: {
  businessId: string;
  externalId?: string | null;
  source?: string;
  authorName?: string | null;
  rating: number;
  reviewText: string;
}) {
  const shield = await classifyReview(input.reviewText, input.rating);

  const review = await prisma.review.create({
    data: {
      businessId: input.businessId,
      externalId: input.externalId ?? null,
      source: input.source ?? "google",
      authorName: input.authorName ?? null,
      rating: input.rating,
      reviewText: input.reviewText,
      classification: shield.classification,
      needsAttention: shield.classification === "danger",
      state: defaultStateForClassification(shield.classification),
      receivedAt: new Date(),
    },
  });

  const job = await createPendingAutomationJob({
    businessId: input.businessId,
    reviewId: review.id,
  });

  return { review, job, shield };
}

async function dailyReplyCount(businessId: string): Promise<number> {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);

  return prisma.reply.count({
    where: {
      businessId,
      status: "SENT",
      sentAt: { gte: start },
    },
  });
}

async function updateJob(
  jobId: string,
  data: {
    status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "SKIPPED";
    replyId?: string;
    skipReason?: string | null;
    errorMessage?: string | null;
    startedAt?: Date;
    finishedAt?: Date;
  }
) {
  await prisma.jobLog.update({
    where: { id: jobId },
    data,
  });
}

export async function processJob(jobId: string) {
  const job = await prisma.jobLog.findUnique({
    where: { id: jobId },
    include: { review: true },
  });

  if (!job) {
    return { ok: false, status: "FAILED", reason: "Job not found" };
  }

  if (job.status !== "RUNNING") {
    return {
      ok: false,
      status: "SKIPPED",
      reason: `Job ${job.id} is not claimed for processing (status=${job.status}).`,
    };
  }

  const settings = await getOrCreateAutomationSettings(job.businessId);

  if (job.review.classification === "danger") {
    await prisma.review.update({
      where: { id: job.reviewId },
      data: {
        state: "NEEDS_ATTENTION",
        needsAttention: true,
      },
    });

    await updateJob(job.id, {
      status: "SKIPPED",
      skipReason: "Needs Attention: danger review",
      finishedAt: new Date(),
    });
    return { ok: false, status: "SKIPPED", reason: "Danger review" };
  }

  if (!settings.autoReplyStarRatings.includes(job.review.rating)) {
    await updateJob(job.id, {
      status: "SKIPPED",
      skipReason: "Star rating excluded by settings",
      finishedAt: new Date(),
    });
    return { ok: false, status: "SKIPPED", reason: "Rating excluded" };
  }

  const sentToday = await dailyReplyCount(job.businessId);
  if (sentToday >= settings.dailyReplyLimit) {
    await updateJob(job.id, {
      status: "SKIPPED",
      skipReason: "Daily reply limit reached",
      finishedAt: new Date(),
    });
    return { ok: false, status: "SKIPPED", reason: "Daily limit reached" };
  }

  try {
    const existingReply = await prisma.reply.findFirst({
      where: {
        reviewId: job.review.id,
        businessId: job.businessId,
      },
      orderBy: { createdAt: "desc" },
    });

    const tone = mapToneFromClassification(job.review.classification as ReviewClassification);

    const reply =
      existingReply ??
      (await prisma.reply.create({
        data: {
          reviewId: job.review.id,
          businessId: job.businessId,
          tone,
          ...(await (async () => {
            const generated = await generateReplyPair({
              reviewText: job.review.reviewText,
              rating: job.review.rating,
              classification: job.review.classification as ReviewClassification,
              tone,
            });

            return {
              publicReply: generated.publicReply,
              privateResolutionMessage: generated.privateResolutionMessage,
              status: settings.dryRunMode ? "APPROVED" : "SENT",
              approvedAt: new Date(),
              sentAt: settings.dryRunMode ? null : new Date(),
            };
          })()),
        },
      }));

    if (existingReply && !settings.dryRunMode && existingReply.status !== "SENT") {
      await prisma.reply.update({
        where: { id: existingReply.id },
        data: {
          status: "SENT",
          approvedAt: existingReply.approvedAt ?? new Date(),
          sentAt: existingReply.sentAt ?? new Date(),
        },
      });
    }

    if (!settings.dryRunMode && job.review.externalId) {
      const latestReply = await prisma.reply.findUnique({ where: { id: reply.id } });
      const replyToPublish = latestReply?.publicReply ?? reply.publicReply;

      const publish = await googleReviewsService.postReply({
        externalReviewId: job.review.externalId,
        publicReply: replyToPublish,
      });

      if (!publish.ok) {
        await prisma.reply.update({
          where: { id: reply.id },
          data: { status: "FAILED" },
        });

        await updateJob(job.id, {
          status: "FAILED",
          replyId: reply.id,
          errorMessage: publish.providerMessage,
          finishedAt: new Date(),
        });

        return { ok: false, status: "FAILED", reason: publish.providerMessage };
      }
    }

    await prisma.review.update({
      where: { id: job.review.id },
      data: {
        state: settings.dryRunMode ? "APPROVED" : "SENT",
      },
    });

    await updateJob(job.id, {
      status: "SUCCESS",
      replyId: reply.id,
      finishedAt: new Date(),
    });

    return { ok: true, status: "SUCCESS", replyId: reply.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Automation failed";

    await updateJob(job.id, {
      status: "FAILED",
      errorMessage: message,
      finishedAt: new Date(),
    });

    return { ok: false, status: "FAILED", reason: message };
  }
}

export async function processDueJobs(businessId?: string) {
  const now = new Date();
  const jobs = await prisma.jobLog.findMany({
    where: {
      status: "PENDING",
      runAt: { lte: now },
      ...(businessId ? { businessId } : {}),
    },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  const results: Array<{ jobId: string; ok: boolean; status: string; reason?: string }> = [];

  for (const job of jobs) {
    const claimed = await prisma.jobLog.updateMany({
      where: {
        id: job.id,
        status: "PENDING",
      },
      data: {
        status: "RUNNING",
        startedAt: new Date(),
        skipReason: null,
        errorMessage: null,
      },
    });

    if (claimed.count === 0) {
      results.push({
        jobId: job.id,
        ok: false,
        status: "SKIPPED",
        reason: "Job already claimed by another worker.",
      });
      continue;
    }

    const result = await processJob(job.id);
    results.push({
      jobId: job.id,
      ok: result.ok,
      status: result.status,
      reason: "reason" in result ? result.reason : undefined,
    });
  }

  return {
    processed: results.length,
    results,
  };
}
