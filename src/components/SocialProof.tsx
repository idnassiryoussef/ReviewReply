const trustBullets = [
  "Works for positive and negative reviews",
  "Professional tone in seconds",
  "Copy and post directly to Google",
];

const logos = [
  "Northline Cafe",
  "Bright Dental",
  "Studio 47",
  "Peak Fitness",
  "Coastline Hotel",
];

export function SocialProof() {
  return (
    <section className="section-fade-in bg-[var(--background)] py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
              Trusted by local teams
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {logos.map((logo) => (
                <span
                  key={logo}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/75"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {trustBullets.map((item) => (
              <div
                key={item}
                className="surface-hover rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/80"
              >
                <span className="font-medium text-emerald-300">✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
