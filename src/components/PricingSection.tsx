"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PaddleCheckoutButton } from "./PaddleCheckoutButton";

const plans = [
  {
    name: "Free",
    price: "$0",
    frequency: "per month",
    description: "Try ReviewReply with limits for occasional use.",
    features: [
      "10 replies per month",
      "Basic tones",
      "Copy replies",
      "No account required",
    ],
    ctaLabel: "Start free",
    href: "/app",
    featured: false,
  },
  {
    name: "Pro",
    price: "$9",
    frequency: "per month",
    description: "Unlimited replies, advanced tones, and priority generation.",
    features: [
      "Unlimited replies",
      "More tone options",
      "Priority generation",
      "Save history (coming soon)",
    ],
    ctaLabel: "Upgrade to Pro",
    href: "/checkout",
    featured: true,
  },
];

export function PricingSection() {
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
            Pricing
          </h2>
          <p className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Plans for every small business
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Start free and upgrade when you&apos;re ready for unlimited responses and extra features.
          </p>
          <p className="mt-3 text-sm text-white/60">
            No credit card required. Works for restaurants, salons, gyms, and other local businesses.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              className={`glass surface-hover rounded-3xl p-8 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                plan.featured ? "ring-2 ring-indigo-400/45 md:scale-[1.03]" : ""
              }`}
              whileHover={{ y: -6, scale: plan.featured ? 1.035 : 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                  <p className="mt-2 text-sm text-white/70">{plan.description}</p>
                </div>
                {plan.featured ? (
                  <span className="rounded-full border border-fuchsia-300/30 bg-fuchsia-500/20 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                    Most popular
                  </span>
                ) : null}
              </div>

              <div className="mt-8 flex items-end gap-2">
                <span className={`font-bold text-white ${plan.featured ? "text-5xl" : "text-4xl"}`}>
                  {plan.price}
                </span>
                  <span className={`pb-1 font-medium ${plan.featured ? "text-base text-indigo-100" : "text-sm text-white/60"}`}>
                  {plan.featured ? "/month" : plan.frequency}
                </span>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-white/70">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.featured ? (
                <PaddleCheckoutButton
                  className="cta-primary mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {plan.ctaLabel}
                </PaddleCheckoutButton>
              ) : (
                <Link
                  href={plan.href}
                  className="cta-secondary mt-8 inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-white/15 hover:shadow-xl"
                >
                  {plan.ctaLabel}
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
