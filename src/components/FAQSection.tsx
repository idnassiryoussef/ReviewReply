const faqs = [
  {
    question: "What kinds of reviews can I reply to?",
    answer:
      "Any Google review text works—positive, neutral, or negative. Paste the review and we’ll suggest a response you can post publicly.",
  },
  {
    question: "Can I use this for negative reviews?",
    answer:
      "Absolutely. The reply will acknowledge concerns, stay calm, and keep the tone professional while offering reassurance.",
  },
  {
    question: "Is the reply unique?",
    answer:
      "The replies are generated on the fly and tailored to the review you provide. We focus on clarity and professionalism.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No installation is required. Use ReviewReply from any modern browser.",
  },
  {
    question: "Can I copy and edit the result?",
    answer:
      "Yes, you can copy the reply and make any edits you like before posting it in Google Reviews.",
  },
];

export function FAQSection() {
  return (
    <section className="section-fade-in bg-[var(--background)] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-300">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Got questions? We’ve got answers.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Everything you need to know to get started and reply confidently.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="glass surface-hover rounded-3xl p-7 shadow-lg"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                FAQ {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">{faq.question}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
