"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/counter";
import { TiltCard } from "@/components/ui/tilt-card";
import { IValueEmblem } from "@/components/ui/ivalue-logo";

function InteractiveStatCard({ stat, index, variant }) {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    setSpotlight((prev) => ({ ...prev, active: false }));
  };

  return (
    <div
      className="card-reveal h-full"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <TiltCard className="rounded-2xl h-full">
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative rounded-2xl h-full"
        >
          <Card className="group relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-xl dark:border-orange-500/20 dark:bg-black/80 dark:hover:border-orange-400/60 dark:hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]">
            {/* Cursor-tracking radial gold & white glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: spotlight.active ? 1 : 0,
                background: `radial-gradient(220px circle at ${spotlight.x}% ${spotlight.y}%, rgba(251, 191, 36, 0.18), rgba(255, 255, 255, 0.12) 38%, transparent 75%)`,
              }}
            />

            {/* Top gold & white accent bar that expands smoothly on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5 origin-center scale-x-0 bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500 transition-transform duration-300 ease-out group-hover:scale-x-100 dark:from-orange-500 dark:via-amber-300 dark:to-orange-500"
            />

            {variant === "success" ? (
              <>
                <AnimatedCounter
                  value={stat.value}
                  duration={1000}
                  className="relative z-10 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 transition-all duration-300 group-hover:scale-105 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-200"
                />
                <span className="relative z-10 mt-2.5 font-display text-xs sm:text-sm font-semibold text-neutral-700 transition-colors duration-300 group-hover:text-neutral-950 dark:text-neutral-300 dark:group-hover:text-white leading-snug">
                  {stat.label}
                </span>
              </>
            ) : (
              <>
                <span className="relative z-10 font-display text-xs font-bold uppercase tracking-wider text-amber-700 transition-transform duration-300 group-hover:-translate-y-0.5 dark:text-amber-300">
                  {stat.label}
                </span>
                <AnimatedCounter
                  value={stat.value}
                  duration={1000}
                  className="relative z-10 mt-2.5 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 transition-all duration-300 group-hover:scale-105 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-200"
                />
              </>
            )}
          </Card>
        </div>
      </TiltCard>
    </div>
  );
}

export function StatsStrip() {
  const successStats = [
    { value: "1,800+", label: "Interactive Demos" },
    { value: "600+", label: "Architecture Solution Validations" },
    { value: "100+", label: "RFP Technical Validations" },
    { value: "750+ Cr", label: "Top Line Revenue Recognition ( Over 2+ Year)" },
  ];

  const engagementStats = [
    { value: "13", label: "iValue Stacks" },
    { value: "62", label: "Onboarded OEM Products" },
    { value: "250+", label: "Partners Engaged" },
    { value: "700+", label: "Customer Served" },
  ];

  return (
    <section
      id="coe-metrics"
      aria-label="Center of Excellence Metrics & Scale"
      className="section-divider py-12 sm:py-16 md:py-20 relative overflow-hidden bg-transparent"
    >
      {/* Background radial gold glow matching site theme */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[520px] w-full max-w-6xl rounded-full bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(245,158,11,0.1),transparent_70%)] blur-3xl dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(245,158,11,0.18),transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            THE RECTANGLE CONTAINER (Contains all metrics inside it)
           ======================================================== */}
        <div className="relative rounded-3xl border border-neutral-200/90 bg-white/85 p-6 sm:p-8 md:p-12 shadow-2xl backdrop-blur-xl dark:border-orange-500/25 dark:bg-black/75 transition-colors duration-300">
          {/* Subtle perimeter glow accent */}
          <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20 dark:from-orange-500/30 dark:via-amber-500/20 dark:to-orange-500/30 opacity-70 blur-xl -z-10" />

          {/* Master Rectangle Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:border-orange-400/30 dark:bg-orange-500/15 dark:text-orange-300 mb-3 shadow-2xs">
              <IValueEmblem className="size-3.5" />
              <span>Proven Production Scale & Ecosystem</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
              Center of Excellence <span className="text-amber-600 dark:text-orange-400">Impact & Engagement</span>
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-2xl mx-auto leading-relaxed">
              Real-world delivery metrics, partner traction, and audited enterprise solutions engineered across 2+ years of production excellence.
            </p>
          </div>

          {/* 1. TOP BLOCK: COE Success Over 2+ Years */}
          <div id="success" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-500" />
                <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  COE Success Over 2+ Years
                </h3>
              </div>
              <span className="text-[11px] font-mono font-medium text-amber-700 dark:text-amber-400 hidden sm:inline">
                Delivery Metrics
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {successStats.map((stat, idx) => (
                <InteractiveStatCard
                  key={stat.label}
                  stat={stat}
                  index={idx}
                  variant="success"
                />
              ))}
            </div>
          </div>

          {/* Subtle inner hairline divider between the two metric blocks */}
          <div className="my-8 sm:my-10 border-t border-neutral-200/80 dark:border-white/10 relative">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white/90 dark:bg-neutral-900/90 px-3 text-[11px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              • • •
            </div>
          </div>

          {/* 2. BOTTOM BLOCK: COE Engagement */}
          <div id="engagement" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-500" />
                <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  COE Engagement
                </h3>
              </div>
              <span className="text-[11px] font-mono font-medium text-amber-700 dark:text-amber-400 hidden sm:inline">
                Ecosystem Adoption
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {engagementStats.map((stat, idx) => (
                <InteractiveStatCard
                  key={stat.label}
                  stat={stat}
                  index={idx}
                  variant="engagement"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsStrip;
