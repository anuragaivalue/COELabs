"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CalculatorNav } from "@/components/calculators/calculator-nav";
import { formatCurrency as formatCurrencyUtil, getCurrencySymbol } from "@/lib/currency";
import { exportSectionsToCSV, triggerPrint } from "@/lib/export-utils";
import {
  LuShieldCheck,
  LuRotateCcw,
  LuPrinter,
  LuChevronRight,
  LuTrendingUp,
  LuFileSpreadsheet,
  LuSparkles,
  LuInfo,
  LuCheckCircle2,
  LuAlertTriangle,
  LuDollarSign,
  LuNetwork,
  LuLayers,
  LuClock
} from "react-icons/lu";

const ZTNA_DEFAULTS = {
  remoteUsers: 3200,
  branchLocations: 45,
  legacyVpnHardwareSpend: 140000,
  mplsSpendAnnual: 360000,
  helpdeskTicketsMonth: 420,
  costPerTicket: 35,
  pointToolsCount: 6,
  pointToolAvgCost: 35000,
  saseCostPerUserMonth: 18,
  implOneTime: 160000,
};

function formatPercent(val) {
  if (!Number.isFinite(val)) return "–";
  return `${val.toFixed(1)}%`;
}

function ZtnaCalculatorContent() {
  const searchParams = useSearchParams();
  const investmentParam = searchParams?.get("investment");
  const currencyParam = searchParams?.get("currency");

  const [inputs, setInputs] = useState(() => {
    let base = { ...ZTNA_DEFAULTS };
    if (investmentParam) {
      const parsed = parseFloat(investmentParam);
      if (!isNaN(parsed) && parsed > 0) {
        base.implOneTime = parsed < 10000 ? parsed * 1000 : parsed;
      }
    }
    return base;
  });

  const [currency, setCurrency] = useState(() =>
    currencyParam?.toUpperCase() === "INR" ? "INR" : "USD"
  );

  const formatMoney = (val, compact = false) => {
    return formatCurrencyUtil(val, currency, compact);
  };

  const handleInputChange = (field, value) => {
    const num = parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));
  };

  const handleReset = () => {
    setInputs(ZTNA_DEFAULTS);
  };

  const handlePrint = () => {
    triggerPrint();
  };

  // Mathematical logic for Legacy VPN/MPLS vs Unified SASE Consolidation
  const results = useMemo(() => {
    const {
      remoteUsers,
      legacyVpnHardwareSpend,
      mplsSpendAnnual,
      helpdeskTicketsMonth,
      costPerTicket,
      pointToolsCount,
      pointToolAvgCost,
      saseCostPerUserMonth,
      implOneTime,
    } = inputs;

    // 1. Legacy Annual Run-Rate (TCO Before)
    const legacyPointToolsAnnual = pointToolsCount * pointToolAvgCost;
    const legacyTicketsAnnual = helpdeskTicketsMonth * 12 * costPerTicket;
    const legacyAnnualTco =
      legacyVpnHardwareSpend +
      mplsSpendAnnual +
      legacyPointToolsAnnual +
      legacyTicketsAnnual;
    const legacy3yTco = legacyAnnualTco * 3;

    // 2. SASE / ZTNA Consolidated Annual Run-Rate (TCO After)
    const saseAnnualSubscription = remoteUsers * saseCostPerUserMonth * 12;
    // 65% broadband offload reduces direct leased line spend
    const saseAnnualBandwidthDirect = mplsSpendAnnual * 0.35;
    // 75% ticket reduction with clientless ZTNA & auto-connect
    const saseAnnualTickets = legacyTicketsAnnual * 0.25;
    const saseAnnualTco =
      saseAnnualSubscription + saseAnnualBandwidthDirect + saseAnnualTickets;
    const sase3yTco = implOneTime + saseAnnualTco * 3;

    // 3. Financial Net Savings & ROI
    const cumulativeSavings3y = legacy3yTco - sase3yTco;
    const annualNetSavings = legacyAnnualTco - saseAnnualTco;
    const roi3y = sase3yTco > 0 ? (cumulativeSavings3y / sase3yTco) * 100 : 0;

    // 4. IT Hours Reclaimed
    // 45 mins per helpdesk ticket, 75% tickets eliminated
    const hoursReclaimedYear =
      (helpdeskTicketsMonth * 12 * 0.75 * 45) / 60;

    // 5. Payback period in months
    const paybackMonths =
      annualNetSavings > 0
        ? Math.round((implOneTime / (annualNetSavings / 12)) * 10) / 10
        : null;

    // 6. 5-Year Cumulative Savings Trend
    const years = [1, 2, 3, 4, 5];
    const cumulativeSavings = [];
    let cumulative = -implOneTime;
    years.forEach(() => {
      cumulative += annualNetSavings;
      cumulativeSavings.push(cumulative);
    });

    return {
      legacyPointToolsAnnual,
      legacyTicketsAnnual,
      legacyAnnualTco,
      legacy3yTco,
      saseAnnualSubscription,
      saseAnnualBandwidthDirect,
      saseAnnualTickets,
      saseAnnualTco,
      sase3yTco,
      cumulativeSavings3y,
      annualNetSavings,
      roi3y,
      hoursReclaimedYear,
      paybackMonths,
      years,
      cumulativeSavings,
    };
  }, [inputs]);

  // Handle CSV Export
  const handleExportCSV = () => {
    const sections = [
      {
        title: "Executive Summary & SASE Consolidation ROI",
        items: [
          ["Currency", currency, ""],
          ["3-Year SASE Consolidation ROI (%)", formatPercent(results.roi3y), "Cumulative net return vs SASE TCO"],
          ["3-Year Cumulative Savings", formatMoney(results.cumulativeSavings3y), "Legacy 3Y TCO minus SASE 3Y TCO"],
          ["Annual Net Run-Rate Savings", formatMoney(results.annualNetSavings), "Ongoing yearly cashflow improvement"],
          ["Payback Period", results.paybackMonths ? `${results.paybackMonths} Months` : "N/A", "Break-even on deployment"],
          ["IT Admin Hours Reclaimed", `${results.hoursReclaimedYear.toFixed(0)} hrs/yr`, "Automated ZTNA connectivity"],
        ],
      },
      {
        title: "Legacy Infrastructure Run-Rate (Before)",
        items: [
          ["Remote / Hybrid Users", inputs.remoteUsers, "Active workforce users"],
          ["Branch Locations", inputs.branchLocations, "Retail & remote offices"],
          ["Legacy VPN Hardware Spend", formatMoney(inputs.legacyVpnHardwareSpend), "Concentrator refreshes & licenses"],
          ["Dedicated MPLS Leased Lines", formatMoney(inputs.mplsSpendAnnual), "Telco circuits"],
          ["Legacy Point Tools Count", inputs.pointToolsCount, "SWG, CASB, DLP, VPN appliances"],
          ["Point Tools Annual Spend", formatMoney(results.legacyPointToolsAnnual), "Maintenance & renewals"],
          ["VPN Helpdesk Tickets / Year", inputs.helpdeskTicketsMonth * 12, "Connection & latency escalations"],
          ["Helpdesk Ticket Cost", formatMoney(results.legacyTicketsAnnual), "Direct IT support labor"],
          ["Legacy Total Annual TCO", formatMoney(results.legacyAnnualTco), "Pre-SASE operational run-rate"],
        ],
      },
      {
        title: "Unified SASE / ZTNA Architecture (After)",
        items: [
          ["SASE License Cost / User / Mo", formatMoney(inputs.saseCostPerUserMonth), "All-inclusive SSE subscription"],
          ["Unified SASE Annual Subscription", formatMoney(results.saseAnnualSubscription), "Full platform licensing"],
          ["Direct Internet Offload Bandwidth", formatMoney(results.saseAnnualBandwidthDirect), "Replaced expensive MPLS"],
          ["Resolved Helpdesk Ticket Labor", formatMoney(results.saseAnnualTickets), "75% ticket reduction"],
          ["SASE Migration & Deployment", formatMoney(inputs.implOneTime), "Zero-touch edge rollout"],
          ["SASE Total Annual TCO", formatMoney(results.saseAnnualTco), "Ongoing consolidated run-rate"],
        ],
      },
    ];

    exportSectionsToCSV("ztna-sase-roi-analysis.csv", sections);
  };

  const minCum = Math.min(...results.cumulativeSavings, -inputs.implOneTime, 0);
  const maxCum = Math.max(...results.cumulativeSavings, 1);
  const cumRange = maxCum - minCum || 1;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans antialiased transition-colors duration-200">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-3 print:hidden">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Home
            </Link>
            <LuChevronRight className="size-3.5" />
            <Link href="/calculator" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Calculators Hub
            </Link>
            <LuChevronRight className="size-3.5" />
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">ZTNA / SASE Consolidation</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 mb-2">
                <LuNetwork className="size-3.5" />
                <span>Zero Trust Network Access & SASE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                ZTNA / SASE Consolidation Calculator
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
                Compare multi-year TCO of legacy VPN appliances and expensive MPLS lines against unified cloud SASE, capturing direct bandwidth offload, point tool retirement, and IT labor reclaimed.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 print:hidden shrink-0">
              {/* Currency Toggle */}
              <div className="inline-flex items-center rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-neutral-900 p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currency === "USD"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("INR")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currency === "INR"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  INR (₹)
                </button>
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <LuRotateCcw className="size-3.5" />
                <span>Reset</span>
              </button>

              {/* CSV Export */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <LuFileSpreadsheet className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Export CSV</span>
              </button>

              {/* Print / PDF */}
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <LuPrinter className="size-3.5" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Mini Navigation Bar */}
        <CalculatorNav active="ztna" />

        {/* Executive Readout KPI Cards */}
        <section className="mb-10" aria-label="Key Performance Indicators">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LuTrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                3-Year TCO Comparison & SASE Returns
              </h2>
            </div>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Active Currency: <strong className="text-amber-600 dark:text-orange-400">{currency} ({getCurrencySymbol(currency)})</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* 3-Year SASE ROI */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">3-Year Net ROI</div>
              <div className="mt-1 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {formatPercent(results.roi3y)}
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                Consolidation return vs SASE cost
              </div>
            </div>

            {/* 3-Year Cumulative Savings */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">3-Year Net Savings</div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 truncate">
                {formatMoney(results.cumulativeSavings3y, true)}
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                Legacy TCO minus SASE TCO
              </div>
            </div>

            {/* Annual Run-Rate Savings */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Annual Net Run-Rate</div>
              <div className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-white truncate">
                {formatMoney(results.annualNetSavings, true)}/yr
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                Ongoing yearly budget reduction
              </div>
            </div>

            {/* IT Hours Reclaimed */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">IT Admin Hours Reclaimed</div>
              <div className="mt-1 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {results.hoursReclaimedYear.toFixed(0)} hrs
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                Reduced VPN & routing tickets
              </div>
            </div>
          </div>
        </section>

        {/* Main Grid: Inputs Left vs Visuals Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT: Inputs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Panel 1: Legacy Network Footprint (Before SASE) */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">1</span>
                  Current Legacy Network & Security Spend
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Remote user count, hardware VPN concentrators, and private MPLS telco lines.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Remote / Hybrid Workforce Users
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.remoteUsers}
                    onChange={(e) => handleInputChange("remoteUsers", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Employees requiring secure enterprise application access.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Distributed Branch Offices
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.branchLocations}
                    onChange={(e) => handleInputChange("branchLocations", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Branch offices & retail outlets currently backhauled.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Legacy VPN Hardware & Refresh ({getCurrencySymbol(currency)}/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.legacyVpnHardwareSpend}
                    onChange={(e) => handleInputChange("legacyVpnHardwareSpend", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">VPN concentrator appliances, client licenses, and support.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Dedicated MPLS Leased Lines ({getCurrencySymbol(currency)}/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.mplsSpendAnnual}
                    onChange={(e) => handleInputChange("mplsSpendAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Telco circuits backhauling internet traffic through HQ.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Legacy Point Security Tools Retired
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.pointToolsCount}
                    onChange={(e) => handleInputChange("pointToolsCount", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Standalone SWG, CASB, DLP, and edge firewalls.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Avg. Annual Cost / Point Tool ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.pointToolAvgCost}
                    onChange={(e) => handleInputChange("pointToolAvgCost", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">License renewal and hardware upkeep per tool.</p>
                </div>
              </div>
            </div>

            {/* Panel 2: SASE Investment & Helpdesk Optimization */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">2</span>
                  Unified SASE Solution Investment & Helpdesk
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Target SASE per-user pricing, zero-touch deployment, and support ticket reduction.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    SASE License Cost / User / Mo ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.saseCostPerUserMonth}
                    onChange={(e) => handleInputChange("saseCostPerUserMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">All-in unified SSE (ZTNA + SWG + CASB + DLP) fee.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    One-Time SASE Migration ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.implOneTime}
                    onChange={(e) => handleInputChange("implOneTime", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">SD-WAN zero-touch edge rollout and policy mapping.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Monthly VPN / Connectivity Tickets
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.helpdeskTicketsMonth}
                    onChange={(e) => handleInputChange("helpdeskTicketsMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Tickets logged for VPN dropouts, speed drops, and certs.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Cost Per Helpdesk Ticket ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.costPerTicket}
                    onChange={(e) => handleInputChange("costPerTicket", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Loaded cost to troubleshoot connectivity.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Analytics */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {/* Cumulative Net Savings Line Chart */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <LuTrendingUp className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>Cumulative SASE Net Savings ({currency})</span>
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {results.paybackMonths ? `Break-even: ${results.paybackMonths} mo` : "N/A"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Real-time cumulative net savings factoring implementation CapEx against retired point tools and MPLS lines.
              </p>

              <div className="w-full h-44 pt-2">
                <div className="relative w-full h-32 border-b border-neutral-200 dark:border-white/10">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 130">
                    {minCum < 0 && (
                      <line
                        x1="0"
                        y1={130 - (Math.abs(minCum) / cumRange) * 130}
                        x2="500"
                        y2={130 - (Math.abs(minCum) / cumRange) * 130}
                        stroke="currentColor"
                        strokeDasharray="4 4"
                        className="text-neutral-300 dark:text-white/20"
                      />
                    )}

                    {(() => {
                      const points = results.cumulativeSavings.map((val, i) => {
                        const x = (i / 4) * 460 + 20;
                        const y = 130 - ((val - minCum) / cumRange) * 105 - 12;
                        return { x, y, val };
                      });
                      const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${p.x} ${p.y}`, "");

                      return (
                        <>
                          <path d={pathD} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                          {points.map((p, idx) => (
                            <g key={idx}>
                              <circle cx={p.x} cy={p.y} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                              <text
                                x={p.x}
                                y={p.y - 8}
                                textAnchor="middle"
                                className="text-[10px] font-semibold fill-neutral-700 dark:fill-neutral-300"
                              >
                                {formatMoney(p.val, true)}
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>

                <div className="flex justify-between items-center px-1 pt-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  {results.years.map((y) => (
                    <span key={y}>Y{y}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Value Card & Aligned OEMs */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <LuSparkles className="size-3.5 text-amber-600 dark:text-amber-400" />
                Aligned CoE Lab Partner OEMs
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {["Netskope", "Forcepoint ONE", "Cloudflare", "Check Point"].map((oem) => (
                  <Link
                    key={oem}
                    href={`/portal/marketplace?oem=${encodeURIComponent(oem)}#solutions-stack`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:border-amber-500/50 transition-colors"
                  >
                    <span>{oem}</span>
                    <LuChevronRight className="size-3 text-amber-600" />
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Benchmark unified SASE latency, zero-trust micro-segmentation, and direct internet breakout policies in our physical lab.
              </p>
            </div>
          </div>
        </section>

        {/* 3-Year TCO Breakdown Table */}
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs overflow-hidden">
          <div className="border-b border-neutral-200 dark:border-white/10 pb-4 mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Detailed 3-Year SASE vs. Legacy Network TCO Accounting
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Side-by-side run-rate analysis comparing fragmented perimeter appliances against unified cloud SASE.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Architecture Component</th>
                  <th className="py-3 px-4 text-right">Legacy Annual Spend ({currency})</th>
                  <th className="py-3 px-4 text-right">Unified SASE Spend ({currency})</th>
                  <th className="py-3 px-4 text-right">3-Year Net Cumulative Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5 text-neutral-700 dark:text-neutral-300">
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">VPN Hardware & Concentrators</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(inputs.legacyVpnHardwareSpend)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">Eliminated ($0)</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(inputs.legacyVpnHardwareSpend * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">MPLS Leased Lines & Backhaul</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(inputs.mplsSpendAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(results.saseAnnualBandwidthDirect)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney((inputs.mplsSpendAnnual - results.saseAnnualBandwidthDirect) * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Disparate Point Security Tools</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(results.legacyPointToolsAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">Consolidated ($0)</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.legacyPointToolsAnnual * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">VPN Trouble Tickets & Helpdesk</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(results.legacyTicketsAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(results.saseAnnualTickets)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney((results.legacyTicketsAnnual - results.saseAnnualTickets) * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Unified SASE Platform Subscription</td>
                  <td className="py-3 px-4 text-right font-mono">—</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(results.saseAnnualSubscription)}</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(results.saseAnnualSubscription * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">One-Time SASE Migration & SD-WAN</td>
                  <td className="py-3 px-4 text-right font-mono">—</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(inputs.implOneTime)}</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(inputs.implOneTime)}</td>
                </tr>
                <tr className="border-t border-neutral-200 dark:border-white/10 bg-amber-500/5 dark:bg-amber-500/10 font-bold text-amber-900 dark:text-amber-300">
                  <td className="py-3 px-4">3-Year Cumulative TCO & Net Benefit</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(results.legacy3yTco)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(results.sase3yTco)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.cumulativeSavings3y)} ({formatPercent(results.roi3y)})</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}

export default function ZtnaCalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
          Loading ZTNA / SASE Calculator...
        </div>
      }
    >
      <ZtnaCalculatorContent />
    </Suspense>
  );
}
