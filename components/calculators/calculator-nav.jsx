"use client";

import React from "react";
import Link from "next/link";
import {
  LuShieldCheck,
  LuKeyRound,
  LuLock,
  LuCalculator,
  LuLayoutGrid,
  LuSparkles,
  LuArrowRight,
  LuFileText,
  LuDatabase,
  LuServer,
  LuCloud
} from "react-icons/lu";

export function CalculatorNav({ active }) {
  const coreCalculators = [
    {
      id: "soc",
      name: "SOC",
      fullName: "SOC Calculator",
      badge: "Security Operations",
      href: "/calculator/soc",
      icon: LuShieldCheck,
    },
    {
      id: "idam",
      name: "IDAM",
      fullName: "IDAM Calculator",
      badge: "Identity & Access",
      href: "/calculator/idam",
      icon: LuKeyRound,
    },
    {
      id: "pam",
      name: "PAM",
      fullName: "PAM Calculator",
      badge: "Privileged Access",
      href: "/calculator/pam",
      icon: LuLock,
    },
  ];

  const newCalculatorsMap = {
    dpdp: {
      name: "DPDP & DSPM",
      badge: "Data Privacy & Statutory Protection",
      icon: LuDatabase,
    },
    resilience: {
      name: "Cyber Resilience & Ransomware",
      badge: "RTO Recovery & Business Continuity",
      icon: LuServer,
    },
    ztna: {
      name: "ZTNA / SASE Consolidation",
      badge: "Zero Trust Architecture & MPLS",
      icon: LuShieldCheck,
    },
    cnapp: {
      name: "CNAPP & Observability",
      badge: "Cloud Ingest & Telemetry Optimization",
      icon: LuCloud,
    },
  };

  const isNewModelActive = Boolean(newCalculatorsMap[active]);
  const activeNewModel = newCalculatorsMap[active];

  return (
    <div className="mb-8 print:hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-2 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-xs">
        {/* Left: Brand & Active Context Badge */}
        <div className="flex flex-wrap items-center gap-2 px-3 py-1 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-500 dark:text-neutral-400">
            <LuCalculator className="size-4 text-amber-600 dark:text-amber-400" />
            <span className="uppercase tracking-wider font-mono text-[11px]">ROI Accelerators</span>
          </div>

          {/* Active status badge if viewing any of the 4 new calculators */}
          {isNewModelActive && activeNewModel && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30 animate-in fade-in">
              <LuSparkles className="size-3 text-amber-600 dark:text-amber-400" />
              <span>Active: {activeNewModel.name}</span>
            </div>
          )}
        </div>

        {/* Right: Core 3 Switcher Buttons + See All Calculators Link */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          <nav aria-label="Calculator Switcher" className="grid grid-cols-3 gap-1 w-full sm:w-auto">
            {coreCalculators.map((calc) => {
              const Icon = calc.icon;
              const isActive = active === calc.id;
              return (
                <Link
                  key={calc.id}
                  href={calc.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-amber-600 text-white shadow-sm ring-1 ring-amber-500/50"
                      : "text-neutral-600 dark:text-neutral-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-500/10 dark:hover:bg-amber-500/10"
                  }`}
                >
                  <Icon className={`size-3.5 shrink-0 ${isActive ? "text-white" : "text-amber-600 dark:text-amber-400"}`} />
                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-bold">{calc.name}</span>
                    <span className={`text-[9px] font-normal hidden sm:inline ${isActive ? "text-amber-100" : "text-neutral-400"}`}>
                      {calc.badge}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Link to see all 7 calculators */}
          <Link
            href="/calculator"
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
              active === "hub"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent shadow-xs"
                : "border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-200 hover:border-amber-500/40 hover:text-amber-700 dark:hover:text-amber-300"
            }`}
          >
            <LuLayoutGrid className="size-3.5 text-amber-600 dark:text-amber-400" />
            <span>See All Calculators (7 Models)</span>
            <LuArrowRight className="size-3 text-neutral-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
