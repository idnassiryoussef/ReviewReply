"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PlanInfo = {
  plan: string;
  dailyRepliesUsed: number;
  dailyRepliesLimit: number;
  usagePercent: number;
};

export function UsageBanner() {
  const [info, setInfo] = useState<PlanInfo | null>(null);

  useEffect(() => {
    fetch("/api/plan-info")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: PlanInfo | null) => { if (d) setInfo(d); })
      .catch(() => null);
  }, []);

  if (!info) return null;
  // Only show when on a limited plan, >= 80% used
  if (info.dailyRepliesLimit === -1) return null;
  if (info.usagePercent < 80) return null;

  const remaining = info.dailyRepliesLimit - info.dailyRepliesUsed;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-amber-300/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-100 sm:flex-row sm:items-center sm:justify-between">
      <p>
        ⚠️ You&apos;ve used{" "}
        <strong>
          {info.dailyRepliesUsed}/{info.dailyRepliesLimit}
        </strong>{" "}
        replies today.{remaining > 0 ? ` ${remaining} remaining.` : " Daily limit reached."}
      </p>
      <Link
        href="/pricing"
        className="flex-shrink-0 rounded-full bg-amber-400/20 border border-amber-300/40 px-4 py-1.5 text-xs font-bold text-amber-100 transition hover:bg-amber-400/30"
      >
        Upgrade to Growth for unlimited replies →
      </Link>
    </div>
  );
}
