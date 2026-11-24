"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CalculatorNav } from "@/components/calculators/calculator-nav";
import {
  LuShieldCheck,
  LuCalculator,
  LuRotateCcw,
  LuPrinter,
  LuChevronRight,
  LuTrendingUp,
  LuDollarSign,
  LuAlertTriangle,
  LuClock,
  LuSparkles,
  LuInfo,
  LuCheckCircle2,
  LuBuilding2,
  LuWrench,
  LuSlidersHorizontal,
  LuLayers,
} from "react-icons/lu";

// Default configuration from MAIN site
const SOC_DEFAULTS = {
  // Current security posture
  currentSpend: 300000,
  incidentsPerYear: 120,
  avgIncidentCost: 15000,
  majorBreaches5y: 2,
  avgBreachCost: 4000000,
  mttdHours: 200,
  mttrHours: 70,

  // SOC investment – tooling & personnel
  initialTooling: 150000,
  annualPlatform: 120000,
  automationPct: 40,
  analystCount: 4,
  analystSalary: 75000,
  engineerCount: 2,
  engineerSalary: 95000,
  managerCount: 1,
  managerSalary: 120000,
  implementationCost: 100000,
  trainingBudget: 25000,
  complianceSavings: 50000,

  // Expected improvements with SOC
  breachReduction: 60,
  incidentCostReduction: 40,
  mttdImprovement: 70,
  mttrImprovement: 60,
  downtimeCostHour: 10000,
};

function formatCurrency(val) {
  if (!Number.isFinite(val)) return "$0";
  const sign = val < 0 ? "-" : "";
  const abs = Math.abs(val);
  return `${sign}$${abs.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatPercent(val) {
  if (!Number.isFinite(val)) return "–";
  return `${val.toFixed(1)}%`;
}

export default function SocCalculatorPage() {
  const [inputs, setInputs] = useState(SOC_DEFAULTS);

  const handleInputChange = (field, value) => {
    const num = parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));
  };

  const handleReset = () => {
    setInputs(SOC_DEFAULTS);
  };

  const handlePrint = () => {
    window.print();
  };

  // Mathematical logic identical to MAIN counterpart
  const results = useMemo(() => {
    const {
      incidentsPerYear,
      avgIncidentCost,
      majorBreaches5y,
      avgBreachCost,
      mttdHours,
      mttrHours,
      initialTooling,
      annualPlatform,
      analystCount,
      analystSalary,
      engineerCount,
      engineerSalary,
      managerCount,
      managerSalary,
      implementationCost,
      trainingBudget,
      complianceSavings,
      breachReduction,
      incidentCostReduction,
      mttdImprovement,
      mttrImprovement,
      downtimeCostHour,
    } = inputs;

    // Current annual incident costs
    const annualIncidentCostBefore = incidentsPerYear * avgIncidentCost;
    const annualizedMajorBreaches = majorBreaches5y / 5;
    const annualBreachCostBefore = annualizedMajorBreaches * avgBreachCost;
    const annualLossBefore = annualIncidentCostBefore + annualBreachCostBefore;

    // SOC personnel cost
    const socPersonnel =
      analystCount * analystSalary +
      engineerCount * engineerSalary +
      managerCount * managerSalary;

    // SOC annual operating cost
    const socOperatingAnnual = socPersonnel + annualPlatform + trainingBudget;

    // Annual savings & risk reduction
    const incidentSavings =
      annualIncidentCostBefore -
      incidentsPerYear * (avgIncidentCost * (1 - incidentCostReduction / 100));

    const breachSavings = annualBreachCostBefore * (breachReduction / 100);

    const downtimeSavings =
      (mttdHours * (mttdImprovement / 100) + mttrHours * (mttrImprovement / 100)) *
      annualizedMajorBreaches *
      downtimeCostHour;

    const annualBenefits =
      incidentSavings + breachSavings + downtimeSavings + complianceSavings;

    // Upfront and recurring investment
    const initialInvestment = initialTooling + implementationCost;

    // 3-Year model
    const totalBenefits3y = annualBenefits * 3;
    const totalCosts3y = initialInvestment + socOperatingAnnual * 3;
    const net3y = totalBenefits3y - totalCosts3y;
    const roi3y = totalCosts3y > 0 ? (net3y / totalCosts3y) * 100 : 0;

    // 5-Year model
    const totalBenefits5y = annualBenefits * 5;
    const totalCosts5y = initialInvestment + socOperatingAnnual * 5;
    const net5y = totalBenefits5y - totalCosts5y;
    const roi5y = totalCosts5y > 0 ? (net5y / totalCosts5y) * 100 : 0;

    // Payback period in months
    const monthlyBenefit = annualBenefits / 12;
    const paybackMonths =
      monthlyBenefit > 0
        ? Math.round((initialInvestment / monthlyBenefit) * 10) / 10
        : null;

    // Chart datasets across 5 years
    const years = [1, 2, 3, 4, 5];
    const lossData = years.map(() => annualLossBefore);
    const socCostData = years.map(() => socOperatingAnnual);

    const cumulativeSavings = [];
    let cumulative = -initialInvestment;
    years.forEach(() => {
      cumulative += annualBenefits;
      cumulativeSavings.push(cumulative);
    });

    return {
      annualIncidentCostBefore,
      annualBreachCostBefore,
      annualLossBefore,
      socPersonnel,
      socOperatingAnnual,
      incidentSavings,
      breachSavings,
      downtimeSavings,
      annualBenefits,
      initialInvestment,
      totalBenefits3y,
      totalCosts3y,
      roi3y,
      net3y,
      totalBenefits5y,
      totalCosts5y,
      roi5y,
      net5y,
      paybackMonths,
      years,
      lossData,
      socCostData,
      cumulativeSavings,
    };
  }, [inputs]);

  // Max value for bar chart scaling
  const maxBarValue = Math.max(
    ...results.lossData,
    ...results.socCostData,
    1
  );

  // Min and max for cumulative savings trend
  const minCum = Math.min(...results.cumulativeSavings, -inputs.initialTooling - inputs.implementationCost, 0);
  const maxCum = Math.max(...results.cumulativeSavings, 1);
  const cumRange = maxCum - minCum || 1;

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
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">SOC ROI Calculator</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 mb-2">
                <LuShieldCheck className="size-3.5" />
                <span>Security Operations Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                SOC ROI Calculator
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
                Quantify the business value, risk mitigation, and operational return on investment from deploying an enterprise Security Operations Center (SOC).
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
                <span>Export / Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Mini Navigation Bar */}
        <CalculatorNav active="soc" />

        {/* Concise Functional Description Block */}
        <div className="mb-8 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/5 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-3">
          <LuInfo className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-900 dark:text-amber-300">How this model works:</span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              This calculator estimates expected financial loss before a SOC by combining annualized incident triage and breach risk. It calculates total upfront capital and operational expenditures across analysts, engineers, and platform software, comparing them against breach prevention, containment velocity (MTTD/MTTR), downtime avoidance, and compliance savings.
            </p>
          </div>
        </div>

        {/* Executive Readout (6 Key Results KPI Cards - Kept Completely Intact) */}
        <section className="mb-10" aria-label="Key Performance Indicators">
          <div className="flex items-center gap-2 mb-4">
            <LuTrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Executive Readout & Projections
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* 3-Year ROI */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">ROI (3-Year)</div>
              <div className="mt-1 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {formatPercent(results.roi3y)}
              </div>
              <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Total return over 3 years
              </div>
            </div>

            {/* 5-Year ROI */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">ROI (5-Year)</div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatPercent(results.roi5y)}
              </div>
              <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Total return over 5 years
              </div>
            </div>

            {/* Payback Period */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Payback Period</div>
              <div className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-white">
                {results.paybackMonths ? `${results.paybackMonths} mo` : "N/A"}
              </div>
              <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Break-even on upfront capex
              </div>
            </div>

            {/* Net Benefit (5-Year) */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Net Benefit (5Y)</div>
              <div className="mt-1 text-2xl font-extrabold text-amber-700 dark:text-amber-300">
                {formatCurrency(results.net5y)}
              </div>
              <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Benefits minus total costs
              </div>
            </div>

            {/* Annual Net Savings */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Annual Savings</div>
              <div className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-white">
                {formatCurrency(results.annualBenefits)}
              </div>
              <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Annual benefits with SOC
              </div>
            </div>

            {/* Annual Loss Before SOC */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-4 shadow-xs">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Loss (Before SOC)</div>
              <div className="mt-1 text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                {formatCurrency(results.annualLossBefore)}
              </div>
              <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Current incident + breach loss
              </div>
            </div>
          </div>
        </section>

        {/* Main Workspace: Side-by-Side Split Architecture */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Vertically Stacked Inputs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Current Security Posture */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">1</span>
                  Current Security Posture
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Baseline metrics defining current breach probability, incident volumes, and handling costs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Current Security Spend ($/year)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.currentSpend}
                    onChange={(e) => handleInputChange("currentSpend", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Existing detection tools and personnel spend.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Incidents Per Year (count)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.incidentsPerYear}
                    onChange={(e) => handleInputChange("incidentsPerYear", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Security alerts requiring triage and investigation.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Avg. Incident Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.avgIncidentCost}
                    onChange={(e) => handleInputChange("avgIncidentCost", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Investigation, remediation, and operational disruption.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Major Breaches (5-Year count)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.majorBreaches5y}
                    onChange={(e) => handleInputChange("majorBreaches5y", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Expected major data incidents over 5 years.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Avg. Breach Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.avgBreachCost}
                    onChange={(e) => handleInputChange("avgBreachCost", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Data recovery, legal fees, forensic, and reputation impact.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    MTTD (Hours to Detect)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.mttdHours}
                    onChange={(e) => handleInputChange("mttdHours", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Current mean time to detect active anomalies.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    MTTR (Hours to Remediate)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.mttrHours}
                    onChange={(e) => handleInputChange("mttrHours", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Current mean time to contain and resolve threats.</p>
                </div>
              </div>
            </div>

            {/* Section 2: SOC Investment – Tooling & Personnel */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">2</span>
                  SOC Investment – Tooling & Personnel
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Upfront platform capital, recurring SIEM/SOAR subscriptions, and staffed engineering FTEs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Initial Tooling Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.initialTooling}
                    onChange={(e) => handleInputChange("initialTooling", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Upfront SIEM, SOAR, EDR licenses.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Implementation Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.implementationCost}
                    onChange={(e) => handleInputChange("implementationCost", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Architecture, rule tuning, integrations.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Platform Cost ($/year)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.annualPlatform}
                    onChange={(e) => handleInputChange("annualPlatform", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Cloud ingest, recurring software fees.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Automation Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.automationPct}
                    onChange={(e) => handleInputChange("automationPct", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Alerts triaged automatically via SOAR.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    SOC Analysts (FTE)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.analystCount}
                    onChange={(e) => handleInputChange("analystCount", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Tier 1 & Tier 2 frontline analysts.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Analyst Salary ($/year)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.analystSalary}
                    onChange={(e) => handleInputChange("analystSalary", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Fully loaded compensation per analyst.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    SOC Engineers (FTE)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.engineerCount}
                    onChange={(e) => handleInputChange("engineerCount", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Detection engineers & content leads.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Engineer Salary ($/year)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.engineerSalary}
                    onChange={(e) => handleInputChange("engineerSalary", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Fully loaded compensation per engineer.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    SOC Managers (FTE)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.managerCount}
                    onChange={(e) => handleInputChange("managerCount", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">SOC operations manager / director.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Manager Salary ($/year)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.managerSalary}
                    onChange={(e) => handleInputChange("managerSalary", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Fully loaded compensation per manager.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Training Budget ($/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.trainingBudget}
                    onChange={(e) => handleInputChange("trainingBudget", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Certifications, adversary simulation.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Compliance Savings ($/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.complianceSavings}
                    onChange={(e) => handleInputChange("complianceSavings", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Reduced audit prep & penalties.</p>
                </div>
              </div>
            </div>

            {/* Section 3: Expected Improvements with SOC */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 mb-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">3</span>
                  Expected Improvements with SOC
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Quantified performance gains achieved through automated containment and 24x7 monitoring.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Breach Reduction (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.breachReduction}
                    onChange={(e) => handleInputChange("breachReduction", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Expected reduction in major breach occurrence.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Incident Cost Reduction (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.incidentCostReduction}
                    onChange={(e) => handleInputChange("incidentCostReduction", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Lower investigation costs via playbooks.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    MTTD Improvement (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.mttdImprovement}
                    onChange={(e) => handleInputChange("mttdImprovement", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Speed improvement in detecting attacks.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    MTTR Improvement (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.mttrImprovement}
                    onChange={(e) => handleInputChange("mttrImprovement", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Speed improvement in threat containment.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Downtime Cost Per Hour ($/hour)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.downtimeCostHour}
                    onChange={(e) => handleInputChange("downtimeCostHour", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">Operational cost of service interruption during active breaches.</p>
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
                  {results.paybackMonths ? `Break-even: ${results.paybackMonths} mo` : "N/A"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Real-time cumulative cashflow including initial implementation and recurring operational savings.
              </p>

              {/* Pure SVG Line / Trend Chart */}
              <div className="w-full h-48 pt-2">
                <div className="relative w-full h-36 border-b border-neutral-200 dark:border-white/10">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 140">
                    <defs>
                      <linearGradient id="socSavingsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Zero baseline */}
                    {minCum < 0 && (
                      <line
                        x1="0"
                        y1={140 - (Math.abs(minCum) / cumRange) * 140}
                        x2="500"
                        y2={140 - (Math.abs(minCum) / cumRange) * 140}
                        stroke="currentColor"
                        strokeDasharray="4 4"
                        className="text-neutral-300 dark:text-white/20"
                      />
                    )}

                    {/* Trend points & path */}
                    {(() => {
                      const points = results.cumulativeSavings.map((val, i) => {
                        const x = (i / 4) * 460 + 20;
                        const y = 140 - ((val - minCum) / cumRange) * 115 - 15;
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
                                {formatCurrency(p.val)}
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

            {/* 2. BAR CHART SECOND (Below): Annual Cost vs. With SOC */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <LuLayers className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>Annual Cost vs. With SOC</span>
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  5-Year View
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Expected annual breach/incident loss today vs. ongoing SOC operating budget.
              </p>

              {/* Grouped Bar Chart */}
              <div className="w-full h-44 pt-2">
                <div className="h-32 flex items-end justify-between gap-3 px-2 border-b border-neutral-200 dark:border-white/10 pb-2">
                  {results.years.map((year, idx) => {
                    const lossHeight = Math.max(10, (results.lossData[idx] / maxBarValue) * 100);
                    const socHeight = Math.max(10, (results.socCostData[idx] / maxBarValue) * 100);
                    return (
                      <div key={year} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div className="w-full flex items-end justify-center gap-1.5 h-full">
                          {/* Loss Before SOC */}
                          <div
                            className="w-1/2 max-w-[20px] bg-rose-500/80 hover:bg-rose-500 rounded-t-sm transition-all relative group"
                            style={{ height: `${lossHeight}%` }}
                          >
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                              {formatCurrency(results.lossData[idx])}
                            </div>
                          </div>

                          {/* SOC Operating Cost */}
                          <div
                            className="w-1/2 max-w-[20px] bg-amber-500/80 hover:bg-amber-500 rounded-t-sm transition-all relative group"
                            style={{ height: `${socHeight}%` }}
                          >
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                              {formatCurrency(results.socCostData[idx])}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                          Y{year}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-center gap-5 mt-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-xs bg-rose-500" />
                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400">Expected Loss (Before)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-xs bg-amber-500" />
                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400">SOC Operating Budget</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Financial Health Indicator */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-4 shadow-xs text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-neutral-900 dark:text-white">
                <span className="flex items-center gap-1.5">
                  <LuSparkles className="size-3.5 text-amber-600 dark:text-amber-400" />
                  Live Economic Summary
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(results.annualBenefits)}/yr net
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Adjust any baseline exposure or team configuration on the left to watch return projections adapt instantly.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Financial Breakdown Table (Bottom Section Kept Intact) */}
        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 shadow-xs overflow-hidden">
          <div className="border-b border-neutral-200 dark:border-white/10 pb-4 mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Detailed Financial Breakdown & Cost Avoidance
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Annualized and multi-year comparison of baseline expenses versus SOC operational economics.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Financial Category</th>
                  <th className="py-3 px-4 text-right">Annual Impact</th>
                  <th className="py-3 px-4 text-right">3-Year Cumulative</th>
                  <th className="py-3 px-4 text-right">5-Year Cumulative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5 text-neutral-700 dark:text-neutral-300">
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Baseline Incident & Breach Loss (Without SOC)</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatCurrency(results.annualLossBefore)}</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatCurrency(results.annualLossBefore * 3)}</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatCurrency(results.annualLossBefore * 5)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">SOC Personnel (Analysts + Engineers + Lead)</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(results.socPersonnel)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(results.socPersonnel * 3)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(results.socPersonnel * 5)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Platform Subscriptions & Maintenance</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(inputs.annualPlatform)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(inputs.annualPlatform * 3)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(inputs.annualPlatform * 5)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Ongoing Training & Upskilling</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(inputs.trainingBudget)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(inputs.trainingBudget * 3)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(inputs.trainingBudget * 5)}</td>
                </tr>
                <tr className="bg-neutral-50/60 dark:bg-white/[0.02] font-semibold text-neutral-900 dark:text-white">
                  <td className="py-3 px-4">Total Operating Cost (Opex)</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(results.socOperatingAnnual)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(results.socOperatingAnnual * 3)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(results.socOperatingAnnual * 5)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">Upfront Capital & Implementation (One-time)</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(results.initialInvestment)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(results.initialInvestment)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(results.initialInvestment)}</td>
                </tr>
                <tr className="border-t border-neutral-200 dark:border-white/10 bg-amber-500/5 dark:bg-amber-500/10 font-bold text-amber-900 dark:text-amber-300">
                  <td className="py-3 px-4">Net Economic Value / Benefit</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(results.annualBenefits)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(results.net3y)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(results.net5y)}</td>
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
