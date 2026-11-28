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
  LuServer,
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
  LuClock,
  LuDollarSign,
  LuLayers
} from "react-icons/lu";

const RESILIENCE_DEFAULTS = {
  annualRevenue: 250000000,
  employeeCount: 4500,
  blendedHourlySalary: 48,
  baselineRtoHours: 72,
  targetRtoHours: 4,
  outageLikelihoodPct: 25,
  resilienceInvestmentAnnual: 220000,
  implOneTime: 150000,
};

function formatPercent(val) {
  if (!Number.isFinite(val)) return "–";
  return `${val.toFixed(1)}%`;
}

function ResilienceCalculatorContent() {
  const searchParams = useSearchParams();
  const investmentParam = searchParams?.get("investment");
  const currencyParam = searchParams?.get("currency");

  const [inputs, setInputs] = useState(() => {
    let base = { ...RESILIENCE_DEFAULTS };
    if (investmentParam) {
      const parsed = parseFloat(investmentParam);
      if (!isNaN(parsed) && parsed > 0) {
        base.resilienceInvestmentAnnual = parsed < 10000 ? parsed * 1000 : parsed;
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
    setInputs(RESILIENCE_DEFAULTS);
  };

  const handlePrint = () => {
    triggerPrint();
  };

  // Mathematical logic for Cyber Resilience, Downtime & Ransomware Extortion Avoidance
  const results = useMemo(() => {
    const {
      annualRevenue,
      employeeCount,
      blendedHourlySalary,
      baselineRtoHours,
      targetRtoHours,
      outageLikelihoodPct,
      resilienceInvestmentAnnual,
      implOneTime,
    } = inputs;

    // 1. Hourly Downtime Cost: Revenue Loss/hr + Idle Labor Loss/hr
    // Assumes 250 business days * 8 hours = 2,000 production hours per year
    const revenuePerHour = annualRevenue / 2000;
    const laborLossPerHour = employeeCount * blendedHourlySalary * 0.7; // 70% workforce productivity disruption
    const hourlyDowntimeCost = revenuePerHour + laborLossPerHour;

    // 2. Recovery Time Objective (RTO) acceleration with immutable storage
    const rtoHoursSaved = Math.max(0, baselineRtoHours - targetRtoHours);

    // 3. Incident Avoidance & Downtime Loss Avoided Per Incident
    const downtimeLossAvoidedPerIncident = rtoHoursSaved * hourlyDowntimeCost;
    const annualDowntimeSavings =
      downtimeLossAvoidedPerIncident * (outageLikelihoodPct / 100);

    // 4. Secondary Forensics & Extortion Avoidance
    // Immutable WORM storage negates ransom leverage and speeds forensic triage
    const secondaryForensicsSavings = 250000 * (outageLikelihoodPct / 100);

    // 5. Total Recurring Annual Benefits
    const annualBenefits = annualDowntimeSavings + secondaryForensicsSavings;

    // 6. 3-Year Model & Resilience ROI
    const totalBenefits3y = annualBenefits * 3;
    const totalInvestment3y = implOneTime + resilienceInvestmentAnnual * 3;
    const net3y = totalBenefits3y - totalInvestment3y;
    const roi3y = totalInvestment3y > 0 ? (net3y / totalInvestment3y) * 100 : 0;

    // 7. Payback period in months
    const paybackMonths =
      annualBenefits > 0 ? Math.round((implOneTime / (annualBenefits / 12)) * 10) / 10 : null;

    // 8. 5-Year Cumulative Savings
    const years = [1, 2, 3, 4, 5];
    const cumulativeSavings = [];
    let cumulative = -implOneTime;
    years.forEach(() => {
      cumulative += annualBenefits - resilienceInvestmentAnnual;
      cumulativeSavings.push(cumulative);
    });

    return {
      revenuePerHour,
      laborLossPerHour,
      hourlyDowntimeCost,
      rtoHoursSaved,
      downtimeLossAvoidedPerIncident,
      annualDowntimeSavings,
      secondaryForensicsSavings,
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
        title: "Executive Readout & Cyber Resilience ROI",
        items: [
          ["Currency", currency, ""],
          ["3-Year Resilience ROI (%)", formatPercent(results.roi3y), "Net return vs resilience CapEx & OpEx"],
          ["Net 3-Year Value", formatMoney(results.net3y), "Avoided downtime & recovery costs"],
          ["Capital Payback Period", results.paybackMonths ? `${results.paybackMonths} Months` : "N/A", "Break-even on implementation"],
          ["Hourly Enterprise Downtime Cost", formatMoney(results.hourlyDowntimeCost), "Revenue loss + idle labor"],
          ["Annualized Downtime Loss Avoided", formatMoney(results.annualDowntimeSavings), "Probability-weighted outage avoidance"],
          ["Secondary Forensics Avoidance", formatMoney(results.secondaryForensicsSavings), "Accelerated evidence & no ransom payout"],
        ],
      },
      {
        title: "Operational Downtime & Recovery Metrics",
        items: [
          ["Annual Enterprise Revenue", formatMoney(inputs.annualRevenue), "Corporate turnover"],
          ["Workforce Headcount", inputs.employeeCount, "Employees impacted during outages"],
          ["Blended Hourly Salary", formatMoney(inputs.blendedHourlySalary), "Loaded labor rate"],
          ["Baseline RTO (Hours)", `${inputs.baselineRtoHours} hrs`, "Traditional tape / unverified snapshots"],
          ["Target Immutable RTO (Hours)", `${inputs.targetRtoHours} hrs`, "Hitachi / immutable object store recovery"],
          ["Recovery Hours Reclaimed", `${results.rtoHoursSaved} hrs`, "Reduced business disruption"],
          ["Annual Outage Likelihood", `${inputs.outageLikelihoodPct}%`, "Actuarial ransomware likelihood"],
        ],
      },
      {
        title: "Resilience Solution Investment",
        items: [
          ["Annual Resilience Subscription", formatMoney(inputs.resilienceInvestmentAnnual), "Immutable storage & replication"],
          ["One-Time Implementation", formatMoney(inputs.implOneTime), "Disaster recovery automation & simulation"],
          ["Total 3-Year Investment", formatMoney(results.totalInvestment3y), "CapEx + OpEx across horizon"],
        ],
      },
    ];

    exportSectionsToCSV("cyber-resilience-roi-analysis.csv", sections);
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
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">Cyber Resilience & Ransomware</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 mb-2">
                <LuServer className="size-3.5" />
                <span>Business Continuity & Immutable Storage</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Cyber Resilience & Ransomware Calculator
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
                Quantify hourly downtime costs, secondary forensics savings, and the financial ROI of accelerating Recovery Time Objectives (RTO) from days to hours using immutable storage.
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
        <CalculatorNav active="resilience" />

        {/* Executive Readout KPI Cards */}
        <section className="mb-10" aria-label="Key Performance Indicators">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LuTrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Resilience ROI & Downtime Avoidance Projections
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
                Returns vs resilience investment
              </div>
            </div>

            {/* Hourly Downtime Cost */}
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 dark:bg-rose-500/15 p-4 shadow-xs">
              <div className="text-xs font-bold text-rose-800 dark:text-rose-300">Hourly Downtime Cost</div>
              <div className="mt-1 text-2xl font-black text-rose-700 dark:text-rose-300 truncate">
                {formatMoney(results.hourlyDowntimeCost, true)}/hr
              </div>
              <div className="mt-0.5 text-[10px] text-rose-700/80 dark:text-rose-400">
                Revenue loss + idle labor
              </div>
            </div>

            {/* Net 3-Year Value */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Net 3-Year Value</div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 truncate">
                {formatMoney(results.net3y, true)}
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                Cumulative business savings
              </div>
            </div>

            {/* RTO Hours Saved */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">RTO Hours Saved</div>
              <div className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-white">
                {results.rtoHoursSaved} hrs
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                {inputs.baselineRtoHours}h baseline down to {inputs.targetRtoHours}h
              </div>
            </div>
          </div>
        </section>

        {/* Main Grid: Inputs Left vs Visuals Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT: Configuration Panels */}
          <div className="lg:col-span-7 space-y-6">
            {/* Panel 1: Business Scale & Labor Cost */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">1</span>
                  Enterprise Scale & Downtime Impact
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Parameters used to calculate the financial burn-rate of unplanned IT operational downtime.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Enterprise Revenue ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="1000000"
                    value={inputs.annualRevenue}
                    onChange={(e) => handleInputChange("annualRevenue", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Total top-line corporate turnover.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Total Enterprise Employees
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.employeeCount}
                    onChange={(e) => handleInputChange("employeeCount", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Staff disrupted during ransomware paralysis.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Blended Hourly Salary ({getCurrencySymbol(currency)}/hr)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.blendedHourlySalary}
                    onChange={(e) => handleInputChange("blendedHourlySalary", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Loaded hourly cost per corporate employee.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Outage Likelihood (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={inputs.outageLikelihoodPct}
                    onChange={(e) => handleInputChange("outageLikelihoodPct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Actuarial probability of major incident per year.</p>
                </div>
              </div>
            </div>

            {/* Panel 2: Recovery Time Objectives (RTO) */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">2</span>
                  Recovery Time Objectives (RTO Comparison)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Hours required to reconstitute production databases and VMs following corruption.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Baseline RTO (Hours Without Immutable Storage)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.baselineRtoHours}
                    onChange={(e) => handleInputChange("baselineRtoHours", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Traditional backup restore time (e.g., 72 hours / 3 days).</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Target RTO (Hours With Immutable Storage)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.targetRtoHours}
                    onChange={(e) => handleInputChange("targetRtoHours", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Automated immutable snapshot instant mounting.</p>
                </div>
              </div>

              {/* Dynamic Live Callout */}
              <div className="mt-4 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <LuClock className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Compressing downtime by <strong>{results.rtoHoursSaved} hours</strong> avoids <strong>{formatMoney(results.downtimeLossAvoidedPerIncident)}</strong> in direct operational disruption per outage.
                  </span>
                </div>
              </div>
            </div>

            {/* Panel 3: Resilience Solution Investment */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">3</span>
                  Resilience & Immutable Storage Investment
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Object storage licensing, air-gapped vaulting, replication, and disaster drills.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Resilience Subscription ({getCurrencySymbol(currency)}/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.resilienceInvestmentAnnual}
                    onChange={(e) => handleInputChange("resilienceInvestmentAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Object lock, immutable storage & replication fees.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Implementation & DR Simulation ({getCurrencySymbol(currency)}, One-time)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.implOneTime}
                    onChange={(e) => handleInputChange("implOneTime", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Air-gapped vault setup, DR testing, team training.</p>
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
                  <span>Cumulative Net Value ({currency})</span>
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {results.paybackMonths ? `Break-even: ${results.paybackMonths} mo` : "N/A"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Multi-year economic cashflow balancing resilience OpEx against avoided enterprise downtime.
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
                {["Hitachi Vantara", "SentinelOne", "Check Point", "Cyberbit"].map((oem) => (
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
                Test immutable backup instant recovery, live cyber range ransomware simulations, and automated failover in the iValue physical lab.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown Table */}
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs overflow-hidden">
          <div className="border-b border-neutral-200 dark:border-white/10 pb-4 mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Detailed Cyber Resilience Impact Breakdown (3-Year Horizon)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Hourly downtime recovery savings, forensics acceleration, and net economic value.
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
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Hourly Enterprise Downtime Cost</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(results.hourlyDowntimeCost)}/hr</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">—</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Avoided Downtime Losses (RTO Hours Saved)</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualDowntimeSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.annualDowntimeSavings * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Secondary Forensics & Extortion Avoidance</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.secondaryForensicsSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(results.secondaryForensicsSavings * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Annual Resilience Subscription</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(inputs.resilienceInvestmentAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(inputs.resilienceInvestmentAnnual * 3)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">One-Time Implementation & Testing</td>
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

export default function ResilienceCalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
          Loading Cyber Resilience Calculator...
        </div>
      }
    >
      <ResilienceCalculatorContent />
    </Suspense>
  );
}
