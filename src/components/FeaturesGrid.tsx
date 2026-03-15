"use client";

import {
  ChatBubbleLeftRightIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const features = [
  {
    title: "Works for positive and negative reviews",
    description:
      "No matter the tone of the review, get a response that reflects your brand and keeps the customer engaged.",
    stat: "All sentiment",
    icon: ShieldCheckIcon,
  },
  {
    title: "Professional ready-to-send replies",
    description:
      "Each message is crafted to sound human, polite, and polished so you can post it immediately.",
    stat: "Public-ready copy",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: "Friendly or formal tone",
    description:
      "Pick the tone that fits your business—whether you want warm and approachable or professional and concise.",
    stat: "Tone control",
    icon: SwatchIcon,
  },
  {
    title: "Copy in one click",
    description:
      "Copy your reply instantly and paste it right into Google Reviews without rewriting.",
    stat: "One-click action",
    icon: ClipboardDocumentIcon,
  },
  {
    title: "Fast and simple UI",
    description:
      "A clean interface that works on mobile and desktop so you can respond on the go.",
    stat: "Mobile + desktop",
    icon: ClockIcon,
  },
  {
    title: "Monthly plan controls",
    description:
      "Free users get a clear monthly quota, while Pro users can generate unlimited replies.",
    stat: "Built-in limits",
    icon: SparklesIcon,
  },
];

export function FeaturesGrid() {
  return (
    <motion.section
      className="bg-[var(--background)] py-20 sm:py-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-300">
            Features
          </h2>
          <p className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Everything you need in one reply workflow
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Built for busy business owners who want a reliable response in seconds.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                className="glass surface-hover rounded-3xl p-7 shadow-lg"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-indigo-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
                    {feature.stat}
                  </p>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
