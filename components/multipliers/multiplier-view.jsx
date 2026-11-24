"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  LuSparkles,
  LuLayers,
  LuCheck,
  LuPlus,
  LuRotateCcw,
  LuCopy,
  LuAnchor,
  LuTrendingUp,
  LuShieldCheck,
  LuCircleAlert,
  LuInfo,
  LuCalendar
} from "react-icons/lu";

export const MULTIPLIER_LIST = [
  { slug: "ztnamultiplier", label: "Zero Trust (ZTNA)", short: "ZTNA" },
  { slug: "SoCmultiplier", label: "SoC Multiplier", short: "SoC" },
  { slug: "bfsimultiplier", label: "BFSI Multiplier", short: "BFSI" },
  { slug: "digitalnativesmultiplier", label: "Digital Natives", short: "Digital Natives" },
  { slug: "energymultiplier", label: "Energy & Power", short: "Energy & Power" },
  { slug: "enterprisemultiplier", label: "Enterprise", short: "Enterprise" },
  { slug: "fintechmultiplier", label: "Fintech", short: "Fintech" },
  { slug: "idammultiplier", label: "IDAM Multiplier", short: "IDAM" },
  { slug: "insurancemultiplier", label: "Insurance", short: "Insurance" },
  { slug: "manufacturingmultiplier", label: "Manufacturing", short: "Manufacturing" },
  { slug: "pharmamultiplier", label: "Pharma", short: "Pharma" }
];

function formatCurrencyK(k) {
  const n = Number(k || 0);
  if (!Number.isFinite(n) || n === 0) return "$0";
  const dollars = n * 1000;
  return dollars >= 1_000_000
    ? `$${(dollars / 1_000_000).toFixed(2)}M`
    : `$${Math.round(dollars / 1000)}K`;
}

export function MultiplierView({ data }) {
  const isDomain = data.type === "domain";

  // ===================== DOMAIN MULTIPLIER STATE =====================
  const domainKeys = useMemo(() => {
    return isDomain && data.domains ? Object.keys(data.domains) : [];
  }, [isDomain, data.domains]);

  const [activeDomain, setActiveDomain] = useState(() => domainKeys[0] || "");

  // Domain state: map of `cat::cap` -> { category, capability, pricek, selected }
  const [domainState, setDomainState] = useState(() => {
    const map = {};
    if (isDomain && data.domains) {
      Object.keys(data.domains).forEach((cat) => {
        data.domains[cat].forEach((cap) => {
          map[`${cat}::${cap}`] = {
            category: cat,
            capability: cap,
            pricek: 50,
            selected: false
          };
        });
      });
    }
    return map;
  });

  const [anchorKey, setAnchorKey] = useState(null);

  // Reset domain state if data changes
  useEffect(() => {
    if (isDomain && data.domains) {
      const map = {};
      Object.keys(data.domains).forEach((cat) => {
        data.domains[cat].forEach((cap) => {
          map[`${cat}::${cap}`] = {
            category: cat,
            capability: cap,
            pricek: 50,
            selected: false
          };
        });
      });
      const firstCat = Object.keys(data.domains)[0];
      setActiveDomain(firstCat || "");
      setDomainState(map);
      setAnchorKey(null);
    }
  }, [isDomain, data]);

  // ===================== GRID MULTIPLIER STATE =====================
  const [gridCaps, setGridCaps] = useState(() => {
    if (!isDomain && data.capabilities) {
      return data.capabilities.map((c) => ({
        name: c.name,
        pricek: c.price || 50,
        desc: c.desc || "",
        isAnchor: false,
        selected: false
      }));
    }
    return [];
  });

  useEffect(() => {
    if (!isDomain && data.capabilities) {
      setGridCaps(
        data.capabilities.map((c) => ({
          name: c.name,
          pricek: c.price || 50,
          desc: c.desc || "",
          isAnchor: false,
          selected: false
        }))
      );
    }
  }, [isDomain, data]);

  // ===================== COPY FEEDBACK =====================
  const [copied, setCopied] = useState(false);

  // ===================== COMPUTATIONS =====================
  const domainResults = useMemo(() => {
    if (!isDomain) return null;
    const anchor = anchorKey ? domainState[anchorKey] : null;
    const baselineK = Number(anchor?.pricek || 0);

    const selectedList = Object.values(domainState).filter((v) => v.selected);
    const selectedK = selectedList.reduce((sum, v) => sum + Number(v.pricek || 0), 0);

    const addK = Math.max(0, selectedK - baselineK);
    const totalK = baselineK + addK;
    const mult = baselineK > 0 ? totalK / baselineK : 0;

    let tip = data.tips?.low || "To increase multiplier, attach across at least 3 domains with measurable outcomes.";
    if (!anchor) {
      tip = data.tips?.noAnchor || "Set an anchor first (baseline capability).";
    } else if (mult >= 6) {
      tip = data.tips?.high || "Strong stack. Next: enforce continuous evaluation and instrument evidence for auditors.";
    } else if (mult >= 3) {
      tip = data.tips?.mid || "Healthy expansion path. Attach across multiple domains for measurable outcomes.";
    }

    return {
      baselineK,
      addK,
      totalK,
      mult,
      count: selectedList.length,
      tip,
      anchor,
      selectedList
    };
  }, [isDomain, domainState, anchorKey, data.tips]);

  const gridResults = useMemo(() => {
    if (isDomain) return null;
    const anchor = gridCaps.find((c) => c.isAnchor && c.selected);
    const baselineK = Number(anchor?.pricek || 0);

    const selectedList = gridCaps.filter((c) => c.selected);
    const selectedK = selectedList.reduce((sum, c) => sum + Number(c.pricek || 0), 0);

    const addK = Math.max(0, selectedK - baselineK);
    const totalK = baselineK + addK;
    const mult = baselineK > 0 ? totalK / baselineK : 0;

    let tip = data.tips?.low || "To increase multiplier, attach across visibility, protection, and resilience layers.";
    if (!baselineK) {
      tip = data.tips?.noAnchor || `Select your anchor (${data.anchor || "Anchor"}) first.`;
    } else if (mult >= 6) {
      tip = data.tips?.high || "Strong stack. Next: validate segmentation, harden remote access, and test recovery.";
    } else if (mult >= 3) {
      tip = data.tips?.mid || "Healthy expansion path. Attach segmentation, monitoring, and incident response playbooks.";
    }

    return {
      baselineK,
      addK,
      totalK,
      mult,
      count: selectedList.length,
      tip,
      anchor,
      selectedList
    };
  }, [isDomain, gridCaps, data.tips, data.anchor]);

  const results = isDomain ? domainResults : gridResults;

  // ===================== HANDLERS: DOMAIN =====================
  const handleDomainPriceChange = (key, value) => {
    const num = Math.max(0, parseFloat(value) || 0);
    setDomainState((prev) => ({
      ...prev,
      [key]: { ...prev[key], pricek: num }
    }));
  };

  const handleSetAnchor = (key) => {
    setAnchorKey(key);
    setDomainState((prev) => ({
      ...prev,
      [key]: { ...prev[key], selected: true }
    }));
  };

  const handleToggleDomainAttach = (key) => {
    if (key === anchorKey) return; // anchor cannot be detached
    setDomainState((prev) => ({
      ...prev,
      [key]: { ...prev[key], selected: !prev[key].selected }
    }));
  };

  const handleResetDomain = () => {
    setDomainState((prev) => {
      const next = {};
      Object.keys(prev).forEach((k) => {
        next[k] = { ...prev[k], selected: false };
      });
      return next;
    });
    setAnchorKey(null);
  };

  // ===================== HANDLERS: GRID =====================
  const handleGridPriceChange = (name, value) => {
    const num = Math.max(0, parseFloat(value) || 0);
    setGridCaps((prev) =>
      prev.map((c) => (c.name === name ? { ...c, pricek: num } : c))
    );
  };

  const handleSetGridAnchor = (name) => {
    setGridCaps((prev) =>
      prev.map((c) =>
        c.name === name
          ? { ...c, isAnchor: true, selected: true }
          : { ...c, isAnchor: false }
      )
    );
  };

  const handleToggleGridAttach = (name) => {
    setGridCaps((prev) =>
      prev.map((c) => (c.name === name ? { ...c, selected: !c.selected } : c))
    );
  };

  const handleResetGrid = () => {
    setGridCaps((prev) =>
      prev.map((c) => ({ ...c, isAnchor: false, selected: false }))
    );
  };

  // ===================== COPY TO CLIPBOARD =====================
  const handleCopy = async () => {
    if (!results) return;
    const names = isDomain
      ? results.selectedList.map((s) => `${s.category}: ${s.capability}`)
      : results.selectedList.map((s) => s.name);

    const anchorName = isDomain
      ? results.anchor
        ? `${results.anchor.category}: ${results.anchor.capability}`
        : "—"
      : data.anchor || "—";

    const text = `${data.title} | Anchor: ${anchorName} (${formatCurrencyK(
      results.baselineK
    )}) | Add-ons: ${formatCurrencyK(results.addK)} | Total: ${formatCurrencyK(
      results.totalK
    )} | Multiplier: ${
      results.baselineK > 0 ? results.mult.toFixed(2) + "x" : "—"
    } | Selected (${results.count}): ${names.join(", ")}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Failed to copy to clipboard.");
    }
  };

  return (
    <div className="w-full min-w-0 flex flex-col gap-6 sm:gap-8">
      {/* 1. Top Multipliers Switcher Navigation Bar (Matching Image 3f8769) */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 custom-gold-scrollbar">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 shrink-0 mr-1 font-display">
          Multipliers:
        </span>
        {MULTIPLIER_LIST.map((item) => {
          const isActive = data.slug?.toLowerCase() === item.slug.toLowerCase();
          return (
            <Link
              key={item.slug}
              href={`/multiplier/${item.slug}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-amber-600 text-white shadow-md font-bold"
                  : "bg-white/80 dark:bg-neutral-800/80 border border-neutral-200/90 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-amber-500/50 hover:text-amber-800 dark:hover:text-amber-300"
              }`}
            >
              <LuLayers className="size-3" />
              <span>{item.short}</span>
            </Link>
          );
        })}
      </div>

      {/* 2. Hero Header Banner */}
      <div className="w-full relative overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-[#141416] p-6 sm:p-8 md:p-10 shadow-lg backdrop-blur-xl">
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-50/80 dark:bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-3">
            <LuSparkles className="size-3.5 text-amber-600 dark:text-amber-400" />
            <span>{data.badge || "Revenue Multiplier"}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-display">
            {data.title}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
            {data.desc}
          </p>
        </div>
      </div>

      {/* 3. Main Interactive Workspace: 2-Card Layout Replicating MAIN Site */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0">

        {/* ======================================================== */}
        {/* CARD 1 (LEFT / MAIN): Stack Builder Card                 */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 xl:col-span-8 w-full rounded-2xl sm:rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-[#141416] p-5 sm:p-7 shadow-lg backdrop-blur-xl min-w-0 flex flex-col gap-5">
          
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                <LuShieldCheck className="size-3.5" />
                <span>{isDomain ? `${activeDomain} Architecture` : "Core Capability Architecture"}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white font-display">
                {isDomain ? `${data.title} Stack Builder` : `${data.title} Stack Builder`}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {isDomain
                  ? "Pick a domain, adjust prices ($K), then attach capabilities. Use Set Anchor once."
                  : `Core Anchor: ${data.anchor || "Baseline"} | Adjust prices ($K) and attach add-ons to calculate multiplier.`}
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={isDomain ? handleResetDomain : handleResetGrid}
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer shadow-xs"
              >
                <LuRotateCcw className="size-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-amber-700 transition-colors cursor-pointer"
              >
                {copied ? <LuCheck className="size-3.5" /> : <LuCopy className="size-3.5" />}
                <span>{copied ? "Copied!" : "Copy Summary"}</span>
              </button>
            </div>
          </div>

          {/* Domain Picker (Rendered ONLY when isDomain: true) */}
          {isDomain && domainKeys.length > 0 && (
            <div className="w-full flex flex-col gap-2 pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 font-display flex items-center justify-between">
                <span>Select Architectural Domain:</span>
                <span className="text-[10px] text-neutral-400 font-sans font-normal">
                  ({domainKeys.length} domains available)
                </span>
              </div>

              {/* Wrapping Horizontal Row of Domain Pills */}
              <div className="flex flex-wrap gap-2 w-full">
                {domainKeys.map((domain) => {
                  const isCurrent = activeDomain === domain;
                  const domainCaps = data.domains[domain] || [];
                  const attachedCount = domainCaps.filter(
                    (c) => domainState[`${domain}::${c}`]?.selected
                  ).length;

                  return (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => setActiveDomain(domain)}
                      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-amber-600 text-white shadow-md font-bold scale-[1.02]"
                          : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 dark:bg-neutral-800/80 dark:hover:bg-neutral-700 dark:text-neutral-300 border border-neutral-200/70 dark:border-white/5"
                      }`}
                    >
                      <span>{domain}</span>
                      {attachedCount > 0 && (
                        <span
                          className={`size-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                            isCurrent
                              ? "bg-white text-amber-700"
                              : "bg-amber-500/20 text-amber-800 dark:text-amber-300"
                          }`}
                        >
                          {attachedCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full-Width Tip Banner */}
          <div className="w-full rounded-xl border border-amber-500/20 bg-amber-50/70 dark:bg-amber-500/10 p-3 sm:p-3.5 flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-300">
            <LuInfo className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {isDomain
                ? "Tip: You can set the anchor from any domain. Selections and prices persist as you switch domains."
                : `Tip: Adjust the baseline anchor (${data.anchor || "Anchor"}) or add-on prices to reflect your deal architecture.`}
            </p>
          </div>

          {/* Capability Cards Grid (2-Column Responsive Grid) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 min-w-0">
            {isDomain ? (
              /* Domain Capabilities for activeDomain */
              (data.domains[activeDomain] || []).map((cap) => {
                const key = `${activeDomain}::${cap}`;
                const item = domainState[key] || {
                  category: activeDomain,
                  capability: cap,
                  pricek: 50,
                  selected: false
                };
                const isAnchor = anchorKey === key;
                const isSelected = item.selected;

                return (
                  <div
                    key={key}
                    className={`relative flex flex-col justify-between rounded-xl sm:rounded-2xl border p-3.5 sm:p-4 transition-all duration-150 min-w-0 overflow-hidden ${
                      isAnchor
                        ? "border-amber-500/80 bg-amber-50/80 dark:bg-amber-500/15 shadow-sm ring-1 ring-amber-500/30"
                        : isSelected
                        ? "border-amber-400/60 bg-amber-50/40 dark:bg-amber-500/10"
                        : "border-neutral-200/90 dark:border-white/10 bg-neutral-50/60 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-white/20"
                    }`}
                  >
                    {/* Capability Name & Anchor Badge */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white leading-snug break-words">
                          {cap}
                        </h4>
                        {isAnchor && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white shrink-0">
                            <LuAnchor className="size-2.5" />
                            <span>Anchor</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Controls: Price + Actions (Contained & Wrapped) */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 min-w-0">
                      {/* Price Input with $K */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">$K</span>
                        <input
                          type="number"
                          min="0"
                          step="5"
                          value={item.pricek}
                          onChange={(e) => handleDomainPriceChange(key, e.target.value)}
                          className="w-14 sm:w-16 rounded-lg border border-neutral-300 dark:border-white/10 bg-white dark:bg-neutral-900 px-2 py-1 text-xs font-bold font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                      </div>

                      {/* Anchor / Attach Button Controls */}
                      <div className="flex flex-wrap items-center justify-end gap-1.5 min-w-0">
                        {!isAnchor && (
                          <button
                            type="button"
                            onClick={() => handleSetAnchor(key)}
                            title="Set as baseline anchor"
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-neutral-600 hover:text-amber-700 dark:text-neutral-300 dark:hover:text-amber-400 transition-colors cursor-pointer shrink-0"
                          >
                            <LuAnchor className="size-3" />
                            <span>Set Anchor</span>
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isAnchor}
                          onClick={() => handleToggleDomainAttach(key)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            isAnchor
                              ? "bg-amber-500/20 text-amber-800 dark:text-amber-300 opacity-90 cursor-default"
                              : isSelected
                              ? "bg-amber-600 text-white shadow-sm font-bold"
                              : "border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 bg-white dark:bg-neutral-900/60"
                          }`}
                        >
                          {isAnchor ? (
                            <span>Anchor Base</span>
                          ) : isSelected ? (
                            <>
                              <LuCheck className="size-3" />
                              <span>Attached</span>
                            </>
                          ) : (
                            <>
                              <LuPlus className="size-3" />
                              <span>+ Attach</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Grid Capabilities */
              gridCaps.map((cap) => {
                const isAnchor = cap.isAnchor;
                const isSelected = cap.selected;

                return (
                  <div
                    key={cap.name}
                    className={`relative flex flex-col justify-between rounded-xl sm:rounded-2xl border p-3.5 sm:p-4 transition-all duration-150 min-w-0 overflow-hidden ${
                      isAnchor
                        ? "border-amber-500/80 bg-amber-50/80 dark:bg-amber-500/15 shadow-sm ring-1 ring-amber-500/30"
                        : isSelected
                        ? "border-amber-400/60 bg-amber-50/40 dark:bg-amber-500/10"
                        : "border-neutral-200/90 dark:border-white/10 bg-neutral-50/60 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-white/20"
                    }`}
                  >
                    {/* Name & Description */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white leading-snug break-words">
                          {cap.name}
                        </h4>
                        {isAnchor && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white shrink-0">
                            <LuAnchor className="size-2.5" />
                            <span>Anchor</span>
                          </span>
                        )}
                      </div>
                      {cap.desc && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                          {cap.desc}
                        </p>
                      )}
                    </div>

                    {/* Controls (Contained & Wrapped) */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 min-w-0">
                      {/* Price */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">$K</span>
                        <input
                          type="number"
                          min="0"
                          step="5"
                          value={cap.pricek}
                          onChange={(e) => handleGridPriceChange(cap.name, e.target.value)}
                          className="w-14 sm:w-16 rounded-lg border border-neutral-300 dark:border-white/10 bg-white dark:bg-neutral-900 px-2 py-1 text-xs font-bold font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                      </div>

                      {/* Attach button */}
                      <div className="flex flex-wrap items-center justify-end gap-1.5 min-w-0">
                        {!isAnchor && (
                          <button
                            type="button"
                            onClick={() => handleSetGridAnchor(cap.name)}
                            title="Set as baseline anchor"
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-neutral-600 hover:text-amber-700 dark:text-neutral-300 dark:hover:text-amber-400 transition-colors cursor-pointer shrink-0"
                          >
                            <LuAnchor className="size-3" />
                            <span>Set Anchor</span>
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isAnchor}
                          onClick={() => handleToggleGridAttach(cap.name)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            isAnchor
                              ? "bg-amber-500/20 text-amber-800 dark:text-amber-300 opacity-90 cursor-default"
                              : isSelected
                              ? "bg-amber-600 text-white shadow-sm font-bold"
                              : "border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 bg-white dark:bg-neutral-900/60"
                          }`}
                        >
                          {isAnchor ? (
                            <span>Anchor Base</span>
                          ) : isSelected ? (
                            <>
                              <LuCheck className="size-3" />
                              <span>Attached</span>
                            </>
                          ) : (
                            <>
                              <LuPlus className="size-3" />
                              <span>+ Attach</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* ======================================================== */}
        {/* CARD 2 (RIGHT): Running Total Sticky Summary Card        */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 xl:col-span-4 w-full shrink-0 lg:sticky lg:top-24">
          <div className="w-full rounded-2xl sm:rounded-3xl border border-amber-500/30 bg-white/98 dark:bg-[#141416] p-5 sm:p-6 md:p-7 shadow-xl backdrop-blur-xl flex flex-col gap-5">
            {/* Header with multiplier badge */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-white/10">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white font-display">
                  RUNNING TOTAL
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {results ? `${results.count} capabilities selected` : "0 selected"}
                </span>
              </div>

              {/* Multiplier Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 px-3.5 py-1 text-xs sm:text-sm font-extrabold text-white shadow-md">
                <LuTrendingUp className="size-3.5" />
                <span>
                  {results && results.baselineK > 0
                    ? `${results.mult.toFixed(2)}x`
                    : "—"}
                </span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Core / Anchor Baseline:</span>
                <span className="font-bold text-neutral-900 dark:text-white font-mono text-sm">
                  {results && results.baselineK > 0 ? formatCurrencyK(results.baselineK) : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Attached Add-ons:</span>
                <span className="font-bold text-neutral-900 dark:text-white font-mono text-sm">
                  {results && results.baselineK > 0 ? formatCurrencyK(results.addK) : "—"}
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
                <span className="font-bold text-neutral-900 dark:text-white">Total Stack Value:</span>
                <span className="text-base sm:text-lg font-extrabold text-amber-700 dark:text-amber-400 font-mono">
                  {results && results.baselineK > 0 ? formatCurrencyK(results.totalK) : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Revenue Multiplier:</span>
                <span className="text-base sm:text-lg font-black text-amber-800 dark:text-amber-300 font-mono">
                  {results && results.baselineK > 0 ? `${results.mult.toFixed(2)}x` : "—"}
                </span>
              </div>
            </div>

            {/* Dynamic Insight Tip Card */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-50/70 dark:bg-amber-500/10 p-4">
              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 text-xs font-bold font-display mb-1.5">
                <LuCircleAlert className="size-3.5" />
                <span>COE Sizing Insight</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                {results?.tip}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-amber-700 transition-all cursor-pointer"
              >
                {copied ? <LuCheck className="size-4" /> : <LuCopy className="size-4" />}
                <span>{copied ? "Copied to Clipboard!" : "Copy Executive Summary"}</span>
              </button>

              <Link
                href="/contact?type=enterprise"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-neutral-50/60 dark:bg-neutral-800/60 py-3 text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-all text-center"
              >
                <LuCalendar className="size-4 text-amber-600" />
                <span>Request Custom Architecture Sizing</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
