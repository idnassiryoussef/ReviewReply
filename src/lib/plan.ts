export type AppPlan = "free" | "pro";

export type UsageRecord = {
  month: string;
  count: number;
};

export type PlanSnapshot = {
  plan: AppPlan;
  usage: UsageRecord;
  monthlyLimit: number | null;
  remaining: number | null;
  limitReached: boolean;
  needsMetadataUpdate: boolean;
};

export const FREE_PLAN_MONTHLY_LIMIT = 10;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getCurrentMonthKey(date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getPlanFromMetadata(metadata: Record<string, unknown> | null | undefined): AppPlan {
  const plan = metadata?.plan;
  return plan === "pro" ? "pro" : "free";
}

export function getUsageFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
  currentMonth: string
): { usage: UsageRecord; needsReset: boolean } {
  const rawUsage = isObject(metadata?.replyUsage) ? metadata?.replyUsage : {};
  const rawMonth = typeof rawUsage.month === "string" ? rawUsage.month : currentMonth;
  const rawCount = typeof rawUsage.count === "number" && Number.isFinite(rawUsage.count)
    ? Math.max(0, Math.floor(rawUsage.count))
    : 0;

  if (rawMonth !== currentMonth) {
    return { usage: { month: currentMonth, count: 0 }, needsReset: true };
  }

  const metadataMissing = !isObject(metadata?.replyUsage);
  return {
    usage: { month: currentMonth, count: rawCount },
    needsReset: metadataMissing,
  };
}

export function buildPlanSnapshot(
  metadata: Record<string, unknown> | null | undefined,
  currentMonth = getCurrentMonthKey()
): PlanSnapshot {
  const plan = getPlanFromMetadata(metadata);
  const { usage, needsReset } = getUsageFromMetadata(metadata, currentMonth);

  if (plan === "pro") {
    return {
      plan,
      usage,
      monthlyLimit: null,
      remaining: null,
      limitReached: false,
      needsMetadataUpdate: needsReset || metadata?.plan !== "pro",
    };
  }

  const remaining = Math.max(FREE_PLAN_MONTHLY_LIMIT - usage.count, 0);

  return {
    plan,
    usage,
    monthlyLimit: FREE_PLAN_MONTHLY_LIMIT,
    remaining,
    limitReached: usage.count >= FREE_PLAN_MONTHLY_LIMIT,
    needsMetadataUpdate: needsReset || metadata?.plan !== "free",
  };
}

export function buildUpdatedPublicMetadata(
  existingMetadata: Record<string, unknown> | null | undefined,
  snapshot: PlanSnapshot
): Record<string, unknown> {
  return {
    ...(existingMetadata ?? {}),
    plan: snapshot.plan,
    replyUsage: snapshot.usage,
  };
}

export function toUsagePayload(snapshot: PlanSnapshot) {
  return {
    plan: snapshot.plan,
    month: snapshot.usage.month,
    usedThisMonth: snapshot.usage.count,
    monthlyLimit: snapshot.monthlyLimit,
    remaining: snapshot.remaining,
  };
}
