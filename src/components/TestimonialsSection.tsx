"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    role: "Restaurant owner",
    quote: "This tool saved us hours every week responding to reviews.",
  },
  {
    role: "Gym owner",
    quote: "Our review responses now look professional.",
  },
  {
    role: "Dental clinic",
    quote: "Customers appreciate our fast responses.",
  },
];

export function TestimonialsSection() {
  return (
    <motion.section
      className="bg-[var(--background)] py-20 sm:py-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-300">
            Testimonials
          </h2>
          <p className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            What business owners say
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <motion.article
              key={item.role}
              className="glass surface-hover rounded-3xl p-7 shadow-lg"
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="text-base leading-relaxed text-white/80">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.1em] text-indigo-200/90">
                {item.role}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
