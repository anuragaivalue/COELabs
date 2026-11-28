"use client";

import React from "react";
import Link from "next/link";
import {
  Cpu,
  TrendingUp,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Zap,
  Building2
} from "lucide-react";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { oemIntroContent } from "@/data/oem-intro-content";

// Icon mapping helper
function renderValuePropIcon(iconName) {
  const className = "size-5 text-amber-600 dark:text-orange-400";
  switch (iconName) {
    case "Cpu":
      return <Cpu className={className} />;
    case "TrendingUp":
      return <TrendingUp className={className} />;
    case "Layers":
      return <Layers className={className} />;
    default:
      return <Zap className={className} />;
  }
}

/**
 * OEM Top Intro Section
 * Highlights iVCoE's value proposition for technology OEMs:
 * 1. Lab Interoperability
 * 2. Joint GTM
 * 3. Enterprise Blueprints
 */
export function OemIntroSection() {
  const { badge, title, valueProps, stats } = oemIntroContent;

  return (
    <div className="relative mt-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:border-orange-400/25 dark:bg-orange-500/15 dark:text-orange-300">
          <IValueEmblem className="size-3.5" />
          <span>{badge}</span>
        </div>

        <h1 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
          {title}
        </h1>

        <p className="mt-3 font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Discover certified global OEMs powering the{" "}
          <span className="font-semibold text-neutral-900 dark:text-white underline decoration-amber-500 decoration-2 underline-offset-4">
            iValue Center of Excellence
          </span>{" "}
          solution stacks. Pre-integrated, multi-brand blueprints tested in live lab environments.
        </p>
      </div>

      {/* 3 Core Value Proposition Cards */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {valueProps.map((prop) => (
          <div
            key={prop.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/80 p-6 sm:p-7 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900/70"
          >
            {/* Ambient telemetry gradient top-border */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-60 group-hover:opacity-100 transition-opacity" />

            <div>
              {/* Header row with icon and badge */}
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-orange-500/15 border border-amber-500/20 dark:border-orange-400/20">
                  {renderValuePropIcon(prop.icon)}
                </div>
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-white/10">
                  {prop.badge}
                </span>
              </div>

              {/* Title & Tagline */}
              <h2 className="mt-4 font-sans text-lg font-bold text-neutral-900 dark:text-white">
                {prop.title}
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-amber-700 dark:text-orange-400">
                {prop.tagline}
              </p>

              {/* Description */}
              <p className="mt-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 font-sans">
                {prop.description}
              </p>

              {/* Feature Highlights Checklist */}
              <ul className="mt-4 space-y-2 pt-3 border-t border-neutral-100 dark:border-white/5">
                {prop.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-[11px] text-neutral-700 dark:text-neutral-300"
                  >
                    <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Metric Tag */}
            <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-900 dark:text-white">
                {prop.metric}
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                {prop.metricSub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Ecosystem Telemetry Strip */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center rounded-xl border border-neutral-200/70 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-neutral-900/50 backdrop-blur-xs"
          >
            <span className="font-sans text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
              {stat.value}
            </span>
            <span className="mt-0.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * OEM Closing Section
 * Features the exact required headline: "Build Once. Sell Everywhere. Scale with iValue CoE."
 * Placed immediately above the global Footer.
 */
export function OemClosingSection() {
  const { closing } = oemIntroContent;

  return (
    <section className="relative mt-20 mb-8 sm:mb-12">
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-gradient-to-br from-white via-neutral-50/90 to-amber-50/40 p-8 sm:p-12 md:p-16 shadow-xl backdrop-blur-md dark:border-white/10 dark:from-neutral-900/90 dark:via-neutral-950 dark:to-amber-950/20 transition-all">
        {/* Ambient background telemetry glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-amber-500/10 blur-3xl dark:bg-orange-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-orange-500/10 blur-3xl dark:bg-amber-600/10" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-700 dark:border-orange-400/30 dark:bg-orange-500/15 dark:text-orange-300">
            <Sparkles className="size-3.5 text-amber-600 dark:text-orange-400" />
            <span>{closing.badge}</span>
          </div>

          {/* Exact Headline Required */}
          <h2 className="mt-5 font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {closing.headline}
          </h2>

          {/* Subheadline */}
          <p className="mt-4 font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            {closing.subheadline}
          </p>

          {/* Proof points checklist */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-600 dark:text-neutral-300">
            {closing.proofPoints.map((point, idx) => (
              <div key={idx} className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          {/* Action Button Row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href={closing.primaryCta.href}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{closing.primaryCta.label}</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href={closing.secondaryCta.href}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-6 py-3.5 text-xs sm:text-sm font-bold text-neutral-800 shadow-xs hover:bg-neutral-100 dark:border-white/20 dark:bg-neutral-800/80 dark:text-white dark:hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{closing.secondaryCta.label}</span>
              <ExternalLink className="size-4 text-neutral-500 dark:text-neutral-400" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
