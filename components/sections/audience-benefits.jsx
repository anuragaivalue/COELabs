"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { audienceBenefits } from "@/data/benefits";
import { CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { MotionReveal } from "@/components/ui/motion-reveal";

export function AudienceBenefits() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);

  const scrollToSlide = useCallback((index) => {
    if (index < 0 || index >= audienceBenefits.length) return;
    setActiveIndex(index);
    if (carouselRef.current) {
      const container = carouselRef.current;
      const slide = container.children[index];
      if (slide) {
        const offsetLeft = slide.offsetLeft - (container.clientWidth - slide.clientWidth) / 2;
        container.scrollTo({
          left: offsetLeft,
          behavior: "smooth"
        });
      }
    }
  }, []);

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + audienceBenefits.length) % audienceBenefits.length;
    scrollToSlide(prevIndex);
  };

  const handleNext = useCallback(() => {
    const nextIndex = (activeIndex + 1) % audienceBenefits.length;
    scrollToSlide(nextIndex);
  }, [activeIndex, scrollToSlide]);

  // Global 2.5s Auto-Scroll with Hover Pause
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Sync activeIndex with scroll position when user swipes or scrolls manually
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const containerCenter = container.scrollLeft + container.clientWidth / 2;
          let closest = 0;
          let minDiff = Infinity;
          Array.from(container.children).forEach((child, i) => {
            const childCenter = child.offsetLeft + child.clientWidth / 2;
            const diff = Math.abs(containerCenter - childCenter);
            if (diff < minDiff) {
              minDiff = diff;
              closest = i;
            }
          });
          setActiveIndex(closest);
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="about" className="section-divider py-20 md:py-28 bg-neutral-50/50 dark:bg-neutral-900/30 border-t border-neutral-200/80 dark:border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <MotionReveal direction="up">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
              <IValueEmblem className="size-3.5" />
              <span>iVCoE Advantages</span>
            </div>
            <h2 className="mt-4 font-sans text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
              Tailored Advantages for the Ecosystem
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
              Bridging the gap between <span className="highlight">diverse enterprise needs and integrated multi-OEM solutions</span>.
            </p>
          </div>
        </MotionReveal>

        {/* Option Tabs / Controls */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <div className="flex flex-wrap justify-center rounded-xl border border-neutral-200 bg-white p-1.5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
            {audienceBenefits.map((aud, idx) => (
              <button
                key={aud.id}
                onClick={() => scrollToSlide(idx)}
                className={`rounded-lg px-4 sm:px-6 py-2 text-xs sm:text-sm font-display font-medium transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-black scale-[1.02]"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {aud.title}
              </button>
            ))}
          </div>

          {/* Snappy Carousel Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous option"
              className="flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => handleNext()}
              aria-label="Next option"
              className="flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Snappy Sideways Peek Carousel Container with 2.5s Auto-Scroll & Hover Pause */}
        <div
          ref={carouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative mt-12 flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none snap-x snap-mandatory py-6 px-[6vw] sm:px-[10vw] lg:px-[12vw] transition-all duration-300"
          style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
        >
          {audienceBenefits.map((aud, idx) => {
            const distance = Math.abs(idx - activeIndex);
            const isCenter = distance === 0;
            const isAdjacent = distance === 1;

            return (
              <div
                key={aud.id}
                onClick={() => {
                  if (!isCenter) scrollToSlide(idx);
                }}
                className={`snap-center shrink-0 w-[88vw] sm:w-[82vw] lg:w-[76vw] max-w-[1080px] rounded-3xl border transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
                  isCenter
                    ? "scale-100 opacity-100 border-amber-500/50 dark:border-orange-500/50 shadow-2xl ring-1 ring-amber-500/20 bg-white dark:bg-neutral-900 z-20 pointer-events-auto"
                    : isAdjacent
                    ? "scale-[0.95] opacity-75 border-neutral-300 dark:border-white/15 shadow-md bg-white/80 dark:bg-neutral-900/70 hover:opacity-95 hover:scale-[0.97] z-10 cursor-pointer"
                    : "scale-[0.88] opacity-30 border-neutral-200 dark:border-white/10 shadow-none bg-white/40 dark:bg-neutral-900/30 z-0 cursor-pointer"
                }`}
              >
                {/* Refactored Balanced 50/50 Split Layout */}
                <div className="p-6 sm:p-10 lg:p-12">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-stretch">
                    
                    {/* Left Column: Well-proportioned Text & Key Points */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-display font-semibold uppercase tracking-wider text-amber-700 dark:text-orange-400">
                            <IValueEmblem className="size-3" />
                            Option 0{idx + 1}
                          </span>
                        </div>

                        <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white leading-snug">
                          {aud.title}
                        </h3>

                        <p className="mt-2 text-sm sm:text-base font-semibold text-amber-700 dark:text-orange-400">
                          {aud.subtitle}
                        </p>

                        <p className="mt-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                          {aud.summary}
                        </p>
                      </div>

                      {/* 4 Feature Points in clean breathable grid */}
                      <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        {aud.keyPoints.map((point, pIdx) => (
                          <div
                            key={pIdx}
                            className="card-reveal flex flex-col gap-1 rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-3.5 dark:border-white/5 dark:bg-neutral-800/40"
                            style={{ transitionDelay: `${pIdx * 80}ms` }}
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                              <h4 className="font-display text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">
                                {point.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans pl-6 line-clamp-2">
                              {point.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* CTA Routing to Dedicated Architecture Request Page */}
                      <div className="mt-8 flex items-center justify-start border-t border-neutral-100 pt-6 dark:border-white/5">
                        <a
                          href="/request-poc"
                          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-xs font-display font-semibold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-sm transition-all"
                        >
                          Request Architecture Blueprint <ArrowRight className="size-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Right Column: Prominent, Well-Proportioned Official Image Container */}
                    <div className="flex flex-col justify-center">
                      <div className="card-reveal relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 shadow-xl dark:border-white/10 bg-neutral-100 dark:bg-neutral-800/80 h-full min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] w-full" style={{ transitionDelay: "200ms" }}>
                        <div className="relative flex-1 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={aud.image}
                            alt={aud.title}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Caption Badge */}
                        <div className="p-4 sm:p-5 bg-white/95 backdrop-blur-md dark:bg-neutral-900/95 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between">
                          <div>
                            <span className="font-display text-xs font-bold text-amber-700 dark:text-orange-400">
                              iValue Center of Excellence Lab
                            </span>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans mt-0.5">
                              Real-world multi-vendor interoperability and compliance blueprints.
                            </p>
                          </div>
                          <IValueEmblem className="size-6 shrink-0 ml-3" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Slide Indicators */}
        <div className="mt-8 flex justify-center items-center gap-2">
          {audienceBenefits.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? "w-8 bg-amber-600 dark:bg-orange-400"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
