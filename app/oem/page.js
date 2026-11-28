"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { OemImage } from "@/components/ui/oem-image";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { oemPartners } from "@/data/oems";
import {
  OemIntroSection,
  OemClosingSection
} from "@/components/oem/oem-intro-sections";
import {
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function OemDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Cloud & Infrastructure",
    "Quantum & Network Security",
    "Identity Security & PAM",
    "Autonomous Endpoint & XDR",
    "Data Protection & Encryption",
    "Exposure Management"
  ];

  const filteredOems = useMemo(() => {
    return oemPartners.filter((oem) => {
      const matchesCategory =
        selectedCategory === "All" ||
        oem.category.toLowerCase().includes(selectedCategory.toLowerCase().split(" ")[0]);

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const nameMatch = oem.name.toLowerCase().includes(q);
      const catMatch = oem.category.toLowerCase().includes(q);
      const descMatch = oem.description.toLowerCase().includes(q);

      return matchesCategory && (nameMatch || catMatch || descMatch);
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-900">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">OEM Directory</span>
          </div>

          {/* Top Intro Section highlighting Value Proposition (Lab Interoperability, Joint GTM, Enterprise Blueprints) */}
          <OemIntroSection />

          {/* Search & Category Filter Controls */}
          <div className="mt-12 rounded-2xl border border-neutral-200/90 bg-white/80 p-4 sm:p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/70">
            <div className="relative">
              <span className="material-symbols-outlined absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 select-none pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search OEM partners by company name, category, or capability..."
                className="w-full rounded-xl border border-neutral-200 bg-white/90 py-3.5 pr-10 pl-11 text-xs sm:text-sm font-sans text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/15 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
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
              Showing <strong className="text-neutral-900 dark:text-white">{filteredOems.length}</strong> certified OEM partners
            </span>
          </div>

          {/* OEM Partners Grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOems.map((partner, idx) => (
              <Card
                key={idx}
                className="flex flex-col justify-between p-6 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div>
                  {/* High contrast backdrop supporting light and dark modes */}
                  <div className="flex h-16 w-full items-center justify-center p-2.5 rounded-xl bg-neutral-100/90 dark:bg-white/95 shadow-xs border border-neutral-200/60 dark:border-white/30 transition-all duration-300">
                    <OemImage
                      src={partner.logo}
                      darkSrc={partner.logoDark}
                      alt={partner.name}
                      className="max-h-11 max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-105"
                      placeholderClassName="w-full h-11"
                    />
                  </div>

                  <div className="mt-4">
                    {/* Certified Lab Verified Metadata Tag */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Certified Lab Verified</span>
                      </span>
                    </div>

                    <CardTitle className="mt-2 text-base font-bold text-neutral-900 dark:text-white">
                      {partner.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs font-semibold text-amber-700 dark:text-orange-400 line-clamp-1">
                      {partner.category}
                    </CardDescription>
                    <p className="mt-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
                  {/* Rewired OEM Stack Specs link with Arrow icon */}
                  <Link
                    href={`/portal/marketplace?oem=${encodeURIComponent(partner.name)}#solutions-stack`}
                    className="inline-flex items-center gap-1 text-xs font-display font-semibold text-amber-700 dark:text-orange-400 hover:underline group/link"
                  >
                    <span>OEM Stack Specs</span>
                    <ArrowRight className="size-3 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>

                  <Link
                    href={`/request-poc?source=oem_${encodeURIComponent(partner.name)}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-neutral-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 transition-all"
                  >
                    <span>Briefing</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Bottom Closing Section featuring "Build Once. Sell Everywhere. Scale with iValue CoE." immediately above Footer */}
          <OemClosingSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
