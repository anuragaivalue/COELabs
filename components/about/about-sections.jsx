"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Server,
  ShieldAlert,
  KeyRound,
  CloudCog,
  Globe2,
  Calendar,
  Building2,
  Sparkles,
  Lock,
  Activity,
  Terminal,
  Layers,
  Cpu,
  Workflow,
  Network
} from "lucide-react";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { AnimatedCounter } from "@/components/ui/counter";
import {
  aboutStats,
  pillars,
  leadership,
  labCapabilities
} from "@/data/about-content";

// Map string icon names to Lucide icon components
const capabilityIcons = {
  Server: Server,
  ShieldAlert: ShieldAlert,
  KeyRound: KeyRound,
  CloudCog: CloudCog
};

export function AboutSections() {
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [selectedVisitType, setSelectedVisitType] = useState("physical");

  const activePillar = pillars[activePillarIndex];

  return (
    <div className="relative overflow-hidden font-display text-neutral-900 dark:text-neutral-100 selection:bg-amber-500/20 selection:text-amber-700 dark:selection:text-orange-400">
      
      {/* =========================================================================
          AMBIENT TELEMETRY BACKGROUND GRADIENTS
          ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Top-right subtle amber glow */}
        <div className="absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent blur-3xl dark:from-amber-500/15 dark:via-orange-600/5" />
        {/* Mid-left cyber blue accent */}
        <div className="absolute top-[35%] -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl dark:from-blue-600/10 dark:via-indigo-600/5" />
        {/* Bottom-center warm glow */}
        <div className="absolute bottom-[10%] left-1/3 h-[600px] w-[600px] rounded-full bg-gradient-to-t from-orange-500/10 via-amber-500/5 to-transparent blur-3xl dark:from-orange-500/10" />
      </div>

      {/* =========================================================================
          1. HERO SECTION: MISSION & CORE POSITIONING
          ========================================================================= */}
      <section className="relative px-6 pt-12 pb-16 sm:px-10 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 font-sans">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">About Us</span>
          </nav>

          <MotionReveal direction="up">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-orange-400 shadow-sm backdrop-blur-sm">
                <IValueEmblem className="size-3.5" />
                <span>iValue Center of Excellence • Innovation & Validation Hub</span>
              </div>

              <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-neutral-900 dark:text-white leading-[1.12]">
                Bridging Enterprise Needs with{" "}
                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 bg-clip-text text-transparent">
                  Multi-OEM Solutions
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans max-w-3xl">
                The iValue Center of Excellence (CoE) is Asia’s premier hands-on technology validation platform. 
                We remove the guesswork from enterprise tech investments by providing pre-tested multi-vendor blueprints, 
                high-fidelity simulation testbeds, and certified interoperability playbooks across Cybersecurity, Hybrid Cloud, and Sovereign Infrastructure.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#pillars"
                  className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-black dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-all cursor-pointer"
                >
                  Explore Strategic Pillars <ArrowRight className="size-4" />
                </a>
                <a
                  href="#schedule-visit"
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-6 py-3.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 dark:border-white/15 dark:bg-neutral-900/80 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white backdrop-blur-sm shadow-sm transition-all cursor-pointer"
                >
                  <Calendar className="size-4 text-amber-600 dark:text-orange-400" />
                  Schedule Lab Visit
                </a>
              </div>
            </div>
          </MotionReveal>

          {/* =========================================================================
              2. KEY METRICS & PROVEN RECORD (aboutStats)
              ========================================================================= */}
          <div className="mt-16 sm:mt-24">
            <MotionReveal direction="up" delay={0.1}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {aboutStats.map((stat, idx) => (
                  <div
                    key={stat.id}
                    className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-6 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-md dark:border-white/10 dark:bg-neutral-900/60"
                  >
                    <div className="flex items-baseline gap-1 text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
                      <AnimatedCounter value={stat.value} duration={1200} />
                      <span className="text-amber-600 dark:text-orange-400">{stat.suffix}</span>
                    </div>

                    <h2 className="mt-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {stat.label}
                    </h2>

                    <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                      {stat.description}
                    </p>

                    <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>
            </MotionReveal>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. STRATEGIC PILLARS (Interactive Tabs & Feature Breakdown)
          ========================================================================= */}
      <section id="pillars" className="relative border-t border-neutral-200/80 bg-neutral-50/70 py-20 dark:border-white/10 dark:bg-neutral-900/30">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          
          <MotionReveal direction="up">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300">
                <Sparkles className="size-3.5 text-amber-600 dark:text-orange-400" />
                <span>Architectural Foundation</span>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-900 dark:text-white">
                Our 4 Strategic Pillars
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                Engineered to replace fragmented vendor speculation with rigorous, repeatable verification.
              </p>
            </div>
          </MotionReveal>

          {/* Interactive Pillar Selector Tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {pillars.map((pillar, idx) => (
              <button
                key={pillar.id}
                onClick={() => setActivePillarIndex(idx)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activePillarIndex === idx
                    ? "bg-neutral-900 text-white shadow-md dark:bg-white dark:text-black scale-[1.02]"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-white/10 dark:bg-neutral-900/80 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activePillarIndex === idx ? "bg-white/20 text-white dark:bg-black/20 dark:text-black" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"}`}>
                  {pillar.number}
                </span>
                <span>{pillar.shortTitle}</span>
              </button>
            ))}
          </div>

          {/* Active Pillar Highlight Showcase */}
          <div className="mt-8">
            <MotionReveal direction="up" delay={0.1}>
              <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 sm:p-12 shadow-xl dark:border-white/10 dark:bg-neutral-900">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
                  
                  {/* Left Details (7 cols) */}
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-orange-400">
                        Pillar {activePillar.number} • {activePillar.tag}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-sans">
                        <Activity className="size-3.5" />
                        {activePillar.metric}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white leading-tight">
                      {activePillar.title}
                    </h3>

                    <p className="mt-2 text-sm sm:text-base font-semibold text-amber-600 dark:text-orange-400">
                      {activePillar.subtitle}
                    </p>

                    <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                      {activePillar.description}
                    </p>

                    {/* Feature Checkpoints */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-sans">
                      {activePillar.features.map((feature, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-start gap-2.5 rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-3 dark:border-white/5 dark:bg-neutral-800/40"
                        >
                          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                          <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium leading-snug">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-white/10 flex items-center gap-4">
                      <Link
                        href="/request-poc"
                        className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-sm transition-all"
                      >
                        Request Architecture Blueprint <ArrowRight className="size-3.5" />
                      </Link>
                      <Link
                        href="/specialized-stacks"
                        className="text-xs font-semibold text-neutral-600 hover:text-amber-600 dark:text-neutral-400 dark:hover:text-orange-400 transition-colors"
                      >
                        View Pre-Built Stacks →
                      </Link>
                    </div>
                  </div>

                  {/* Right Visual Dashboard Graphic (5 cols) */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative w-full rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 shadow-inner dark:border-white/10 dark:from-neutral-800/80 dark:to-neutral-950">
                      
                      <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <Terminal className="size-4 text-amber-600 dark:text-orange-400" />
                          <span className="text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300">
                            iVCoE::telemetry_stream
                          </span>
                        </div>
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>

                      <div className="mt-4 space-y-3 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center justify-between rounded-lg bg-white/80 p-2.5 shadow-xs dark:bg-neutral-900/60">
                          <span>Target Metric:</span>
                          <span className="font-bold text-amber-600 dark:text-orange-400">{activePillar.metric}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/80 p-2.5 shadow-xs dark:bg-neutral-900/60">
                          <span>Multi-Stack Verification:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">Validated</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/80 p-2.5 shadow-xs dark:bg-neutral-900/60">
                          <span>ISO 27001 Mapping:</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">Annex A.12 / A.14</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/80 p-2.5 shadow-xs dark:bg-neutral-900/60">
                          <span>Sandbox Isolation:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">100% Air-Gapped</span>
                        </div>
                      </div>

                      <div className="mt-6 rounded-xl border border-dashed border-neutral-300 p-4 text-center dark:border-white/15 bg-white/50 dark:bg-neutral-900/30">
                        <Lock className="size-5 mx-auto text-neutral-400 mb-1" />
                        <p className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400">
                          Execution logs and blueprint outputs are signed and NDA-protected for enterprise security.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </MotionReveal>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. LAB CAPABILITIES (Bare-Metal, Cyber Range, HSM Vaults, Cloud Interconnect)
          ========================================================================= */}
      <section className="relative py-20 px-6 sm:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          
          <MotionReveal direction="up">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <Server className="size-3.5 text-amber-600 dark:text-orange-400" />
                <span>Physical & Virtual Infrastructure</span>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-900 dark:text-white">
                High-Fidelity Lab Capabilities
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                Our hybrid testing infrastructure replicates real-world enterprise constraints at wire speed.
              </p>
            </div>
          </MotionReveal>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
            {labCapabilities.map((cap, idx) => {
              const IconComponent = capabilityIcons[cap.icon] || Server;

              return (
                <MotionReveal key={cap.id} direction="up" delay={idx * 0.1}>
                  <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-7 sm:p-9 shadow-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900 h-full">
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-orange-400 shadow-sm transition-transform duration-300 group-hover:scale-105">
                          <IconComponent className="size-6" />
                        </div>
                        <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-0.5 text-[11px] font-semibold text-neutral-600 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-400">
                          {cap.badge}
                        </span>
                      </div>

                      <h3 className="mt-6 text-xl font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-orange-400 transition-colors">
                        {cap.title}
                      </h3>

                      <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                        {cap.description}
                      </p>
                    </div>

                    {/* Spec Checklist Pills */}
                    <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-white/10">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                        Technical Specifications
                      </h4>
                      <div className="space-y-2 font-sans">
                        {cap.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                            <span className="size-1.5 rounded-full bg-amber-600 dark:bg-orange-400 shrink-0" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subtle Corner Ambient Aura */}
                    <div className="absolute -bottom-8 -right-8 size-28 rounded-full bg-amber-500/5 blur-2xl group-hover:bg-amber-500/15 transition-all pointer-events-none" />
                  </div>
                </MotionReveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. EXECUTIVE LEADERSHIP & ARCHITECTURAL SPECIALISTS
          ========================================================================= */}
      <section className="relative border-t border-neutral-200/80 bg-neutral-50/50 py-20 dark:border-white/10 dark:bg-neutral-950/60 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          
          <MotionReveal direction="up">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <ShieldCheck className="size-3.5 text-amber-600 dark:text-orange-400" />
                <span>Executive Guidance</span>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-900 dark:text-white">
                CoE Technical Leadership
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                Our team brings over a century of cumulative engineering expertise architecting mission-critical infrastructure across APAC and EMEA.
              </p>
            </div>
          </MotionReveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((leader, idx) => (
              <MotionReveal key={leader.name} direction="up" delay={idx * 0.08}>
                <div className="flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-neutral-900 h-full">
                  
                  <div>
                    {/* Monogram Avatar & Experience Tag */}
                    <div className="flex items-center justify-between">
                      <div className={`flex size-14 items-center justify-center rounded-2xl border font-mono text-lg font-bold ${leader.color}`}>
                        {leader.avatar}
                      </div>
                      <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 font-sans">
                        {leader.experience}
                      </span>
                    </div>

                    <h3 className="mt-5 text-base font-bold text-neutral-900 dark:text-white">
                      {leader.name}
                    </h3>

                    <p className="text-xs font-semibold text-amber-700 dark:text-orange-400 font-sans mt-0.5">
                      {leader.role}
                    </p>

                    <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans line-clamp-4">
                      {leader.bio}
                    </p>
                  </div>

                  {/* Domain Specialties Pills */}
                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Domain Focus
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {leader.specialties.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md border border-neutral-200/90 bg-neutral-100/80 px-2 py-0.5 text-[10px] font-medium text-neutral-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </MotionReveal>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. SCHEDULE VISIT & LAB ENGAGEMENT (CLOSING CTA)
          ========================================================================= */}
      <section id="schedule-visit" className="relative py-20 px-6 sm:px-10 lg:py-24">
        <div className="mx-auto max-w-5xl">
          
          <MotionReveal direction="up">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-8 sm:p-14 shadow-2xl dark:border-white/10 dark:from-neutral-900 dark:to-neutral-950 text-center">
              
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-orange-400">
                <IValueEmblem className="size-3.5" />
                <span>Direct Hands-On Access</span>
              </div>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-900 dark:text-white">
                Experience the iValue CoE First-Hand
              </h2>

              <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                Whether you need a confidential proof-of-concept for an upcoming RFP or a full multi-vendor adversary simulation, 
                our specialists are ready to architect your session.
              </p>

              {/* Visit Type Toggle */}
              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-xl border border-neutral-200 bg-white p-1 shadow-xs dark:border-white/10 dark:bg-neutral-800">
                  <button
                    onClick={() => setSelectedVisitType("physical")}
                    className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      selectedVisitType === "physical"
                        ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-black"
                        : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    }`}
                  >
                    🏢 Physical Lab Tour (Bangalore / Singapore)
                  </button>
                  <button
                    onClick={() => setSelectedVisitType("virtual")}
                    className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      selectedVisitType === "virtual"
                        ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-black"
                        : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    }`}
                  >
                    🌐 Low-Latency Remote Sandbox
                  </button>
                </div>
              </div>

              {/* Dynamic Action Trigger based on Selected Type */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/request-poc"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-7 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all"
                >
                  {selectedVisitType === "physical" ? "Book Physical Facility Visit" : "Launch Remote Virtual PoC"} <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:bg-neutral-100 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-all shadow-sm"
                >
                  Talk to a Principal Architect
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 pt-8 border-t border-neutral-200/80 dark:border-white/10 flex flex-wrap justify-center items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400 font-sans">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  <span>ISO 27001 Certified Lab</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="size-4 text-emerald-500" />
                  <span>Comprehensive NDA Protection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="size-4 text-emerald-500" />
                  <span>Zero Impact to Live Production</span>
                </div>
              </div>

            </div>
          </MotionReveal>

        </div>
      </section>

    </div>
  );
}

export default AboutSections;
