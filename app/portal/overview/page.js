"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { OemImage } from "@/components/ui/oem-image";
import { Card } from "@/components/ui/card";
import { MARKETPLACE_STACKS } from "@/data/marketplace-data";
import { PARTNER_SOLUTIONS } from "@/data/marketplace-partner-solutions";
import { OEM_PARTNER_SOLUTIONS } from "@/data/oem-partner-solutions";
import { OemSolutionDetailView } from "@/components/marketplace/oem-solution-detail-view";
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Building2,
  Cpu,
  Laptop2,
  FileText,
  Search,
  BadgeCheck,
  Zap,
  TrendingUp
} from "lucide-react";

function OverviewLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent dark:border-orange-400" />
        <p className="text-xs text-neutral-500 font-sans">Loading Solution Stacks Overview...</p>
      </div>
    </div>
  );
}

function OverviewContent() {
  const searchParams = useSearchParams();
  const initialStack = searchParams.get("stack") || "";
  const cParam = searchParams.get("c");
  const contentKeyParam = searchParams.get("contentKey");

  const activeSolution = useMemo(() => {
    if (!cParam && !contentKeyParam) return null;
    return OEM_PARTNER_SOLUTIONS.find(
      (s) =>
        (cParam && String(s.id) === String(cParam)) ||
        (contentKeyParam && s.idKey === contentKeyParam)
    );
  }, [cParam, contentKeyParam]);

  const [selectedVertical, setSelectedVertical] = useState("All");
  const [searchQuery, setSearchQuery] = useState(initialStack);

  const verticals = [
    "All",
    "BFSI",
    "Fintech",
    "Healthcare",
    "Digital Natives",
    "Government",
    "Energy & Power"
  ];

  // Filter Stacks
  const filteredStacks = useMemo(() => {
    return MARKETPLACE_STACKS.filter((stack) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        stack.title.toLowerCase().includes(q) ||
        stack.slug.toLowerCase().includes(q) ||
        stack.category.toLowerCase().includes(q) ||
        stack.executiveSummary.toLowerCase().includes(q) ||
        stack.architectureDescription.toLowerCase().includes(q) ||
        stack.oems.some((o) => o.name.toLowerCase().includes(q));

      const matchesVertical =
        selectedVertical === "All" ||
        stack.targetVerticals.some((v) =>
          v.toLowerCase().includes(selectedVertical.toLowerCase())
        );

      return matchesSearch && matchesVertical;
    });
  }, [searchQuery, selectedVertical]);

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-900">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          {activeSolution ? (
            <OemSolutionDetailView solution={activeSolution} />
          ) : (
            <>
              {/* Breadcrumb */}
              <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/portal/marketplace" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                Marketplace
              </Link>
              <span>/</span>
              <span className="text-neutral-900 dark:text-white font-semibold">Solutions Overview</span>
            </div>

            <Link
              href="/portal/marketplace"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 dark:text-orange-400 dark:hover:text-orange-300"
            >
              <span>Back to Marketplace</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {/* Hero Header */}
          <div className="mt-8 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:border-orange-400/25 dark:bg-orange-500/15 dark:text-orange-300">
              <Layers className="size-3.5 text-amber-600 dark:text-orange-400" />
              <span>Executive Solutions Architecture</span>
            </div>

            <h1 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
              Multi-OEM Solution Stacks Overview
            </h1>

            <p className="mt-3 font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Executive architectural summaries, control references, and target verticals for certified multi-vendor blueprints. Designed for enterprise CISOs, enterprise architects, and technology evaluation committees.
            </p>
          </div>

          {/* Search & Vertical Filters */}
          <div className="mt-12 rounded-2xl border border-neutral-200/90 bg-white/80 p-4 sm:p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/70">
            <div className="relative">
              <Search className="absolute top-1/2 left-3.5 -translate-y-1/2 size-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search executive blueprints by stack name, OEM partner (e.g. Datadog, EDB, Check Point, CyberArk), or compliance control..."
                className="w-full rounded-xl border border-neutral-200 bg-white/90 py-3.5 pr-12 pl-11 text-xs sm:text-sm font-sans text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/15 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer px-2 py-1 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Vertical Filter Pills */}
            <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-neutral-100 dark:border-white/5">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 self-center mr-1">
                Target Vertical:
              </span>
              {verticals.map((vert) => (
                <button
                  key={vert}
                  onClick={() => setSelectedVertical(vert)}
                  className={`rounded-full px-3.5 py-1 text-xs font-display font-medium transition-all cursor-pointer ${
                    selectedVertical === vert
                      ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-black font-semibold"
                      : "border border-neutral-200 bg-white/70 text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-400 dark:hover:bg-white/5"
                  }`}
                >
                  {vert}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Executive Solution Stacks */}
          <div className="mt-10 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Certified Multi-OEM Architecture Blueprints ({filteredStacks.length})
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  End-to-end multi-vendor architectures verified in live CoE lab environments.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {filteredStacks.map((stack) => (
                <Card
                  key={stack.id}
                  className="overflow-hidden border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 shadow-md hover:border-amber-500/40 transition-all p-6 sm:p-8"
                >
                  {/* Card Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-white/10">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-orange-300 uppercase">
                          {stack.category}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{stack.readinessStatus}</span>
                        </span>
                        <span className="text-[11px] font-bold text-amber-700 dark:text-orange-400">
                          {stack.benchmarkMultiplier}
                        </span>
                      </div>

                      <h3 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        {stack.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        {stack.tagline}
                      </p>
                    </div>

                    {/* Target Verticals Badges */}
                    <div className="flex flex-wrap md:flex-col md:items-end gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Target Verticals
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {stack.targetVerticals.map((v, vIdx) => (
                          <span
                            key={vIdx}
                            className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-[10px] font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Executive Summary Callout */}
                  <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-50/40 p-4 dark:border-amber-500/15 dark:bg-amber-950/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-orange-400">
                      <FileText className="size-4 text-amber-600 dark:text-orange-400" />
                      <span>Executive Summary</span>
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed">
                      {stack.executiveSummary}
                    </p>
                  </div>

                  {/* Architecture Description */}
                  <div className="mt-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Architecture Blueprint & Technical Flow
                    </h4>
                    <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                      {stack.architectureDescription}
                    </p>
                  </div>

                  {/* OEM Partner Lineup */}
                  <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-white/5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                      Certified Multi-OEM Technology Stack ({stack.oems.length} Partners)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {stack.oems.map((oem, oIdx) => (
                        <div
                          key={oIdx}
                          className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-3 dark:border-white/10 dark:bg-neutral-800/60"
                        >
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-2xs border border-neutral-200/60 dark:border-white/20">
                            <OemImage
                              src={oem.logo}
                              darkSrc={oem.logoDark}
                              alt={oem.name}
                              className="max-h-7 max-w-[32px] object-contain"
                              placeholderClassName="text-[8px]"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-xs font-bold text-neutral-900 dark:text-white truncate">
                              {oem.name}
                            </span>
                            <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                              {oem.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Controls & Compliance Row */}
                  <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Control References */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                        Key Architecture Control References
                      </h4>
                      <ul className="space-y-1.5">
                        {stack.controlReferences.map((ctrl, cIdx) => (
                          <li
                            key={cIdx}
                            className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-sans"
                          >
                            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{ctrl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Compliance Frameworks */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                        Regulatory Audit Baselines
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {stack.complianceFrameworks.map((comp, kIdx) => (
                          <span
                            key={kIdx}
                            className="inline-flex items-center gap-1 rounded-md bg-neutral-100 dark:bg-neutral-800/90 px-2.5 py-1 text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/10"
                          >
                            <BadgeCheck className="size-3 text-amber-600 dark:text-orange-400" />
                            <span>{comp}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/portal/marketplace?oem=${encodeURIComponent(stack.oems[0]?.name || "")}#solutions-stack`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 transition-all"
                      >
                        <span>Filter in Marketplace</span>
                        <ArrowRight className="size-3" />
                      </Link>

                      <Link
                        href={`/stack/${stack.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-all"
                      >
                        <span>Full Tech Spec</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </div>

                    <Link
                      href={`/request-poc?stack=${encodeURIComponent(stack.slug)}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 dark:text-orange-400 dark:hover:text-orange-300"
                    >
                      <span>Request POC Briefing</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Section 2: Partner Multi-OEM Solutions Showcase */}
          <div className="mt-20">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-orange-400">
                  <Sparkles className="size-3.5" />
                  <span>Integrated Partner Architectures</span>
                </div>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Collaborative Multi-OEM Solution Blueprints
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  Pre-validated multi-vendor blueprints co-engineered with tier-1 global partners for rapid enterprise adoption.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {PARTNER_SOLUTIONS.map((sol) => (
                <div
                  key={sol.solutionId}
                  className="flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white/90 p-6 sm:p-7 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/80 hover:border-amber-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <div>
                    {/* Partner stack title */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md border border-neutral-200 bg-neutral-100/90 px-2 py-0.5 text-[10px] font-bold text-neutral-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300">
                        {sol.category}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {sol.deploymentTimeline}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-neutral-900 dark:text-white">
                      {sol.name}
                    </h3>
                    <p className="mt-0.5 text-xs font-semibold text-amber-700 dark:text-orange-400">
                      {sol.partnerStack}
                    </p>

                    <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                      {sol.executiveSummary}
                    </p>

                    {/* Target outcomes */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/5 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Key Target Outcomes:
                      </span>
                      {sol.targetOutcomes.map((out, oIdx) => (
                        <div key={oIdx} className="flex items-start gap-1.5 text-[11px] text-neutral-700 dark:text-neutral-300">
                          <CheckCircle2 className="size-3 text-amber-600 dark:text-orange-400 shrink-0 mt-0.5" />
                          <span>{out}</span>
                        </div>
                      ))}
                    </div>

                    {/* Participating OEMs */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/5">
                      <div className="flex flex-wrap items-center gap-2">
                        {sol.oemPartners.map((oem, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-center gap-1.5 rounded-lg border border-neutral-200/70 bg-white px-2 py-1 dark:border-white/10 dark:bg-neutral-800"
                            title={`${oem.name}: ${oem.role}`}
                          >
                            <div className="size-5 flex items-center justify-center">
                              <OemImage
                                src={oem.logo}
                                darkSrc={oem.logoDark}
                                alt={oem.name}
                                className="max-h-4 max-w-[20px] object-contain"
                                placeholderClassName="text-[7px]"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200">
                              {oem.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {sol.estimatedRoiMultiplier}
                    </span>

                    <Link
                      href={`/portal/marketplace?oem=${encodeURIComponent(sol.oemPartners[0]?.name || "")}#solutions-stack`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-orange-400 hover:underline"
                    >
                      <span>Explore Stack</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CoE Lab CTA */}
          <div className="mt-20 rounded-3xl border border-neutral-200/90 bg-gradient-to-br from-neutral-900 to-black p-8 sm:p-12 text-white shadow-xl dark:border-white/15">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-orange-300">
                  <Laptop2 className="size-3.5" />
                  <span>Physical & Virtual Lab Environments</span>
                </div>
                <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Schedule a High-Fidelity Multi-OEM Architecture Simulation
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                  Evaluate any pre-integrated solution stack against your real-world enterprise traffic, active threat vectors, and compliance requirements in our Bangalore CoE physical lab or dedicated virtual cloud sandbox.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0">
                <Link
                  href="/request-poc?source=overview_cta"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-neutral-900 hover:bg-neutral-100 shadow-md transition-all"
                >
                  <span>Schedule Lab Demonstration</span>
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition-all"
                >
                  <span>Talk with an Architect</span>
                </Link>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PortalOverviewPage() {
  return (
    <Suspense fallback={<OverviewLoadingFallback />}>
      <OverviewContent />
    </Suspense>
  );
}
