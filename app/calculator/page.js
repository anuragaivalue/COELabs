import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CalculatorNav } from "@/components/calculators/calculator-nav";
import {
  LuCalculator,
  LuShieldCheck,
  LuKeyRound,
  LuLock,
  LuDatabase,
  LuServer,
  LuCloud,
  LuArrowRight,
  LuChevronRight,
  LuSparkles,
  LuTrendingUp,
  LuLayers,
  LuSlidersHorizontal,
  LuFileSpreadsheet,
  LuCheckCircle2
} from "react-icons/lu";

export const metadata = {
  title: "Enterprise ROI Calculators Hub | iValue Center of Excellence (CoE)",
  description:
    "Explore 7 validated economic ROI and risk modeling calculators across SecOps, IAM, PAM, DPDP compliance, cyber resilience, ZTNA SASE consolidation, and CNAPP cloud observability.",
};

const CALCULATOR_CATEGORIES = [
  {
    category: "SecOps & Access Governance",
    description: "Quantify SOC operational returns, automated identity lifecycles, and machine secret vaulting.",
    models: [
      {
        id: "soc",
        title: "SOC ROI & ROSI Calculator",
        badge: "Security Operations",
        icon: LuShieldCheck,
        href: "/calculator/soc",
        summary:
          "Quantify the business value, AI autonomous triage savings, risk mitigation, and Return on Security Investment (ROSI) from deploying an enterprise SOC.",
        formulaHighlight: "ROSI (%) = ((Risk Mitigation + AI Labor Savings - Total Cost) / Total Cost) × 100",
        keyInputs: ["Monthly Alert Volume", "% Triaged Autonomously", "Analyst Hourly Cost", "MTTD/MTTR"],
        alignedOems: ["Splunk", "Check Point", "Mandiant", "Google Cloud"],
      },
      {
        id: "idam",
        title: "IDAM ROI & NHI Calculator",
        badge: "Identity Governance",
        icon: LuKeyRound,
        href: "/calculator/idam",
        summary:
          "Measure the economic ROI, automated provisioning efficiencies, Non-Human Identity (NHI) machine secrets protection, and password reset avoidance.",
        formulaHighlight: "Net Benefit = (Baseline Manual Ops - Automated IDAM) + NHI Risk Reduction + Productivity Gain",
        keyInputs: ["Employee Count", "Service Accounts & API Keys", "Password Resets", "Audit Hours"],
        alignedOems: ["CyberArk", "Ping Identity", "Okta", "Entrust"],
      },
      {
        id: "pam",
        title: "PAM ROI & Machine Secrets Calculator",
        badge: "Privileged Access",
        icon: LuLock,
        href: "/calculator/pam",
        summary:
          "Quantify credential risk reduction, Non-Human Identity (NHI) machine secrets vaulting, JIT session recording, and compliance audit savings.",
        formulaHighlight: "ROI (%) = (Cred Risk Savings + Machine Secrets Vaulting + Helpdesk Savings - PAM Investment) / Total Investment",
        keyInputs: ["Privileged Admins", "Vaulted Machine Secrets", "Credential Theft Risk", "Manual Rotation Hours"],
        alignedOems: ["CyberArk", "BeyondTrust", "HashiCorp", "Entrust"],
      },
    ],
  },
  {
    category: "Compliance, Privacy & Data Governance",
    description: "Evaluate statutory fine avoidance under DPDP Act 2023 and automated data security posture discovery.",
    models: [
      {
        id: "dpdp",
        title: "DPDP Act & DSPM Calculator",
        badge: "Statutory DPDP 2023",
        icon: LuDatabase,
        href: "/calculator/dpdp",
        summary:
          "Calculate statutory non-compliance exposure (statutorily capped at ₹250 Crore per instance under DPDP 2023), shadow data eradication, and automated audit ROI.",
        formulaHighlight: "Exposure Avoidance = Min(₹250 Cr, Unprotected Records × Risk Index) × Target DSPM Coverage Gain",
        keyInputs: ["Sensitive Records Volume", "Shadow Data %", "DLP Baseline", "Target DSPM Coverage"],
        alignedOems: ["Forcepoint", "Imperva", "Netskope"],
      },
    ],
  },
  {
    category: "Infrastructure Resilience & Zero Trust SASE",
    description: "Model business continuity downtime recovery and legacy network consolidation savings.",
    models: [
      {
        id: "resilience",
        title: "Cyber Resilience & Ransomware Calculator",
        badge: "RTO Continuity",
        icon: LuServer,
        href: "/calculator/resilience",
        summary:
          "Model blended hourly operational downtime losses, ransomware extortion mitigation, and immutable backup RTO recovery acceleration from 72 hours down to 4 hours.",
        formulaHighlight: "Downtime Avoided = (Baseline RTO - Target Immutable RTO) × (Hourly Revenue + Idle Labor) × Outage Likelihood",
        keyInputs: ["Annual Enterprise Revenue", "Blended Hourly Salary", "Baseline vs Target RTO", "Outage Likelihood"],
        alignedOems: ["Hitachi Vantara", "SentinelOne", "Check Point", "Cyberbit"],
      },
      {
        id: "ztna",
        title: "ZTNA / SASE Consolidation Calculator",
        badge: "Network Security",
        icon: LuShieldCheck,
        href: "/calculator/ztna",
        summary:
          "Compare legacy VPN hardware and expensive MPLS leased lines against unified cloud SASE/ZTNA, capturing direct bandwidth offload and IT hours reclaimed.",
        formulaHighlight: "SASE Savings = (Legacy VPN HW + MPLS Leased Lines + Point Tools Retired) - Unified SASE OpEx",
        keyInputs: ["Remote Users", "Branch Locations", "Legacy VPN Hardware Spend", "MPLS Circuit Spend"],
        alignedOems: ["Netskope", "Forcepoint ONE", "Cloudflare", "Check Point"],
      },
    ],
  },
  {
    category: "Cloud Native & Telemetry Optimization",
    description: "Streamline multi-cloud observability spend and Kubernetes security operations.",
    models: [
      {
        id: "cnapp",
        title: "CNAPP & Cloud Observability Calculator",
        badge: "Cloud Telemetry",
        icon: LuCloud,
        href: "/calculator/cnapp",
        summary:
          "Calculate multi-cloud telemetry ingest savings through smart pipeline filtering, Kubernetes cluster context consolidation, and legacy point tool retirement.",
        formulaHighlight: "Observability Net = (Raw Log Ingest × Reduction %) + DevOps Incident Hours Saved + Point Tool Consolidation",
        keyInputs: ["Cloud Compute VMs", "K8s Clusters", "Daily Log Ingest GB", "Pipeline Reduction %"],
        alignedOems: ["Datadog", "Check Point CloudGuard", "Cloudera", "Confluent"],
      },
    ],
  },
];

export default function CalculatorHubPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans antialiased transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Home
          </Link>
          <LuChevronRight className="size-3.5" />
          <span>Accelerators</span>
          <LuChevronRight className="size-3.5" />
          <span className="text-neutral-800 dark:text-neutral-200 font-medium">ROI Calculators Hub</span>
        </nav>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-gradient-to-br from-amber-50/50 via-white to-amber-100/20 p-8 sm:p-12 mb-8 dark:border-white/10 dark:from-neutral-900 dark:via-neutral-950 dark:to-amber-950/20 shadow-xs">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30 mb-4">
              <LuCalculator className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span>Executive Financial Intelligence Suite</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
              Enterprise ROI & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent dark:from-orange-400 dark:via-amber-400 dark:to-orange-500">
                Risk Modeling Suite
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Explore 7 validated economic ROI and risk mitigation models designed for CISOs, CFOs, and enterprise IT leaders. Each model features real-time formula transparency, dual currency toggles (USD/INR), and automated CSV/PDF export.
            </p>

            {/* Quick Metrics Banner */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-neutral-200/80 bg-white/80 p-3 shadow-xs dark:border-white/10 dark:bg-neutral-900/60">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Calculators
                </div>
                <div className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">7 Models</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">SecOps to Observability</div>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-white/80 p-3 shadow-xs dark:border-white/10 dark:bg-neutral-900/60">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Currencies
                </div>
                <div className="mt-1 text-2xl font-black text-neutral-900 dark:text-white">USD & INR</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Lakhs & Crores support</div>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-white/80 p-3 shadow-xs dark:border-white/10 dark:bg-neutral-900/60">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Statutory Caps
                </div>
                <div className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">₹250 Cr</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">DPDP Act 2023 aligned</div>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-white/80 p-3 shadow-xs dark:border-white/10 dark:bg-neutral-900/60">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Exports
                </div>
                <div className="mt-1 text-2xl font-black text-neutral-900 dark:text-white">CSV & PDF</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">UTF-8 BOM compliant</div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Mini Nav Switcher */}
        <CalculatorNav active="hub" />

        {/* Catalog Categories */}
        <div className="space-y-12">
          {CALCULATOR_CATEGORIES.map((cat, catIdx) => (
            <section key={catIdx} className="space-y-4">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-black">
                    {catIdx + 1}
                  </span>
                  <span>{cat.category}</span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {cat.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.models.map((model) => {
                  const Icon = model.icon;
                  return (
                    <div
                      key={model.id}
                      className="group flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white dark:border-white/10 dark:bg-neutral-900/80 p-6 shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all duration-200"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20">
                            <Icon className="size-3 text-amber-600 dark:text-amber-400" />
                            <span>{model.badge}</span>
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            Model #{model.id.toUpperCase()}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {model.title}
                        </h3>

                        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                          {model.summary}
                        </p>

                        {/* Formula Breakdown Card */}
                        <div className="mt-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-white/5 text-[11px]">
                          <span className="block font-mono font-bold text-amber-800 dark:text-amber-300 text-[10px] uppercase tracking-wider mb-1">
                            Formula Breakdown:
                          </span>
                          <code className="block text-neutral-700 dark:text-neutral-300 font-mono text-[10px] leading-tight">
                            {model.formulaHighlight}
                          </code>
                        </div>

                        {/* Aligned OEMs */}
                        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/10">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                            Aligned Lab OEMs:
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {model.alignedOems.map((oem, oIdx) => (
                              <span
                                key={oIdx}
                                className="rounded bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-white/10"
                              >
                                {oem}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/10">
                        <Link
                          href={model.href}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-100 px-4 py-2.5 text-xs font-bold transition-all shadow-xs group-hover:scale-[1.01]"
                        >
                          <span>Launch Calculator</span>
                          <LuArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
