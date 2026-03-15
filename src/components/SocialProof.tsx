"use client";

import { BuildingStorefrontIcon, ScissorsIcon, HeartIcon, BoltIcon, HomeModernIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const badges = [
  { label: "Restaurants", icon: BuildingStorefrontIcon },
  { label: "Barber Shops", icon: ScissorsIcon },
  { label: "Dental Clinics", icon: HeartIcon },
  { label: "Gyms", icon: BoltIcon },
  { label: "Hotels", icon: HomeModernIcon },
  { label: "Coffee Shops", icon: SparklesIcon },
];

export function SocialProof() {
  return (
    <section className="section-fade-in bg-[var(--background)] py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-indigo-200/80 sm:text-sm">
            Trusted by local businesses
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.label}
                  whileHover={{ y: -3, scale: 1.03 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="surface-hover flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-300/30 bg-indigo-500/15 text-indigo-100">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{badge.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
