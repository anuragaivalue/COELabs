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
  LuLock,
  LuRotateCcw,
  LuPrinter,
  LuChevronRight,
  LuTrendingUp,
  LuShieldAlert,
  LuSlidersHorizontal,
  LuDollarSign,
  LuPieChart,
  LuChartBar,
  LuCheckCircle2,
  LuAlertTriangle,
  LuLightbulb,
  LuBuilding2,
  LuReceipt,
  LuCreditCard,
  LuZap,
  LuInfo,
  LuSparkles,
  LuLayers,
  LuBot,
  LuFileSpreadsheet,
  LuKeyRound
} from "react-icons/lu";

const PAM_DEFAULTS = {
  industry: "Other",
  employees: 5000,
  privUsers: 250,
  privAccounts: 1200,
  hourlyRate: 85,
  years: 3,

  // Non-Human Identities (NHI) & Machine Secrets Vaulting (NEW!)
  nhiMachineAccounts: 1800,
  nhiSecretsCount: 4500,
  nhiManualHoursMonth: 45,
  nhiBreachExposureAnnual: 350000,
  nhiVaultingReductionPct: 75,

  // Current State Costs (Before PAM)
  resetsPerMonth: 120,
  costPerReset: 35,
  provReqPerMonth: 220,
  minutesPerProv: 35,
  reviewsPerYear: 4,
  hoursPerReview: 240,
  auditHoursPerYear: 800,

  // Risk & Compliance Exposure
  criticalSystems: 55,
  credProb: 18,
  credCost: 1200000,
  insiderIncidents: 2,
  insiderCost: 350000,
  orphanedPct: 30,
  orphanedHoursFactor: 1.5,
  complianceExposure: 250000,

  // PAM Investment
  pamLicenseAnnual: 420000,
  implOneTime: 450000,
  integrationOneTime: 250000,
  trainingOneTime: 35000,
  supportAnnual: 140000,
  sessionStorageAnnual: 45000,

  // Improvements With PAM
  resetReduction: 80,
  provReduction: 65,
  reviewReduction: 70,
  auditReduction: 55,
  orphanedCleanup: 75,
  credRiskReduction: 65,
  insiderRiskReduction: 45,
  complianceReduction: 30,
};

const INDUSTRIES = [
  "Other",
  "Banking & Financial Services",
  "Healthcare",
  "Energy & Utilities",
  "Technology & Telecom",
  "Retail & eCommerce",
  "Government & Public Sector",
];

function PamCalculatorContent() {
  const searchParams = useSearchParams();
  const investmentParam = searchParams?.get("investment");
  const currencyParam = searchParams?.get("currency");

  const [inputs, setInputs] = useState(() => {
    let base = { ...PAM_DEFAULTS };
    if (investmentParam) {
      const parsed = parseFloat(investmentParam);
      if (!isNaN(parsed) && parsed > 0) {
        base.pamLicenseAnnual = parsed < 10000 ? parsed * 1000 : parsed;
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

  const handleInputChange = (field, val) => {
    if (field === "industry") {
      setInputs((prev) => ({ ...prev, industry: val }));
      return;
    }
    const num = parseFloat(val);
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));
  };

  const handleReset = () => {
    setInputs(PAM_DEFAULTS);
  };

  const handlePrint = () => {
    triggerPrint();
  };

  // Exact math with NHI Privileged Machine Secrets Vaulting integration
  const calc = useMemo(() => {
    const years = Math.min(5, Math.max(1, inputs.years));
    const hourlyRate = Math.max(0, inputs.hourlyRate);

    // Current operational costs
    const passwordResetCost = inputs.resetsPerMonth * 12 * inputs.costPerReset;
    const provisioningCost = inputs.provReqPerMonth * 12 * (inputs.minutesPerProv / 60) * hourlyRate;
    const accessReviewCost = inputs.reviewsPerYear * inputs.hoursPerReview * hourlyRate;
    const auditCost = inputs.auditHoursPerYear * hourlyRate;

    // Risk: expected annual loss
    const credentialIncidentExpectedLoss = (inputs.credProb / 100) * inputs.credCost;
    const insiderExpectedLoss = inputs.insiderIncidents * inputs.insiderCost;
    const orphanedAccounts = (inputs.orphanedPct / 100) * inputs.privAccounts;
    const orphanedAccountRiskCost = orphanedAccounts * inputs.orphanedHoursFactor * hourlyRate;
    const complianceExpectedLoss = inputs.complianceExposure;

    // NHI Machine Secrets & Workload Credentials
    const nhiManualRotationCost = (inputs.nhiManualHoursMonth * 12) * hourlyRate;
    const nhiBreachLoss = inputs.nhiBreachExposureAnnual;

    const totalCurrentAnnual =
      passwordResetCost +
      provisioningCost +
      accessReviewCost +
      auditCost +
      credentialIncidentExpectedLoss +
      insiderExpectedLoss +
      orphanedAccountRiskCost +
      complianceExpectedLoss +
      nhiManualRotationCost +
      nhiBreachLoss;

    // PAM costs
    const newAnnualPAMCost = inputs.pamLicenseAnnual + inputs.supportAnnual + inputs.sessionStorageAnnual;
    const oneTime = inputs.implOneTime + inputs.integrationOneTime + inputs.trainingOneTime;
    const year1Investment = oneTime + newAnnualPAMCost;
    const totalInvestment = oneTime + newAnnualPAMCost * years;

    // Benefits
    const resetSavings = passwordResetCost * (inputs.resetReduction / 100);
    const provisioningSavings = provisioningCost * (inputs.provReduction / 100);
    const reviewSavings = accessReviewCost * (inputs.reviewReduction / 100);
    const auditSavings = auditCost * (inputs.auditReduction / 100);
    const credRiskSavings = credentialIncidentExpectedLoss * (inputs.credRiskReduction / 100);
    const insiderRiskSavings = insiderExpectedLoss * (inputs.insiderRiskReduction / 100);
    const orphanedSavings = orphanedAccountRiskCost * (inputs.orphanedCleanup / 100);
    const complianceSavings = complianceExpectedLoss * (inputs.complianceReduction / 100);

    // NHI Vaulting Benefits
    const nhiRotationSavings = nhiManualRotationCost * (inputs.nhiVaultingReductionPct / 100);
    const nhiRiskSavings = nhiBreachLoss * (inputs.nhiVaultingReductionPct / 100);
    const nhiTotalSavings = nhiRotationSavings + nhiRiskSavings;

    const totalAnnualBenefits =
      resetSavings +
      provisioningSavings +
      reviewSavings +
      auditSavings +
      credRiskSavings +
      insiderRiskSavings +
      orphanedSavings +
      complianceSavings +
      nhiTotalSavings;

    const annualNetBenefit = totalAnnualBenefits - newAnnualPAMCost;
    const totalBenefits = totalAnnualBenefits * years;
    const netBenefit = totalBenefits - totalInvestment;
    const roiPct = totalInvestment > 0 ? (netBenefit / totalInvestment) * 100 : 0;
    const paybackMonths = annualNetBenefit > 0 ? year1Investment / (annualNetBenefit / 12) : null;
    const riskReductionAnnualValue = credRiskSavings + insiderRiskSavings + nhiRiskSavings;

    // Yearly cost and benefit arrays for chart
    const yearlyCosts = Array.from({ length: years }, (_, i) => newAnnualPAMCost + (i === 0 ? oneTime : 0));
    const yearlyBenefits = Array.from({ length: years }, () => totalAnnualBenefits);
    const maxBarVal = Math.max(...yearlyCosts, ...yearlyBenefits, 1);

    // Cumulative net cashflow for line chart
    const cumulativeBenefit = [];
    let cum = -oneTime;
    for (let yr = 1; yr <= years; yr++) {
      cum += annualNetBenefit;
      cumulativeBenefit.push(cum);
    }

    return {
      years,
      hourlyRate,
      passwordResetCost,
      provisioningCost,
      accessReviewCost,
      auditCost,
      credentialIncidentExpectedLoss,
      insiderExpectedLoss,
      orphanedAccountRiskCost,
      complianceExpectedLoss,
      nhiManualRotationCost,
      nhiBreachLoss,
      nhiRotationSavings,
      nhiRiskSavings,
      nhiTotalSavings,
      totalCurrentAnnual,
      newAnnualPAMCost,
      oneTime,
      year1Investment,
      totalInvestment,
      resetSavings,
      provisioningSavings,
      reviewSavings,
      auditSavings,
      credRiskSavings,
      insiderRiskSavings,
      orphanedSavings,
      complianceSavings,
      totalAnnualBenefits,
      annualNetBenefit,
      totalBenefits,
      netBenefit,
      roiPct,
      paybackMonths,
      riskReductionAnnualValue,
      yearlyCosts,
      yearlyBenefits,
      maxBarVal,
      cumulativeBenefit,
    };
  }, [inputs]);

  // Handle CSV Export
  const handleExportCSV = () => {
    const sections = [
      {
        title: "Executive Readout & Return Metrics",
        items: [
          ["Currency", currency, ""],
          ["Industry Vertical", inputs.industry, ""],
          ["Time Horizon", `${calc.years} Years`, ""],
          ["Total ROI (%)", `${calc.roiPct.toFixed(1)}%`, "Net return vs total investment"],
          ["Payback Period", calc.paybackMonths ? `${calc.paybackMonths.toFixed(1)} Months` : "N/A", "Break-even on Year 1 CapEx"],
          ["Net Economic Benefit", formatMoney(calc.netBenefit), "Cumulative over horizon"],
          ["Annual Net Benefit", formatMoney(calc.annualNetBenefit), "Ongoing annual net run-rate"],
          ["Total Solution Investment", formatMoney(calc.totalInvestment), "CapEx + OpEx across horizon"],
        ],
      },
      {
        title: "NHI Privileged Machine Secrets Vaulting",
        items: [
          ["Privileged Machine Accounts", inputs.nhiMachineAccounts, "Service accounts, daemons & db users"],
          ["Machine Secrets & Tokens", inputs.nhiSecretsCount, "SSH keys, API tokens & CI/CD secrets"],
          ["Monthly Manual Rotation Hours", `${inputs.nhiManualHoursMonth} hrs/mo`, "DevOps/SecOps labor time"],
          ["Annual NHI Breach Risk Exposure", formatMoney(inputs.nhiBreachExposureAnnual), "Risk from exposed machine credentials"],
          ["Vaulting Risk & Toil Reduction", `${inputs.nhiVaultingReductionPct}%`, "Automated secret injection & rotation"],
          ["Annual NHI Operational Savings", formatMoney(calc.nhiRotationSavings), "Reduced manual DevOps rotation labor"],
          ["Annual NHI Risk Avoidance", formatMoney(calc.nhiRiskSavings), "Prevented machine credential breaches"],
          ["Total Annual NHI Value", formatMoney(calc.nhiTotalSavings), "Combined operational & risk mitigation"],
        ],
      },
      {
        title: "Organization & Privileged Scope",
        items: [
          ["Total Employees", inputs.employees, ""],
          ["Privileged Users (Admins)", inputs.privUsers, ""],
          ["Privileged Accounts & Vaulted Assets", inputs.privAccounts, ""],
          ["IT Admin Hourly Rate", formatMoney(inputs.hourlyRate), ""],
          ["Current Pre-PAM Annual Exposure", formatMoney(calc.totalCurrentAnnual), ""],
        ],
      },
      {
        title: "PAM Solution Investment",
        items: [
          ["Annual Software License", formatMoney(inputs.pamLicenseAnnual), "Core PAM license"],
          ["One-Time Implementation", formatMoney(inputs.implOneTime), "Professional services"],
          ["One-Time Integration", formatMoney(inputs.integrationOneTime), "Active Directory & vault hooks"],
          ["One-Time Training", formatMoney(inputs.trainingOneTime), "Admin certification"],
          ["Annual Support & Updates", formatMoney(inputs.supportAnnual), "Maintenance & SLA"],
          ["Session Recording Storage", formatMoney(inputs.sessionStorageAnnual), "Video & log storage"],
          ["Total Year 1 CapEx & OpEx", formatMoney(calc.year1Investment), ""],
        ],
      },
    ];

    exportSectionsToCSV("pam-roi-analysis.csv", sections);
  };

  // Line chart scaling
  const minCumPam = Math.min(...calc.cumulativeBenefit, -calc.oneTime, 0);
  const maxCumPam = Math.max(...calc.cumulativeBenefit, 1);
  const cumRangePam = maxCumPam - minCumPam || 1;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans antialiased transition-colors duration-200">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-3 print:hidden">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Home
            </Link>
            <LuChevronRight className="size-3.5" />
            <span>Accelerators</span>
            <LuChevronRight className="size-3.5" />
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">PAM ROI & NHI Secrets Calculator</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 mb-2">
                <LuLock className="size-3.5" />
                <span>Privileged Access Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                PAM ROI & NHI Secrets Calculator
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
                Quantify the return on investment, credential risk reduction, Non-Human Identity (NHI) machine secrets vaulting, and compliance audit savings of enterprise PAM.
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

              {/* Reset Defaults */}
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <LuRotateCcw className="size-3.5" />
                <span>Reset Defaults</span>
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

              {/* Print / PDF Export */}
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <LuPrinter className="size-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Mini Navigation Bar */}
        <CalculatorNav active="pam" />

        {/* Concise Functional Description Block */}
        <div className="mb-8 p-4 rounded-2xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-3">
          <LuInfo className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-900 dark:text-amber-300">How this model works:</span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              This calculator models the risk exposure of unmanaged privileged human credentials alongside <strong>Non-Human Identity (NHI) Machine Secrets</strong> (SSH keys, CI/CD tokens, daemon users). It calculates the net return from credential vaulting, automated rotation, session recording, and just-in-time access across your target time horizon.
            </p>
          </div>
        </div>

        {/* Executive Readout (4 Core KPIs Readout) */}
        <section className="mb-10" aria-label="PAM Return Metrics">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LuTrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Projected PAM Value Drivers
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              <span>Industry: <strong className="text-amber-700 dark:text-amber-400">{inputs.industry}</strong></span>
              <span>•</span>
              <span>Currency: <strong className="text-amber-600 dark:text-orange-400">{currency} ({getCurrencySymbol(currency)})</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total ROI (%) */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total ROI (%)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  {calc.years}-Year
                </span>
              </div>
              <div className="mt-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {calc.roiPct.toFixed(1)}%
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Benefits vs. total PAM investment
              </div>
            </div>

            {/* Payback Period */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Payback Period</span>
                <span className="text-[10px] font-semibold text-neutral-400">Break-even</span>
              </div>
              <div className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-white">
                {calc.paybackMonths ? `${calc.paybackMonths.toFixed(1)} mo` : "N/A"}
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Months to break even on Year 1 capex
              </div>
            </div>

            {/* Net Benefit */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Net Benefit (Horizon)</span>
                <span className="text-[10px] font-semibold text-neutral-400">Cumulative</span>
              </div>
              <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 truncate">
                {formatMoney(calc.netBenefit, true)}
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Total savings & risk reduction minus PAM cost
              </div>
            </div>

            {/* Annual Net Run-Rate */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Annual Net Benefit</span>
                <span className="text-[10px] font-semibold text-neutral-400">Run-Rate</span>
              </div>
              <div className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-white truncate">
                {formatMoney(calc.annualNetBenefit, true)}
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Ongoing yearly benefit minus annual OpEx
              </div>
            </div>
          </div>
        </section>

        {/* Main Grid: Inputs Left vs Charts Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT: 6 Configuration Panels */}
          <div className="lg:col-span-7 space-y-6">
            {/* Panel 1: Organization & Privileged Scope */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">1</span>
                  Organization Profile & Scope
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  General organizational parameters, workforce size, and internal hourly IT labor cost.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Industry Vertical
                  </label>
                  <select
                    value={inputs.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-neutral-400">Shapes default risk and compliance factors.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Analysis Horizon (Years)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => handleInputChange("years", y)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          inputs.years === y
                            ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                            : "border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {y}Y
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-400">Investment return evaluation horizon.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Total Enterprise Employees
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.employees}
                    onChange={(e) => handleInputChange("employees", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Total corporate headcount.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    IT Security Hourly Rate ({getCurrencySymbol(currency)}/hr)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.hourlyRate}
                    onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Fully loaded rate for admin engineering hours.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Privileged Users (Human Admins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.privUsers}
                    onChange={(e) => handleInputChange("privUsers", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Admins, engineers, external contractors with root access.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Privileged Accounts to Vault
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.privAccounts}
                    onChange={(e) => handleInputChange("privAccounts", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Root, domain admin, database, and cloud credentials.</p>
                </div>
              </div>
            </div>

            {/* Panel 2: NHI Machine Secrets Vaulting (NEW!) */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-white via-neutral-50/80 to-amber-50/20 dark:from-neutral-900/90 dark:via-neutral-900 dark:to-amber-950/20 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-400 text-xs font-bold">2</span>
                    NHI Privileged Machine Secrets Vaulting
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-400 border border-amber-500/20">
                    <LuBot className="size-3 text-amber-600 dark:text-amber-400" />
                    Machine Secrets
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Protect non-human privileged accounts: daemon credentials, automated container tokens, SSH keys, and CI/CD secrets.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Privileged Machine Accounts
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.nhiMachineAccounts}
                    onChange={(e) => handleInputChange("nhiMachineAccounts", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-white dark:bg-neutral-800/70 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Service accounts, backup daemons, database engines.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Machine Secrets & Tokens Vaulted
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.nhiSecretsCount}
                    onChange={(e) => handleInputChange("nhiSecretsCount", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-white dark:bg-neutral-800/70 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">SSH keys, API tokens, pipeline variables.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Monthly Manual Rotation Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.nhiManualHoursMonth}
                    onChange={(e) => handleInputChange("nhiManualHoursMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-white dark:bg-neutral-800/70 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">DevOps hours manually rotating keys & tokens.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Machine Breach Exposure ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.nhiBreachExposureAnnual}
                    onChange={(e) => handleInputChange("nhiBreachExposureAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-white dark:bg-neutral-800/70 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Risk from hardcoded machine credentials in scripts.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Machine Secrets Vaulting Efficiency (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.nhiVaultingReductionPct}
                    onChange={(e) => handleInputChange("nhiVaultingReductionPct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-white dark:bg-neutral-800/70 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Reduction in manual key rotation toil & token breach probability.</p>
                </div>
              </div>

              {/* Dynamic Live NHI Callout */}
              <div className="mt-4 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <LuSparkles className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Automated rotation across <strong>{inputs.nhiSecretsCount.toLocaleString()}</strong> secrets saves <strong>{(inputs.nhiManualHoursMonth * 12 * (inputs.nhiVaultingReductionPct / 100)).toFixed(0)} hrs/yr</strong> of DevOps toil.
                  </span>
                </div>
                <div className="font-mono font-bold text-amber-700 dark:text-amber-300 shrink-0">
                  + {formatMoney(calc.nhiTotalSavings)}/yr in NHI value
                </div>
              </div>
            </div>

            {/* Panel 3: Current State Operations (Before PAM) */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">3</span>
                  Current Operational Overhead (Pre-PAM)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manual admin password resets, ad-hoc access provisioning, and periodic compliance audit preparation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Privileged Password Resets / Month
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.resetsPerMonth}
                    onChange={(e) => handleInputChange("resetsPerMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Admin password resets and unlocks per month.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Cost Per Privileged Reset ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.costPerReset}
                    onChange={(e) => handleInputChange("costPerReset", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">High security verification cost for root resets.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Ad-hoc Provisioning Requests / Month
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.provReqPerMonth}
                    onChange={(e) => handleInputChange("provReqPerMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Temporary elevation and emergency access requests.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Minutes Spent Per Request
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.minutesPerProv}
                    onChange={(e) => handleInputChange("minutesPerProv", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Approval, credential assignment, and manual revocation.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Privileged Access Reviews / Year
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.reviewsPerYear}
                    onChange={(e) => handleInputChange("reviewsPerYear", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Scheduled re-certification cycles (typically quarterly).</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Audit Prep Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.auditHoursPerYear}
                    onChange={(e) => handleInputChange("auditHoursPerYear", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Hours pulling audit logs for SOX, ISO, PCI-DSS.</p>
                </div>
              </div>
            </div>

            {/* Panel 4: Risk & Exposure Factors */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">4</span>
                  Risk & Regulatory Exposure Factors
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Probability and financial fallout of credential-based breaches, insider abuse, and compliance non-conformance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Credential Compromise Prob. (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.credProb}
                    onChange={(e) => handleInputChange("credProb", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Probability of unmanaged admin credential theft.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Avg. Breach Financial Impact ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.credCost}
                    onChange={(e) => handleInputChange("credCost", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Forensics, regulatory fines, downtime, reputational loss.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Orphaned Account Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.orphanedPct}
                    onChange={(e) => handleInputChange("orphanedPct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">% of privileged accounts with no active human owner.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Regulatory Non-Compliance Risk ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.complianceExposure}
                    onChange={(e) => handleInputChange("complianceExposure", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Fines and remediation mandates (e.g., RBI, HIPAA, SOX).</p>
                </div>
              </div>
            </div>

            {/* Panel 5: PAM Investment */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">5</span>
                  PAM Solution Investment
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Annual software subscription, professional services, directory integration, and ongoing infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual PAM License ({getCurrencySymbol(currency)}/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.pamLicenseAnnual}
                    onChange={(e) => handleInputChange("pamLicenseAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Vault, session manager, and rotation engine subscription.</p>
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
                  <p className="mt-1 text-[11px] text-neutral-400">Professional services, vault clustering, policy design.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Directory & Cloud Integration ({getCurrencySymbol(currency)}, One-time)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.integrationOneTime}
                    onChange={(e) => handleInputChange("integrationOneTime", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Target connectors, Active Directory & cloud hooks.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Support & Maintenance ({getCurrencySymbol(currency)}/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.supportAnnual}
                    onChange={(e) => handleInputChange("supportAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Vendor 24x7 SLA support and version updates.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Visual Analytics (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {/* 1. Line Chart: Cumulative Net Savings Trend */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <LuTrendingUp className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>Cumulative Net Value ({currency})</span>
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  {calc.years}-Year Horizon
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Cumulative cashflow from initial implementation through multi-year operational return.
              </p>

              {/* Pure SVG Line / Trend Chart */}
              <div className="w-full h-44 pt-2">
                <div className="relative w-full h-32 border-b border-neutral-200 dark:border-white/10">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 130">
                    <defs>
                      <linearGradient id="pamGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Zero baseline */}
                    {minCumPam < 0 && (
                      <line
                        x1="0"
                        y1={130 - (Math.abs(minCumPam) / cumRangePam) * 130}
                        x2="500"
                        y2={130 - (Math.abs(minCumPam) / cumRangePam) * 130}
                        stroke="currentColor"
                        strokeDasharray="4 4"
                        className="text-neutral-300 dark:text-white/20"
                      />
                    )}

                    {/* Trend points & path */}
                    {(() => {
                      const len = calc.cumulativeBenefit.length;
                      const points = calc.cumulativeBenefit.map((val, i) => {
                        const x = len > 1 ? (i / (len - 1)) * 460 + 20 : 250;
                        const y = 130 - ((val - minCumPam) / cumRangePam) * 105 - 12;
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
                  {Array.from({ length: calc.years }, (_, i) => i + 1).map((y) => (
                    <span key={y}>Y{y}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Grouped Bar Chart: Cost vs Benefits */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <LuChartBar className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>Annual Cost vs. Benefit Value ({currency})</span>
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Total annualized PAM operational expenditure versus risk avoidance and operational recovery.
              </p>

              <div className="w-full h-36 pt-2">
                <div className="h-28 flex items-end justify-center gap-12 border-b border-neutral-200 dark:border-white/10 pb-2">
                  {/* PAM Cost */}
                  <div className="flex flex-col items-center gap-1 h-full justify-end w-20">
                    <div
                      className="w-full bg-amber-500/80 hover:bg-amber-500 rounded-t-sm transition-all relative group"
                      style={{ height: `${Math.max(15, (calc.newAnnualPAMCost / calc.maxBarVal) * 100)}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                        {formatMoney(calc.newAnnualPAMCost)}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                      PAM OpEx
                    </span>
                  </div>

                  {/* PAM Benefit */}
                  <div className="flex flex-col items-center gap-1 h-full justify-end w-20">
                    <div
                      className="w-full bg-emerald-500/80 hover:bg-emerald-500 rounded-t-sm transition-all relative group"
                      style={{ height: `${Math.max(15, (calc.totalAnnualBenefits / calc.maxBarVal) * 100)}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                        {formatMoney(calc.totalAnnualBenefits)}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                      Benefits
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 mt-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-xs bg-amber-500" />
                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400">PAM Running Cost</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-xs bg-emerald-500" />
                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400">Annual Return Value</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Value Card */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <LuLightbulb className="size-3.5 text-amber-600 dark:text-amber-400" />
                Strategic PAM Highlights
              </h3>
              <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">▪</span>
                  <span><strong>{formatMoney(calc.riskReductionAnnualValue)}/yr</strong> in total avoided human & machine credential breach risk.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">▪</span>
                  <span>Automated machine secrets vaulting eliminates static token leakage across <strong>{inputs.nhiSecretsCount.toLocaleString()}</strong> machine endpoints.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">▪</span>
                  <span>Payback break-even projected at <strong>{calc.paybackMonths ? `${calc.paybackMonths.toFixed(1)} months` : "N/A"}</strong>.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Detailed Financial Breakdown Table */}
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs overflow-hidden">
          <div className="border-b border-neutral-200 dark:border-white/10 pb-4 mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Detailed PAM Economic Impact ({calc.years}-Year Horizon)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Annualized and multi-year comparison of baseline risk and operational costs versus PAM returns.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Financial Driver</th>
                  <th className="py-3 px-4 text-right">Annual Baseline ({currency})</th>
                  <th className="py-3 px-4 text-right">Annual Value Avoided ({currency})</th>
                  <th className="py-3 px-4 text-right">{calc.years}-Year Cumulative Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5 text-neutral-700 dark:text-neutral-300">
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Credential Compromise Risk</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(calc.credentialIncidentExpectedLoss)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(calc.credRiskSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(calc.credRiskSavings * calc.years)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">NHI Machine Secrets & Token Vaulting</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(calc.nhiBreachLoss + calc.nhiManualRotationCost)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(calc.nhiTotalSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(calc.nhiTotalSavings * calc.years)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Insider Threat Mitigation</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(calc.insiderExpectedLoss)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(calc.insiderRiskSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(calc.insiderRiskSavings * calc.years)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Privileged Password Resets</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(calc.passwordResetCost)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(calc.resetSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(calc.resetSavings * calc.years)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Ad-hoc Provisioning Automation</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(calc.provisioningCost)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(calc.provisioningSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(calc.provisioningSavings * calc.years)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Compliance & Audit Preparation</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(calc.auditCost + calc.complianceExpectedLoss)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(calc.auditSavings + calc.complianceSavings)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney((calc.auditSavings + calc.complianceSavings) * calc.years)}</td>
                </tr>
                <tr className="border-t border-neutral-200 dark:border-white/10 bg-amber-500/5 dark:bg-amber-500/10 font-bold text-amber-900 dark:text-amber-300">
                  <td className="py-3 px-4">Net Economic Benefit / ROI</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(calc.totalCurrentAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(calc.annualNetBenefit)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(calc.netBenefit)} ({calc.roiPct.toFixed(1)}%)</td>
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

export default function PamCalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
          Loading PAM ROI Calculator...
        </div>
      }
    >
      <PamCalculatorContent />
    </Suspense>
  );
}
