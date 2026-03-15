"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ReplyCard } from "./ReplyCard";
import { UpgradeCard } from "./UpgradeCard";

const sampleReviews = [
  "The food was delicious but the service was a bit slow. We’ll be back!",
  "Great haircut and friendly staff — I’ll recommend this place to friends.",
  "The room was clean but the air conditioning was noisy at night.",
  "Fantastic workout class, but the equipment could be updated.",
];

type UsageInfo = {
  plan: "free" | "pro";
  month: string;
  usedThisMonth: number;
  monthlyLimit: number | null;
  remaining: number | null;
};

export function ReviewForm() {
  const [businessType, setBusinessType] = useState("Restaurant");
  const [tone, setTone] = useState("Professional");
  const [reviewText, setReviewText] = useState("");
  const [extraInstructions, setExtraInstructions] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null);

  const generateReply = useCallback(
    async (override?: { review?: string; tone?: string; businessType?: string; extra?: string }) => {
      setError(null);
      setLoading(true);
      try {
        const response = await fetch("/api/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            review: override?.review ?? reviewText,
            tone: override?.tone ?? tone,
            businessType: override?.businessType ?? businessType,
            extraInstructions: override?.extra ?? extraInstructions,
          }),
        });

        const data = (await response.json().catch(() => null)) as
          | { reply?: string; usage?: UsageInfo; error?: string }
          | null;

        if (data?.usage) {
          setUsageInfo(data.usage);
        }

        if (!response.ok) {
          if (response.status === 429) {
            setLimitReached(true);
          }

          const message = data?.error || "Unable to generate reply.";
          throw new Error(message || "Unable to generate reply.");
        }

        setLimitReached(false);
        setReply(data?.reply ?? "");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";

        if (message.toLowerCase().includes("api key")) {
          setError(
            "API key is missing or invalid. Add your key to .env.local and restart the server."
          );
        } else if (message.toLowerCase().includes("sign in")) {
          setError("Please sign in to generate replies.");
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    },
    [businessType, tone, reviewText, extraInstructions]
  );

  const handleCopy = async () => {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(reply);
      setToast("Copied to clipboard!");
    } catch {
      setError("Unable to copy. Please copy manually.");
    }
  };

  const handleClear = () => {
    setReply("");
    setError(null);
  };

  const handleRegenerate = () => {
    generateReply();
  };

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const usageMessage = useMemo(() => {
    if (limitReached) {
      return "You’ve reached your free limit for this month.";
    }

    if (!usageInfo) {
      return "Free plan: 10 replies/month. Pro: unlimited replies.";
    }

    if (usageInfo.plan === "pro") {
      return "Pro plan: unlimited replies.";
    }

    return `${Math.max(usageInfo.remaining ?? 0, 0)} replies left this month.`;
  }, [limitReached, usageInfo]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-6">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-white">Reply generator</h2>
          <p className="mt-2 text-sm text-white/70">
            Paste a Google review, choose your tone, and generate a professional response.
          </p>

          <div className="mt-6 space-y-6">
            <label className="block text-sm font-semibold text-white/80">
              Business type
              <select
                value={businessType}
                onChange={(event) => setBusinessType(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-gray-800 px-4 py-3 text-sm text-white shadow-sm outline-none transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              >
                <option>Restaurant</option>
                <option>Hotel</option>
                <option>Café</option>
                <option>Barber Shop</option>
                <option>Clinic</option>
                <option>Dental Office</option>
                <option>Gym</option>
                <option>Store</option>
                <option>Other</option>
              </select>
            </label>

            <label className="block text-sm font-semibold text-white/80">
              Tone
              <select
                value={tone}
                onChange={(event) => setTone(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-gray-800 px-4 py-3 text-sm text-white shadow-sm outline-none transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Warm</option>
                <option>Formal</option>
                <option>Apologetic</option>
              </select>
            </label>

            <label className="block text-sm font-semibold text-white/80">
              Customer review
              <textarea
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                placeholder="The service was slow but the food was good."
                rows={6}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm outline-none transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-white/60">Try a sample review:</span>
                {sampleReviews.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setReviewText(sample)}
                    className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-white/10"
                  >
                    {sample.length > 36 ? `${sample.slice(0, 36)}…` : sample}
                  </button>
                ))}
              </div>
            </label>

            <label className="block text-sm font-semibold text-white/80">
              Optional extra instructions
              <input
                value={extraInstructions}
                onChange={(event) => setExtraInstructions(event.target.value)}
                placeholder="Any special note? e.g. mention refund, invite customer back..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm outline-none transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              />
            </label>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => generateReply()}
                disabled={loading || !reviewText.trim() || limitReached}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate Reply"}
              </button>
              <p className="text-xs text-white/60">{usageMessage}</p>
              {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {!limitReached ? (
            <ReplyCard
              reply={reply}
              tone={tone}
              loading={loading}
              onCopy={handleCopy}
              onRegenerate={handleRegenerate}
              onClear={handleClear}
            />
          ) : (
            <UpgradeCard />
          )}
        </div>
      </div>

      {toast ? (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-3 text-sm text-white shadow-lg shadow-black/40 backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          {toast}
        </div>
      ) : null}
    </div>
  );
}
