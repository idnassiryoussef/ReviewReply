import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({
      totalThisMonth: 0,
      successRate: 0,
      avgResponseTimeMinutes: 0,
      skippedToday: 0,
    });
  }

  const jobs = await prisma.jobLog.findMany({
    where: { businessId: userId },
    include: {
      reply: {
        select: {
          sentAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  const now = new Date();
  const thisMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const thisMonthJobs = jobs.filter((job) => job.createdAt >= thisMonthStart);
  const completedJobs = thisMonthJobs.filter((job) =>
    ["SUCCESS", "FAILED", "SKIPPED"].includes(job.status)
  );
  const successJobs = completedJobs.filter((job) => job.status === "SUCCESS");

  const avgResponseTimeMinutes =
    successJobs.length > 0
      ? Math.max(
          1,
          Math.round(
            successJobs.reduce((sum, job) => {
              const end = job.reply?.sentAt ?? job.finishedAt ?? job.createdAt;
              return sum + Math.max(0, end.getTime() - job.createdAt.getTime());
            }, 0) /
              successJobs.length /
              60000
          )
        )
      : 0;

  return NextResponse.json({
    totalThisMonth: thisMonthJobs.length,
    successRate:
      completedJobs.length > 0
        ? Math.round((successJobs.length / completedJobs.length) * 100)
        : 0,
    avgResponseTimeMinutes,
    skippedToday: jobs.filter((job) => job.status === "SKIPPED" && job.createdAt >= todayStart)
      .length,
  });
}
