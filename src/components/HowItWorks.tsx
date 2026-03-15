const steps = [
  {
    title: "Paste a customer review",
    description:
      "Copy the review text from Google and paste it into the app so we can draft a reply.",
    hint: "Input",
  },
  {
    title: "Choose tone and business type",
    description:
      "Select the right response style and company type so the reply matches your brand.",
    hint: "Configuration",
  },
  {
    title: "Generate a professional reply instantly",
    description:
      "Get a polished response that you can post directly to Google Reviews.",
    hint: "Output",
  },
];

export function HowItWorks() {
  return (
    <section className="section-fade-in bg-[var(--background)] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-300">
            How It Works
          </h2>
          <p className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Three steps to a better public reply
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            A focused workflow built for speed, consistency, and brand tone.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="glass surface-hover relative rounded-3xl p-7 shadow-lg"
            >
              <span className="inline-flex rounded-full border border-indigo-300/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-100">
                {step.hint}
              </span>

              <div className="mt-6 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/70 to-sky-500/70 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30">
                {index + 1}
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {step.description}
              </p>

              {index < steps.length - 1 ? (
                <span className="pointer-events-none absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-white/20 bg-[var(--background)] text-center text-white/40 md:block">
                  +
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
