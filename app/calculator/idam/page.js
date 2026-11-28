"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CalculatorNav } from "@/components/calculators/calculator-nav";
import { formatCurrency as formatCurrencyUtil, getCurrencySymbol } from "@/lib/currency";
import { exportSectionsToCSV, triggerPrint } from "@/lib/export-utils";
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
  LuChartBar,
  LuLayers,
  LuShieldCheck,
  LuSparkles,
  LuInfo,
  LuBuilding2,
  LuReceipt,
  LuBoxes,
  LuSlidersHorizontal,
  LuBot,
  LuFileSpreadsheet
} from "react-icons/lu";

const IDAM_STORAGE_KEY = "idam_roi_inputs_v2";

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

  // Category 2: Non-Human Identities (NHI) & Machine Secrets (NEW!)
  nhiServiceAccounts: 1200,
  nhiApiKeys: 3500,
  nhiRiskLossAnnual: 220000,
  nhiGovernanceReductionPct: 65,

  // Category 3: Passwords & Audit (Current)
  pwdResetsMonth: 900,
  pwdResetCost: 22,
  auditHoursMonth: 80,
  auditHourly: 95,

  // Category 4: IDAM Solution Investment
  licenseAnnual: 210000,
  implOneTime: 380000,
  trainingOneTime: 55000,
  adminFTE: 1.5,
  fteCost: 135000,
  supportAnnual: 45000,

  // Category 5: Business Impact Drivers
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

function formatPercent(val) {
  if (!Number.isFinite(val)) return "–";
  return `${(val * 100).toFixed(1)}%`;
}

function IdamCalculatorContent() {
  const searchParams = useSearchParams();
  const investmentParam = searchParams?.get("investment");
  const currencyParam = searchParams?.get("currency");

  // Initialize state cleanly avoiding setState in useEffect
  const [inputs, setInputs] = useState(() => {
    let base = { ...IDAM_DEFAULTS };
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(IDAM_STORAGE_KEY);
        if (saved) {
          base = { ...base, ...JSON.parse(saved) };
        }
      } catch (_) {}
    }
    if (investmentParam) {
      const parsed = parseFloat(investmentParam);
      if (!isNaN(parsed) && parsed > 0) {
        base.licenseAnnual = parsed < 10000 ? parsed * 1000 : parsed;
      }
    }
    return base;
  });

  const [selectedScenario, setSelectedScenario] = useState("exp");
  const [horizonYears, setHorizonYears] = useState(3);
  const [currency, setCurrency] = useState(() =>
    currencyParam?.toUpperCase() === "INR" ? "INR" : "USD"
  );
  const [saveToast, setSaveToast] = useState(false);

  const formatMoney = useCallback(
    (val, compact = false) => {
      return formatCurrencyUtil(val, currency, compact);
    },
    [currency]
  );

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
    triggerPrint();
  };

  // IDAM mathematical model with NHI governance integration
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
    const nhiGovernanceReduction = clamp((inputs.nhiGovernanceReductionPct / 100) * mult, 0, 1);

    const withPwd = baselinePwd * (1 - pwdReduction);
    const withAudit = baselineAudit * (1 - auditReduction);

    const adminAnnual = inputs.adminFTE * inputs.fteCost;
    const solutionOpexAnnual = withAccessOps + withPwd + withAudit + inputs.licenseAnnual + inputs.supportAnnual + adminAnnual;

    // Additional benefits beyond baseline savings
    const riskBenefitAnnual = inputs.riskLossAnnual * riskReduction;
    const prodBenefitAnnual = (inputs.employees * inputs.prodHoursPerUser) * inputs.prodHourly * mult;

    // NHI Non-Human Identities annual security benefit
    const nhiBenefitAnnual = inputs.nhiRiskLossAnnual * nhiGovernanceReduction;

    // Annual net cashflow (savings + added benefits)
    const annualSavings = baselineAnnual - solutionOpexAnnual;
    const annualBenefitsTotal = Math.max(0, annualSavings) + riskBenefitAnnual + prodBenefitAnnual + nhiBenefitAnnual;

    // Total model over horizon
    const oneTime = inputs.implOneTime + inputs.trainingOneTime;
    const totalSolutionCost = oneTime + (solutionOpexAnnual * years);
    const totalBaselineCost = baselineAnnual * years;

    const totalAdditionalBenefits = (riskBenefitAnnual + prodBenefitAnnual + nhiBenefitAnnual) * years;
    const netBenefit = (totalBaselineCost - totalSolutionCost) + totalAdditionalBenefits;

    const roi = totalSolutionCost > 0 ? (netBenefit / totalSolutionCost) : 0;

    // Payback on one-time cost using annual net improvement
    const annualNet = (baselineAnnual - solutionOpexAnnual) + (riskBenefitAnnual + prodBenefitAnnual + nhiBenefitAnnual);
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
      insights.push(`Projected net economic benefit of ${formatMoney(netBenefit)} over ${years} years with an expected return of ${(roi * 100).toFixed(1)}%.`);
    }

    if (paybackMonths <= 18) {
      insights.push(`Rapid payback period of ${paybackMonths.toFixed(1)} months enables capital recovery within the second fiscal year.`);
    } else if (paybackMonths !== Infinity) {
      insights.push(`Capital payback period is estimated at ${paybackMonths.toFixed(1)} months based on automated provisioning and audit efficiencies.`);
    }

    const topBenefit = Math.max(sourceTime, sourcePwd, sourceAudit, riskBenefitAnnual, prodBenefitAnnual, nhiBenefitAnnual);
    if (topBenefit === prodBenefitAnnual) {
      insights.push(`Workforce productivity recovery (${formatMoney(prodBenefitAnnual)}/yr) represents your largest financial value driver.`);
    } else if (topBenefit === nhiBenefitAnnual) {
      insights.push(`Non-Human Identity (NHI) governance (${formatMoney(nhiBenefitAnnual)}/yr) provides primary risk protection against machine credential compromise.`);
    } else if (topBenefit === sourceTime) {
      insights.push(`Automated lifecycle provisioning time savings (${formatMoney(sourceTime)}/yr) is the primary driver of IT ops reduction.`);
    } else if (topBenefit === riskBenefitAnnual) {
      insights.push(`Prevented unauthorized access and breach risk avoidance (${formatMoney(riskBenefitAnnual)}/yr) provides primary risk protection.`);
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
      nhiBenefitAnnual,
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
  }, [inputs, selectedScenario, horizonYears, formatMoney]);

  // Handle CSV Export
  const handleExportCSV = () => {
    const sections = [
      {
        title: "Executive Readout & Projections",
        items: [
          ["Currency", currency, ""],
          ["Scenario", model.scenarioLabel, ""],
          ["Time Horizon", `${model.years} Years`, ""],
          ["Net Economic Benefit", formatMoney(model.netBenefit), "Net value over horizon"],
          ["ROI", formatPercent(model.roi), model.roiBadge],
          ["Payback Period", model.paybackMonths !== Infinity ? `${model.paybackMonths.toFixed(1)} Months` : "N/A", model.paybackBadge],
          ["Total Solution Cost", formatMoney(model.totalSolutionCost), "One-time + OpEx over horizon"],
          ["Annual Benefits Total", formatMoney(model.annualBenefitsTotal), "Annualized savings and risk reduction"],
        ],
      },
      {
        title: "Non-Human Identities (NHI) & Machine Secrets",
        items: [
          ["Service Accounts & Bots", inputs.nhiServiceAccounts, "Unmanaged service accounts"],
          ["API Keys & CI/CD Secrets", inputs.nhiApiKeys, "Machine tokens & webhooks"],
          ["Annual NHI Breach Risk Exposure", formatMoney(inputs.nhiRiskLossAnnual), "Financial exposure from exposed secrets"],
          ["Governance Risk Reduction Rate", `${inputs.nhiGovernanceReductionPct}%`, "Attack surface eliminated via IDAM"],
          ["Annual NHI Security Benefit", formatMoney(model.nhiBenefitAnnual), "Direct avoided breach risk"],
        ],
      },
      {
        title: "Organization & Workload Baseline",
        items: [
          ["Total Employees", inputs.employees, ""],
          ["Protected Enterprise Apps", inputs.apps, ""],
          ["Requests / User / Month", inputs.reqPerUserMonth, ""],
          ["Current Mins / Request", inputs.minsPerRequestCurrent, "Manual workflow"],
          ["New Mins / Request", inputs.minsPerRequestNew, "Automated IDAM"],
          ["IT Operations Hourly Rate", formatMoney(inputs.opsHourly), ""],
          ["Baseline Annual IT Cost", formatMoney(model.baselineAnnual), "Pre-solution operations"],
        ],
      },
      {
        title: "IDAM Solution Investment",
        items: [
          ["Annual Software License", formatMoney(inputs.licenseAnnual), "Recurring subscription"],
          ["Implementation (One-time)", formatMoney(inputs.implOneTime), "Professional services"],
          ["Training (One-time)", formatMoney(inputs.trainingOneTime), "Admin & user enablement"],
          ["Ongoing Annual Support", formatMoney(inputs.supportAnnual), "Vendor maintenance"],
          ["Admin FTE Count", inputs.adminFTE, ""],
          ["Admin FTE Cost", formatMoney(inputs.fteCost), "Loaded salary"],
          ["One-time Capital Investment", formatMoney(model.oneTime), ""],
          ["Annual Solution OpEx", formatMoney(model.solutionOpexAnnual), ""],
        ],
      },
    ];

    exportSectionsToCSV("idam-roi-analysis.csv", sections);
  };

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
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">IDAM ROI & NHI Calculator</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 mb-2">
                <LuKeyRound className="size-3.5" />
                <span>Identity & Access Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                IDAM ROI & NHI Calculator
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
                Measure the economic ROI, automated provisioning efficiencies, Non-Human Identity (NHI) machine secrets protection, and password reset avoidance from enterprise IDAM.
              </p>
            </div>

            {/* Actions & Controls */}
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

              {/* Scenario Toggle */}
              <div className="inline-flex rounded-lg border border-neutral-200 dark:border-white/10 p-1 bg-white dark:bg-neutral-900">
                {Object.entries(SCENARIOS).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
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
                    type="button"
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
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {saveToast ? <LuCheck className="size-3.5 text-emerald-600" /> : <LuSave className="size-3.5" />}
                <span>{saveToast ? "Saved" : "Save"}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <LuRotateCcw className="size-3.5" />
                <span>Reset</span>
              </button>

              {/* CSV Export */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <LuFileSpreadsheet className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>CSV</span>
              </button>

              {/* Print / PDF */}
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <LuPrinter className="size-3.5" />
                <span>Print / PDF</span>
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
            <span className="font-bold text-amber-900 dark:text-amber-300">Enterprise Model Architecture:</span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              This model quantifies the financial return of automating user lifecycles (Joiner-Mover-Leaver), self-service password resets, and compliance audits. Additionally, it models <strong>Non-Human Identity (NHI) Governance</strong> across service accounts, API keys, and machine tokens to prevent credential exposure.
            </p>
          </div>
        </div>

        {/* Executive Readout (KPI Cards) */}
        <section className="mb-10" aria-label="Key Performance Indicators">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LuTrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Executive Readout ({model.years}-Year Horizon, {model.scenarioLabel} Scenario)
              </h2>
            </div>
            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Active Currency: <span className="text-amber-600 dark:text-orange-400 font-bold">{currency} ({getCurrencySymbol(currency)})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* ROI Metric */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Projected ROI</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20">
                  {model.roiBadge}
                </span>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {formatPercent(model.roi)}
              </div>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Over {model.years} fiscal years
              </p>
            </div>

            {/* Net Economic Benefit */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Net Economic Benefit</span>
                <LuDollarSign className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 truncate">
                {formatMoney(model.netBenefit, true)}
              </div>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Total savings & efficiency minus all costs
              </p>
            </div>

            {/* Payback Period */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Capital Payback</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {model.paybackBadge}
                </span>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-neutral-900 dark:text-white">
                {model.paybackMonths !== Infinity ? `${model.paybackMonths.toFixed(1)} mo` : "N/A"}
              </div>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Break-even on one-time implementation
              </p>
            </div>

            {/* Total Solution Cost */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Solution Cost</span>
                <LuBoxes className="size-4 text-neutral-400" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-neutral-900 dark:text-white truncate">
                {formatMoney(model.totalSolutionCost, true)}
              </div>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                CapEx ({formatMoney(model.oneTime, true)}) + OpEx ({formatMoney(model.solutionOpexAnnual * model.years, true)})
              </p>
            </div>
          </div>
        </section>

        {/* Main Grid: Inputs Left vs Charts Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT: 5 Input Categories */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category 1: Organization & Workload */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">1</span>
                  Organization Scale & Request Workload
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Workforce headcount, target application footprint, and manual provisioning overhead.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <p className="mt-1 text-[11px] text-neutral-400">Identities governed under IDAM scope.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Integrated Applications
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.apps}
                    onChange={(e) => handleInputChange("apps", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">SaaS, cloud, and legacy on-premises apps.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Access Requests / User / Month
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={inputs.reqPerUserMonth}
                    onChange={(e) => handleInputChange("reqPerUserMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Joiner, mover, leaver, and role change requests.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    IT Operations Hourly Rate ({getCurrencySymbol(currency)}/hr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.opsHourly}
                    onChange={(e) => handleInputChange("opsHourly", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Loaded hourly rate for helpdesk/IT ops.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Current Mins / Request (Manual)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputs.minsPerRequestCurrent}
                    onChange={(e) => handleInputChange("minsPerRequestCurrent", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Approval, ticket review, and manual provisioning.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    New Mins / Request (Automated)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.minsPerRequestNew}
                    onChange={(e) => handleInputChange("minsPerRequestNew", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Target workflow automation latency with IDAM.</p>
                </div>
              </div>
            </div>

            {/* Category 2: Non-Human Identities (NHI) & Machine Secrets (NEW!) */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-white via-neutral-50/80 to-amber-50/20 dark:from-neutral-900/90 dark:via-neutral-900 dark:to-amber-950/20 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-400 text-xs font-bold">2</span>
                    Non-Human Identities (NHI) & Machine Secrets
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-400 border border-amber-500/20">
                    <LuBot className="size-3 text-amber-600 dark:text-amber-400" />
                    NHI Protection
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Govern service accounts, bot credentials, API keys, and CI/CD machine secrets to eradicate static token exposure.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Service Accounts & Bots
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.nhiServiceAccounts}
                    onChange={(e) => handleInputChange("nhiServiceAccounts", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-white dark:bg-neutral-800/70 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Active machine service identities.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    API Keys & CI/CD Pipeline Secrets
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.nhiApiKeys}
                    onChange={(e) => handleInputChange("nhiApiKeys", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-white dark:bg-neutral-800/70 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Machine access keys across repositories and clouds.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    NHI Annual Breach Exposure ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.nhiRiskLossAnnual}
                    onChange={(e) => handleInputChange("nhiRiskLossAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-white dark:bg-neutral-800/70 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Financial exposure from leaked machine credentials.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    NHI Risk Reduction (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.nhiGovernanceReductionPct}
                    onChange={(e) => handleInputChange("nhiGovernanceReductionPct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-white dark:bg-neutral-800/70 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Attack surface eliminated through automated NHI discovery.</p>
                </div>
              </div>

              {/* Live NHI Benefit Callout */}
              <div className="mt-4 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <LuSparkles className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Governing <strong>{(inputs.nhiServiceAccounts + inputs.nhiApiKeys).toLocaleString()}</strong> machine secrets eliminates static token leaks.
                  </span>
                </div>
                <div className="font-mono font-bold text-amber-700 dark:text-amber-300 shrink-0">
                  + {formatMoney(model.nhiBenefitAnnual)}/yr in avoided breach risk
                </div>
              </div>
            </div>

            {/* Category 3: Passwords & Audit (Current) */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">3</span>
                  Password Helpdesk & Compliance Audit Costs
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Current recurring expenses for password resets and preparation for internal/external audits.
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
                    value={inputs.pwdResetsMonth}
                    onChange={(e) => handleInputChange("pwdResetsMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Helpdesk tickets for account unlocks & resets.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Cost Per Password Reset ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.pwdResetCost}
                    onChange={(e) => handleInputChange("pwdResetCost", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Industry average ranges from $18 to $30.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Audit Prep Hours / Month
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.auditHoursMonth}
                    onChange={(e) => handleInputChange("auditHoursMonth", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Staff time pulling access certification reports.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Auditor / Compliance Hourly Rate ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.auditHourly}
                    onChange={(e) => handleInputChange("auditHourly", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Loaded rate for compliance specialists.</p>
                </div>
              </div>
            </div>

            {/* Category 4: IDAM Solution Investment */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">4</span>
                  IDAM Solution Investment
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Software licensing, implementation services, training, and ongoing administration.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Software License ({getCurrencySymbol(currency)}/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.licenseAnnual}
                    onChange={(e) => handleInputChange("licenseAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Recurring IGA / AM platform fee.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Implementation Cost ({getCurrencySymbol(currency)}, One-Time)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.implOneTime}
                    onChange={(e) => handleInputChange("implOneTime", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Architecture, connectors, policy deployment.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Training & Enablement ({getCurrencySymbol(currency)}, One-Time)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.trainingOneTime}
                    onChange={(e) => handleInputChange("trainingOneTime", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Administrator and helpdesk certification.</p>
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
                  <p className="mt-1 text-[11px] text-neutral-400">Connector updates and SLA coverage.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Internal Admin FTE
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={inputs.adminFTE}
                    onChange={(e) => handleInputChange("adminFTE", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Dedicated IDAM administrators.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Loaded FTE Cost ({getCurrencySymbol(currency)}/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.fteCost}
                    onChange={(e) => handleInputChange("fteCost", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Fully loaded annual compensation.</p>
                </div>
              </div>
            </div>

            {/* Category 5: Business Impact Drivers */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">5</span>
                  Business Impact Drivers
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Productivity recaptured, password reset reduction, and breach risk avoidance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Password Reset Reduction (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.pwdReductionPct}
                    onChange={(e) => handleInputChange("pwdReductionPct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Target reduction via self-service portal (SSPR).</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Audit Effort Reduction (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.auditReductionPct}
                    onChange={(e) => handleInputChange("auditReductionPct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Automated access certification campaigns.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Breach Loss Risk ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.riskLossAnnual}
                    onChange={(e) => handleInputChange("riskLossAnnual", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Baseline exposure from unauthorized access & orphan accounts.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Breach Risk Reduction (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.riskReductionPct}
                    onChange={(e) => handleInputChange("riskReductionPct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Risk avoided through automated deprovisioning.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Analytics (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {/* 1. Line Chart: Cumulative Net Cashflow */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <LuTrendingUp className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>Cumulative Net Value ({currency})</span>
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  {model.years}-Year Horizon
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
                      <linearGradient id="idamGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

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

                    {/* Trend points & path */}
                    {(() => {
                      const len = model.cumulativeBenefit.length;
                      const points = model.cumulativeBenefit.map((val, i) => {
                        const x = len > 1 ? (i / (len - 1)) * 460 + 20 : 250;
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
                  {Array.from({ length: model.years }, (_, i) => i + 1).map((y) => (
                    <span key={y}>Y{y}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Grouped Cost Comparison Bar Chart */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <LuChartBar className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>Annualized Cost Avoidance ({currency})</span>
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Pre-solution baseline expenditure vs. ongoing IDAM operational run-rate.
              </p>

              <div className="w-full h-36 pt-2">
                <div className="h-28 flex items-end justify-center gap-12 border-b border-neutral-200 dark:border-white/10 pb-2">
                  {/* Baseline Bar */}
                  <div className="flex flex-col items-center gap-1 h-full justify-end w-20">
                    <div
                      className="w-full bg-rose-500/80 hover:bg-rose-500 rounded-t-sm transition-all relative group"
                      style={{ height: `${Math.max(15, (model.baselineAnnual / maxCostAvoided) * 100)}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                        {formatMoney(model.baselineAnnual)}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                      Baseline
                    </span>
                  </div>

                  {/* With IDAM Bar */}
                  <div className="flex flex-col items-center gap-1 h-full justify-end w-20">
                    <div
                      className="w-full bg-amber-500/80 hover:bg-amber-500 rounded-t-sm transition-all relative group"
                      style={{ height: `${Math.max(15, (model.solutionOpexAnnual / maxCostAvoided) * 100)}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                        {formatMoney(model.solutionOpexAnnual)}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                      With IDAM
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 mt-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-xs bg-rose-500" />
                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400">Pre-Solution Loss</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-xs bg-amber-500" />
                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400">IDAM Annual OpEx</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Executive Insights */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                <LuLightbulb className="size-3.5 text-amber-600 dark:text-amber-400" />
                Strategic Insights & Value Drivers
              </h3>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                {model.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 mt-0.5">▪</span>
                    <span className="leading-relaxed">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown Table */}
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs overflow-hidden">
          <div className="border-b border-neutral-200 dark:border-white/10 pb-4 mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Detailed IDAM Economic Breakdown ({model.years}-Year Horizon)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Annualized and multi-year accounting comparison of baseline operational costs versus IDAM economics.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Financial Driver</th>
                  <th className="py-3 px-4 text-right">Annual Baseline ({currency})</th>
                  <th className="py-3 px-4 text-right">Annual With IDAM ({currency})</th>
                  <th className="py-3 px-4 text-right">{model.years}-Year Net Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5 text-neutral-700 dark:text-neutral-300">
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Access Provisioning Ops</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(model.baselineAccessOps)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(model.withAccessOps)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney((model.baselineAccessOps - model.withAccessOps) * model.years)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Helpdesk Password Resets</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(model.baselinePwd)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(model.withPwd)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney((model.baselinePwd - model.withPwd) * model.years)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Compliance Audit Preparation</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(model.baselineAudit)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(model.withAudit)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney((model.baselineAudit - model.withAudit) * model.years)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Non-Human Identity (NHI) Protection</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatMoney(inputs.nhiRiskLossAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(inputs.nhiRiskLossAnnual - model.nhiBenefitAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(model.nhiBenefitAnnual * model.years)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Software License & Support</td>
                  <td className="py-3 px-4 text-right font-mono">—</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(inputs.licenseAnnual + inputs.supportAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney((inputs.licenseAnnual + inputs.supportAnnual) * model.years)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">One-Time Implementation & Training</td>
                  <td className="py-3 px-4 text-right font-mono">—</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(model.oneTime)}</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">-{formatMoney(model.oneTime)}</td>
                </tr>
                <tr className="border-t border-neutral-200 dark:border-white/10 bg-amber-500/5 dark:bg-amber-500/10 font-bold text-amber-900 dark:text-amber-300">
                  <td className="py-3 px-4">Net Economic Benefit / ROI</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(model.baselineAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatMoney(model.solutionOpexAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">+{formatMoney(model.netBenefit)} ({formatPercent(model.roi)})</td>
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

export default function IdamCalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
          Loading IDAM ROI Calculator...
        </div>
      }
    >
      <IdamCalculatorContent />
    </Suspense>
  );
}
