"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const trustTags = ["Restaurant", "Barber shop", "Dental clinic", "Gym", "Hotel", "Coffee shop"];

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoMouseEnter = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.pause();
  };

  const handleVideoMouseLeave = async () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    try {
      await video.play();
    } catch {
      // Autoplay can be blocked in some browser states.
    }
  };

  return (
    <motion.section
      className="relative overflow-hidden bg-[var(--background)] pb-20 pt-20 sm:pb-28 sm:pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -z-10 left-1/2 top-[-7rem] h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/35 via-fuchsia-500/30 to-sky-500/30 blur-3xl opacity-30"
          animate={{ x: [0, 10, 0], y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-32 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-14 md:px-6">
        <div>
          <motion.p
            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-200"
            {...fadeUp}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            ReviewReply Platform
          </motion.p>

          <motion.h1
            className="mt-6 max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-7xl lg:text-8xl"
            {...fadeUp}
            transition={{ duration: 0.35, delay: 0.03, ease: "easeOut" }}
          >
            Reply to Google Reviews in Seconds with{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/68 sm:text-xl"
            {...fadeUp}
            transition={{ duration: 0.35, delay: 0.06, ease: "easeOut" }}
          >
            Generate professional responses to customer reviews instantly. Perfect for restaurants, salons, gyms, clinics, and local businesses.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            {...fadeUp}
            transition={{ duration: 0.35, delay: 0.09, ease: "easeOut" }}
          >
            <motion.div whileHover={{ y: -2, scale: 1.05 }} transition={{ duration: 0.2, ease: "easeOut" }}>
              <Link
                href="/app"
                className="cta-primary inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-900/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40"
              >
                Start Free
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2, ease: "easeOut" }}>
              <a
                href="#demo"
                className="cta-secondary inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/90 transition-all duration-200 hover:scale-105 hover:bg-white/10 hover:shadow-xl"
              >
                Watch Demo
              </a>
            </motion.div>
          </motion.div>

          <motion.p
            className="mt-3 text-sm text-white/60"
            {...fadeUp}
            transition={{ duration: 0.35, delay: 0.12, ease: "easeOut" }}
          >
            No credit card required.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/72"
            {...fadeUp}
            transition={{ duration: 0.35, delay: 0.14, ease: "easeOut" }}
          >
            <span className="w-full text-xs font-semibold uppercase tracking-[0.14em] text-indigo-200/80">
              Trusted by local businesses worldwide
            </span>
            {trustTags.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ y: -2, scale: 1.04 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="icon-chip rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}
        >
          <motion.div
            className="glass glow relative overflow-hidden rounded-3xl border border-white/10 p-4 shadow-2xl transition-all duration-200 hover:-translate-y-2 hover:shadow-2xl sm:p-5"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ y: -6 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white/80">The Engine Behind Your Service</p>
              <span className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">
                Live preview
              </span>
            </div>

            <div
              className="group relative w-full aspect-video overflow-hidden rounded-xl border border-white/10 shadow-xl"
              onMouseEnter={handleVideoMouseEnter}
              onMouseLeave={handleVideoMouseLeave}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover rounded-xl"
              >
                <source src="/demo/reviewreply-demo.mp4" type="video/mp4" />
              </video>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
