"use client";

import { motion } from "framer-motion";
import { ChatBubbleBottomCenterTextIcon, SparklesIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

const steps = [
  {
    title: "Paste your Google review",
    description: "Copy any review from Google and drop it into ReviewReply.",
    hint: "Step 1",
    Icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    title: "AI generates a professional reply",
    description: "Select tone once and get a polished response tailored to your business.",
    hint: "Step 2",
    Icon: SparklesIcon,
  },
  {
    title: "Copy and post to Google",
    description: "One click to copy, then publish your response in seconds.",
    hint: "Step 3",
    Icon: ClipboardDocumentCheckIcon,
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
            <motion.div
              key={step.title}
              className="relative rounded-3xl bg-gradient-to-br from-indigo-400/25 via-fuchsia-400/15 to-sky-400/20 p-[1px]"
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="glass surface-hover relative rounded-3xl p-7 shadow-lg shadow-indigo-900/20">
                <span className="inline-flex rounded-full border border-indigo-300/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-100">
                  {step.hint}
                </span>

                <div className="mt-6 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/70 to-sky-500/70 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30">
                  <step.Icon className="h-5 w-5" aria-hidden="true" />
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
