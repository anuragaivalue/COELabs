"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CalculatorNav } from "@/components/calculators/calculator-nav";
import {
  LuKeyRound,
  LuRotateCcw,
  LuPrinter,
  LuChevronRight,
  LuTrendingUp,
  LuSave,
  LuCheck,
  LuAlertCircle,
  LuLightbulb,
  LuDollarSign,
  LuPieChart,
  LuBarChart3,
  LuLayers,
  LuShieldCheck,
  LuSparkles,
  LuInfo,
  LuBuilding2,
  LuReceipt,
  LuBoxes,
  LuSlidersHorizontal,
} from "react-icons/lu";

const IDAM_STORAGE_KEY = "idam_roi_inputs_v1";

const SCENARIOS = {
  cons: { label: "Conservative", mult: 0.75 },
  exp: { label: "Expected", mult: 1.0 },
  agg: { label: "Aggressive", mult: 1.25 },
};

const IDAM_DEFAULTS = {
  // Category 1: Organization & Workload
  employees: 2500,
  apps: 35,
  reqPerUserMonth: 0.7,
  minsPerRequestCurrent: 35,
  minsPerRequestNew: 10,
  opsHourly: 85,

  // Category 2: Passwords & Audit (Current)
  pwdResetsMonth: 900,
  pwdResetCost: 22,
  auditHoursMonth: 80,
  auditHourly: 95,

  // Category 3: IDAM Solution Investment
  licenseAnnual: 210000,
  implOneTime: 380000,
  trainingOneTime: 55000,
  adminFTE: 1.5,
  fteCost: 135000,
  supportAnnual: 45000,

  // Category 4: Business Impact Drivers
  pwdReductionPct: 35,
  auditReductionPct: 30,
  riskLossAnnual: 250000,
  riskReductionPct: 18,
  prodHoursPerUser: 1.2,
  prodHourly: 55,
};

function clamp(n, min, max) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function formatUSD(val) {
  if (!Number.isFinite(val)) return "$0";
  const sign = val < 0 ? "-" : "";
  const abs = Math.abs(val);
  return `${sign}$${abs.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function IdamCalculatorPage() {
  const [inputs, setInputs] = useState(IDAM_DEFAULTS);
  const [selectedScenario, setSelectedScenario] = useState("exp");
  const [horizonYears, setHorizonYears] = useState(3);
  const [saveToast, setSaveToast] = useState(false);

  // Load saved inputs on mount if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(IDAM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setInputs((prev) => ({ ...prev, ...parsed }));
      }
    } catch (_) {}
  }, []);

  const handleInputChange = (field, val) => {
    const num = parseFloat(val);
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(IDAM_STORAGE_KEY, JSON.stringify(inputs));
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2600);
    } catch (_) {}
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(IDAM_STORAGE_KEY);
    } catch (_) {}
    setInputs(IDAM_DEFAULTS);
    setSelectedScenario("exp");
    setHorizonYears(3);
  };

  const handlePrint = () => {
    window.print();
  };

  // Exact IDAM mathematical model from MAIN counterpart
  const model = useMemo(() => {
    const scn = SCENARIOS[selectedScenario] || SCENARIOS.exp;
    const mult = scn.mult;
    const years = horizonYears;

    const reqPerYear = inputs.employees * inputs.reqPerUserMonth * 12;

    // Baseline costs
    const baselineAccessOps = (reqPerYear * inputs.minsPerRequestCurrent / 60) * inputs.opsHourly;
    const baselinePwd = (inputs.pwdResetsMonth * 12) * inputs.pwdResetCost;
    const baselineAudit = (inputs.auditHoursMonth * 12) * inputs.auditHourly;
    const baselineAnnual = baselineAccessOps + baselinePwd + baselineAudit;

    // With-solution operational costs
    const withAccessOps = (reqPerYear * inputs.minsPerRequestNew / 60) * inputs.opsHourly;

    const pwdReduction = clamp((inputs.pwdReductionPct / 100) * mult, 0, 1);
    const auditReduction = clamp((inputs.auditReductionPct / 100) * mult, 0, 1);
    const riskReduction = clamp((inputs.riskReductionPct / 100) * mult, 0, 1);

    const withPwd = baselinePwd * (1 - pwdReduction);
    const withAudit = baselineAudit * (1 - auditReduction);

    const adminAnnual = inputs.adminFTE * inputs.fteCost;
    const solutionOpexAnnual = withAccessOps + withPwd + withAudit + inputs.licenseAnnual + inputs.supportAnnual + adminAnnual;

    // Additional benefits beyond baseline savings
    const riskBenefitAnnual = inputs.riskLossAnnual * riskReduction;
    const prodBenefitAnnual = (inputs.employees * inputs.prodHoursPerUser) * inputs.prodHourly * mult;

    // Annual net cashflow (savings + added benefits)
    const annualSavings = baselineAnnual - solutionOpexAnnual;
    const annualBenefitsTotal = Math.max(0, annualSavings) + riskBenefitAnnual + prodBenefitAnnual;

    // Total model over horizon
    const oneTime = inputs.implOneTime + inputs.trainingOneTime;
    const totalSolutionCost = oneTime + (solutionOpexAnnual * years);
    const totalBaselineCost = baselineAnnual * years;

    const totalAdditionalBenefits = (riskBenefitAnnual + prodBenefitAnnual) * years;
    const netBenefit = (totalBaselineCost - totalSolutionCost) + totalAdditionalBenefits;

    const roi = totalSolutionCost > 0 ? (netBenefit / totalSolutionCost) : 0;

    // Payback on one-time cost using annual net improvement
    const annualNet = (baselineAnnual - solutionOpexAnnual) + (riskBenefitAnnual + prodBenefitAnnual);
    const paybackMonths = annualNet > 0 ? (oneTime / (annualNet / 12)) : Infinity;

    // Benefit sources (annual)
    const sourceTime = Math.max(0, baselineAccessOps - withAccessOps);
    const sourcePwd = Math.max(0, baselinePwd - withPwd);
    const sourceAudit = Math.max(0, baselineAudit - withAudit);

    // Qualitative badges
    let roiBadge = "—";
    if (Number.isFinite(roi)) {
      if (roi >= 0.75) roiBadge = "Strong";
      else if (roi >= 0.25) roiBadge = "Moderate";
      else if (roi >= 0) roiBadge = "Low";
      else roiBadge = "Negative";
    }

    let paybackBadge = "No payback";
    if (paybackMonths !== Infinity) {
      if (paybackMonths <= 12) paybackBadge = "Fast";
      else if (paybackMonths <= 24) paybackBadge = "Normal";
      else paybackBadge = "Long";
    }

    // Dynamic executive insights
    const insights = [];
    if (netBenefit <= 0) {
      insights.push("ROI is currently negative. Consider tuning implementation cost, optimizing license tier, or evaluating higher user adoption.");
    } else {
      insights.push(`Projected net economic benefit of ${formatUSD(netBenefit)} over ${years} years with an expected return of ${(roi * 100).toFixed(1)}%.`);
    }

    if (paybackMonths <= 18) {
      insights.push(`Rapid payback period of ${paybackMonths.toFixed(1)} months enables capital recovery within the second fiscal year.`);
    } else if (paybackMonths !== Infinity) {
      insights.push(`Capital payback period is estimated at ${paybackMonths.toFixed(1)} months based on automated provisioning and audit efficiencies.`);
    }

    const topBenefit = Math.max(sourceTime, sourcePwd, sourceAudit, riskBenefitAnnual, prodBenefitAnnual);
    if (topBenefit === prodBenefitAnnual) {
      insights.push(`Workforce productivity recovery (${formatUSD(prodBenefitAnnual)}/yr) represents your largest financial value driver.`);
    } else if (topBenefit === sourceTime) {
      insights.push(`Automated lifecycle provisioning time savings (${formatUSD(sourceTime)}/yr) is the primary driver of IT ops reduction.`);
    } else if (topBenefit === riskBenefitAnnual) {
      insights.push(`Prevented unauthorized access and breach risk avoidance (${formatUSD(riskBenefitAnnual)}/yr) provides primary risk protection.`);
    }

    // Cumulative net cashflow array across the horizon years for Line Chart
    const cumulativeBenefit = [];
    let cum = -oneTime;
    for (let yr = 1; yr <= years; yr++) {
      cum += annualNet;
      cumulativeBenefit.push(cum);
    }

    return {
      scenarioLabel: scn.label,
      years,
      reqPerYear,
      baselineAccessOps,
      baselinePwd,
      baselineAudit,
      baselineAnnual,
      withAccessOps,
      withPwd,
      withAudit,
      adminAnnual,
      solutionOpexAnnual,
      riskBenefitAnnual,
      prodBenefitAnnual,
      annualSavings,
      annualBenefitsTotal,
      oneTime,
      totalSolutionCost,
      totalBaselineCost,
      totalAdditionalBenefits,
      netBenefit,
      roi,
      annualNet,
      paybackMonths,
      sourceTime,
      sourcePwd,
      sourceAudit,
      roiBadge,
      paybackBadge,
      insights,
      cumulativeBenefit,
    };
  }, [inputs, selectedScenario, horizonYears]);

  // Max value for bar chart
  const maxCostAvoided = Math.max(
    model.baselineAnnual,
    model.solutionOpexAnnual + model.oneTime,
    1
  );

  // Line chart scaling
  const minCumIdam = Math.min(...model.cumulativeBenefit, -model.oneTime, 0);
  const maxCumIdam = Math.max(...model.cumulativeBenefit, 1);
  const cumRangeIdam = maxCumIdam - minCumIdam || 1;

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
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">IDAM ROI Calculator</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 mb-2">
                <LuKeyRound className="size-3.5" />
                <span>Identity & Access Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                IDAM ROI Calculator
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
                Measure the ROI, cost avoidance, automated provisioning efficiencies, and risk reduction of an enterprise Identity & Access Management deployment.
              </p>
            </div>

            {/* Actions & Controls */}
            <div className="flex flex-wrap items-center gap-2 print:hidden shrink-0">
              {/* Scenario Toggle */}
              <div className="inline-flex rounded-lg border border-neutral-200 dark:border-white/10 p-1 bg-white dark:bg-neutral-900">
                {Object.entries(SCENARIOS).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedScenario(key)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      selectedScenario === key
                        ? "bg-amber-600 text-white shadow-xs"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Time Horizon Toggle */}
              <div className="inline-flex rounded-lg border border-neutral-200 dark:border-white/10 p-1 bg-white dark:bg-neutral-900">
                {[1, 3, 5].map((yrs) => (
                  <button
                    key={yrs}
                    onClick={() => setHorizonYears(yrs)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      horizonYears === yrs
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {yrs}Y
                  </button>
                ))}
              </div>

              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {saveToast ? <LuCheck className="size-3.5 text-emerald-600" /> : <LuSave className="size-3.5" />}
                <span>{saveToast ? "Saved" : "Save"}</span>
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <LuRotateCcw className="size-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <LuPrinter className="size-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Mini Navigation Bar */}
        <CalculatorNav active="idam" />

        {/* Concise Functional Description Block */}
        <div className="mb-8 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/5 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-3">
          <LuInfo className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-900 dark:text-amber-300">How this model works:</span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              This calculator analyzes baseline access ticketing overhead, self-service password reduction, audit certification effort, and workforce onboarding latency. It models recurring SaaS licenses and implementation costs against productivity gains and risk mitigation across customizable scenarios.
            </p>
          </div>
        </div>

        {/* Executive Readout (4 Core KPIs Readout - Kept Completely Intact) */}
        <section className="mb-10" aria-label="Executive Readout">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LuTrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Executive Readout
              </h2>
            </div>
            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Active Model: <span className="text-amber-700 dark:text-amber-400">{model.scenarioLabel}</span> • <span className="text-neutral-800 dark:text-neutral-200">{model.years}-Year Horizon</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Expected ROI */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Expected ROI</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    model.roi >= 0.25
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {model.roiBadge}
                </span>
              </div>
              <div className="mt-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {Number.isFinite(model.roi) ? `${(model.roi * 100).toFixed(1)}%` : "—"}
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Net return over {model.years}-year horizon
              </div>
            </div>

            {/* KPI 2: Net Benefit */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Net Benefit (Horizon)</span>
                <span className="text-[10px] font-semibold text-neutral-400">Cumulative</span>
              </div>
              <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatUSD(model.netBenefit)}
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Baseline avoided minus solution costs
              </div>
            </div>

            {/* KPI 3: Annual Net Improvement */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Annual Net Improvement</span>
                <span className="text-[10px] font-semibold text-neutral-400">Recurring</span>
              </div>
              <div className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-white">
                {formatUSD(model.annualNet)}
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Recurring annual cashflow boost
              </div>
            </div>

            {/* KPI 4: Payback Period */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Payback Period</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    model.paybackMonths <= 18
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  {model.paybackBadge}
                </span>
              </div>
              <div className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-white">
                {model.paybackMonths === Infinity ? "N/A" : `${model.paybackMonths.toFixed(1)} mo`}
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Time to break even on one-time investment
              </div>
            </div>
          </div>
        </section>

        {/* Main Workspace: Side-by-Side Split Architecture */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Vertically Stacked Inputs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category 1: Organization & Workload */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <LuBuilding2 className="size-5 text-amber-600 dark:text-amber-400" />
                  Organization & Workload
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Identity volume, applications, and access request provisioning velocity.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Employees (Total Headcount)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.employees}
                    onChange={(e) => handleInputChange("employees", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Total employees and contractors covered by IDAM.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Apps / Systems Integrated
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.apps}
                    onChange={(e) => handleInputChange("apps", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Target cloud, on-premises, and legacy applications.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Access Requests per User / Month
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={inputs.reqPerUserMonth}
                    onChange={(e) => handleInputChange("reqPerUserMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Joiner/Mover/Leaver (JML) and privilege grant requests.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Current Time (min/req)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={inputs.minsPerRequestCurrent}
                      onChange={(e) => handleInputChange("minsPerRequestCurrent", e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                    <p className="mt-1 text-[11px] text-neutral-400">Manual approval + ticketing time.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      With IDAM (min/req)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={inputs.minsPerRequestNew}
                      onChange={(e) => handleInputChange("minsPerRequestNew", e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                    <p className="mt-1 text-[11px] text-neutral-400">Automated birthright & RBAC speed.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Blended Ops Hourly Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.opsHourly}
                    onChange={(e) => handleInputChange("opsHourly", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Fully loaded rate for IT helpdesk / IAM administrators.</p>
                </div>
              </div>
            </div>

            {/* Category 2: Passwords & Audit (Current Baseline) */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <LuReceipt className="size-5 text-amber-600 dark:text-amber-400" />
                  Passwords & Audit (Current Baseline)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Helpdesk password ticket volume and compliance audit evidence gathering.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Password Reset Tickets / Month
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.pwdResetsMonth}
                    onChange={(e) => handleInputChange("pwdResetsMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Monthly user lockout tickets handled by Tier 1 support.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Cost per Password Reset ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.pwdResetCost}
                    onChange={(e) => handleInputChange("pwdResetCost", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Direct support cost per password ticket (benchmark: $18-$35).</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Audit & Review Effort (Hours / Month)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.auditHoursMonth}
                    onChange={(e) => handleInputChange("auditHoursMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Hours spent collating logs, manager reviews, and access certifications.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Audit Hourly Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.auditHourly}
                    onChange={(e) => handleInputChange("auditHourly", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Loaded cost for internal compliance auditors and security leads.</p>
                </div>
              </div>
            </div>

            {/* Category 3: IDAM Solution Investment */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <LuBoxes className="size-5 text-amber-600 dark:text-amber-400" />
                  IDAM Solution Investment
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Platform subscription, systems integration, admin staffing, and maintenance.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Platform Licenses (Annual $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.licenseAnnual}
                    onChange={(e) => handleInputChange("licenseAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Annual recurring IDAM software licenses / SaaS fees.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                    <p className="mt-1 text-[11px] text-neutral-400">Professional services & connectors.</p>
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
                    <p className="mt-1 text-[11px] text-neutral-400">Change management & training.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Admin FTE (With IDAM)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={inputs.adminFTE}
                      onChange={(e) => handleInputChange("adminFTE", e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                    <p className="mt-1 text-[11px] text-neutral-400">Dedicated IDAM operational staff.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Cost per FTE ($/year)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.fteCost}
                      onChange={(e) => handleInputChange("fteCost", e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                    <p className="mt-1 text-[11px] text-neutral-400">Fully burdened cost per admin.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Support & Maintenance (Annual $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.supportAnnual}
                    onChange={(e) => handleInputChange("supportAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Vendor 24x7 SLA support and patch maintenance.</p>
                </div>
              </div>
            </div>

            {/* Category 4: Business Impact Drivers */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <LuSlidersHorizontal className="size-5 text-amber-600 dark:text-amber-400" />
                  Business Impact Drivers (Scenario Levers)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Percentage gains applied across password reduction, risk avoidance, and user speed.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Password Reduction (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={inputs.pwdReductionPct}
                      onChange={(e) => handleInputChange("pwdReductionPct", e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                    <p className="mt-1 text-[11px] text-neutral-400">Self-service password reset gains.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Audit Reduction (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={inputs.auditReductionPct}
                      onChange={(e) => handleInputChange("auditReductionPct", e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                    <p className="mt-1 text-[11px] text-neutral-400">Automated certification reporting.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Annual Risk Exposure ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.riskLossAnnual}
                      onChange={(e) => handleInputChange("riskLossAnnual", e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                    <p className="mt-1 text-[11px] text-neutral-400">Expected annual loss from access breaches.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Risk Reduction (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={inputs.riskReductionPct}
                      onChange={(e) => handleInputChange("riskReductionPct", e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                    <p className="mt-1 text-[11px] text-neutral-400">Breach reduction via least privilege.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Hours Saved / User / Yr
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={inputs.prodHoursPerUser}
                      onChange={(e) => handleInputChange("prodHoursPerUser", e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                    <p className="mt-1 text-[11px] text-neutral-400">Elimination of user wait-time.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      User Value Rate ($/hr)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={inputs.prodHourly}
                      onChange={(e) => handleInputChange("prodHourly", e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                    <p className="mt-1 text-[11px] text-neutral-400">Blended employee productivity value.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Dynamic Charts (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {/* 1. LINE CHART FIRST (Top): Cumulative Net Benefit Trend */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <LuTrendingUp className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>Cumulative Net Benefit</span>
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {model.paybackMonths === Infinity ? "No payback" : `Payback: ${model.paybackMonths.toFixed(1)} mo`}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Net cashflow trajectory after upfront deployment and ongoing operational savings.
              </p>

              {/* Pure SVG Line / Trend Chart */}
              <div className="w-full h-44 pt-2">
                <div className="relative w-full h-32 border-b border-neutral-200 dark:border-white/10">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 130">
                    {/* Zero baseline */}
                    {minCumIdam < 0 && (
                      <line
                        x1="0"
                        y1={130 - (Math.abs(minCumIdam) / cumRangeIdam) * 130}
                        x2="500"
                        y2={130 - (Math.abs(minCumIdam) / cumRangeIdam) * 130}
                        stroke="currentColor"
                        strokeDasharray="4 4"
                        className="text-neutral-300 dark:text-white/20"
                      />
                    )}

                    {(() => {
                      const points = model.cumulativeBenefit.map((val, i) => {
                        const denom = Math.max(1, model.years - 1);
                        const x = (i / denom) * 440 + 30;
                        const y = 130 - ((val - minCumIdam) / cumRangeIdam) * 105 - 12;
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
                                {formatUSD(p.val)}
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>

                <div className="flex justify-between items-center px-1 pt-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  {Array.from({ length: model.years }).map((_, i) => (
                    <span key={i}>Y{i + 1}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. BAR CHART SECOND (Below): Cost vs. Cost Avoided */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <LuLayers className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>Cost vs. Cost Avoided</span>
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {model.scenarioLabel}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Baseline cost vs. IDAM total cost (Year 1 includes upfront capex).
              </p>

              <div className="w-full h-40 flex items-end justify-between gap-3 px-2 border-b border-neutral-200 dark:border-white/10 pb-2">
                {Array.from({ length: model.years }).map((_, i) => {
                  const yearNum = i + 1;
                  const baselineVal = model.baselineAnnual;
                  const solutionVal = model.solutionOpexAnnual + (i === 0 ? model.oneTime : 0);

                  const bH = Math.max(10, (baselineVal / maxCostAvoided) * 100);
                  const sH = Math.max(10, (solutionVal / maxCostAvoided) * 100);

                  return (
                    <div key={yearNum} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1.5 h-full">
                        {/* Baseline */}
                        <div
                          className="w-1/2 max-w-[20px] bg-rose-500/80 hover:bg-rose-500 rounded-t-sm transition-all relative group"
                          style={{ height: `${bH}%` }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                            {formatUSD(baselineVal)}
                          </div>
                        </div>
                        {/* With IDAM */}
                        <div
                          className="w-1/2 max-w-[20px] bg-amber-500/80 hover:bg-amber-500 rounded-t-sm transition-all relative group"
                          style={{ height: `${sH}%` }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                            {formatUSD(solutionVal)}
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
                  <span className="text-neutral-600 dark:text-neutral-400">Baseline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-xs bg-amber-500" />
                  <span className="text-neutral-600 dark:text-neutral-400">With IDAM</span>
                </div>
              </div>
            </div>

            {/* 3. Solution Cost Breakdown */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Solution Cost Breakdown
                </h3>
                <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
                  {formatUSD(model.totalSolutionCost)}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Total solution investments across the {model.years}-year horizon.
              </p>

              <div className="space-y-2 py-1">
                {[
                  { label: "Licenses", val: inputs.licenseAnnual * model.years, color: "bg-amber-500" },
                  { label: "Implementation", val: inputs.implOneTime, color: "bg-amber-700" },
                  { label: "Admin / Ops FTE", val: inputs.adminFTE * inputs.fteCost * model.years, color: "bg-orange-500" },
                  { label: "Support & Maint.", val: inputs.supportAnnual * model.years, color: "bg-amber-400" },
                  { label: "Training & Adoption", val: inputs.trainingOneTime, color: "bg-yellow-500" },
                ].map((item, idx) => {
                  const pct = model.totalSolutionCost > 0 ? (item.val / model.totalSolutionCost) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-neutral-700 dark:text-neutral-300">
                        <span className="flex items-center gap-1.5">
                          <span className={`size-2 rounded-full ${item.color}`} />
                          <span>{item.label}</span>
                        </span>
                        <span className="font-mono">{formatUSD(item.val)} ({pct.toFixed(0)}%)</span>
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
                  {formatUSD(model.annualBenefitsTotal)}/yr
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Annual value generated through automation, audits, and risk control.
              </p>

              <div className="space-y-2 py-1">
                {[
                  { label: "Workforce Productivity", val: model.prodBenefitAnnual, color: "bg-emerald-500" },
                  { label: "Provisioning Time Savings", val: model.sourceTime, color: "bg-amber-500" },
                  { label: "Risk Incident Avoidance", val: model.riskBenefitAnnual, color: "bg-teal-500" },
                  { label: "Password Reset Savings", val: model.sourcePwd, color: "bg-amber-600" },
                  { label: "Audit Effort Reduction", val: model.sourceAudit, color: "bg-amber-400" },
                ].map((item, idx) => {
                  const totalB = model.prodBenefitAnnual + model.sourceTime + model.riskBenefitAnnual + model.sourcePwd + model.sourceAudit || 1;
                  const pct = (item.val / totalB) * 100;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-neutral-700 dark:text-neutral-300">
                        <span className="flex items-center gap-1.5">
                          <span className={`size-2 rounded-full ${item.color}`} />
                          <span>{item.label}</span>
                        </span>
                        <span className="font-mono">{formatUSD(item.val)} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Insights Box */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 mb-2">
                <LuLightbulb className="size-4 text-amber-600 dark:text-amber-400" />
                <span>Key Analytical Insights</span>
              </div>
              <ul className="space-y-1 text-xs text-neutral-700 dark:text-neutral-300 list-disc list-inside">
                {model.insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Detailed Financial Comparison Table (Bottom Area Kept Intact) */}
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs overflow-hidden">
          <div className="border-b border-neutral-200 dark:border-white/10 pb-4 mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Baseline vs. IDAM Solution Comparison
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Side-by-side assessment across operating expenses and multi-year savings realization.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Cost / Benefit Component</th>
                  <th className="py-3 px-4 text-right">Annual Baseline</th>
                  <th className="py-3 px-4 text-right">With IDAM (Annual)</th>
                  <th className="py-3 px-4 text-right">{model.years}-Year Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5 text-neutral-700 dark:text-neutral-300">
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Access Request Operations Effort</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatUSD(model.baselineAccessOps)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatUSD(model.withAccessOps)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatUSD(model.sourceTime * model.years)} saved</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Password Reset Helpdesk Costs</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatUSD(model.baselinePwd)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatUSD(model.withPwd)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatUSD(model.sourcePwd * model.years)} saved</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Audit & Access Certification Reviews</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatUSD(model.baselineAudit)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatUSD(model.withAudit)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatUSD(model.sourceAudit * model.years)} saved</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Software Licenses & Maintenance</td>
                  <td className="py-3 px-4 text-right font-mono">$0</td>
                  <td className="py-3 px-4 text-right font-mono">{formatUSD(inputs.licenseAnnual + inputs.supportAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatUSD((inputs.licenseAnnual + inputs.supportAnnual) * model.years)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Dedicated Admin / Operations FTE</td>
                  <td className="py-3 px-4 text-right font-mono">$0</td>
                  <td className="py-3 px-4 text-right font-mono">{formatUSD(model.adminAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatUSD(model.adminAnnual * model.years)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Implementation & Change Management (One-time)</td>
                  <td className="py-3 px-4 text-right font-mono">$0</td>
                  <td className="py-3 px-4 text-right font-mono">{formatUSD(model.oneTime)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatUSD(model.oneTime)}</td>
                </tr>
                <tr className="bg-neutral-50/60 dark:bg-white/[0.02] font-semibold text-neutral-900 dark:text-white">
                  <td className="py-3 px-4">Workforce Productivity Value Added</td>
                  <td className="py-3 px-4 text-right font-mono">—</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatUSD(model.prodBenefitAnnual)}/yr</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatUSD(model.prodBenefitAnnual * model.years)}</td>
                </tr>
                <tr className="bg-neutral-50/60 dark:bg-white/[0.02] font-semibold text-neutral-900 dark:text-white">
                  <td className="py-3 px-4">Risk Incident Expected Loss Avoidance</td>
                  <td className="py-3 px-4 text-right font-mono">—</td>
                  <td className="py-3 px-4 text-right font-mono text-teal-600 dark:text-teal-400">+{formatUSD(model.riskBenefitAnnual)}/yr</td>
                  <td className="py-3 px-4 text-right font-mono text-teal-600 dark:text-teal-400">+{formatUSD(model.riskBenefitAnnual * model.years)}</td>
                </tr>
                <tr className="border-t border-neutral-200 dark:border-white/10 bg-amber-500/5 dark:bg-amber-500/10 font-bold text-amber-900 dark:text-amber-300">
                  <td className="py-3 px-4">Net Economic Benefit</td>
                  <td className="py-3 px-4 text-right font-mono">{formatUSD(model.baselineAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatUSD(model.annualNet)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatUSD(model.netBenefit)}</td>
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
