"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { articles } from "@/data/articles";
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Newspaper,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Threat Intelligence",
    "Regulatory Compliance",
    "Strategy & Operations",
    "OT / Industrial Security"
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory =
        selectedCategory === "All" || art.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const titleMatch = art.title.toLowerCase().includes(q);
      const summaryMatch = art.summary.toLowerCase().includes(q);
      const catMatch = art.category.toLowerCase().includes(q);

      return matchesCategory && (titleMatch || summaryMatch || catMatch);
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
            <span className="text-neutral-900 dark:text-white font-semibold">News & Insights</span>
          </div>

          {/* Hero Header */}
          <div className="mt-8 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:border-orange-400/25 dark:bg-orange-500/15 dark:text-orange-300">
              <Newspaper className="size-3.5" />
              <span>Cybersecurity Intel & Advisories</span>
            </div>

            <h1 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
              Latest Cyber Security News
            </h1>

            <p className="mt-3 font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Curated intelligence, regulatory framework updates, and architectural analysis from the <span className="highlight">iValue Center of Excellence</span> research team.
            </p>
          </div>

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
                placeholder="Search articles by title, topic, or regulatory mandate..."
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
              Showing <strong className="text-neutral-900 dark:text-white">{filteredArticles.length}</strong> cybersecurity briefings
            </span>
          </div>

          {/* Articles Grid */}
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="group flex flex-col justify-between overflow-hidden border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-md border border-neutral-200/80 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-neutral-800 shadow-xs dark:border-white/10 dark:bg-neutral-950/90 dark:text-neutral-200">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-[11px] text-neutral-400 dark:text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {article.readTime}
                      </span>
                    </div>

                    <CardTitle className="mt-3 text-lg font-bold text-neutral-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-orange-400 transition-colors">
                      {article.title}
                    </CardTitle>

                    <CardDescription className="mt-2 text-xs font-sans text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                      {article.summary}
                    </CardDescription>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-neutral-100 dark:border-white/5 mt-4">
                  <a
                    href="https://coe.ivaluegroup.com/index"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-amber-700 dark:text-orange-400 group-hover:gap-2 transition-all"
                  >
                    <span>Read Full Intelligence Report</span>
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
