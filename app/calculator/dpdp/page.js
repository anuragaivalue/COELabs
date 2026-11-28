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
  LuDatabase,
  LuShieldAlert,
  LuRotateCcw,
  LuPrinter,
  LuChevronRight,
  LuTrendingUp,
  LuFileSpreadsheet,
  LuSparkles,
  LuInfo,
  LuCheckCircle2,
  LuAlertTriangle,
  LuSlidersHorizontal,
  LuLayers,
  LuDollarSign,
  LuLock,
  LuScale
} from "react-icons/lu";

const DPDP_DEFAULTS = {
  verticalSector: "BFSI",
  sensitiveRecordsVolume: 5000000,
  dataStoresCount: 120,
  shadowDataPct: 35,
  dlpCoveragePct: 40,
  targetDspmCoveragePct: 90,
  auditHoursYear: 600,
  complianceHourlyRate: 95,
  dspmInvestmentAnnual: 180000,
  implOneTime: 120000,
};

const VERTICAL_SECTORS = [
  "BFSI",
  "Healthcare & Pharma",
  "Fintech & Payments",
  "eCommerce & Retail",
  "Telecom & SaaS",
  "Government & PSU",
];

function formatPercent(val) {
  if (!Number.isFinite(val)) return "–";
  return `${val.toFixed(1)}%`;
}

function DpdpCalculatorContent() {
  const searchParams = useSearchParams();
  const investmentParam = searchParams?.get("investment");
  const currencyParam = searchParams?.get("currency");

  const [inputs, setInputs] = useState(() => {
    let base = { ...DPDP_DEFAULTS };
    if (investmentParam) {
      const parsed = parseFloat(investmentParam);
      if (!isNaN(parsed) && parsed > 0) {
        base.dspmInvestmentAnnual = parsed < 10000 ? parsed * 1000 : parsed;
      }
    }
    return base;
  });

  const [currency, setCurrency] = useState(() => {
    if (currencyParam) return currencyParam.toUpperCase() === "USD" ? "USD" : "INR";
    return "INR"; // Default INR for DPDP India law
  });

  const formatMoney = (val, compact = false) => {
    return formatCurrencyUtil(val, currency, compact);
  };

  const handleInputChange = (field, value) => {
    if (field === "verticalSector") {
      setInputs((prev) => ({ ...prev, verticalSector: value }));
      return;
    }
    const num = parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));
  };

  const handleReset = () => {
    setInputs(DPDP_DEFAULTS);
  };

  const handlePrint = () => {
    triggerPrint();
  };

  // Mathematical logic aligned with DPDP Act 2023 statutory penalties
  const results = useMemo(() => {
    const {
      sensitiveRecordsVolume,
      dataStoresCount,
      shadowDataPct,
      dlpCoveragePct,
      targetDspmCoveragePct,
      auditHoursYear,
      complianceHourlyRate,
      dspmInvestmentAnnual,
      implOneTime,
    } = inputs;

    // Unprotected data surface index
    const shadowStoresCount = dataStoresCount * (shadowDataPct / 100);
    const unprotectedRecords =
      sensitiveRecordsVolume * (1 - dlpCoveragePct / 100) * (1 + shadowDataPct / 100);

    // Statutory fine exposure under DPDP Act 2023 Schedule (Section 33)
    // Capped at exactly ₹250 Crore per instance (approx $29.41M USD)
    const MAX_STATUTORY_FINE_INR = 2500000000; // ₹250 Crore
    const rawPenaltyINR = Math.round(unprotectedRecords * 50 + 250000000);
    const statutoryExposureINR = Math.min(MAX_STATUTORY_FINE_INR, rawPenaltyINR);
    const statutoryExposureUSD = statutoryExposureINR / 85;

    // Active exposure depending on selected currency display
    const activeStatutoryExposure =
      currency === "INR" ? statutoryExposureINR : statutoryExposureUSD;

    // Breach risk avoidance value (4% annual statutory enforcement probability)
    const coverageGain = Math.max(0, (targetDspmCoveragePct - dlpCoveragePct) / 100);
    const annualBreachRiskAvoidance = statutoryExposureUSD * 0.04 * coverageGain;

    // Manual audit and compliance reporting labor savings (70% automation)
    const auditHoursSaved = auditHoursYear * 0.7 * (targetDspmCoveragePct / 100);
    const annualAuditSavings = auditHoursSaved * complianceHourlyRate;

    // Shadow data pruning and redundant cloud storage elimination
    const shadowStoresPruned = shadowStoresCount * 0.75;
    const annualStorageSavings = shadowStoresPruned * 1400; // $1,400/store eliminated cloud compute & storage

    // Total recurring annual benefits
    const annualBenefits =
      annualBreachRiskAvoidance + annualAuditSavings + annualStorageSavings;

    // 3-Year Model
    const totalBenefits3y = annualBenefits * 3;
    const totalInvestment3y = implOneTime + dspmInvestmentAnnual * 3;
    const net3y = totalBenefits3y - totalInvestment3y;
    const roi3y = totalInvestment3y > 0 ? (net3y / totalInvestment3y) * 100 : 0;

    // Payback in months on upfront implementation
    const paybackMonths =
      annualBenefits > 0 ? Math.round((implOneTime / (annualBenefits / 12)) * 10) / 10 : null;

    // 5-Year cumulative trend
    const years = [1, 2, 3, 4, 5];
    const cumulativeSavings = [];
    let cumulative = -implOneTime;
    years.forEach(() => {
      cumulative += annualBenefits - dspmInvestmentAnnual;
      cumulativeSavings.push(cumulative);
    });

    return {
      shadowStoresCount,
      unprotectedRecords,
      statutoryExposureINR,
      statutoryExposureUSD,
      activeStatutoryExposure,
      coverageGain,
      annualBreachRiskAvoidance,
      auditHoursSaved,
      annualAuditSavings,
      annualStorageSavings,
      annualBenefits,
      totalBenefits3y,
      totalInvestment3y,
      net3y,
      roi3y,
      paybackMonths,
      years,
      cumulativeSavings,
    };
  }, [inputs, currency]);

  // Handle CSV Export
  const handleExportCSV = () => {
    const sections = [
      {
        title: "Executive Summary & DPDP 2023 Compliance ROI",
        items: [
          ["Currency", currency, ""],
          ["Vertical Sector", inputs.verticalSector, ""],
          ["3-Year Net ROI (%)", formatPercent(results.roi3y), "Net return vs DSPM investment"],
          ["Net 3-Year Value", formatMoney(results.net3y), "Cumulative economic gain"],
          ["Capital Payback Period", results.paybackMonths ? `${results.paybackMonths} Months` : "N/A", "Break-even on CapEx"],
          ["Statutory Penalty Cap Exposure", formatMoney(results.statutoryExposureUSD), "Capped at ₹250 Crore under DPDP Act 2023"],
          ["Annual Risk & Efficiency Benefits", formatMoney(results.annualBenefits), "Avoidance + audit labor + storage"],
        ],
      },
      {
        title: "Sensitive Data Footprint & Shadow Stores",
        items: [
          ["Sensitive Records Volume", inputs.sensitiveRecordsVolume.toLocaleString(), "Identified personal data records"],
          ["Known Enterprise Data Stores", inputs.dataStoresCount, "Databases, data lakes & file shares"],
          ["Estimated Shadow Data %", `${inputs.shadowDataPct}%`, "Unmanaged / unclassified data stores"],
          ["Shadow Data Stores Discovered", results.shadowStoresCount.toFixed(0), "Hidden data stores mapped by DSPM"],
          ["Baseline DLP Coverage", `${inputs.dlpCoveragePct}%`, "Existing security coverage"],
          ["Target DSPM Autonomous Coverage", `${inputs.targetDspmCoveragePct}%`, "Full posture management coverage"],
        ],
      },
      {
        title: "DSPM Investment & Operational Economics",
        items: [
          ["Annual DSPM Subscription", formatMoney(inputs.dspmInvestmentAnnual), "Software & continuous discovery"],
          ["One-Time Implementation", formatMoney(inputs.implOneTime), "Initial classification & rule tuning"],
          ["Annual Audit Hours Saved", `${results.auditHoursSaved.toFixed(0)} hrs/yr`, "Automated Data Principal mapping"],
          ["Audit Labor Reclaimed", formatMoney(results.annualAuditSavings), "Direct compliance team savings"],
          ["Shadow Storage Optimization", formatMoney(results.annualStorageSavings), "Decommissioned duplicate stores"],
          ["Avoided Statutory Breach Risk", formatMoney(results.annualBreachRiskAvoidance), "Probability-weighted fine avoidance"],
        ],
      },
    ];

    exportSectionsToCSV("dpdp-dspm-roi-analysis.csv", sections);
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
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">DPDP Act & DSPM Calculator</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 mb-2">
                <LuDatabase className="size-3.5" />
                <span>Data Security Posture Management (DSPM)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                DPDP Act & DSPM Calculator
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
                Model statutory non-compliance exposure under the Digital Personal Data Protection (DPDP) Act 2023 (capped at ₹250 Crore), shadow data eradication, and automated audit ROI.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 print:hidden shrink-0">
              {/* Currency Toggle */}
              <div className="inline-flex items-center rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-neutral-900 p-1 shadow-2xs">
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
              </div>

              {/* Reset Defaults */}
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
        <CalculatorNav active="dpdp" />

        {/* DPDP Act 2023 Statutory Regulatory Box */}
        <div className="mb-8 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/10 text-xs text-neutral-800 dark:text-neutral-200 flex items-start gap-3">
          <LuScale className="size-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-950 dark:text-amber-300">
              DPDP Act 2023 Statutory Benchmark:
            </span>
            <p className="leading-relaxed">
              Under Section 33 & the Schedule to the Digital Personal Data Protection Act 2023, failure to take reasonable security safeguards to prevent personal data breaches carries statutory financial penalties up to <strong>₹250 Crore per violation</strong>. This calculator models your exposure based on unmanaged shadow data, baseline DLP gaps, and automated DSPM posture protection.
            </p>
          </div>
        </div>

        {/* Executive Readout KPI Cards */}
        <section className="mb-10" aria-label="Key Performance Indicators">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LuTrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                DPDP Risk Mitigation & Economic Returns
              </h2>
            </div>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Sector: <strong className="text-amber-700 dark:text-amber-400">{inputs.verticalSector}</strong> • Currency: <strong className="text-amber-600 dark:text-orange-400">{currency} ({getCurrencySymbol(currency)})</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* 3-Year ROI */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">3-Year Net ROI</div>
              <div className="mt-1 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {formatPercent(results.roi3y)}
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                Returns vs DSPM CapEx & OpEx
              </div>
            </div>

            {/* Statutory Exposure Capped at ₹250 Cr */}
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 dark:bg-rose-500/15 p-4 shadow-xs">
              <div className="text-xs font-bold text-rose-800 dark:text-rose-300">Statutory Exposure Cap</div>
              <div className="mt-1 text-2xl font-black text-rose-700 dark:text-rose-300 truncate">
                {formatMoney(results.statutoryExposureUSD, true)}
              </div>
              <div className="mt-0.5 text-[10px] text-rose-700/80 dark:text-rose-400">
                Statutory cap: ₹250 Crore
              </div>
            </div>

            {/* Net 3-Year Value */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Net 3-Year Value</div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 truncate">
                {formatMoney(results.net3y, true)}
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                Avoided fines & labor savings
              </div>
            </div>

            {/* Payback Period */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Payback Period</div>
              <div className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-white">
                {results.paybackMonths ? `${results.paybackMonths} mo` : "N/A"}
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                Break-even on deployment
              </div>
            </div>
          </div>
        </section>

        {/* Main Grid: Inputs Left vs Visuals Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT: Inputs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Panel 1: Data Footprint & Shadow Stores */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">1</span>
                  Sensitive Records Footprint & Shadow Stores
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Personal data volume, repository counts, and uncatalogued shadow data risk.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={inputs.verticalSector}
                    onChange={(e) => handleInputChange("verticalSector", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  >
                    {VERTICAL_SECTORS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Sensitive Personal Records
                  </label>
                  <input
                    type="number"
                    min="1000"
                    value={inputs.sensitiveRecordsVolume}
                    onChange={(e) => handleInputChange("sensitiveRecordsVolume", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Customer PII, health, biometric, financial records.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Known Enterprise Data Stores
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.dataStoresCount}
                    onChange={(e) => handleInputChange("dataStoresCount", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">RDBMS, S3 buckets, Snowflake, MongoDB, file shares.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Estimated Shadow Data (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.shadowDataPct}
                    onChange={(e) => handleInputChange("shadowDataPct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Unmanaged backups, dev copies, orphaned analytics buckets.</p>
                </div>
              </div>
            </div>

            {/* Panel 2: Security Posture Coverage & Audit Labor */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">2</span>
                  Security Coverage & Compliance Audit Labor
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Current endpoint/cloud DLP protection compared against target autonomous DSPM classification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Current DLP Coverage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.dlpCoveragePct}
                    onChange={(e) => handleInputChange("dlpCoveragePct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Existing rule-based network & endpoint DLP.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Target DSPM Coverage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.targetDspmCoveragePct}
                    onChange={(e) => handleInputChange("targetDspmCoveragePct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Autonomous AI data classification & lineage discovery.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Audit Prep Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.auditHoursYear}
                    onChange={(e) => handleInputChange("auditHoursYear", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Staff hours compiling data inventory for statutory auditors.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Compliance Hourly Rate ({getCurrencySymbol(currency)}/hr)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.complianceHourlyRate}
                    onChange={(e) => handleInputChange("complianceHourlyRate", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Loaded hourly rate for DPO and privacy engineers.</p>
                </div>
              </div>
            </div>

            {/* Panel 3: DSPM Investment */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">3</span>
                  DSPM Solution Investment
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Continuous data discovery, classification scanners, and automated privacy orchestration.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual DSPM Subscription ({getCurrencySymbol(currency)}/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.dspmInvestmentAnnual}
                    onChange={(e) => handleInputChange("dspmInvestmentAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Continuous cloud & on-prem data scanner licenses.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Implementation Cost ({getCurrencySymbol(currency)}, One-time)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.implOneTime}
                    onChange={(e) => handleInputChange("implOneTime", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Classifier fine-tuning and compliance pipeline integration.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Analytics */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {/* Cumulative Cashflow Trend */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <LuTrendingUp className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>Cumulative Net Value ({currency})</span>
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {results.paybackMonths ? `Break-even: ${results.paybackMonths} mo` : "N/A"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Cumulative return from avoided statutory fines and automated privacy audit operations.
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
                {["Forcepoint", "Imperva", "Netskope"].map((oem) => (
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
                Test unified DSPM autonomous discovery across databases and S3 buckets with pre-configured Data Principal rights mapping templates.
              </p>
            </div>
          </div>
        </section>

        {/* Breakdown Table */}
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs overflow-hidden">
          <div className="border-b border-neutral-200 dark:border-white/10 pb-4 mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Detailed DPDP & DSPM Financial Accounting Breakdown
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Statutory risk mitigation, audit labor reclaimed, and cloud storage cost avoidance.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Financial Driver</th>
                  <th className="py-3 px-4 text-right">Annual Impact ({currency})</th>
                  <th className="py-3 px-4 text-right">3-Year Cumulative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5 text-neutral-700 dark:text-neutral-300">
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Statutory Exposure Cap (DPDP Act 2023)</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(results.statutoryExposureUSD)}</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(results.statutoryExposureUSD)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Avoided Annual Breach Risk Value</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualBreachRiskAvoidance)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualBreachRiskAvoidance * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Automated Privacy Audit Labor Savings</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualAuditSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualAuditSavings * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Shadow Data Cloud Storage Pruning</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualStorageSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualStorageSavings * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Annual DSPM Platform Subscription</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(inputs.dspmInvestmentAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(inputs.dspmInvestmentAnnual * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">One-Time Implementation & Discovery Setup</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(inputs.implOneTime)}</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(inputs.implOneTime)}</td>
                </tr>
                <tr className="border-t border-neutral-200 dark:border-white/10 bg-amber-500/5 dark:bg-amber-500/10 font-bold text-amber-900 dark:text-amber-300">
                  <td className="py-3 px-4">Net Economic Benefit / ROI</td>
                  <td className="py-3 px-4 text-right font-mono">+{formatMoney(results.annualBenefits)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.net3y)} ({formatPercent(results.roi3y)})</td>
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

export default function DpdpCalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
          Loading DPDP & DSPM Calculator...
        </div>
      }
    >
      <DpdpCalculatorContent />
    </Suspense>
  );
}
