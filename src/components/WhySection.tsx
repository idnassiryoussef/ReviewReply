"use client";

import { motion } from "framer-motion";
import { HandThumbUpIcon, ExclamationTriangleIcon, ClockIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const benefits = [
  {
    title: "Works for positive reviews",
    description: "Respond with warmth and gratitude in your brand voice.",
    icon: HandThumbUpIcon,
  },
  {
    title: "Handles negative reviews professionally",
    description: "Acknowledge concerns and protect your reputation with calm replies.",
    icon: ExclamationTriangleIcon,
  },
  {
    title: "Saves hours replying manually",
    description: "Generate polished responses in seconds instead of writing from scratch.",
    icon: ClockIcon,
  },
  {
    title: "Improves customer trust",
    description: "Consistent, thoughtful replies show customers you genuinely care.",
    icon: ShieldCheckIcon,
  },
];

export function WhySection() {
  return (
    <section className="section-fade-in bg-[var(--background)] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-300">
            Benefits
          </h2>
          <p className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Built to make review management effortless
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                className="glass surface-hover rounded-3xl p-7 shadow-lg"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-indigo-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
