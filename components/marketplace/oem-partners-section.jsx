"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { OEM_PARTNER_SOLUTIONS, OEM_NAMES } from "@/data/oem-partner-solutions";
import {
  Building2,
  Layers,
  ArrowRight,
  Laptop2,
  Clock,
  CheckCircle2,
  Search,
  X,
  ExternalLink,
  ChevronDown
} from "lucide-react";

export function OemPartnersSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOem, setSelectedOem] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);

  // Filter solutions
  const filteredSolutions = useMemo(() => {
    return OEM_PARTNER_SOLUTIONS.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        item.title.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.oem.toLowerCase().includes(q);

      const matchesOem =
        selectedOem === "All" ||
        item.oem.toLowerCase() === selectedOem.toLowerCase();

      return matchesSearch && matchesOem;
    });
  }, [searchQuery, selectedOem]);

  // Frequently accessed OEM quick filter pills
  const topOems = useMemo(() => {
    return [
      "All",
      "Akamai",
      "Checkpoint",
      "Cloudflare",
      "CyberArk",
      "Datadog",
      "EDB",
      "Entrust",
      "Forcepoint",
      "Gambit Cyber",
      "Netskope",
      "Opentext",
      "RSA",
      "SentinelOne",
      "Splunk",
      "Tenable",
      "Thales",
      "Yubico"
    ];
  }, []);

  const displayedSolutions = filteredSolutions.slice(0, visibleCount);

  return (
    <section id="oem-partners" className="scroll-mt-24 mt-16 pt-8 border-t border-neutral-200/80 dark:border-white/10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:border-orange-400/25 dark:bg-orange-500/15 dark:text-orange-300">
          <Building2 className="size-3.5 text-amber-600 dark:text-orange-400" />
          <span>OEM Partners Solutions Library</span>
        </div>

        <h2 className="mt-4 font-sans text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
          OEM Partners
        </h2>

        <p className="mt-3 font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Explore all <strong className="text-neutral-900 dark:text-white">{OEM_PARTNER_SOLUTIONS.length}</strong> certified partner solutions across <strong className="text-neutral-900 dark:text-white">{OEM_NAMES.length}</strong> global technology OEMs. Pre-configured and tested for enterprise interoperability in our physical and virtual CoE labs.
        </p>
      </div>

      {/* Search & OEM Filter Bar (Replicating Solutions Stack design tokens) */}
      <div className="mt-10 rounded-2xl border border-neutral-200/90 bg-white/80 p-4 sm:p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/70">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 -translate-y-1/2 size-4 text-neutral-400 dark:text-neutral-500 select-none pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(12);
            }}
            placeholder="Search partner solutions by name, OEM, or capability (e.g. YubiKey, Thales KMS, Tenable One, SentinelOne EDR, Fortify)..."
            className="w-full rounded-xl border border-neutral-200 bg-white/90 py-3.5 pr-14 pl-11 text-xs sm:text-sm font-sans text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/15 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setVisibleCount(12);
              }}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Clear search filter"
            >
              Clear
            </button>
          )}
        </div>

        {/* OEM Filter Pills */}
        <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-neutral-100 dark:border-white/5">
          {topOems.map((oem) => (
            <button
              key={oem}
              onClick={() => {
                setSelectedOem(oem);
                setVisibleCount(12);
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-display font-medium transition-all cursor-pointer ${
                selectedOem === oem
                  ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-black"
                  : "border border-neutral-200 bg-white/70 text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-400 dark:hover:bg-white/5"
              }`}
            >
              {oem}
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary & Filter Tag */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <div>
          Showing <strong className="text-neutral-900 dark:text-white">{displayedSolutions.length}</strong> of <strong className="text-neutral-900 dark:text-white">{filteredSolutions.length}</strong> partner solutions
          {selectedOem !== "All" && (
            <span> for OEM: <strong className="text-amber-700 dark:text-orange-400">{selectedOem}</strong></span>
          )}
        </div>
        {(searchQuery || selectedOem !== "All") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedOem("All");
              setVisibleCount(12);
            }}
            className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 font-bold text-amber-700 dark:bg-orange-500/15 dark:text-orange-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            <span>Reset OEM Filters</span>
            <X className="size-3" />
          </button>
        )}
      </div>

      {/* Partner Cards Grid (Exact replica of Solutions Stack layout) */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedSolutions.map((item) => (
          <Card
            key={`${item.id}-${item.idKey}`}
            className="flex flex-col justify-between p-6 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <div>
              {/* Category & Status Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md border border-neutral-200 bg-neutral-100/80 px-2 py-0.5 text-[10px] font-bold text-neutral-600 uppercase dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300">
                  {item.oem}
                </span>
                {item.comingSoon ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    <Clock className="size-3" />
                    Launching Soon
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Certified Lab Ready
                  </span>
                )}
              </div>

              {/* OEM Logo */}
              <div className="mt-4 flex h-11 items-center justify-start rounded-lg border border-neutral-200/90 bg-white px-3 py-1 shadow-2xs max-w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.logoUrl}
                  alt={item.oem}
                  className="h-6 max-w-[120px] object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Title & Tagline */}
              <h3 className="mt-4 font-display text-base font-bold text-neutral-900 dark:text-white line-clamp-1">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs font-sans text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                {item.tagline}
              </p>
            </div>

            {/* Card Action Buttons (Exact parity with live site) */}
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {/* Explore Solution Button */}
                <Link
                  href={item.destinationUrl}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300/80 bg-white py-2 text-xs font-semibold text-neutral-800 hover:border-amber-500/50 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700/80 transition-all text-center"
                >
                  <Layers className="size-3 text-amber-600 dark:text-orange-400" />
                  <span>Explore Solution</span>
                  <ArrowRight className="size-3" />
                </Link>

                {/* Request Demo / POC Button */}
                <Link
                  href={`/request-poc?oem=${encodeURIComponent(item.oem)}&solution=${encodeURIComponent(item.title)}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 transition-all"
                  title="Request Lab Demonstration"
                >
                  <Laptop2 className="size-3.5" />
                  <span>Demo</span>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More / Expand All Button */}
      {visibleCount < filteredSolutions.length && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => Math.min(prev + 12, filteredSolutions.length))}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-2.5 text-xs font-semibold text-neutral-800 hover:border-amber-500 hover:text-amber-700 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-all shadow-xs cursor-pointer"
          >
            <span>Load More ({filteredSolutions.length - visibleCount} remaining)</span>
            <ChevronDown className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setVisibleCount(filteredSolutions.length)}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-amber-700 transition-all shadow-xs cursor-pointer"
          >
            <span>Show All {filteredSolutions.length} Solutions</span>
          </button>
        </div>
      )}
    </section>
  );
}
