import { prisma } from "@/lib/prisma";

type PlanTier = "free" | "pro";

const FREE_DAILY_REPLIES = 10;

async function getSubscriptionTier(businessId: string): Promise<PlanTier> {
  try {
    const sub = await prisma.subscription.findUnique({ where: { businessId } });
    if (!sub || sub.status !== "active") return "free";
    return sub.plan === "pro" ? "pro" : "free";
  } catch {
    return "free";
  }
}

function startOfUtcDay() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function checkPlanLimit(
  businessId: string,
  feature: "reply_generation" | "automation" | "analytics"
): Promise<boolean> {
  const tier = await getSubscriptionTier(businessId);

  if (feature === "automation") {
    return tier === "pro";
  }

  if (feature === "analytics") {
    return tier === "pro";
  }

  if (tier === "pro") {
    return true;
  }

  const usedToday = await prisma.reply.count({
    where: {
      businessId,
      createdAt: { gte: startOfUtcDay() },
    },
  });

  return usedToday < FREE_DAILY_REPLIES;
}

export async function getPlanInfo(businessId: string): Promise<{
  plan: PlanTier;
  dailyRepliesUsed: number;
  dailyRepliesLimit: number;
  usagePercent: number;
}> {
  const plan = await getSubscriptionTier(businessId);

  if (plan === "pro") {
    return {
      plan,
      dailyRepliesUsed: 0,
      dailyRepliesLimit: -1,
      usagePercent: 0,
    };
  }

  const dailyRepliesUsed = await prisma.reply.count({
    where: {
      businessId,
      createdAt: { gte: startOfUtcDay() },
    },
  });

  return {
    plan,
    dailyRepliesUsed,
    dailyRepliesLimit: FREE_DAILY_REPLIES,
    usagePercent: Math.min(100, Math.round((dailyRepliesUsed / FREE_DAILY_REPLIES) * 100)),
  };
}
