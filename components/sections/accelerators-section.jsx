"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { accelerators } from "@/data/accelerators";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { AnimatedCounter } from "@/components/ui/counter";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { Zap, Check, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

export function AcceleratorsSection() {
  const [selectedOption, setSelectedOption] = useState("All");
  const carouselRef = useRef(null);

  const options = ["All", ...accelerators.map((a) => a.title.replace(" Revenue Multiplier", ""))];

  const filteredAccelerators =
    selectedOption === "All"
      ? accelerators
      : accelerators.filter((a) =>
          a.title.toLowerCase().includes(selectedOption.toLowerCase())
        );

  const scrollBy = (offset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section id="accelerators" className="section-divider py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <MotionReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <Zap className="size-3 text-amber-500 fill-amber-500" />
                <span>Exponential Growth Engines</span>
              </div>
              <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
                Revenue Multiplier Accelerators
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                Turnkey GTM bundles engineered to <span className="highlight">shorten sales cycles, maximize contract value, and drive recurring revenue</span>.
              </p>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => scrollBy(-300)}
                aria-label="Previous accelerator"
                className="flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => scrollBy(300)}
                aria-label="Next accelerator"
                className="flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </MotionReveal>

        {/* Option Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedOption(opt)}
              className={`rounded-full px-4 py-1.5 text-xs font-display font-medium transition-all cursor-pointer ${
                selectedOption === opt
                  ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-black"
                  : "border border-neutral-200 bg-white/70 text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-400 dark:hover:bg-white/5"
              }`}
            >
              {opt === "All" ? "All Accelerators" : `${opt} Multiplier`}
            </button>
          ))}
        </div>

        {/* Responsive Grid with Snappy Sideways Peek Scroll on Mobile/Tablet */}
        <div
          ref={carouselRef}
          className="mt-10 flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-visible scrollbar-none snap-x snap-mandatory py-4 px-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {filteredAccelerators.map((item, idx) => (
            <div
              key={item.id}
              className="card-reveal snap-start shrink-0 w-[80vw] sm:w-[320px] lg:w-auto h-full"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <TiltCard className="h-full rounded-2xl">
                <Card
                  className="flex h-full flex-col justify-between transition-all duration-300 hover:border-amber-500/50 hover:shadow-xl dark:hover:border-orange-500/50 bg-white dark:bg-neutral-900/90"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300">
                        {item.category}
                      </span>
                      <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
                    </div>

                    {/* Key metric showcase with 1s Count-Up Animation (Locked to single line) */}
                    <div className="mt-4 flex items-baseline gap-2 flex-nowrap">
                      <span className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white whitespace-nowrap shrink-0">
                        <AnimatedCounter value={item.metric} duration={1000} className="whitespace-nowrap" />
                      </span>
                      <span className="text-xs font-semibold text-amber-700 dark:text-orange-400 whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.metricLabel}
                      </span>
                    </div>

                    <CardTitle className="mt-4 text-base">{item.title}</CardTitle>
                    <CardDescription className="mt-2 text-xs">
                      {item.description}
                    </CardDescription>

                    <div className="mt-5 space-y-2 border-t border-neutral-100 pt-4 dark:border-white/5">
                      {item.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-[11px] text-neutral-600 dark:text-neutral-300">
                          <Check className="mt-0.5 size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-neutral-100 pt-4 dark:border-white/5">
                    <Link
                      href={item.url}
                      className="block w-full rounded-lg bg-neutral-100 py-2.5 text-center text-xs font-display font-semibold text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      Deploy Accelerator →
                    </Link>
                  </div>
                </Card>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
