import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateAutomationSettings } from "@/lib/autoReplyProcessor";
import { prisma } from "@/lib/prisma";
import { checkPlanLimit } from "@/lib/planGuard";

type SettingsBody = {
  isEnabled?: unknown;
  autoReplyStarRatings?: unknown;
  delayMinutes?: unknown;
  dailyReplyLimit?: unknown;
  dryRunMode?: unknown;
};

function normalizeStars(value: unknown): number[] {
  if (!Array.isArray(value)) return [4, 5];
  const normalized = Array.from(
    new Set(
      value
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item) && item >= 1 && item <= 5)
        .map((item) => Math.floor(item))
    )
  ).sort((a, b) => a - b);

  return normalized.length > 0 ? normalized : [4, 5];
}

function normalizeDelay(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 5;
  return Math.min(30, Math.max(5, Math.floor(n)));
}

function normalizeDailyLimit(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 10;
  return Math.min(1000, Math.max(1, Math.floor(n)));
}

export async function GET() {
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

  const settings = await getOrCreateAutomationSettings(userId);
  return NextResponse.json({ settings });
}

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

  const body = (await request.json().catch(() => null)) as SettingsBody | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const settings = await prisma.automationSettings.upsert({
    where: { businessId: userId },
    update: {
      isEnabled: typeof body.isEnabled === "boolean" ? body.isEnabled : false,
      autoReplyStarRatings: normalizeStars(body.autoReplyStarRatings),
      delayMinutes: normalizeDelay(body.delayMinutes),
      dailyReplyLimit: normalizeDailyLimit(body.dailyReplyLimit),
      dryRunMode: typeof body.dryRunMode === "boolean" ? body.dryRunMode : true,
    },
    create: {
      businessId: userId,
      isEnabled: typeof body.isEnabled === "boolean" ? body.isEnabled : false,
      autoReplyStarRatings: normalizeStars(body.autoReplyStarRatings),
      delayMinutes: normalizeDelay(body.delayMinutes),
      dailyReplyLimit: normalizeDailyLimit(body.dailyReplyLimit),
      dryRunMode: typeof body.dryRunMode === "boolean" ? body.dryRunMode : true,
    },
  });

  return NextResponse.json({ settings });
}
