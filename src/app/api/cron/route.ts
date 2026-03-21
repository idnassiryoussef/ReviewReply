import { NextResponse } from "next/server";
import { processDueJobs } from "@/lib/autoReplyProcessor";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return true;
  }

  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${secret}`;
  if (authHeader === expected) {
    return true;
  }

  const headerSecret = request.headers.get("x-cron-secret");
  return headerSecret === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await processDueJobs();
    const success = summary.results.filter((item) => item.status === "SUCCESS").length;
    const skipped = summary.results.filter((item) => item.status === "SKIPPED").length;
    const failed = summary.results.filter((item) => item.status === "FAILED").length;

    return NextResponse.json({
      processed: summary.processed,
      success,
      failed,
      skipped,
      results: summary.results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cron processing failed";
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
