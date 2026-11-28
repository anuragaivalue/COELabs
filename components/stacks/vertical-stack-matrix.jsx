"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { OemImage } from "@/components/ui/oem-image";
import { Card } from "@/components/ui/card";
import {
  VERTICAL_DOMAINS,
  REGULATORY_STANDARDS,
} from "@/data/vertical-stacks-data";
import {
  Landmark,
  Factory,
  Zap,
  ShieldCheck,
  Pill,
  Stethoscope,
  Building2,
  CheckCircle2,
  ArrowRight,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Filter,
  FileCheck2,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Server
} from "lucide-react";

// Icon mapping helper
function renderVerticalIcon(iconName, className = "size-5") {
  switch (iconName) {
    case "Landmark":
      return <Landmark className={className} />;
    case "Factory":
      return <Factory className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "Pill":
      return <Pill className={className} />;
    case "Stethoscope":
      return <Stethoscope className={className} />;
    case "Building2":
      return <Building2 className={className} />;
    default:
      return <Layers className={className} />;
  }
}

// Regulatory standard color badge helper
function getStandardBadgeClass(standard) {
  const std = (standard || "").toUpperCase();
  if (std.includes("RBI")) {
    return "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/30";
  }
  if (std.includes("HIPAA")) {
    return "bg-sky-500/10 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 border-sky-500/30";
  }
  if (std.includes("NCIIPC")) {
    return "bg-purple-500/10 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border-purple-500/30";
  }
  if (std.includes("SEBI")) {
    return "bg-amber-500/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/30";
  }
  if (std.includes("DPDP")) {
    return "bg-orange-500/10 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300 border-orange-500/30";
  }
  if (std.includes("IEC")) {
    return "bg-teal-500/10 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300 border-teal-500/30";
  }
  return "bg-neutral-500/10 text-neutral-800 dark:bg-neutral-500/20 dark:text-neutral-300 border-neutral-500/30";
}

export function VerticalStackMatrix() {
  const [activeDomainId, setActiveDomainId] = useState(VERTICAL_DOMAINS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("All");
  const [crossIndustryView, setCrossIndustryView] = useState(false);

  const currentDomain = useMemo(() => {
    return (
      VERTICAL_DOMAINS.find((d) => d.id === activeDomainId) || VERTICAL_DOMAINS[0]
    );
  }, [activeDomainId]);

  // Compute controls based on filters & view mode
  const displayedControls = useMemo(() => {
    let pool = crossIndustryView
      ? VERTICAL_DOMAINS.flatMap((v) =>
          v.matrixControls.map((c) => ({
            ...c,
            industryTitle: v.shortTitle,
            industryId: v.id,
          }))
        )
      : currentDomain.matrixControls.map((c) => ({
          ...c,
          industryTitle: currentDomain.shortTitle,
          industryId: currentDomain.id,
        }));

    return pool.filter((ctrl) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        ctrl.controlId.toLowerCase().includes(q) ||
        ctrl.capability.toLowerCase().includes(q) ||
        ctrl.primaryOem.toLowerCase().includes(q) ||
        ctrl.blueprintSpec.toLowerCase().includes(q) ||
        ctrl.regulatoryMandate.toLowerCase().includes(q) ||
        ctrl.auditProof.toLowerCase().includes(q) ||
        ctrl.complementaryOems.some((o) => o.toLowerCase().includes(q));

      const matchesStandard =
        selectedStandard === "All" ||
        ctrl.regulatoryStandard
          .toUpperCase()
          .includes(selectedStandard.toUpperCase());

      return matchesSearch && matchesStandard;
    });
  }, [crossIndustryView, currentDomain, searchQuery, selectedStandard]);

  // Total matching controls across all verticals for the selected regulation
  const totalStandardMatches = useMemo(() => {
    if (selectedStandard === "All") return 0;
    return VERTICAL_DOMAINS.flatMap((v) => v.matrixControls).filter((c) =>
      c.regulatoryStandard.toUpperCase().includes(selectedStandard.toUpperCase())
    ).length;
  }, [selectedStandard]);

  return (
    <div className="w-full">
      {/* 1. Vertical Industry Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl border border-neutral-200/90 bg-white/80 dark:border-white/10 dark:bg-neutral-900/80 shadow-sm backdrop-blur-md">
        {VERTICAL_DOMAINS.map((domain) => {
          const isActive = domain.id === activeDomainId && !crossIndustryView;
          return (
            <button
              key={domain.id}
              onClick={() => {
                setActiveDomainId(domain.id);
                setCrossIndustryView(false);
              }}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-neutral-900 text-white shadow-md dark:bg-white dark:text-black scale-[1.02]"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800/60"
              }`}
            >
              <span
                className={
                  isActive
                    ? "text-amber-400 dark:text-orange-500"
                    : "text-neutral-400"
                }
              >
                {renderVerticalIcon(domain.icon, "size-4")}
              </span>
              <span>{domain.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Industry Overview Banner (or Cross-Industry Summary Banner) */}
      {!crossIndustryView ? (
        <div className="mt-8 rounded-3xl border border-neutral-200/90 bg-gradient-to-br from-white via-neutral-50/80 to-amber-50/30 p-6 sm:p-10 shadow-md backdrop-blur-md dark:border-white/10 dark:from-neutral-900/90 dark:via-neutral-950 dark:to-amber-950/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-neutral-200/80 dark:border-white/10">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-800 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300">
                  <Sparkles className="size-3.5 text-amber-600 dark:text-orange-400" />
                  <span>{currentDomain.badge}</span>
                </span>
                <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10">
                  Regulators: {currentDomain.regulatoryAuthority}
                </span>
              </div>

              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
                {currentDomain.name}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-3xl leading-relaxed">
                {currentDomain.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Server className="size-3.5 text-amber-600 dark:text-orange-400" />
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Target Workloads:
                  </span>
                  <span>{currentDomain.targetWorkloads}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
              <div className="rounded-xl border border-neutral-200/80 bg-white/80 p-3 text-center dark:border-white/10 dark:bg-neutral-900/60 shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Critical Controls
                </div>
                <div className="text-xl font-black text-amber-600 dark:text-orange-400">
                  {currentDomain.stats.criticalControls} Validated
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-white/80 p-3 text-center dark:border-white/10 dark:bg-neutral-900/60 shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Blueprints
                </div>
                <div className="text-xl font-black text-neutral-900 dark:text-white">
                  {currentDomain.stats.certifiedBlueprints} Ready
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-white/80 p-3 text-center dark:border-white/10 dark:bg-neutral-900/60 shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  OEM Ecosystem
                </div>
                <div className="text-xl font-black text-neutral-900 dark:text-white">
                  {currentDomain.stats.oemIntegrations} Tested
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-white/80 p-3 text-center dark:border-white/10 dark:bg-neutral-900/60 shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Audit Readiness
                </div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {currentDomain.stats.auditReadiness}
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry pill */}
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-xs text-amber-900 dark:text-orange-200">
            <CheckCircle2 className="size-4 shrink-0 text-amber-600 dark:text-orange-400" />
            <span className="font-semibold">Lab Telemetry:</span>
            <span>{currentDomain.labValidationTelemetry}</span>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-neutral-200/90 bg-gradient-to-br from-white via-neutral-50/80 to-purple-50/30 p-6 sm:p-10 shadow-md backdrop-blur-md dark:border-white/10 dark:from-neutral-900/90 dark:via-neutral-950 dark:to-purple-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-0.5 text-xs font-bold text-purple-800 dark:border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300">
                <Globe className="size-3.5 text-purple-600 dark:text-purple-400" />
                <span>Cross-Industry Regulatory Audit Matrix</span>
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
                Aggregated Multi-Vertical Controls
              </h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                Viewing all validated controls across all 7 industry domains filtered by{" "}
                <span className="font-bold text-amber-600 dark:text-orange-400">
                  {selectedStandard === "All" ? "All Standards" : selectedStandard}
                </span>
                .
              </p>
            </div>

            <button
              onClick={() => setCrossIndustryView(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-800 shadow-sm transition-all hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 cursor-pointer"
            >
              <span>Return to {currentDomain.shortTitle}</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Filter Bar: Regulatory Standards, Search & Scope Toggle */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-2xl border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/90 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search capability, mandate, OEM, control ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 pl-9 pr-4 py-2 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-neutral-800/60 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Regulatory Standards Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-neutral-400 mr-1 flex items-center gap-1">
            <Filter className="size-3" />
            Standard:
          </span>
          {REGULATORY_STANDARDS.map((std) => {
            const isSelected = selectedStandard === std;
            return (
              <button
                key={std}
                onClick={() => setSelectedStandard(std)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs"
                    : "border border-neutral-200 bg-white/70 text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                {std}
              </button>
            );
          })}
        </div>

        {/* Cross-Industry Toggle */}
        <div className="shrink-0">
          <button
            onClick={() => setCrossIndustryView(!crossIndustryView)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
              crossIndustryView
                ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:bg-orange-500/15 dark:text-orange-300"
                : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            <SlidersHorizontal className="size-3.5" />
            <span>
              {crossIndustryView ? "Scope: All 7 Verticals" : "Scope: Single Vertical"}
            </span>
          </button>
        </div>
      </div>

      {/* Cross-Industry Notification Pill if active standard has matches elsewhere */}
      {!crossIndustryView && selectedStandard !== "All" && totalStandardMatches > displayedControls.length && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-2 text-xs text-sky-900 dark:text-sky-200">
          <div className="flex items-center gap-2">
            <Globe className="size-3.5 text-sky-600 dark:text-sky-400" />
            <span>
              Found <strong>{displayedControls.length}</strong> matching control(s) in {currentDomain.shortTitle}, and{" "}
              <strong>{totalStandardMatches - displayedControls.length}</strong> more in other verticals for standard{" "}
              <strong>{selectedStandard}</strong>.
            </span>
          </div>
          <button
            onClick={() => setCrossIndustryView(true)}
            className="font-bold underline hover:text-sky-700 dark:hover:text-sky-300 cursor-pointer ml-3"
          >
            View all {totalStandardMatches} controls →
          </button>
        </div>
      )}

      {/* 4. Interactive Vertical Matrix Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/95 shadow-sm dark:border-white/10 dark:bg-neutral-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/80 bg-neutral-50/80 text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:border-white/10 dark:bg-neutral-800/80 dark:text-neutral-400">
                <th className="py-3.5 px-4 sm:px-6">Control ID & Standard</th>
                <th className="py-3.5 px-4">Capability Requirement & Mandate</th>
                <th className="py-3.5 px-4">Enforcement Level</th>
                <th className="py-3.5 px-4">Validated Primary OEM</th>
                <th className="py-3.5 px-4">Lab Blueprint & Audit Proof</th>
                <th className="py-3.5 px-4 text-right">Marketplace Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-white/5 text-xs font-sans">
              {displayedControls.map((ctrl) => (
                <tr
                  key={ctrl.controlId}
                  className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  {/* Control ID & Standard Badge */}
                  <td className="py-4 px-4 sm:px-6 font-medium text-neutral-900 dark:text-white max-w-[190px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <code className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-700 dark:text-orange-400 border border-neutral-200 dark:border-white/10">
                        {ctrl.controlId}
                      </code>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border ${getStandardBadgeClass(
                          ctrl.regulatoryStandard
                        )}`}
                      >
                        {ctrl.regulatoryStandard}
                      </span>
                    </div>
                    {crossIndustryView && (
                      <div className="mt-1 text-[10px] font-semibold text-neutral-400">
                        Industry: {ctrl.industryTitle}
                      </div>
                    )}
                  </td>

                  {/* Capability & Regulatory Mandate */}
                  <td className="py-4 px-4 max-w-sm">
                    <div className="font-semibold text-neutral-900 dark:text-white text-xs">
                      {ctrl.capability}
                    </div>
                    <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                      <span className="font-medium text-amber-700 dark:text-orange-400">
                        Mandate:
                      </span>{" "}
                      {ctrl.regulatoryMandate}
                    </div>
                  </td>

                  {/* Enforcement Level */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10">
                      <ShieldCheck className="size-3 text-amber-600 dark:text-orange-400" />
                      {ctrl.enforcementLevel}
                    </span>
                  </td>

                  {/* Primary OEM Provider */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-2xs border border-neutral-200 dark:border-white/15">
                        <OemImage
                          src={ctrl.primaryOemLogo}
                          alt={ctrl.primaryOem}
                          className="max-h-5 max-w-[20px] object-contain"
                          placeholderClassName="text-[6px]"
                        />
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                        {ctrl.primaryOem}
                      </span>
                    </div>

                    {ctrl.complementaryOems && ctrl.complementaryOems.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1">
                        <span className="text-[10px] text-neutral-400">Tested with:</span>
                        {ctrl.complementaryOems.map((coem, cIdx) => (
                          <span
                            key={cIdx}
                            className="rounded bg-neutral-100 dark:bg-neutral-800/80 px-1 py-0.5 text-[9px] font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-white/10"
                          >
                            {coem}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Blueprint Spec & Audit Proof */}
                  <td className="py-4 px-4 max-w-sm">
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                      {ctrl.blueprintSpec}
                    </p>
                    <div className="mt-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                      ✓ Audit Proof: {ctrl.auditProof}
                    </div>
                  </td>

                  {/* Action Link */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/portal/marketplace?oem=${encodeURIComponent(
                        ctrl.primaryOem
                      )}#solutions-stack`}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-neutral-800 shadow-xs transition-all hover:border-amber-500 hover:text-amber-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:text-orange-400 cursor-pointer"
                    >
                      <span>OEM Stack</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}

              {displayedControls.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <ShieldAlert className="size-8 mx-auto text-neutral-400 mb-2" />
                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      No controls found matching your filters
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Try searching for another keyword or reset the regulatory standard filter.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedStandard("All");
                        setCrossIndustryView(false);
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black px-3 py-1.5 text-xs font-semibold cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Pre-Validated Industry Blueprints Showcase */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white">
              Pre-Validated {currentDomain.shortTitle} Solution Blueprints
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Turnkey architectural blueprints pre-integrated and benchmarked in the iValue CoE physical labs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentDomain.blueprints.map((bp, bIdx) => (
            <Card
              key={bIdx}
              className="p-5 sm:p-6 rounded-2xl border border-neutral-200/90 bg-white/90 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/90 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{bp.labStatus}</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {bp.complianceTags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="rounded bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[9px] font-semibold text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h4 className="mt-3 text-base font-bold text-neutral-900 dark:text-white">
                  {bp.title}
                </h4>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {bp.description}
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/10">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Integrated OEM Engines:
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {bp.primaryOems.map((oem, oIdx) => (
                      <span
                        key={oIdx}
                        className="rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-800 dark:bg-orange-500/15 dark:text-orange-300 border border-amber-500/20"
                      >
                        {oem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 flex items-center justify-between">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:from-amber-600 hover:to-orange-600 cursor-pointer"
                >
                  <span>Request Blueprint PoV</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/portal/marketplace"
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white inline-flex items-center gap-1"
                >
                  <span>Marketplace</span>
                  <ChevronRight className="size-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
