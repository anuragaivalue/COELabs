"use client";

import React, { useState, useMemo } from "react";
import { solutionStacks } from "@/data/stacks";
import { SearchBar } from "@/components/ui/search-bar";
import { Dialog } from "@/components/ui/dialog";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { OemImage } from "@/components/ui/oem-image";
import {
  ShieldCheck,
  ArrowUpRight,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Building2,
  FileCheck2,
  Zap
} from "lucide-react";

export function StacksExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedStack, setSelectedStack] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes("search=")) {
        const query = decodeURIComponent(hash.split("search=")[1] || "");
        if (query) {
          setSearchQuery(query);
          setActiveCategory("All");
        }
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const categories = [
    "All",
    "Cloud & Infrastructure",
    "Security & SOC",
    "Compliance & Governance",
    "Industry Verticals",
    "Application & Identity"
  ];

  const filteredStacks = useMemo(() => {
    return solutionStacks.filter((stack) => {
      const matchesCategory =
        activeCategory === "All" || stack.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const tokens = q.split(/\s+/).filter(Boolean);
      const searchableContent = [
        stack.title,
        stack.description,
        stack.category,
        ...(stack.oems || []).map((o) => (typeof o === "string" ? o : o.name)),
        ...(stack.controls || []).map((c) => (typeof c === "string" ? c : c.name || ""))
      ]
        .join(" ")
        .toLowerCase();

      // Check if tokens match
      const matchesSearch = tokens.some((token) => searchableContent.includes(token));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const handleOpenStack = (stack) => {
    setSelectedStack(stack);
    setIsModalOpen(true);
  };

  return (
    <section id="values" className="section-divider py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        {/* Section Header mirroring MAIN site */}
        <div className="text-center">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-orange-400">
            Complete Solution Stacks
          </p>
          <h2 className="mt-2 font-sans text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-white">
            iValue Stacks
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
            Explore 34 enterprise-ready solution stacks addressing <span className="highlight">cybersecurity, cloud infrastructure, and compliance</span>.
          </p>
        </div>

        {/* Toolbar: Search + Category Tabs */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 md:flex-row">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search stacks by name, OEM, or keyword..."
            className="w-full md:max-w-md"
          />

          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-display">
            <SlidersHorizontal className="size-3.5" />
            <span>Showing</span>
            <span className="font-bold text-neutral-900 dark:text-white">
              {filteredStacks.length}
            </span>
            <span>of {solutionStacks.length} stacks</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mt-4 flex flex-wrap gap-2 border-b border-neutral-200/80 pb-4 dark:border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-3.5 py-2 text-xs font-display font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-black"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900 dark:bg-neutral-800/60 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Architectural Telemetry Bar to eliminate center whitespace */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3 dark:border-white/10 dark:bg-neutral-900/40">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:bg-orange-500/15 dark:text-orange-300">
              <Layers className="size-4" />
            </div>
            <div>
              <span className="block font-display text-xs font-bold text-neutral-900 dark:text-white">34 Solutions</span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Validated Stacks</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3 dark:border-white/10 dark:bg-neutral-900/40">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Building2 className="size-4" />
            </div>
            <div>
              <span className="block font-display text-xs font-bold text-neutral-900 dark:text-white">62+ OEM Partners</span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Pre-Integrated</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3 dark:border-white/10 dark:bg-neutral-900/40">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
              <FileCheck2 className="size-4" />
            </div>
            <div>
              <span className="block font-display text-xs font-bold text-neutral-900 dark:text-white">100% Audit Ready</span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">SEBI / RBI / CERT-In</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3 dark:border-white/10 dark:bg-neutral-900/40">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
              <Zap className="size-4" />
            </div>
            <div>
              <span className="block font-display text-xs font-bold text-neutral-900 dark:text-white">Live Testing Lab</span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Hands-on Blueprints</span>
            </div>
          </div>
        </div>

        {/* Stacks Grid with Appearing Bottom-to-Top Animation */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStacks.map((stack, idx) => (
            <div
              key={stack.id}
              className="card-reveal relative hover:z-30 has-[.group\/oempopover:hover]:z-50"
              style={{ transitionDelay: `${(idx % 9) * 60}ms` }}
            >
              <Card
                className="group flex h-full flex-col justify-between !overflow-visible relative transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1.5 hover:shadow-xl dark:hover:border-orange-500/50"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300">
                      <ShieldCheck className="size-3 text-amber-600 dark:text-orange-400" />
                      {stack.category}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-display">
                      {stack.oems ? `${stack.oems.length} OEMs` : "Multi-OEM"}
                    </span>
                  </div>

                  <CardTitle className="mt-4 group-hover:text-amber-600 dark:group-hover:text-orange-400 transition-colors">
                    {stack.title}
                  </CardTitle>

                  <CardDescription className="mt-2.5 line-clamp-3">
                    {stack.description}
                  </CardDescription>

                  {/* Partner Logo Thumbnails with Increased Scale & High Contrast */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {stack.oems &&
                      stack.oems.slice(0, 4).map((oem, oIdx) => {
                        const name = typeof oem === "string" ? oem : oem.name;
                        const logo = typeof oem === "string" ? null : oem.logo;
                        return (
                          <div
                            key={oIdx}
                            className="flex h-9 sm:h-10 items-center justify-center rounded-lg border border-neutral-200/90 bg-white dark:bg-white px-2.5 py-1 shadow-2xs hover:shadow-xs hover:scale-105 transition-all duration-200"
                            title={name}
                          >
                            <OemImage
                              src={logo}
                              alt={name}
                              className="h-5 sm:h-5.5 max-w-[70px] sm:max-w-[85px] object-contain"
                              placeholderClassName="h-6 px-1.5 py-0 text-[10px]"
                            />
                          </div>
                        );
                      })}

                    {/* Interactive + <num> more Hover Popover */}
                    {stack.oems && stack.oems.length > 4 && (
                      <div className="relative group/oempopover z-20 group-hover/oempopover:z-50">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenStack(stack);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-800 hover:bg-amber-500/20 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300 dark:hover:bg-orange-500/25 transition-all cursor-pointer"
                        >
                          <span>+{stack.oems.length - 4} more</span>
                          <ChevronDown className="size-3 transition-transform duration-200 group-hover/oempopover:rotate-180" />
                        </button>

                        {/* Interactive Hover Popover - Completely Unclipped */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/oempopover:flex flex-col w-[300px] sm:w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-neutral-200/90 bg-white/98 p-3.5 shadow-2xl backdrop-blur-xl dark:border-white/20 dark:bg-neutral-900/98 z-50 animate-in fade-in-0 zoom-in-95 duration-150 pointer-events-auto text-left before:absolute before:inset-x-0 before:top-full before:h-3 before:content-['']">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 dark:border-white/10">
                            <span className="font-display text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                              Additional Integrated OEMs ({stack.oems.length - 4})
                            </span>
                            <span className="text-[10px] text-amber-700 dark:text-orange-400 font-semibold">
                              CoE Certified
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1.5 custom-gold-scrollbar">
                            {stack.oems.slice(4).map((oem, remIdx) => {
                              const name = typeof oem === "string" ? oem : oem.name;
                              const logo = typeof oem === "string" ? null : oem.logo;
                              return (
                                <div
                                  key={remIdx}
                                  className="flex items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50/90 p-1.5 dark:border-white/10 dark:bg-neutral-800/60"
                                >
                                  <div className="flex size-7 shrink-0 items-center justify-center rounded bg-white p-1 shadow-2xs border border-neutral-200/60">
                                    <OemImage
                                      src={logo}
                                      alt={name}
                                      className="max-h-5 max-w-[24px] object-contain"
                                      placeholderClassName="text-[8px] p-0"
                                    />
                                  </div>
                                  <span className="font-display text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                                    {name}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-white/10 text-center">
                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                              Click to view complete stack blueprint & controls
                            </span>
                          </div>

                          {/* Decorative pointer arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white dark:border-t-neutral-900" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Trigger */}
                <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-white/5">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Pre-tested in COE Lab
                  </span>
                  <button
                    onClick={() => handleOpenStack(stack)}
                    className="inline-flex items-center gap-1 font-display text-xs font-semibold text-neutral-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    View Details & OEMs
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Empty state if search returns nothing */}
        {filteredStacks.length === 0 && (
          <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-12 text-center dark:border-white/10">
            <p className="font-display text-base font-semibold text-neutral-800 dark:text-neutral-200">
              No solution stacks matched &quot;{searchQuery}&quot;
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-sans">
              Try searching for &quot;Cloud&quot;, &quot;SOC&quot;, &quot;PCI&quot;, or an OEM like &quot;Google&quot; or &quot;Netskope&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white dark:bg-white dark:text-black cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Stack Details Dialog (Mounted via Portal into document.body) */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stack={selectedStack}
      />
    </section>
  );
}
