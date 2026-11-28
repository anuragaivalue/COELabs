"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { OemImage } from "@/components/ui/oem-image";
import { Card } from "@/components/ui/card";
import { TECHNOLOGY_DOMAINS } from "@/data/technology-stacks-data";
import {
  ShieldAlert,
  KeyRound,
  Laptop,
  Cloud,
  Code,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
  Filter
} from "lucide-react";

// Icon mapping helper
function renderDomainIcon(iconName, className = "size-5") {
  switch (iconName) {
    case "ShieldAlert":
      return <ShieldAlert className={className} />;
    case "KeyRound":
      return <KeyRound className={className} />;
    case "Laptop":
      return <Laptop className={className} />;
    case "Cloud":
      return <Cloud className={className} />;
    case "Code":
      return <Code className={className} />;
    default:
      return <Layers className={className} />;
  }
}

export function TechnologyStackMatrix() {
  const [activeDomainId, setActiveDomainId] = useState(TECHNOLOGY_DOMAINS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("All");

  const currentDomain = useMemo(() => {
    return TECHNOLOGY_DOMAINS.find((d) => d.id === activeDomainId) || TECHNOLOGY_DOMAINS[0];
  }, [activeDomainId]);

  // Unique tiers for filtering
  const tiers = ["All", "Mandatory Core", "Advanced Detection", "Advanced Prevention", "Governance Core", "Compliance Mandate"];

  // Filtered Matrix Controls
  const filteredControls = useMemo(() => {
    return currentDomain.matrixControls.filter((ctrl) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        ctrl.controlId.toLowerCase().includes(q) ||
        ctrl.capability.toLowerCase().includes(q) ||
        ctrl.primaryOem.toLowerCase().includes(q) ||
        ctrl.blueprintSpec.toLowerCase().includes(q) ||
        ctrl.complianceRef.toLowerCase().includes(q) ||
        ctrl.complementaryOems.some((o) => o.toLowerCase().includes(q));

      const matchesTier =
        selectedTier === "All" ||
        ctrl.requirementTier.toLowerCase().includes(selectedTier.toLowerCase().split(" ")[0]);

      return matchesSearch && matchesTier;
    });
  }, [currentDomain, searchQuery, selectedTier]);

  return (
    <div className="w-full">
      {/* 1. Technology Domain Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl border border-neutral-200/90 bg-white/80 dark:border-white/10 dark:bg-neutral-900/80 shadow-sm backdrop-blur-md">
        {TECHNOLOGY_DOMAINS.map((domain) => {
          const isActive = domain.id === activeDomainId;
          return (
            <button
              key={domain.id}
              onClick={() => {
                setActiveDomainId(domain.id);
                setSearchQuery("");
                setSelectedTier("All");
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-neutral-900 text-white shadow-md dark:bg-white dark:text-black scale-[1.02]"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800/60"
              }`}
            >
              <span className={isActive ? "text-amber-400 dark:text-orange-500" : "text-neutral-400"}>
                {renderDomainIcon(domain.icon, "size-4")}
              </span>
              <span>{domain.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Domain Overview Banner */}
      <div className="mt-8 rounded-3xl border border-neutral-200/90 bg-gradient-to-br from-white via-neutral-50/80 to-amber-50/30 p-6 sm:p-10 shadow-md backdrop-blur-md dark:border-white/10 dark:from-neutral-900/90 dark:via-neutral-950 dark:to-amber-950/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-neutral-200/80 dark:border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-800 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300">
                <Sparkles className="size-3.5 text-amber-600 dark:text-orange-400" />
                <span>{currentDomain.badge}</span>
              </span>
              <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10">
                {currentDomain.architectureTier}
              </span>
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              {currentDomain.title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-amber-700 dark:text-orange-400">
              {currentDomain.tagline}
            </p>
            <p className="mt-3 max-w-3xl text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              {currentDomain.overview}
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end justify-center shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              Validated Benchmark Advantage
            </span>
            <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-0.5">
              {currentDomain.multiplier}
            </span>
            <Link
              href={`/stack/${currentDomain.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 dark:text-orange-400 dark:hover:text-orange-300 underline"
            >
              <span>View Deep Architecture Blueprint</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Primary OEM Lineup for this domain */}
        <div className="mt-6">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-3">
            Primary Certified OEM Providers ({currentDomain.primaryOems.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {currentDomain.primaryOems.map((oem, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 rounded-xl border border-neutral-200/80 bg-white/80 p-2.5 dark:border-white/10 dark:bg-neutral-800/70"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-2xs border border-neutral-200/60 dark:border-white/20">
                  <OemImage
                    src={oem.logo}
                    darkSrc={oem.logoDark}
                    alt={oem.name}
                    className="max-h-6 max-w-[28px] object-contain"
                    placeholderClassName="text-[7px]"
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
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-3.5 -translate-y-1/2 size-4 text-neutral-400 select-none pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${currentDomain.shortTitle} capabilities, OEMs, or protocols...`}
            className="w-full rounded-xl border border-neutral-200 bg-white/90 py-2.5 pr-10 pl-10 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tier filter */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
          <span className="text-[11px] font-semibold text-neutral-400 mr-1 flex items-center gap-1">
            <Filter className="size-3" />
            Tier:
          </span>
          {tiers.slice(0, 4).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                selectedTier === t
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold"
                  : "border border-neutral-200 bg-white/70 text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Interactive Capability Matrix Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/95 shadow-sm dark:border-white/10 dark:bg-neutral-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/80 bg-neutral-50/80 text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:border-white/10 dark:bg-neutral-800/80 dark:text-neutral-400">
                <th className="py-3.5 px-4 sm:px-6">Control ID & Capability Requirement</th>
                <th className="py-3.5 px-4">Tier</th>
                <th className="py-3.5 px-4">Primary OEM Provider</th>
                <th className="py-3.5 px-4">Integration Blueprint Spec & Protocols</th>
                <th className="py-3.5 px-4">Compliance Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-white/5 text-xs font-sans">
              {filteredControls.map((ctrl) => (
                <tr
                  key={ctrl.controlId}
                  className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  {/* Control ID & Capability */}
                  <td className="py-4 px-4 sm:px-6 font-medium text-neutral-900 dark:text-white max-w-xs">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-700 dark:text-orange-400 border border-neutral-200 dark:border-white/10">
                        {ctrl.controlId}
                      </code>
                    </div>
                    <div className="mt-1 font-semibold text-neutral-800 dark:text-neutral-200">
                      {ctrl.capability}
                    </div>
                  </td>

                  {/* Requirement Tier */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-orange-500/15 dark:text-orange-300 border border-amber-500/20">
                      {ctrl.requirementTier}
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
                  </td>

                  {/* Integration Blueprint Spec & Complementary */}
                  <td className="py-4 px-4 max-w-sm">
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                      {ctrl.blueprintSpec}
                    </p>
                    {ctrl.complementaryOems.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1">
                        <span className="text-[10px] text-neutral-400">Tested with:</span>
                        {ctrl.complementaryOems.map((coem, cIdx) => (
                          <span
                            key={cIdx}
                            className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600 dark:text-neutral-300"
                          >
                            {coem}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Compliance Reference */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{ctrl.complianceRef}</span>
                    </span>
                  </td>
                </tr>
              ))}

              {filteredControls.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    No capability requirements match your search query &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Pre-Validated Integration Blueprints Showcase */}
      {currentDomain.integrationBlueprints.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Pre-Validated {currentDomain.shortTitle} Architecture Blueprints
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Fully documented blueprints with Terraform baselines and live CoE lab configurations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentDomain.integrationBlueprints.map((bp, bIdx) => (
              <Card
                key={bIdx}
                className="flex flex-col justify-between p-6 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 hover:border-amber-500/40 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {bp.oems.map((o, oIdx) => (
                        <span
                          key={oIdx}
                          className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-800 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-200"
                        >
                          {o}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {bp.timeToDeploy}
                    </span>
                  </div>

                  <h4 className="mt-3 text-base font-bold text-neutral-900 dark:text-white">
                    {bp.name}
                  </h4>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                    {bp.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
                  <Link
                    href={bp.link}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="size-3" />
                  </Link>

                  <Link
                    href={`/request-poc?blueprint=${encodeURIComponent(bp.name)}`}
                    className="rounded-lg bg-neutral-900 px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 transition-all"
                  >
                    Request Demo
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnologyStackMatrix;
