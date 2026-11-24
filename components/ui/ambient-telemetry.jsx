"use client";

import React, { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AmbientTelemetry() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Left Margin: Ambient Live Telemetry Bento Card (Ultra-wide screens) */}
      <aside
        aria-label="Live Architecture Telemetry"
        className="fixed left-5 top-1/2 -translate-y-1/2 z-30 hidden 2xl:flex flex-col pointer-events-auto transition-all duration-300"
      >
        <div
          className={cn(
            "relative rounded-2xl border border-neutral-200/90 bg-white/90 p-3.5 shadow-xl backdrop-blur-md dark:border-white/15 dark:bg-neutral-950/90 transition-all duration-300",
            collapsed ? "w-14 items-center" : "w-64"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              {!collapsed && (
                <span className="font-display text-[11px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Live CoE Telemetry
                </span>
              )}
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand telemetry panel" : "Collapse telemetry panel"}
              className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
            </button>
          </div>

          {!collapsed && (
            <div className="mt-3.5 space-y-2.5 text-xs">
              {/* Dual CoE Labs Status */}
              <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-2.5 dark:border-white/5 dark:bg-neutral-900/60">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Bangalore CoE</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">100G Mesh</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Singapore Hub</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">ZTNA Active</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-neutral-200/50 pt-1.5 text-[10px] text-neutral-500 dark:border-white/5 dark:text-neutral-400">
                  <span>Synced Latency</span>
                  <span className="font-mono text-amber-700 dark:text-orange-400 font-bold">28ms</span>
                </div>
              </div>

              {/* Verified Metrics Strip */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg border border-neutral-100 bg-neutral-50/60 p-2 dark:border-white/5 dark:bg-neutral-900/40">
                  <span className="block font-display text-xs font-bold text-neutral-900 dark:text-white">34 Stacks</span>
                  <span className="text-[9px] text-neutral-400">Tested Blueprints</span>
                </div>
                <div className="rounded-lg border border-neutral-100 bg-neutral-50/60 p-2 dark:border-white/5 dark:bg-neutral-900/40">
                  <span className="block font-display text-xs font-bold text-neutral-900 dark:text-white">62+ OEMs</span>
                  <span className="text-[9px] text-neutral-400">Interoperable</span>
                </div>
              </div>

              {/* Direct PoC link */}
              <a
                href="/request-poc"
                className="mt-1 flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <span>Request Live Lab Access</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
