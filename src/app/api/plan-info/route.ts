import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPlanInfo } from "@/lib/planGuard";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({
      plan: "free",
      dailyRepliesUsed: 0,
      dailyRepliesLimit: 10,
      usagePercent: 0,
    });
  }

  try {
    const info = await getPlanInfo(userId);
    return NextResponse.json(info);
  } catch {
    return NextResponse.json({
      plan: "free",
      dailyRepliesUsed: 0,
      dailyRepliesLimit: 10,
      usagePercent: 0,
    });
  }
}
