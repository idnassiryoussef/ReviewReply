"use client";

import { useEffect, useMemo, useState } from "react";

type JobItem = {
  id: string;
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "SKIPPED";
  createdAt: string;
  publishedAt: string | null;
};

type LogsResponse = {
  items: JobItem[];
};

export function AutoReplyStatsWidget() {
  const [items, setItems] = useState<JobItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/auto-reply/logs?page=1&pageSize=20", { method: "GET" });
      const data = (await response.json().catch(() => null)) as LogsResponse | null;
      if (!response.ok || !data?.items) return;
      setItems(data.items);
    };

    void load();
  }, []);

  const metrics = useMemo(() => {
    const now = new Date();
    const thisMonthItems = items.filter((item) => {
      const created = new Date(item.createdAt);
      return (
        created.getUTCFullYear() === now.getUTCFullYear() &&
        created.getUTCMonth() === now.getUTCMonth()
      );
    });

    const successItems = thisMonthItems.filter((item) => item.status === "SUCCESS");
    const doneItems = thisMonthItems.filter(
      (item) => item.status === "SUCCESS" || item.status === "FAILED" || item.status === "SKIPPED"
    );

    const replyRate = doneItems.length > 0 ? Math.round((successItems.length / doneItems.length) * 100) : 0;

    const publishedDurations = successItems
      .filter((item) => item.publishedAt)
      .map((item) => {
        const start = new Date(item.createdAt).getTime();
        const end = new Date(item.publishedAt as string).getTime();
        return Math.max(end - start, 0);
      });

    const avgMs =
      publishedDurations.length > 0
        ? Math.floor(
            publishedDurations.reduce((sum, value) => sum + value, 0) /
              publishedDurations.length
          )
        : 3 * 60 * 1000;

    const avgMinutes = Math.max(Math.round(avgMs / 60000), 1);

    return {
      autoRepliesThisMonth: successItems.length,
      replyRate,
      avgMinutes,
    };
  }, [items]);

  return (
    <section className="glass rounded-3xl border border-white/10 p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-white">Auto-reply Performance</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-wide text-white/55">Auto-replies this month</p>
          <p className="mt-2 text-2xl font-semibold text-white">{metrics.autoRepliesThisMonth}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-wide text-white/55">Reply rate</p>
          <p className="mt-2 text-2xl font-semibold text-white">{metrics.replyRate}%</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-wide text-white/55">Avg response time</p>
          <p className="mt-2 text-2xl font-semibold text-white">{metrics.avgMinutes} min</p>
        </div>
      </div>
    </section>
  );
}
