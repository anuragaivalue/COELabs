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
  LuCloud,
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
  LuActivity,
  LuBoxes,
  LuClock
} from "react-icons/lu";

const CNAPP_DEFAULTS = {
  cloudVms: 850,
  k8sClusters: 24,
  dailyLogGb: 1500,
  logCostPerGb: 0.65,
  pipelineOptimizationPct: 45,
  devopsHourlyRate: 90,
  pointToolsRetired: 4,
  pointToolAvgCost: 45000,
  cnappInvestmentAnnual: 240000,
  implOneTime: 95000,
};

function formatPercent(val) {
  if (!Number.isFinite(val)) return "–";
  return `${val.toFixed(1)}%`;
}

function CnappCalculatorContent() {
  const searchParams = useSearchParams();
  const investmentParam = searchParams?.get("investment");
  const currencyParam = searchParams?.get("currency");

  const [inputs, setInputs] = useState(() => {
    let base = { ...CNAPP_DEFAULTS };
    if (investmentParam) {
      const parsed = parseFloat(investmentParam);
      if (!isNaN(parsed) && parsed > 0) {
        base.cnappInvestmentAnnual = parsed < 10000 ? parsed * 1000 : parsed;
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
    setInputs(CNAPP_DEFAULTS);
  };

  const handlePrint = () => {
    triggerPrint();
  };

  // Mathematical logic for Cloud Observability, Telemetry Pipeline Ingest Optimization & Tool Consolidation
  const results = useMemo(() => {
    const {
      cloudVms,
      k8sClusters,
      dailyLogGb,
      logCostPerGb,
      pipelineOptimizationPct,
      devopsHourlyRate,
      pointToolsRetired,
      pointToolAvgCost,
      cnappInvestmentAnnual,
      implOneTime,
    } = inputs;

    // 1. Telemetry Ingest & Cloud Indexing Optimization
    const rawAnnualLogSpend = dailyLogGb * 365 * logCostPerGb;
    const optimizedLogGbSavedPerDay = dailyLogGb * (pipelineOptimizationPct / 100);
    const annualIngestSavings =
      optimizedLogGbSavedPerDay * 365 * logCostPerGb;

    // 2. DevOps & Cloud SecOps Incident Investigation Hours Saved
    // Unified context eliminates alert context switching: 15 hrs/mo per K8s cluster + 0.4 hrs/mo per VM
    const devopsHoursSavedYear = (k8sClusters * 15 + cloudVms * 0.4) * 12;
    const annualDevopsSavings = devopsHoursSavedYear * devopsHourlyRate;

    // 3. Point Tool Retirement & Consolidation Net
    const annualToolConsolidationSavings = pointToolsRetired * pointToolAvgCost;

    // 4. Total Recurring Annual Benefits
    const annualBenefits =
      annualIngestSavings + annualDevopsSavings + annualToolConsolidationSavings;

    // 5. 3-Year Model & CNAPP ROI
    const totalBenefits3y = annualBenefits * 3;
    const totalInvestment3y = implOneTime + cnappInvestmentAnnual * 3;
    const net3y = totalBenefits3y - totalInvestment3y;
    const roi3y = totalInvestment3y > 0 ? (net3y / totalInvestment3y) * 100 : 0;

    // 6. Payback period in months
    const paybackMonths =
      annualBenefits > 0
        ? Math.round((implOneTime / (annualBenefits / 12)) * 10) / 10
        : null;

    // 7. 5-Year Cumulative Savings
    const years = [1, 2, 3, 4, 5];
    const cumulativeSavings = [];
    let cumulative = -implOneTime;
    years.forEach(() => {
      cumulative += annualBenefits - cnappInvestmentAnnual;
      cumulativeSavings.push(cumulative);
    });

    return {
      rawAnnualLogSpend,
      optimizedLogGbSavedPerDay,
      annualIngestSavings,
      devopsHoursSavedYear,
      annualDevopsSavings,
      annualToolConsolidationSavings,
      annualBenefits,
      totalBenefits3y,
      totalInvestment3y,
      net3y,
      roi3y,
      paybackMonths,
      years,
      cumulativeSavings,
    };
  }, [inputs]);

  // Handle CSV Export
  const handleExportCSV = () => {
    const sections = [
      {
        title: "Executive Summary & CNAPP ROI Projections",
        items: [
          ["Currency", currency, ""],
          ["3-Year Net CNAPP ROI (%)", formatPercent(results.roi3y), "Consolidated return vs platform investment"],
          ["Net 3-Year Value", formatMoney(results.net3y), "Cumulative telemetry savings + labor + tools"],
          ["Capital Payback Period", results.paybackMonths ? `${results.paybackMonths} Months` : "N/A", "Break-even on onboarding"],
          ["Annual Telemetry Ingest Savings", formatMoney(results.annualIngestSavings), "Cloud log filtering & indexing reduction"],
          ["DevOps Incident Hours Reclaimed", `${results.devopsHoursSavedYear.toFixed(0)} hrs/yr`, "Root-cause acceleration"],
          ["Point Tool Consolidation Net", formatMoney(results.annualToolConsolidationSavings), "Retired CSPM, CWPP, CIEM silos"],
        ],
      },
      {
        title: "Cloud Workload & Telemetry Scale",
        items: [
          ["Cloud Virtual Machines / Compute", inputs.cloudVms, "AWS EC2, Azure VMs, GCP Compute Engine"],
          ["Production Kubernetes Clusters", inputs.k8sClusters, "EKS, AKS, GKE clusters governed"],
          ["Daily Telemetry Log Volume", `${inputs.dailyLogGb.toLocaleString()} GB/day`, "Raw ingest before pipeline optimization"],
          ["Log Ingest & Storage Cost / GB", formatMoney(inputs.logCostPerGb), "Cloud observability index rate"],
          ["Raw Annual Log Ingest Spend", formatMoney(results.rawAnnualLogSpend), "Pre-optimization telemetry cost"],
          ["Pipeline Optimization Rate", `${inputs.pipelineOptimizationPct}%`, "Edge filtering and deduplication"],
        ],
      },
      {
        title: "CNAPP & Observability Investment",
        items: [
          ["Annual CNAPP Subscription", formatMoney(inputs.cnappInvestmentAnnual), "All-in observability & posture fee"],
          ["One-Time Onboarding & Deployment", formatMoney(inputs.implOneTime), "Cloud pipeline setup and rule tuning"],
          ["Total 3-Year Investment", formatMoney(results.totalInvestment3y), "CapEx + OpEx across horizon"],
        ],
      },
    ];

    exportSectionsToCSV("cnapp-observability-roi-analysis.csv", sections);
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
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">CNAPP & Cloud Observability</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 mb-2">
                <LuCloud className="size-3.5" />
                <span>Cloud-Native Application Protection & Observability</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                CNAPP & Observability Calculator
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
                Model telemetry ingest reduction, Kubernetes cluster incident investigation acceleration, and point tool consolidation savings from deploying unified CNAPP & Observability.
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
        <CalculatorNav active="cnapp" />

        {/* Executive Readout KPI Cards */}
        <section className="mb-10" aria-label="Key Performance Indicators">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LuTrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Cloud Ingest & Observability ROI Readout
              </h2>
            </div>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Active Currency: <strong className="text-amber-600 dark:text-orange-400">{currency} ({getCurrencySymbol(currency)})</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* 3-Year Net ROI */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">3-Year Net ROI</div>
              <div className="mt-1 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {formatPercent(results.roi3y)}
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                Returns vs CNAPP CapEx & OpEx
              </div>
            </div>

            {/* Ingest Savings */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 p-4 shadow-xs">
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Annual Ingest Savings</div>
              <div className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-300 truncate">
                {formatMoney(results.annualIngestSavings, true)}/yr
              </div>
              <div className="mt-0.5 text-[10px] text-emerald-700/80 dark:text-emerald-400">
                {inputs.pipelineOptimizationPct}% log reduction
              </div>
            </div>

            {/* Net 3-Year Value */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Net 3-Year Value</div>
              <div className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-white truncate">
                {formatMoney(results.net3y, true)}
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                Cumulative economic benefit
              </div>
            </div>

            {/* DevOps Hours Saved */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">DevOps Hours Saved</div>
              <div className="mt-1 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {results.devopsHoursSavedYear.toFixed(0)} hrs
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                Investigation & root-cause time
              </div>
            </div>
          </div>
        </section>

        {/* Main Grid: Inputs Left vs Visuals Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT: Configuration Panels */}
          <div className="lg:col-span-7 space-y-6">
            {/* Panel 1: Cloud Scale & Telemetry Ingest */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">1</span>
                  Cloud Footprint & Telemetry Ingest Scale
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Compute instances, Kubernetes cluster fleet, and raw uncompressed daily log generation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Cloud Compute VMs / Instances
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.cloudVms}
                    onChange={(e) => handleInputChange("cloudVms", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">AWS EC2, Azure VMs, and Google Compute instances.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Production Kubernetes Clusters
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.k8sClusters}
                    onChange={(e) => handleInputChange("k8sClusters", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Managed EKS, GKE, AKS, and OpenShift clusters.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Daily Telemetry / Log Volume (GB/day)
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={inputs.dailyLogGb}
                    onChange={(e) => handleInputChange("dailyLogGb", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Unfiltered application logs, APM traces, and VPC flows.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Log Ingest Cost / GB ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    value={inputs.logCostPerGb}
                    onChange={(e) => handleInputChange("logCostPerGb", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Observability indexing rate (typically $0.50 - $1.20/GB).</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Pipeline Ingest Optimization (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={inputs.pipelineOptimizationPct}
                    onChange={(e) => handleInputChange("pipelineOptimizationPct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Telemetry filtered and transformed at the edge.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    DevOps Hourly Rate ({getCurrencySymbol(currency)}/hr)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.devopsHourlyRate}
                    onChange={(e) => handleInputChange("devopsHourlyRate", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Loaded hourly rate for SRE and cloud security staff.</p>
                </div>
              </div>
            </div>

            {/* Panel 2: Tool Consolidation & CNAPP Investment */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">2</span>
                  Point Tool Consolidation & Solution Investment
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Retiring separate CSPM, CWPP, and CIEM tools into a unified CNAPP platform.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Legacy Cloud Point Tools Retired
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.pointToolsRetired}
                    onChange={(e) => handleInputChange("pointToolsRetired", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Standalone posture scanners, image analyzers, and agents.</p>
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
                  <p className="mt-1 text-[11px] text-neutral-400">Annual license and support fees per retired silo.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual CNAPP Subscription ({getCurrencySymbol(currency)}/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.cnappInvestmentAnnual}
                    onChange={(e) => handleInputChange("cnappInvestmentAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Unified CNAPP, CSPM, and observability subscription.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    One-Time Onboarding & Integration ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.implOneTime}
                    onChange={(e) => handleInputChange("implOneTime", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Cloud account connection, pipeline rules, SRE enablement.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Analytics */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {/* Cumulative Net Trend Chart */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <LuTrendingUp className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>Cumulative CNAPP Value ({currency})</span>
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {results.paybackMonths ? `Break-even: ${results.paybackMonths} mo` : "N/A"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Multi-year economic cashflow balancing unified platform subscription against telemetry ingest and labor savings.
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
                {["Datadog", "Check Point CloudGuard", "Cloudera", "Confluent"].map((oem) => (
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
                Benchmark real-time telemetry streaming pipelines, Kubernetes agent footprint, and automated cloud remediation in the iValue lab.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown Table */}
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs overflow-hidden">
          <div className="border-b border-neutral-200 dark:border-white/10 pb-4 mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Detailed CNAPP & Telemetry Pipeline Financial Breakdown
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Annualized and 3-year multi-cloud economic comparison.
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
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Raw Annual Telemetry Log Ingest Spend</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(results.rawAnnualLogSpend)}</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(results.rawAnnualLogSpend * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Telemetry Pipeline Ingest Savings</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualIngestSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualIngestSavings * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">DevOps Incident Investigation Hours Saved</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualDevopsSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualDevopsSavings * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Retired Cloud Point Security Tools</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualToolConsolidationSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualToolConsolidationSavings * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Annual CNAPP & Observability Subscription</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(inputs.cnappInvestmentAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(inputs.cnappInvestmentAnnual * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">One-Time Onboarding & Integration</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(inputs.implOneTime)}</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(inputs.implOneTime)}</td>
                </tr>
                <tr className="border-t border-neutral-200 dark:border-white/10 bg-amber-500/5 dark:bg-amber-500/10 font-bold text-amber-900 dark:text-amber-300">
                  <td className="py-3 px-4">Net Economic Value / ROI</td>
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

export default function CnappCalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
          Loading CNAPP & Observability Calculator...
        </div>
      }
    >
      <CnappCalculatorContent />
    </Suspense>
  );
}
