"use client";

import { useEffect, useMemo, useState } from "react";

type LogStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "SKIPPED";

const LANGUAGE_FLAGS: Record<string, string> = {
  en: "🇺🇸",
  fr: "🇫🇷",
  ar: "🇲🇦",
  es: "🇪🇸",
  de: "🇩🇪",
  it: "🇮🇹",
  pt: "🇵🇹",
};

type JobItem = {
  id: string;
  reviewId: string;
  status: LogStatus;
  generatedReply: string;
  skipReason: string | null;
  reviewStars: number | null;
  reviewSnippet: string | null;
  detectedLanguage: string | null;
  createdAt: string;
};

type LogsResponse = {
  items: JobItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

function statusClass(status: LogStatus) {
  if (status === "SUCCESS") return "bg-emerald-500/15 text-emerald-100 border-emerald-300/35";
  if (status === "SKIPPED") return "bg-amber-500/15 text-amber-100 border-amber-300/35";
  if (status === "FAILED") return "bg-rose-500/15 text-rose-100 border-rose-300/35";
  if (status === "PENDING") return "bg-sky-500/15 text-sky-100 border-sky-300/35";
  return "bg-indigo-500/15 text-indigo-100 border-indigo-300/35";
}

export function ActivityLog() {
  const [data, setData] = useState<LogsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReply, setSelectedReply] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/auto-reply/logs?page=${page}&pageSize=20`, {
          method: "GET",
        });

        const json = (await response.json().catch(() => null)) as
          | (LogsResponse & { error?: string })
          | null;

        if (!response.ok || !json?.items || !json?.pagination) {
          throw new Error(json?.error ?? "Failed to load logs.");
        }

        setData({ items: json.items, pagination: json.pagination });
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : "Failed to load logs.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [page]);

  const rows = useMemo(() => data?.items ?? [], [data]);

  return (
    <section className="glass rounded-3xl border border-white/10 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Auto-Reply Activity Log</h3>
        <span className="text-xs text-white/60">Last 50 jobs</span>
      </div>

      {loading ? <p className="mt-4 text-sm text-white/70">Loading activity...</p> : null}
      {error ? <p className="mt-4 text-sm text-rose-200">{error}</p> : null}

      {!loading && !error ? (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm text-white/85">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-white/50">
                <th className="px-3 py-2">Review snippet</th>
                <th className="px-3 py-2">Stars</th>
                <th className="px-3 py-2">Generated reply</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr
                  key={item.id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] opacity-0"
                  style={{ animation: `sectionFadeIn 420ms ease ${index * 40}ms forwards` }}
                >
                  <td className="rounded-l-xl px-3 py-3">{item.reviewSnippet ?? "System event"}</td>
                  <td className="px-3 py-3">
                    <span>{item.reviewStars ? `${item.reviewStars}★` : "-"}</span>
                    {item.detectedLanguage ? (
                      <span className="ml-1.5 text-base" title={item.detectedLanguage}>
                        {LANGUAGE_FLAGS[item.detectedLanguage] ?? item.detectedLanguage}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <div className="max-w-xs truncate text-white/70">
                      {item.generatedReply || item.skipReason || "-"}
                    </div>
                    {item.generatedReply ? (
                      <button
                        type="button"
                        onClick={() => setSelectedReply(item.generatedReply)}
                        className="mt-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/80"
                      >
                        View Reply
                      </button>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="rounded-r-xl px-3 py-3 text-xs text-white/65">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {data ? (
        <div className="mt-4 flex items-center justify-between text-xs text-white/70">
          <span>
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={data.pagination.page <= 1}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((prev) =>
                  Math.min(prev + 1, Math.max(data.pagination.totalPages, 1))
                )
              }
              disabled={data.pagination.page >= data.pagination.totalPages}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {selectedReply ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="glass w-full max-w-2xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">Generated Reply</h4>
              <button
                type="button"
                onClick={() => setSelectedReply(null)}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80"
              >
                Close
              </button>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/85">{selectedReply}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
