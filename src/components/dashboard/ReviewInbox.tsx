"use client";

import { useEffect, useMemo, useState } from "react";
import type { InboxReviewItem } from "@/lib/reviewTypes";

type Filter = "all" | "positive" | "neutral" | "negative" | "danger" | "needs-attention";
type Tone = "friendly" | "professional" | "apologetic";

type ReviewsResponse = {
  reviews: InboxReviewItem[];
};

function sentimentBadge(classification: InboxReviewItem["classification"]) {
  if (classification === "positive") {
    return {
      label: "🟢 Positive",
      classes: "border-emerald-300/40 bg-emerald-500/15 text-emerald-100",
    };
  }

  if (classification === "neutral") {
    return {
      label: "🟡 Neutral",
      classes: "border-amber-300/40 bg-amber-500/15 text-amber-100",
    };
  }

  if (classification === "negative") {
    return {
      label: "🔴 Negative",
      classes: "border-rose-300/40 bg-rose-500/15 text-rose-100",
    };
  }

  return {
    label: "⚠️ Danger",
    classes: "border-orange-300/50 bg-orange-500/20 text-orange-100",
  };
}

function statePill(state: InboxReviewItem["state"]) {
  if (state === "SENT") return "Sent";
  if (state === "RESOLVED") return "Resolved";
  if (state === "APPROVED") return "Approved";
  if (state === "DRAFT_READY") return "Draft Ready";
  if (state === "NEEDS_ATTENTION") return "Needs Attention";
  return "New";
}

export function ReviewInbox() {
  const [items, setItems] = useState<InboxReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [toneById, setToneById] = useState<Record<string, Tone>>({});
  const [draftPublicById, setDraftPublicById] = useState<Record<string, string>>({});
  const [draftPrivateById, setDraftPrivateById] = useState<Record<string, string>>({});
  const [copiedById, setCopiedById] = useState<Record<string, boolean>>({});

  const loadReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reviews", { method: "GET" });
      const data = (await response.json().catch(() => null)) as ReviewsResponse | null;

      if (!response.ok || !data?.reviews) {
        throw new Error("Failed to load reviews inbox.");
      }

      setItems(data.reviews);

      const nextTone: Record<string, Tone> = {};
      const nextPublic: Record<string, string> = {};
      const nextPrivate: Record<string, string> = {};

      for (const item of data.reviews) {
        nextTone[item.id] = item.tone;
        nextPublic[item.id] = item.publicReply ?? "";
        nextPrivate[item.id] = item.privateResolutionMessage ?? "";
      }

      setToneById(nextTone);
      setDraftPublicById(nextPublic);
      setDraftPrivateById(nextPrivate);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Failed to load reviews.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filter === "all") return true;
      if (filter === "needs-attention") return item.needsAttention || item.state === "NEEDS_ATTENTION";
      return item.classification === filter;
    });
  }, [items, filter]);

  const callAction = async (
    reviewId: string,
    action: "generate" | "approve-send" | "resolve"
  ) => {
    setSavingId(reviewId);
    setError(null);

    const tone = toneById[reviewId] ?? "professional";

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        reviewId,
        tone,
        publicReply: draftPublicById[reviewId] ?? "",
        privateResolutionMessage: draftPrivateById[reviewId] ?? "",
      }),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      throw new Error(data?.error ?? "Action failed.");
    }

    await loadReviews();
    setSavingId(null);
  };

  const onGenerate = async (reviewId: string) => {
    try {
      await callAction(reviewId, "generate");
    } catch (actionError) {
      setSavingId(null);
      const message = actionError instanceof Error ? actionError.message : "Failed to generate.";
      setError(message);
    }
  };

  const onApproveSend = async (reviewId: string) => {
    try {
      await callAction(reviewId, "approve-send");
    } catch (actionError) {
      setSavingId(null);
      const message = actionError instanceof Error ? actionError.message : "Failed to approve and send.";
      setError(message);
    }
  };

  const onResolve = async (reviewId: string) => {
    try {
      await callAction(reviewId, "resolve");
    } catch (actionError) {
      setSavingId(null);
      const message = actionError instanceof Error ? actionError.message : "Failed to resolve.";
      setError(message);
    }
  };

  const copy = async (reviewId: string, value: string) => {
    if (!value.trim()) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedById((prev) => ({ ...prev, [reviewId]: true }));
      setTimeout(() => {
        setCopiedById((prev) => ({ ...prev, [reviewId]: false }));
      }, 1200);
    } catch {
      setError("Clipboard copy failed on this browser.");
    }
  };

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: "All" },
    { key: "positive", label: "Positive" },
    { key: "neutral", label: "Neutral" },
    { key: "negative", label: "Negative" },
    { key: "danger", label: "Danger" },
    { key: "needs-attention", label: "Needs Attention" },
  ];

  return (
    <section className="section-fade-in pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="glass rounded-3xl border border-white/10 p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200/90">
                Reputation Shield Inbox
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Reviews Inbox
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-white/70 sm:text-base">
                Classify every review, protect your reputation, and send public + private responses from one queue.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((entry) => (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => setFilter(entry.key)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    filter === entry.key
                      ? "border-indigo-300/50 bg-indigo-400/20 text-indigo-100"
                      : "border-white/15 bg-white/5 text-white/75 hover:bg-white/10"
                  }`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="glass mt-6 rounded-3xl border border-white/10 p-6 text-white/70">
            Loading inbox...
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        {!loading && filtered.length === 0 ? (
          <div className="glass mt-6 rounded-3xl border border-white/10 p-8 text-center text-white/70">
            No reviews yet. Connect your source or wait for new reviews to appear.
          </div>
        ) : null}

        <div className="mt-6 grid gap-5">
          {filtered.map((item) => {
            const badge = sentimentBadge(item.classification);
            const isDanger = item.classification === "danger" || item.needsAttention;
            const busy = savingId === item.id;
            const publicDraft = draftPublicById[item.id] ?? "";
            const privateDraft = draftPrivateById[item.id] ?? "";

            return (
              <article key={item.id} className="glass rounded-3xl border border-white/10 p-5 shadow-lg sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${badge.classes}`}>
                    {badge.label}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75">
                    {item.rating}★
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75">
                    {item.source}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75">
                    {statePill(item.state)}
                  </span>
                </div>

                {isDanger ? (
                  <div className="mt-4 rounded-2xl border border-orange-300/40 bg-orange-500/10 p-3 text-sm text-orange-100">
                    ⚠️ Needs Attention: this review is classified as danger. Auto-reply is blocked and manual handling is recommended.
                  </div>
                ) : null}

                <p className="mt-4 text-sm leading-7 text-white/90 sm:text-base">{item.reviewText}</p>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
                        Public Reply
                      </h2>
                      <button
                        type="button"
                        onClick={() => copy(item.id, publicDraft)}
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80"
                      >
                        {copiedById[item.id] ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <textarea
                      value={publicDraft}
                      onChange={(event) =>
                        setDraftPublicById((prev) => ({ ...prev, [item.id]: event.target.value }))
                      }
                      rows={5}
                      className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm leading-6 text-white outline-none focus:border-indigo-300/70"
                      placeholder="Generate a public reply"
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
                      Private Resolution Message
                    </h2>
                    <textarea
                      value={privateDraft}
                      onChange={(event) =>
                        setDraftPrivateById((prev) => ({ ...prev, [item.id]: event.target.value }))
                      }
                      rows={5}
                      className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm leading-6 text-white outline-none focus:border-indigo-300/70"
                      placeholder="Generate a private follow-up message for DM/email"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <label className="text-xs text-white/70">Tone</label>
                  <select
                    value={toneById[item.id] ?? "professional"}
                    onChange={(event) =>
                      setToneById((prev) => ({
                        ...prev,
                        [item.id]: event.target.value as Tone,
                      }))
                    }
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="apologetic">Apologetic</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onGenerate(item.id)}
                    disabled={busy}
                    className="rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    {busy ? "Working..." : publicDraft ? "Regenerate reply" : "Generate reply"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onApproveSend(item.id)}
                    disabled={busy || isDanger || !publicDraft.trim()}
                    className="rounded-full border border-emerald-300/40 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-100 disabled:opacity-40"
                  >
                    Approve & Send
                  </button>

                  <button
                    type="button"
                    onClick={() => onResolve(item.id)}
                    disabled={busy}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 disabled:opacity-40"
                  >
                    Mark Resolved
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
