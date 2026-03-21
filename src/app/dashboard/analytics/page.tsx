"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

type AnalyticsData = {
  totalReviews: number;
  repliedReviewsPercent: number;
  averageResponseTimeMinutes: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
    danger: number;
  };
  reviewsPerDay: { date: string; count: number }[];
  negativeDangerTrend: { date: string; count: number }[];
};

const SENTIMENT_COLORS = {
  positive: "#22c55e",
  neutral: "#eab308",
  negative: "#ef4444",
  danger: "#f97316",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/analytics");
        const json = (await response.json().catch(() => null)) as
          | (AnalyticsData & { error?: string })
          | null;

        if (!response.ok || !json || typeof json.totalReviews !== "number") {
          throw new Error(json?.error ?? "Failed to load analytics.");
        }

        setData(json);
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Failed to load analytics.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#0d1117] p-8 text-white">Loading analytics...</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0d1117] p-8 text-white">
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-rose-100">
          {error ?? "Unable to load analytics"}
        </div>
      </div>
    );
  }

  const sentimentRows = [
    { name: "Positive", value: data.sentimentDistribution.positive, color: SENTIMENT_COLORS.positive },
    { name: "Neutral", value: data.sentimentDistribution.neutral, color: SENTIMENT_COLORS.neutral },
    { name: "Negative", value: data.sentimentDistribution.negative, color: SENTIMENT_COLORS.negative },
    { name: "Danger", value: data.sentimentDistribution.danger, color: SENTIMENT_COLORS.danger },
  ].filter((row) => row.value > 0);

  return (
    <div className="min-h-screen bg-[#0d1117] px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-white/60">Reputation and response performance over the last 30 days.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#161b22] p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Total Reviews</p>
            <p className="mt-2 text-3xl font-bold">{data.totalReviews}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161b22] p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Replied Reviews %</p>
            <p className="mt-2 text-3xl font-bold">{data.repliedReviewsPercent}%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161b22] p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Avg Response Time</p>
            <p className="mt-2 text-3xl font-bold">{data.averageResponseTimeMinutes} min</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#161b22] p-5">
            <p className="mb-3 text-sm font-semibold text-white/85">Reviews Per Day</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.reviewsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" />
                <XAxis dataKey="date" stroke="#ffffff70" tick={{ fontSize: 11 }} />
                <YAxis stroke="#ffffff70" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#161b22] p-5">
            <p className="mb-3 text-sm font-semibold text-white/85">Sentiment Distribution</p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={sentimentRows} dataKey="value" nameKey="name" outerRadius={90}>
                  {sentimentRows.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#161b22] p-5">
          <p className="mb-3 text-sm font-semibold text-white/85">Negative + Danger Trend</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.negativeDangerTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" />
              <XAxis dataKey="date" stroke="#ffffff70" tick={{ fontSize: 11 }} />
              <YAxis stroke="#ffffff70" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
