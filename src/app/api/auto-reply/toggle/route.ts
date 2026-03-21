import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkPlanLimit } from "@/lib/planGuard";

type ToggleBody = {
  isEnabled?: unknown;
};

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

  const body = (await request.json().catch(() => null)) as ToggleBody | null;
  if (!body || typeof body.isEnabled !== "boolean") {
    return NextResponse.json({ error: "isEnabled must be boolean." }, { status: 400 });
  }

  const settings = await prisma.automationSettings.upsert({
    where: { businessId: userId },
    update: { isEnabled: body.isEnabled },
    create: {
      businessId: userId,
      isEnabled: body.isEnabled,
      autoReplyStarRatings: [4, 5],
      delayMinutes: 5,
      dailyReplyLimit: 10,
      dryRunMode: true,
    },
  });

  return NextResponse.json({ settings });
}
