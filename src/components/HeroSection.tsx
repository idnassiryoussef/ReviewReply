import Link from "next/link";

export function HeroSection() {
  return (
    <section className="section-fade-in relative overflow-hidden bg-[var(--background)] pb-20 pt-20 sm:pb-28 sm:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-32 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-14 md:px-6">
        <div>
          <p className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-200">
            ReviewReply Platform
          </p>

          <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Reply to Google Reviews in Seconds with AI
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/68 sm:text-xl">
            Generate professional responses to customer reviews instantly. Perfect for restaurants, salons, gyms, clinics, and local businesses.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/app"
              className="cta-primary inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-900/30"
            >
              Start Free
            </Link>
            <a
              href="#demo"
              className="cta-secondary inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              See demo
            </a>
          </div>

          <p className="mt-3 text-sm text-white/60">
            No credit card required • 10 free replies
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/72">
            <span className="font-medium text-white/82">Trusted by local businesses</span>
            <span className="icon-chip rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5">Restaurant</span>
            <span className="icon-chip rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5">Barber Shop</span>
            <span className="icon-chip rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5">Dental Clinic</span>
            <span className="icon-chip rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5">Gym</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-sm text-white/75">
            <span className="icon-chip rounded-full border border-white/15 bg-white/5 px-3 py-1.5">🍽 Restaurants</span>
            <span className="icon-chip rounded-full border border-white/15 bg-white/5 px-3 py-1.5">💈 Barber shops</span>
            <span className="icon-chip rounded-full border border-white/15 bg-white/5 px-3 py-1.5">🏋️ Gyms</span>
            <span className="icon-chip rounded-full border border-white/15 bg-white/5 px-3 py-1.5">🦷 Dentists</span>
            <span className="icon-chip rounded-full border border-white/15 bg-white/5 px-3 py-1.5">🏨 Hotels</span>
          </div>
        </div>

        <div className="w-full">
          <div className="glass glow relative overflow-hidden rounded-3xl p-6 shadow-2xl sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-white">Live reply preview</p>
                <p className="text-sm text-white/60">Generated in under 10 seconds</p>
              </div>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/75">
                Professional tone
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="surface-hover rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <p className="text-sm text-white/55">Google review</p>
                <p className="mt-2 text-sm text-amber-300">⭐⭐⭐⭐⭐</p>
                <p className="mt-2 text-base text-white/75">
                  &ldquo;The service was fast and the staff were friendly. Will visit again!&rdquo;
                </p>
              </div>

              <div className="surface-hover rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-sky-500/10 p-4 sm:p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100/90">
                  AI Suggested Reply
                </p>
                <p className="mt-2 text-base text-white/80">
                  Thank you for your kind feedback. We&apos;re delighted you enjoyed the service and our team looks forward to welcoming you again soon.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
                  <p className="text-lg font-semibold text-white">40-90</p>
                  <p className="text-xs text-white/55">words</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
                  <p className="text-lg font-semibold text-white">10</p>
                  <p className="text-xs text-white/55">free replies</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
                  <p className="text-lg font-semibold text-white">1-click</p>
                  <p className="text-xs text-white/55">copy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
