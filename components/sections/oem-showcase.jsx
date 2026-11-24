"use client";

import React, { useState, useRef, useEffect } from "react";
import { oemPartners } from "@/data/oems";
import { OemImage } from "@/components/ui/oem-image";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IValueEmblem } from "@/components/ui/ivalue-logo";

export function OemShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);

  const categories = [
    "All",
    "Cloud & Infrastructure",
    "Quantum & Network Security",
    "Identity Security & PAM",
    "Autonomous Endpoint & XDR",
    "Data Protection & Encryption"
  ];

  const filteredOems =
    selectedCategory === "All"
      ? oemPartners
      : oemPartners.filter((oem) =>
        oem.category.toLowerCase().includes(selectedCategory.toLowerCase().split(" ")[0])
      );

  const scrollBy = (offset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Global 2.5s Auto-Scroll with Hover Pause
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 15) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section id="clients" className="section-divider py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        {/* Centered Section Header matching sibling section headings across the page */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
            <IValueEmblem className="size-3" />
            <span>Leading Technology Partners</span>
          </div>
          <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            OEM&apos;s
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
            Onboarded leading technology OEMs powering the <span className="highlight">iValue Center of Excellence</span> solution stacks.
          </p>
        </div>

        {/* Filter Pills & Carousel Next / Prev Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-display font-medium transition-all cursor-pointer ${selectedCategory === cat
                    ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-black"
                    : "border border-neutral-200 bg-white/70 text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-400 dark:hover:bg-white/5"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Carousel Next / Prev Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollBy(-320)}
              aria-label="Previous OEMs"
              className="flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => scrollBy(320)}
              aria-label="Next OEMs"
              className="flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Snappy Sideways Carousel with 2.5s Auto-Scroll & Hover Pause */}
        <div
          ref={carouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="mt-10 flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 px-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {filteredOems.map((partner, idx) => (
            <a
              key={idx}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group snap-start shrink-0 w-[240px] sm:w-[260px] md:w-[280px] card-reveal"
              style={{ transitionDelay: `${(idx % 6) * 80}ms` }}
            >
              <Card
                className="flex h-full flex-col items-center justify-between p-6 text-center transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-2 shadow-sm hover:shadow-md"
              >
                <div className="flex h-16 w-full items-center justify-center p-2.5 rounded-xl bg-neutral-100/90 dark:bg-white/95 shadow-xs border border-neutral-200/60 dark:border-white/30 transition-all duration-300">
                  <OemImage
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-11 max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-105"
                    placeholderClassName="w-full h-11"
                  />
                </div>

                <div className="mt-4 flex-1">
                  <CardTitle className="text-sm font-bold group-hover:text-amber-600 dark:group-hover:text-orange-400 transition-colors">
                    {partner.name}
                  </CardTitle>
                  <CardDescription className="mt-1 text-[11px] font-medium text-amber-700 dark:text-orange-400 line-clamp-1">
                    {partner.category}
                  </CardDescription>
                  <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 font-sans">
                    {partner.description}
                  </p>
                </div>

                <span className="mt-4 text-[10px] font-display font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1 group-hover:text-amber-600 dark:group-hover:text-orange-400 transition-colors">
                  Explore OEM Stack →
                </span>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
