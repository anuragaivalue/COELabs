"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { Search, X, Server, ArrowRight } from "lucide-react";

export function HeroSection() {
  const rotatingTaglines = [
    "Empowering Digital Transformation with Unified Multistack Solutions",
    "Accelerate Innovation with Our Integrated Cybersecurity and Datacentre Expertise",
    "Redefining Business Resilience Through Advanced Technology Stacks",
    "Your Partner in Building a Future-Ready Digital Ecosystem",
    "From Data to Insight, Security to Efficiency - We Cover It All",
    "Leading the Way in Multistack Excellence for a Secure and Scalable Tomorrow",
    "Experience Seamless Integration and Unmatched Performance",
    "Innovate, Secure, and Scale with Our Comprehensive Multistack Solutions",
    "Transforming Challenges into Opportunities with Cutting-Edge Technology"
  ];

  const [taglineIndex, setTaglineIndex] = useState(0);
  const [heroSearch, setHeroSearch] = useState("");
  const [activeTags, setActiveTags] = useState([]);

  const quickTags = [
    "EDR / XDR",
    "Identity & PAM",
    "Cloud Security",
    "Data Loss Prevention (DLP)",
    "Zero Trust (ZTNA)",
    "WAAP / AppSec",
    "BFSI Compliance",
    "Check Point",
    "SentinelOne",
    "CyberArk"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % rotatingTaglines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [rotatingTaglines.length]);

  const toggleTag = (tag) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter((t) => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  const removeTag = (tag) => {
    setActiveTags(activeTags.filter((t) => t !== tag));
  };

  const clearAllSearch = () => {
    setActiveTags([]);
    setHeroSearch("");
  };

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    const queryParts = [...activeTags];
    if (heroSearch.trim()) {
      queryParts.push(heroSearch.trim());
    }
    const combinedQuery = queryParts.join(" ");

    if (combinedQuery) {
      window.location.href = `#values?search=${encodeURIComponent(combinedQuery)}`;
    } else {
      window.location.href = "#values";
    }
  };

  return (
    <section id="hero" className="relative pt-4 pb-16 sm:pt-6 md:pt-15 md:pb-1 overflow-hidden scroll-mt-20">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(249,115,22,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(249,115,22,0.2),transparent)]" />

      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col items-center text-center">

          {/* 1. Main Heading */}
          <h1 className="max-w-4xl font-sans text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-5xl dark:text-white leading-[1.12]">
            Unlock the Full Potential of Your IT Infrastructure with Our{" "}
            <span className="text-amber-600 dark:text-orange-400">COE</span>
          </h1>

          {/* Dynamic rotating headlines matching MAIN site */}
          <div className="mt-4 min-h-[3rem] flex items-center justify-center">
            <p className="font-display text-sm sm:text-base font-semibold text-amber-800 dark:text-orange-300 transition-all duration-500">
              {rotatingTaglines[taglineIndex]}
            </p>
          </div>


          {/* CTA Buttons - De-emphasized PoC with high-value enterprise terminology */}
          {/* <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="#values" variant="solid" size="lg">
              Explore 34+ Solution Stacks
            </Button>
            <Button href="/request-poc" variant="outline" size="lg">
              Request Architecture Blueprint
            </Button>
          </div> */}

        </div>
      </div>
    </section>
  );
}
