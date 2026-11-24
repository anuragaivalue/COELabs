"use client";

import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

/**
 * MotionTestCard
 * 
 * Verifies Motion for React integration (`motion/react`):
 * - Fade-in & slide-up entrance animation
 * - Spring-based physics (`stiffness: 260, damping: 20`)
 * - Smooth hover and tap micro-interactions
 * - Follows 120fps GPU-accelerated compositor rules
 */
export function MotionTestCard({
  title = "Motion AI Studio Verified",
  description = "Engineered with motion/react, natural spring dynamics, and GPU-accelerated transforms.",
  tag = "Motion 14 • React 19"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        mass: 0.8
      }}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { type: "spring", stiffness: 500, damping: 20 }
      }}
      className="group relative max-w-sm rounded-2xl border border-neutral-200/90 bg-white/90 p-6 shadow-md backdrop-blur-md transition-colors duration-200 hover:border-amber-500/50 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900/90 dark:hover:border-amber-400/50 cursor-pointer"
    >
      {/* Ambient Radial Accent */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all duration-300" />

      {/* Header Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-[11px] font-semibold text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-300">
          <Sparkles className="size-3 text-amber-600 dark:text-amber-400" />
          <span>{tag}</span>
        </span>
        <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Lab
        </span>
      </div>

      {/* Card Body */}
      <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
        {description}
      </p>

      {/* Interactive Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-white/5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
        <span>Explore Architecture</span>
        <motion.span
          className="inline-block"
          variants={{
            hover: { x: 4 }
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <ArrowRight className="size-4" />
        </motion.span>
      </div>
    </motion.div>
  );
}
