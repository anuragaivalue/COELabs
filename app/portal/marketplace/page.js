"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { OemImage } from "@/components/ui/oem-image";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/counter";
import { solutionStacks } from "@/data/stacks";
import { stackControlsData } from "@/data/stack-controls";
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  SlidersHorizontal,
  Sparkles,
  ShoppingBag,
  Laptop2
} from "lucide-react";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Cloud & Infrastructure",
    "Identity & Access Management",
    "Security Operations (SOC)",
    "Endpoint & Mobile Security",
    "Application Security",
    "Verticals & BFSI",
    "Compliance & Governance"
  ];

  // Merge solutionStacks and stackControlsData
  const marketplaceItems = useMemo(() => {
    // Start with the curated stackControlsData
    const curated = Object.values(stackControlsData).map((s) => ({
      id: s.slug,
      slug: s.slug,
      title: s.title,
      category: s.category,
      tagline: s.tagline,
      description: s.overview,
      oems: s.oems,
      controls: s.controls.map((c) => c.name),
      multiplier: s.multiplier,
      compliance: s.compliance.map((c) => c.name)
    }));

    // Add any from solutionStacks not already in curated
    solutionStacks.forEach((stack) => {
      const exists = curated.some(
        (c) =>
          c.id.toLowerCase() === stack.id.toLowerCase() ||
          c.title.toLowerCase().includes(stack.title.toLowerCase())
      );
      if (!exists) {
        curated.push({
          id: stack.id,
          slug: stack.id,
          title: stack.title,
          category: stack.category || "Technology Stack",
          tagline: stack.description || "Validated Enterprise Solution Stack",
          description: stack.description,
          oems: (stack.oems || []).map((o) => ({
            name: typeof o === "string" ? o : o.name,
            logo: typeof o === "string" ? null : o.logo,
            role: "Technology Partner"
          })),
          controls: (stack.controls || []).map((c) =>
            typeof c === "string" ? c : (c.name || c.title || "")
          ),
          multiplier: "Accelerate deployment timeline by 3.5x.",
          compliance: ["CERT-In", "RBI CSF", "SEBI CSCRF", "DPDP Act"]
        });
      }
    });

    return curated;
  }, []);

  const filteredItems = useMemo(() => {
    return marketplaceItems.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.oems.some((o) => o.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase().includes(selectedCategory.toLowerCase().split(" ")[0]) ||
        item.title.toLowerCase().includes(selectedCategory.toLowerCase().split(" ")[0]);

      return matchesSearch && matchesCategory;
    });
  }, [marketplaceItems, searchQuery, selectedCategory]);

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-900">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:border-orange-400/25 dark:bg-orange-500/15 dark:text-orange-300">
              <ShoppingBag className="size-3.5 text-amber-600 dark:text-orange-400" />
              <span>iValue Solution Marketplace</span>
            </div>

            <h1 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
              Pre-Validated Multi-OEM Solution Stacks
            </h1>

            <p className="mt-3 font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Discover, evaluate, and test certified multistack blueprints engineered with leading global OEMs. Map your technology architecture directly to <span className="highlight">CERT-In, RBI, SEBI CSCRF, and DPDP</span> regulatory compliance frameworks.
            </p>

            {/* Quick Stats Bar with 1s Count-Up */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-neutral-200/80 bg-white/70 p-3.5 text-center shadow-2xs dark:border-white/10 dark:bg-neutral-900/60">
                <AnimatedCounter value="34+" duration={1000} className="font-display text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white" />
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans">Solution Stacks</div>
              </div>
              <div className="rounded-xl border border-neutral-200/80 bg-white/70 p-3.5 text-center shadow-2xs dark:border-white/10 dark:bg-neutral-900/60">
                <AnimatedCounter value="15+" duration={1000} className="font-display text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white" />
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans">Top Global OEMs</div>
              </div>
              <div className="rounded-xl border border-neutral-200/80 bg-white/70 p-3.5 text-center shadow-2xs dark:border-white/10 dark:bg-neutral-900/60">
                <AnimatedCounter value="100+" duration={1000} className="font-display text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white" />
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans">Live Blueprints</div>
              </div>
              <div className="rounded-xl border border-neutral-200/80 bg-white/70 p-3.5 text-center shadow-2xs dark:border-white/10 dark:bg-neutral-900/60">
                <AnimatedCounter value="5+" duration={1000} className="font-display text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white" />
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans">Regulatory Mappings</div>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="mt-12 rounded-2xl border border-neutral-200/90 bg-white/80 p-4 sm:p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/70">
            {/* Search Input with Google Material Symbol */}
            <div className="relative">
              <span className="material-symbols-outlined absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 select-none pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search solutions by stack name, OEM partner (e.g. Check Point, CyberArk, Google Cloud), or keyword..."
                className="w-full rounded-xl border border-neutral-200 bg-white/90 py-3.5 pr-10 pl-11 text-xs sm:text-sm font-sans text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/15 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-neutral-100 dark:border-white/5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-display font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-black"
                      : "border border-neutral-200 bg-white/70 text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-400 dark:hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>
              Showing <strong className="text-neutral-900 dark:text-white">{filteredItems.length}</strong> certified solution stacks
            </span>
            {searchQuery && (
              <span>
                Filtered by: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          {/* Marketplace Cards Grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, idx) => (
              <Card
                key={idx}
                className="flex flex-col justify-between p-6 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Category Badge & Live Lab Indicator */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md border border-neutral-200 bg-neutral-100/80 px-2 py-0.5 text-[10px] font-bold text-neutral-600 uppercase dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Demo Ready
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="mt-3 font-display text-base font-bold text-neutral-900 dark:text-white line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-sans text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {item.tagline || item.description}
                  </p>

                  {/* OEM Logos Row with crisp white container in dark mode */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                      Integrated OEM Partners ({item.oems.length})
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {item.oems.slice(0, 4).map((oem, oIdx) => (
                        <div
                          key={oIdx}
                          className="flex h-9 items-center justify-center rounded-lg border border-neutral-200/90 bg-white dark:bg-white px-2.5 py-1 shadow-2xs hover:scale-105 transition-all"
                          title={oem.name}
                        >
                          <OemImage
                            src={oem.logo}
                            alt={oem.name}
                            className="h-5 max-w-[70px] object-contain"
                            placeholderClassName="h-5 px-1 py-0 text-[9px]"
                          />
                        </div>
                      ))}
                      {item.oems.length > 4 && (
                        <div className="relative group/morepop">
                          <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-800 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300 cursor-pointer">
                            +{item.oems.length - 4} more
                          </span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/morepop:flex flex-col w-64 rounded-xl border border-neutral-200/90 bg-white/95 p-3 shadow-xl backdrop-blur-xl dark:border-white/20 dark:bg-neutral-900/95 z-30 pointer-events-auto">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                              Additional Partners ({item.oems.length - 4})
                            </span>
                            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                              {item.oems.slice(4).map((remOem, rIdx) => (
                                <div key={rIdx} className="flex items-center gap-1.5 p-1 rounded bg-neutral-50 dark:bg-neutral-800">
                                  <div className="size-6 shrink-0 bg-white rounded p-0.5 shadow-2xs flex items-center justify-center">
                                    <OemImage src={remOem.logo} alt={remOem.name} className="max-h-4 max-w-[20px] object-contain" placeholderClassName="text-[7px]" />
                                  </div>
                                  <span className="text-[10px] font-semibold text-neutral-800 dark:text-neutral-200 truncate">{remOem.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Capabilities Preview */}
                  <div className="mt-4 space-y-1.5">
                    {item.controls.slice(0, 2).map((ctrl, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 font-sans">
                        <CheckCircle2 className="size-3 text-amber-600 dark:text-orange-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          {typeof ctrl === "string" ? ctrl : (ctrl?.name || ctrl?.title || "")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer CTAs */}
                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/5 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/stack/${item.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300/80 bg-white py-2 text-xs font-semibold text-neutral-800 hover:border-amber-500/50 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700/80 transition-all text-center"
                    >
                      <span>View Blueprint</span>
                      <ArrowRight className="size-3" />
                    </Link>

                    <Link
                      href={`/request-poc?stack=${encodeURIComponent(item.slug)}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 transition-all"
                      title="Request Architecture Demo"
                    >
                      <Laptop2 className="size-3.5" />
                      <span>Demo</span>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Bottom Consultation Banner */}
          <div className="mt-16 rounded-2xl border border-neutral-200/90 bg-neutral-900 p-8 text-white shadow-xl dark:border-white/15 dark:bg-neutral-900/90">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-orange-300">
                  <Sparkles className="size-3.5" />
                  <span>Custom Solution Blueprinting</span>
                </div>
                <h3 className="mt-3 font-sans text-2xl font-bold">
                  Need a Custom Multi-Vendor Stack for an Upcoming RFP?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                  Our certified solutions architects in Bangalore and Singapore will architect, benchmark, and deploy a custom architecture blueprint tailored specifically to your enterprise architecture and regulatory audit needs.
                </p>
              </div>

              <Link
                href="/request-poc?source=marketplace"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs font-bold text-neutral-900 hover:bg-neutral-100 shadow-md transition-all shrink-0"
              >
                <span>Request Custom RFP Blueprint</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
