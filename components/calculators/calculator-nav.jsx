"use client";

import React from "react";
import Link from "next/link";
import { LuShieldCheck, LuKeyRound, LuLock, LuCalculator } from "react-icons/lu";

export function CalculatorNav({ active }) {
  const calculators = [
    {
      id: "soc",
      name: "SOC Calculator",
      badge: "Security Operations",
      href: "/calculator/soc",
      icon: LuShieldCheck,
    },
    {
      id: "idam",
      name: "IDAM Calculator",
      badge: "Identity & Access",
      href: "/calculator/idam",
      icon: LuKeyRound,
    },
    {
      id: "pam",
      name: "PAM Calculator",
      badge: "Privileged Access",
      href: "/calculator/pam",
      icon: LuLock,
    },
  ];

  return (
    <div className="mb-8 print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <LuCalculator className="size-4 text-amber-600 dark:text-amber-400" />
          <span className="uppercase tracking-wider font-mono text-[11px]">ROI Accelerators</span>
        </div>

        <nav aria-label="Calculator Switcher" className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 w-full sm:w-auto">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            const isActive = active === calc.id;
            return (
              <Link
                key={calc.id}
                href={calc.href}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-amber-600 text-white shadow-sm ring-1 ring-amber-500/50"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-500/10 dark:hover:bg-amber-500/10"
                }`}
              >
                <Icon className={`size-4 shrink-0 ${isActive ? "text-white" : "text-amber-600 dark:text-amber-400"}`} />
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-bold">{calc.name}</span>
                  <span className={`text-[10px] font-normal ${isActive ? "text-amber-100" : "text-neutral-400"}`}>
                    {calc.badge}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
