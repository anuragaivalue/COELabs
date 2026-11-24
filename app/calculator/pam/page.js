"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CalculatorNav } from "@/components/calculators/calculator-nav";
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
  LuBarChart3,
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
} from "react-icons/lu";

const PAM_DEFAULTS = {
  industry: "Other",
  employees: 5000,
  privUsers: 250,
  privAccounts: 1200,
  hourlyRate: 85,
  years: 3,

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

function pamFormatCurrency(val) {
  if (!Number.isFinite(val)) return "$0";
  const abs = Math.abs(val);
  const sign = val < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

function pamFormatFullUSD(val) {
  if (!Number.isFinite(val)) return "$0";
  const sign = val < 0 ? "-" : "";
  const abs = Math.abs(val);
  return `${sign}$${abs.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function PamCalculatorPage() {
  const [inputs, setInputs] = useState(PAM_DEFAULTS);

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
    window.print();
  };

  // Exact math from scratch/pam_logic.js
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

    const totalCurrentAnnual =
      passwordResetCost +
      provisioningCost +
      accessReviewCost +
      auditCost +
      credentialIncidentExpectedLoss +
      insiderExpectedLoss +
      orphanedAccountRiskCost +
      complianceExpectedLoss;

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

    const totalAnnualBenefits =
      resetSavings +
      provisioningSavings +
      reviewSavings +
      auditSavings +
      credRiskSavings +
      insiderRiskSavings +
      orphanedSavings +
      complianceSavings;

    const annualNetBenefit = totalAnnualBenefits - newAnnualPAMCost;
    const totalBenefits = totalAnnualBenefits * years;
    const netBenefit = totalBenefits - totalInvestment;
    const roiPct = totalInvestment > 0 ? (netBenefit / totalInvestment) * 100 : 0;
    const paybackMonths = annualNetBenefit > 0 ? year1Investment / (annualNetBenefit / 12) : null;
    const riskReductionAnnualValue = credRiskSavings + insiderRiskSavings;

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
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">PAM ROI Calculator</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 mb-2">
                <LuLock className="size-3.5" />
                <span>Privileged Access Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                PAM ROI Calculator
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
                Quantify the return on investment, credential risk reduction, automated session management, and audit savings of deploying an enterprise Privileged Access Management solution.
              </p>
            </div>

            <div className="flex items-center gap-2 print:hidden shrink-0">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <LuRotateCcw className="size-3.5" />
                <span>Reset Defaults</span>
              </button>
              <button
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
              This calculator models the risk exposure of unmanaged privileged credentials, admin password resets, manual JIT elevation requests, and regulatory compliance audits. It calculates the net return from credential vaulting, session recording, and automated rotation across your target time horizon.
            </p>
          </div>
        </div>

        {/* Executive Readout (4 Core KPIs Readout - Kept Completely Intact) */}
        <section className="mb-10" aria-label="PAM Return Metrics">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LuTrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Projected PAM Value Drivers
              </h2>
            </div>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Industry: <span className="text-amber-700 dark:text-amber-400 font-bold">{inputs.industry}</span> • <span className="text-neutral-800 dark:text-neutral-200">{calc.years}-Year Horizon</span>
            </span>
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
              <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {pamFormatCurrency(calc.netBenefit)}
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Total benefits minus total investment
              </div>
            </div>

            {/* Annual Risk Reduction Value */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Risk Reduction (Annual)</span>
                <span className="text-[10px] font-semibold text-neutral-400">Expected Loss</span>
              </div>
              <div className="mt-2 text-3xl font-extrabold text-teal-600 dark:text-teal-400">
                {pamFormatCurrency(calc.riskReductionAnnualValue)}
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Credential + insider risk mitigation
              </div>
            </div>
          </div>
        </section>

        {/* Main Workspace: Side-by-Side Split Architecture */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Vertically Stacked Inputs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Organization Profile */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <LuBuilding2 className="size-5 text-amber-600 dark:text-amber-400" />
                  Organization Profile (Scale Drivers)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Workforce size, privileged account inventory, and IT labor rates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={inputs.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-neutral-400">Calibrates compliance risk weightings.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Total Employees (Headcount)
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={inputs.employees}
                    onChange={(e) => handleInputChange("employees", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Full-time equivalent workforce.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Privileged Users
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.privUsers}
                    onChange={(e) => handleInputChange("privUsers", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Admins, DevOps, engineers with root/admin access.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Privileged Accounts
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.privAccounts}
                    onChange={(e) => handleInputChange("privAccounts", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Service accounts, domain admins, cloud IAM keys.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    IT / Security Hourly Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={inputs.hourlyRate}
                    onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Fully burdened labor rate for sysadmins.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Time Horizon (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={inputs.years}
                    onChange={(e) => handleInputChange("years", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Analysis timeframe (1 to 5 years).</p>
                </div>
              </div>
            </div>

            {/* Section 2: Current State Costs (Before PAM) */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <LuReceipt className="size-5 text-amber-600 dark:text-amber-400" />
                  Current State Costs (Before PAM - Operational Overhead)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manual password rotation, ticket handling, and access review workloads.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Password Resets / Month
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.resetsPerMonth}
                    onChange={(e) => handleInputChange("resetsPerMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Privileged credential lockout tickets.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Cost per Password Reset ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.costPerReset}
                    onChange={(e) => handleInputChange("costPerReset", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Direct support handling cost.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Provisioning Requests / Month
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.provReqPerMonth}
                    onChange={(e) => handleInputChange("provReqPerMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Elevation and server entitlement tickets.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Minutes per Provisioning Request
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.minutesPerProv}
                    onChange={(e) => handleInputChange("minutesPerProv", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Manual administrative provisioning time.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Access Reviews / Year
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.reviewsPerYear}
                    onChange={(e) => handleInputChange("reviewsPerYear", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Annual recurring certification campaigns.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Hours per Access Review
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.hoursPerReview}
                    onChange={(e) => handleInputChange("hoursPerReview", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Effort reviewing entitlements and logs.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Audit Evidence Hours / Year
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.auditHoursPerYear}
                    onChange={(e) => handleInputChange("auditHoursPerYear", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Annual auditor evidence compilation time.</p>
                </div>
              </div>
            </div>

            {/* Section 3: Risk & Compliance Exposure */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <LuShieldAlert className="size-5 text-amber-600 dark:text-amber-400" />
                  Risk & Compliance Exposure (Before PAM)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Expected loss probability from unvaulted credentials, insider abuse, and compliance penalties.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Critical Systems (Count)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.criticalSystems}
                    onChange={(e) => handleInputChange("criticalSystems", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Mission-critical targets requiring vault protection.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Credential Incident Probability (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.credProb}
                    onChange={(e) => handleInputChange("credProb", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Annual likelihood of credential-based breach.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Avg. Credential Incident Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.credCost}
                    onChange={(e) => handleInputChange("credCost", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Total forensic, downtime, and regulatory damages.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Insider Misuse Incidents / Year
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.insiderIncidents}
                    onChange={(e) => handleInputChange("insiderIncidents", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Accidental or malicious internal abuse.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Avg. Cost per Insider Incident ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.insiderCost}
                    onChange={(e) => handleInputChange("insiderCost", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Remediation and data restoration costs.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Orphaned Accounts (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.orphanedPct}
                    onChange={(e) => handleInputChange("orphanedPct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Unmanaged / dormant privileged accounts.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Compliance Exposure ($/year)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.complianceExposure}
                    onChange={(e) => handleInputChange("complianceExposure", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Potential audit fines (PCI-DSS, ISO 27001, HIPAA, SOX).</p>
                </div>
              </div>
            </div>

            {/* Section 4: PAM Investment (Solution Costs) */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <LuCreditCard className="size-5 text-amber-600 dark:text-amber-400" />
                  PAM Investment (Solution Costs)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Platform subscription, systems integration, admin staffing, and maintenance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    PAM License (Annual $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.pamLicenseAnnual}
                    onChange={(e) => handleInputChange("pamLicenseAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Vault software subscription.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Implementation (One-time $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.implOneTime}
                    onChange={(e) => handleInputChange("implOneTime", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Hardening, vault architecture, deployment.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Integrations (One-time $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.integrationOneTime}
                    onChange={(e) => handleInputChange("integrationOneTime", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Server, database, and cloud connectors.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Training (One-time $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.trainingOneTime}
                    onChange={(e) => handleInputChange("trainingOneTime", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Admin enablement and user onboarding.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Support & Operations (Annual $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.supportAnnual}
                    onChange={(e) => handleInputChange("supportAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Ongoing 24x7 SLA support.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Session Storage & Infra (Annual $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.sessionStorageAnnual}
                    onChange={(e) => handleInputChange("sessionStorageAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Session video & audit logging storage.</p>
                </div>
              </div>
            </div>

            {/* Section 5: Improvements With PAM */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <LuZap className="size-5 text-amber-600 dark:text-amber-400" />
                  Improvements With PAM (Benefit Levers)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Percentage risk reduction and automated efficiency gains across operational workflows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Reset Reduction (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.resetReduction}
                    onChange={(e) => handleInputChange("resetReduction", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Automated password rotation.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Provisioning Reduction (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.provReduction}
                    onChange={(e) => handleInputChange("provReduction", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Just-in-Time elevation speed.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Review Effort Reduction (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.reviewReduction}
                    onChange={(e) => handleInputChange("reviewReduction", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Automated certification reporting.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Audit Effort Reduction (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.auditReduction}
                    onChange={(e) => handleInputChange("auditReduction", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">One-click audit trail export.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Orphaned Cleanup (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.orphanedCleanup}
                    onChange={(e) => handleInputChange("orphanedCleanup", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Discovery of dormant accounts.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Credential Risk Cut (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.credRiskReduction}
                    onChange={(e) => handleInputChange("credRiskReduction", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Credential vaulting & isolation.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Insider Risk Cut (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.insiderRiskReduction}
                    onChange={(e) => handleInputChange("insiderRiskReduction", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Session recording & command limits.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Compliance Risk Cut (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.complianceReduction}
                    onChange={(e) => handleInputChange("complianceReduction", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Elimination of non-conformance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Dynamic Charts (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {/* 1. LINE CHART FIRST (Top): Cumulative Net Savings Trend */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <LuTrendingUp className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>Cumulative Net Savings</span>
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {calc.paybackMonths ? `Break-even: ${calc.paybackMonths.toFixed(1)} mo` : "N/A"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Cumulative capital trajectory over the {calc.years}-year timeframe.
              </p>

              {/* Pure SVG Line / Trend Chart */}
              <div className="w-full h-44 pt-2">
                <div className="relative w-full h-32 border-b border-neutral-200 dark:border-white/10">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 130">
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

                    {(() => {
                      const points = calc.cumulativeBenefit.map((val, i) => {
                        const denom = Math.max(1, calc.years - 1);
                        const x = (i / denom) * 440 + 30;
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
                                y={p.y - 7}
                                textAnchor="middle"
                                className="text-[10px] font-semibold fill-neutral-700 dark:fill-neutral-300"
                              >
                                {pamFormatCurrency(p.val)}
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>

                <div className="flex justify-between items-center px-1 pt-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  {Array.from({ length: calc.years }).map((_, i) => (
                    <span key={i}>Y{i + 1}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. BAR CHART SECOND (Below): Cost vs. Benefit (by Year) */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <LuLayers className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>Cost vs. Benefit (by Year)</span>
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {calc.years}-Year View
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Total solution capex/opex vs. gross annual risk & operations savings.
              </p>

              <div className="w-full h-40 flex items-end justify-between gap-3 px-2 border-b border-neutral-200 dark:border-white/10 pb-2">
                {Array.from({ length: calc.years }).map((_, i) => {
                  const yearNum = i + 1;
                  const costVal = calc.yearlyCosts[i];
                  const benVal = calc.yearlyBenefits[i];

                  const cH = Math.max(10, (costVal / calc.maxBarVal) * 100);
                  const bH = Math.max(10, (benVal / calc.maxBarVal) * 100);

                  return (
                    <div key={yearNum} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1.5 h-full">
                        {/* Cost */}
                        <div
                          className="w-1/2 max-w-[20px] bg-rose-500/80 hover:bg-rose-500 rounded-t-sm transition-all relative group"
                          style={{ height: `${cH}%` }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                            {pamFormatCurrency(costVal)}
                          </div>
                        </div>
                        {/* Benefit */}
                        <div
                          className="w-1/2 max-w-[20px] bg-emerald-500/80 hover:bg-emerald-500 rounded-t-sm transition-all relative group"
                          style={{ height: `${bH}%` }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                            {pamFormatCurrency(benVal)}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                        Y{yearNum}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-5 mt-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-xs bg-rose-500" />
                  <span className="text-neutral-600 dark:text-neutral-400">Investment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-xs bg-emerald-500" />
                  <span className="text-neutral-600 dark:text-neutral-400">Benefits</span>
                </div>
              </div>
            </div>

            {/* 3. Investment Breakdown */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Investment Breakdown
                </h3>
                <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
                  {pamFormatCurrency(calc.totalInvestment)}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Cumulative solution allocation over {calc.years} years.
              </p>

              <div className="space-y-2 py-1">
                {[
                  { label: "PAM Licenses", val: inputs.pamLicenseAnnual * calc.years, color: "bg-amber-500" },
                  { label: "Implementation", val: inputs.implOneTime, color: "bg-amber-700" },
                  { label: "Integrations", val: inputs.integrationOneTime, color: "bg-orange-500" },
                  { label: "Support & Maint.", val: inputs.supportAnnual * calc.years, color: "bg-yellow-500" },
                  { label: "Session Storage", val: inputs.sessionStorageAnnual * calc.years, color: "bg-amber-400" },
                  { label: "Training", val: inputs.trainingOneTime, color: "bg-amber-600" },
                ].map((item, idx) => {
                  const pct = calc.totalInvestment > 0 ? (item.val / calc.totalInvestment) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-neutral-700 dark:text-neutral-300">
                        <span className="flex items-center gap-1.5">
                          <span className={`size-2 rounded-full ${item.color}`} />
                          <span>{item.label}</span>
                        </span>
                        <span className="font-mono">{pamFormatCurrency(item.val)} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Benefit Drivers (Annual) */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Benefit Drivers (Annual)
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                  {pamFormatCurrency(calc.totalAnnualBenefits)}/yr
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Operational efficiencies and risk loss avoidance annualized.
              </p>

              <div className="space-y-2 py-1">
                {[
                  { label: "Credential Risk Avoidance", val: calc.credRiskSavings, color: "bg-emerald-500" },
                  { label: "Insider Risk Mitigation", val: calc.insiderRiskSavings, color: "bg-teal-500" },
                  { label: "Provisioning Automation", val: calc.provisioningSavings, color: "bg-amber-500" },
                  { label: "Access Review Reduction", val: calc.reviewSavings, color: "bg-amber-600" },
                  { label: "Audit Evidence Savings", val: calc.auditSavings, color: "bg-amber-400" },
                  { label: "Compliance Risk Cut", val: calc.complianceSavings, color: "bg-cyan-500" },
                  { label: "Password Reset Savings", val: calc.resetSavings, color: "bg-yellow-500" },
                ].map((item, idx) => {
                  const pct = calc.totalAnnualBenefits > 0 ? (item.val / calc.totalAnnualBenefits) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-neutral-700 dark:text-neutral-300">
                        <span className="flex items-center gap-1.5">
                          <span className={`size-2 rounded-full ${item.color}`} />
                          <span>{item.label}</span>
                        </span>
                        <span className="font-mono">{pamFormatCurrency(item.val)} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 3 Detailed Tables: Investment, Benefits, KPI Comparison (Bottom Area Kept Intact) */}
        <section className="space-y-8">
          {/* Table 1: Investment Breakdown Table */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs overflow-hidden">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
              PAM Investment Breakdown
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Comprehensive one-time capital requirements and ongoing operating costs.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Investment Element</th>
                    <th className="py-3 px-4">Cost Type</th>
                    <th className="py-3 px-4 text-right">Annual Impact</th>
                    <th className="py-3 px-4 text-right">{calc.years}-Year Horizon Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-white/5 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Software License / Subscription</td>
                    <td className="py-3 px-4 text-neutral-500">Recurring</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(inputs.pamLicenseAnnual)}</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(inputs.pamLicenseAnnual * calc.years)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Implementation & Professional Services</td>
                    <td className="py-3 px-4 text-neutral-500">One-time</td>
                    <td className="py-3 px-4 text-right font-mono">—</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(inputs.implOneTime)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Target Integrations & Connectors</td>
                    <td className="py-3 px-4 text-neutral-500">One-time</td>
                    <td className="py-3 px-4 text-right font-mono">—</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(inputs.integrationOneTime)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Training & Change Management</td>
                    <td className="py-3 px-4 text-neutral-500">One-time</td>
                    <td className="py-3 px-4 text-right font-mono">—</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(inputs.trainingOneTime)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Administration & Tier 3 Support</td>
                    <td className="py-3 px-4 text-neutral-500">Recurring</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(inputs.supportAnnual)}</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(inputs.supportAnnual * calc.years)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Session Recording Infrastructure & Storage</td>
                    <td className="py-3 px-4 text-neutral-500">Recurring</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(inputs.sessionStorageAnnual)}</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(inputs.sessionStorageAnnual * calc.years)}</td>
                  </tr>
                  <tr className="border-t border-neutral-200 dark:border-white/10 bg-amber-500/5 dark:bg-amber-500/10 font-bold text-amber-900 dark:text-amber-300">
                    <td className="py-3 px-4">Total PAM Investment</td>
                    <td className="py-3 px-4">All Costs</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(calc.newAnnualPAMCost)}</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(calc.totalInvestment)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Benefits Breakdown Table */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs overflow-hidden">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
              Annual & Horizon Benefits Breakdown
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Value delivered per category across operational automation and risk mitigation.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Benefit Category</th>
                    <th className="py-3 px-4 text-right">Current Annual Exposure</th>
                    <th className="py-3 px-4 text-right">% Reduction</th>
                    <th className="py-3 px-4 text-right">Annual Savings</th>
                    <th className="py-3 px-4 text-right">{calc.years}-Year Total Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-white/5 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Password Resets & Account Lockouts</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(calc.passwordResetCost)}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600">{inputs.resetReduction}%</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.resetSavings)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.resetSavings * calc.years)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Privileged Provisioning & JIT Elevation</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(calc.provisioningCost)}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600">{inputs.provReduction}%</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.provisioningSavings)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.provisioningSavings * calc.years)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Access Review & Certification Overhead</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(calc.accessReviewCost)}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600">{inputs.reviewReduction}%</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.reviewSavings)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.reviewSavings * calc.years)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Audit Evidence Gathering & Preparation</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(calc.auditCost)}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600">{inputs.auditReduction}%</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.auditSavings)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.auditSavings * calc.years)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Credential-Based Incident Expected Loss</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(calc.credentialIncidentExpectedLoss)}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600">{inputs.credRiskReduction}%</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.credRiskSavings)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.credRiskSavings * calc.years)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Insider Misuse & Accidental Errors</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(calc.insiderExpectedLoss)}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600">{inputs.insiderRiskReduction}%</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.insiderRiskSavings)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.insiderRiskSavings * calc.years)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Orphaned Account Remediation</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(calc.orphanedAccountRiskCost)}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600">{inputs.orphanedCleanup}%</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.orphanedSavings)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.orphanedSavings * calc.years)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Compliance Exposure & Penalties</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(calc.complianceExpectedLoss)}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600">{inputs.complianceReduction}%</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.complianceSavings)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{pamFormatFullUSD(calc.complianceSavings * calc.years)}</td>
                  </tr>
                  <tr className="border-t border-neutral-200 dark:border-white/10 bg-amber-500/5 dark:bg-amber-500/10 font-bold text-amber-900 dark:text-amber-300">
                    <td className="py-3 px-4">Total Benefits Realized</td>
                    <td className="py-3 px-4 text-right font-mono">{pamFormatFullUSD(calc.totalCurrentAnnual)}</td>
                    <td className="py-3 px-4 text-right font-mono">—</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 dark:text-emerald-300">{pamFormatFullUSD(calc.totalAnnualBenefits)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 dark:text-emerald-300">{pamFormatFullUSD(calc.totalBenefits)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 3: Before vs After KPI Comparison */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs overflow-hidden">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
              Operational KPI Comparison (Before vs. After)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Direct operational metrics shift achieved through automated credential management.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Key Performance Indicator</th>
                    <th className="py-3 px-4 text-right">Current Baseline</th>
                    <th className="py-3 px-4 text-right">With PAM Deployed</th>
                    <th className="py-3 px-4 text-right">Net Operational Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-white/5 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Annual Password Reset Tickets</td>
                    <td className="py-3 px-4 text-right font-mono">{(inputs.resetsPerMonth * 12).toLocaleString("en-US")}</td>
                    <td className="py-3 px-4 text-right font-mono">{Math.round(inputs.resetsPerMonth * 12 * (1 - inputs.resetReduction / 100)).toLocaleString("en-US")}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">-{Math.round(inputs.resetsPerMonth * 12 * (inputs.resetReduction / 100)).toLocaleString("en-US")} tickets/yr</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Annual Provisioning Hours</td>
                    <td className="py-3 px-4 text-right font-mono">{Math.round(inputs.provReqPerMonth * 12 * (inputs.minutesPerProv / 60)).toLocaleString("en-US")} hrs</td>
                    <td className="py-3 px-4 text-right font-mono">{Math.round(inputs.provReqPerMonth * 12 * (inputs.minutesPerProv / 60) * (1 - inputs.provReduction / 100)).toLocaleString("en-US")} hrs</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">-{Math.round(inputs.provReqPerMonth * 12 * (inputs.minutesPerProv / 60) * (inputs.provReduction / 100)).toLocaleString("en-US")} hrs saved</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Access Review Hours / Year</td>
                    <td className="py-3 px-4 text-right font-mono">{(inputs.reviewsPerYear * inputs.hoursPerReview).toLocaleString("en-US")} hrs</td>
                    <td className="py-3 px-4 text-right font-mono">{Math.round(inputs.reviewsPerYear * inputs.hoursPerReview * (1 - inputs.reviewReduction / 100)).toLocaleString("en-US")} hrs</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">-{Math.round(inputs.reviewsPerYear * inputs.hoursPerReview * (inputs.reviewReduction / 100)).toLocaleString("en-US")} hrs saved</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Audit Preparation Hours / Year</td>
                    <td className="py-3 px-4 text-right font-mono">{inputs.auditHoursPerYear.toLocaleString("en-US")} hrs</td>
                    <td className="py-3 px-4 text-right font-mono">{Math.round(inputs.auditHoursPerYear * (1 - inputs.auditReduction / 100)).toLocaleString("en-US")} hrs</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">-{Math.round(inputs.auditHoursPerYear * (inputs.auditReduction / 100)).toLocaleString("en-US")} hrs saved</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Orphaned Accounts</td>
                    <td className="py-3 px-4 text-right font-mono">{Math.round(inputs.privAccounts * (inputs.orphanedPct / 100)).toLocaleString("en-US")}</td>
                    <td className="py-3 px-4 text-right font-mono">{Math.round(inputs.privAccounts * (inputs.orphanedPct / 100) * (1 - inputs.orphanedCleanup / 100)).toLocaleString("en-US")}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">-{Math.round(inputs.privAccounts * (inputs.orphanedPct / 100) * (inputs.orphanedCleanup / 100)).toLocaleString("en-US")} accounts remediated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
