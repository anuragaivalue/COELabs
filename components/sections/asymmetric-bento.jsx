"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { AnimatedCounter } from "@/components/ui/counter";
import { MotionReveal } from "@/components/ui/motion-reveal";
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Lock,
  Globe,
  Database,
  Activity,
  Server,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  Laptop2
} from "lucide-react";

export function AsymmetricBento() {
  const [activeTab, setActiveTab] = useState("topology");

  return (
    <section id="capabilities" className="section-divider py-20 md:py-28 overflow-hidden relative">
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute top-1/4 -left-48 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl dark:bg-orange-500/15 -z-10" />
      <div className="pointer-events-none absolute bottom-1/4 -right-48 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl dark:bg-amber-500/15 -z-10" />

      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        {/* Section Header */}
        <MotionReveal direction="up">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:border-orange-400/25 dark:bg-orange-500/15 dark:text-orange-300">
              <span>Enterprise Architecture & Innovation</span>
            </div>

            <h2 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-white">
              Engineered for Resilient Enterprise Multi-Vendor Ecosystems
            </h2>

            <p className="mt-3 font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              A single unified testing, certification, and deployment platform bridging <span className="highlight">multi-cloud security, autonomous SecOps, and compliance benchmarks</span>.
            </p>
          </div>
        </MotionReveal>

        {/* Asymmetric Bento Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">

          {/* Block 1: Main Feature Showcase (Span 7 cols) with 3D Tilt */}
          <div className="lg:col-span-7">
            <TiltCard className="h-full rounded-2xl">
              <Card className="h-full flex flex-col justify-between p-6 sm:p-8 border border-neutral-200/90 bg-white/95 dark:border-white/10 dark:bg-neutral-900/90 shadow-sm hover:border-amber-500/50 hover:shadow-xl transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-display text-[11px] font-bold text-amber-700 uppercase dark:border-orange-400/30 dark:bg-orange-500/15 dark:text-orange-300">
                      Core Multistack Engine
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Architecture Certified
                    </span>
                  </div>

                  <h3 className="mt-4 font-sans text-2xl font-bold text-neutral-900 dark:text-white">
                    Pre-Integrated Multi-OEM Blueprints
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                    Eliminate architectural silos with certified integrations unifying network perimeter, cloud workloads, identity governance, and autonomous incident response.
                  </p>

                  {/* Interactive Architecture Topology Graphic */}
                  <div className="mt-6 rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-4 dark:border-white/10 dark:bg-neutral-950/70">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-2xs dark:border-white/10 dark:bg-neutral-900">
                        <Lock className="size-4 mx-auto text-amber-600 dark:text-orange-400" />
                        <div className="mt-1.5 font-display text-xs font-bold text-neutral-900 dark:text-white">Identity (IAM)</div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Zero Trust PAM</div>
                      </div>
                      <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-2xs dark:border-white/10 dark:bg-neutral-900">
                        <Globe className="size-4 mx-auto text-amber-600 dark:text-orange-400" />
                        <div className="mt-1.5 font-display text-xs font-bold text-neutral-900 dark:text-white">Cloud (CNAPP)</div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Microsegmentation</div>
                      </div>
                      <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-2xs dark:border-white/10 dark:bg-neutral-900">
                        <Activity className="size-4 mx-auto text-amber-600 dark:text-orange-400" />
                        <div className="mt-1.5 font-display text-xs font-bold text-neutral-900 dark:text-white">SecOps (SOC)</div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Chronicle / Splunk</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <AnimatedCounter
                      value="34+"
                      duration={1000}
                      className="font-display text-3xl font-extrabold text-neutral-900 dark:text-white"
                    />
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      Pre-Tested Solution Blueprints
                    </span>
                  </div>

                  <Link
                    href="/portal/marketplace"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 shadow-sm transition-all"
                  >
                    <span>Explore Marketplace</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </Card>
            </TiltCard>
          </div>

          {/* Block 2: Live Labs (Bangalore & Singapore) (Span 5 cols) */}
          <div className="lg:col-span-5">
            <TiltCard className="h-full rounded-2xl">
              <Card className="h-full flex flex-col justify-between p-6 sm:p-8 border border-neutral-200/90 bg-white/95 dark:border-white/10 dark:bg-neutral-900/90 shadow-sm hover:border-amber-500/50 hover:shadow-xl transition-all">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-orange-400">
                    <Laptop2 className="size-4" />
                    <span>Executive Briefing Center</span>
                  </div>

                  <h3 className="mt-3 font-sans text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                    Bangalore & Singapore Live Labs
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                    Hands-on multi-vendor enterprise testbeds. Benchmark your architecture on live hardware racks guided by specialized architects before capital allocation.
                  </p>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-sans">
                      <CheckCircle2 className="size-3.5 text-amber-600 dark:text-orange-400 shrink-0" />
                      <span>Zero-Trust SWIFT & Financial Payment Sandbox</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-sans">
                      <CheckCircle2 className="size-3.5 text-amber-600 dark:text-orange-400 shrink-0" />
                      <span>Purdue Model OT/ICS SCADA Security Testbed</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-sans">
                      <CheckCircle2 className="size-3.5 text-amber-600 dark:text-orange-400 shrink-0" />
                      <span>Petabyte-Scale Chronicle & Mandiant SIEM Simulation</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Engineering Scale</div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white">
                      <AnimatedCounter value="250+" duration={1000} /> Certified Architects
                    </div>
                  </div>

                  <Link
                    href="/request-poc"
                    className="inline-flex items-center gap-1 rounded-lg border border-neutral-300/80 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-all"
                  >
                    <span>Schedule Lab Demo</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </Card>
            </TiltCard>
          </div>

          {/* Block 3: Regulatory Compliance Matrix (Span 4 cols) */}
          <div className="lg:col-span-4">
            <TiltCard className="h-full rounded-2xl">
              <Card className="h-full flex flex-col justify-between p-6 border border-neutral-200/90 bg-white/95 dark:border-white/10 dark:bg-neutral-900/90 shadow-sm hover:border-amber-500/50 hover:shadow-xl transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <FileCheck2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Audit Guaranteed
                    </span>
                  </div>

                  <h3 className="mt-3 font-sans text-lg font-bold text-neutral-900 dark:text-white">
                    Regulatory Compliance Matrix
                  </h3>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
                    Pre-audited control mappings against mandatory national & global frameworks.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {["CERT-In", "RBI CSCRF", "SEBI Mandate", "DPDP Act", "IRDAI", "ISO 27001"].map((reg) => (
                      <span
                        key={reg}
                        className="rounded-md border border-neutral-200/90 bg-neutral-100/80 px-2 py-0.5 text-[10px] font-semibold text-neutral-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    <AnimatedCounter value="100%" duration={1000} /> Evidence Automated
                  </span>
                  <Link href="/specialized-stacks" className="text-amber-700 dark:text-orange-400 font-semibold hover:underline">
                    View Matrix →
                  </Link>
                </div>
              </Card>
            </TiltCard>
          </div>

          {/* Block 4: Revenue Multiplier Impact (Span 4 cols) */}
          <div className="lg:col-span-4">
            <TiltCard className="h-full rounded-2xl">
              <Card className="h-full flex flex-col justify-between p-6 border border-neutral-200/90 bg-white/95 dark:border-white/10 dark:bg-neutral-900/90 shadow-sm hover:border-amber-500/50 hover:shadow-xl transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <TrendingUp className="size-5 text-amber-600 dark:text-orange-400" />
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-orange-500/20 dark:text-orange-300">
                      Proven ROI
                    </span>
                  </div>

                  <h3 className="mt-3 font-sans text-lg font-bold text-neutral-900 dark:text-white">
                    Revenue Multiplier Impact
                  </h3>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
                    Accelerating time-to-market while slashing procurement & deployment overhead.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-neutral-200/80 bg-neutral-50/70 p-2.5 text-center dark:border-white/5 dark:bg-neutral-800/40">
                      <div className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                        <AnimatedCounter value="4.2x" duration={1000} />
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Faster MTTD</div>
                    </div>
                    <div className="rounded-lg border border-neutral-200/80 bg-neutral-50/70 p-2.5 text-center dark:border-white/5 dark:bg-neutral-800/40">
                      <div className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                        <AnimatedCounter value="35%" duration={1000} />
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Lower TCO</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400">Tested across 700+ enterprises</span>
                  <a href="#accelerators" className="text-amber-700 dark:text-orange-400 font-semibold hover:underline">
                    Calculators →
                  </a>
                </div>
              </Card>
            </TiltCard>
          </div>

          {/* Block 5: Global OEM Alliance (Span 4 cols) */}
          <div className="lg:col-span-4">
            <TiltCard className="h-full rounded-2xl">
              <Card className="h-full flex flex-col justify-between p-6 border border-neutral-200/90 bg-white/95 dark:border-white/10 dark:bg-neutral-900/90 shadow-sm hover:border-amber-500/50 hover:shadow-xl transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <Cpu className="size-5 text-amber-600 dark:text-orange-400" />
                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                      Tier-1 Alliance
                    </span>
                  </div>

                  <h3 className="mt-3 font-sans text-lg font-bold text-neutral-900 dark:text-white">
                    Certified Technology OEMs
                  </h3>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
                    Leading cybersecurity & datacenter brands pre-validated in harmonious stacks.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {["Check Point", "Google Cloud", "CyberArk", "Tenable", "SentinelOne", "Netskope"].map((oem) => (
                      <span
                        key={oem}
                        className="rounded-md border border-neutral-200/90 bg-neutral-100/80 px-2 py-0.5 text-[10px] font-semibold text-neutral-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {oem}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    <AnimatedCounter value="15+" duration={1000} /> Global Leaders
                  </span>
                  <Link href="/oem" className="text-amber-700 dark:text-orange-400 font-semibold hover:underline">
                    OEM Directory →
                  </Link>
                </div>
              </Card>
            </TiltCard>
          </div>

        </div>
      </div>
    </section>
  );
}
