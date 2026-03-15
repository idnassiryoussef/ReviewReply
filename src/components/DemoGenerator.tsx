"use client";

import { useMemo, useState } from "react";

const sampleReview =
  "The service was slow but the food was great.";

const sampleResponses = [
  "Thank you for your feedback! We're glad you enjoyed the food and we appreciate your patience. We’re always working to improve our service.",
  "Thanks so much for your review. We truly appreciate your support and can’t wait to serve you again soon.",
];

export function DemoGenerator() {
  const [review, setReview] = useState(sampleReview);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generated = useMemo(() => response, [response]);
  const displayReply = generated ?? sampleResponses[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleGenerate = () => {
    setLoading(true);
    setResponse(null);
    setTimeout(() => {
      setResponse(sampleResponses[Math.floor(Math.random() * sampleResponses.length)]);
      setLoading(false);
    }, 750);
  };

  return (
    <section id="demo" className="section-fade-in bg-[var(--background)] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-300">
            Example AI Demo
          </h2>
          <p className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            See the output before you sign up
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Paste a review, click generate, and see how the response looks. Then jump to the full app
            for unlimited use.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
          <div className="glass surface-hover rounded-3xl p-6 shadow-lg sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold uppercase tracking-[0.1em] text-white/60">
                Customer review
              </label>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                Input
              </span>
            </div>

            <textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              rows={5}
              className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="cta-primary mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating…" : "Generate reply"}
            </button>
          </div>

          <div className="glass surface-hover rounded-3xl p-6 shadow-lg sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/60">AI Suggested Reply</p>
              <span className="rounded-full border border-indigo-300/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-100">
                Preview
              </span>
            </div>
            <div className="mt-4 min-h-[170px] rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/75">
              {loading ? (
                <p className="text-white/60">Generating a reply…</p>
              ) : displayReply ? (
                <p>{displayReply}</p>
              ) : (
                <p className="text-white/60">Click generate to see a response.</p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-white/15 hover:shadow-xl"
              >
                {copied ? "Copied" : "Copy reply"}
              </button>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
                Friendly tone
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
                Public-ready
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
                40-90 words
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
