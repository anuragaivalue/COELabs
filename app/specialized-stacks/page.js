import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Lock,
  Globe,
  Database,
  ChevronRight
} from "lucide-react";

export const metadata = {
  title: "Specialized Stacks | iValue Center of Excellence",
  description:
    "Explore high-impact specialized architecture stacks engineered for complex multi-vendor enterprise environments."
};

export default function SpecializedStacksPage() {
  const specializedItems = [
    {
      id: "ztna",
      title: "Zero Trust Network Access (ZTNA)",
      category: "Network & Perimeter",
      headline: "Context-Aware Micro-Perimeter & Least-Privilege Access",
      desc: "Comprehensive zero-trust remote access architecture isolating private enterprise applications behind continuous posture checks and software-defined perimeters.",
      metrics: "60% Reduction in Attack Surface",
      oems: ["Check Point", "Netskope", "CyberArk", "Google Cloud"],
      controls: [
        "Identity-bound application cloak preventing IP port scanning",
        "Continuous device posture verification (EDR health & OS patch level)",
        "Granular per-session micro-tunnels with automatic ephemeral teardown",
        "Strict outbound DLP filtering and encrypted session inspection"
      ],
      slug: "cloudSecurityControls"
    },
    {
      id: "soc",
      title: "Next-Gen Autonomous SOC",
      category: "SecOps & SIEM",
      headline: "AI-Driven Telemetry Ingestion & Real-Time Incident Orchestration",
      desc: "Cloud-scale security operations center ingesting hundreds of thousands of events per second with automated correlation against MITRE ATT&CK and pre-built SOAR playbooks.",
      metrics: "4.2x Faster Mean Time to Detect (MTTD)",
      oems: ["Google Cloud (Chronicle)", "Splunk", "SentinelOne", "Tenable"],
      controls: [
        "Normalized multi-vendor log ingestion with zero schema lock-in",
        "UEBA behavioral anomaly detection flagging lateral movements",
        "Automated one-click containment playbooks for compromised endpoints",
        "Bidirectional threat intelligence integration with national CERT feeds"
      ],
      slug: "scoControls"
    },
    {
      id: "cloud",
      title: "Cloud Infrastructure & CNAPP",
      category: "Cloud Native",
      headline: "Full-Lifecycle Container, Workload & Posture Governance",
      desc: "Cloud-native application protection platform unifying CSPM, CWPP, and CIEM across AWS, Azure, Google Cloud, and private enterprise datacentres.",
      metrics: "90% Faster Compliance Sign-Offs",
      oems: ["Google Cloud", "Netskope", "Check Point", "Akamai"],
      controls: [
        "Continuous CSPM audit against CIS, RBI Cloud & DPDP benchmarks",
        "Kernel-level eBPF runtime container and Kubernetes escape detection",
        "Automated pull-request IaC scanning blocking misconfigurations",
        "Customer-owned HSM key lifecycle management (BYOK/HYOK)"
      ],
      slug: "cloudSecurityControls"
    },
    {
      id: "iam",
      title: "Identity Governance & Privileged Access",
      category: "Identity Security",
      headline: "Privileged Session Vaulting & Automated Lifecycle Governance",
      desc: "Zero-trust identity repository ensuring single identity uniqueness, adaptive MFA verification, and tamper-proof privileged session recording.",
      metrics: "65% Drop in Privilege Escalation Risk",
      oems: ["CyberArk", "Entrust", "OpenText", "Netskope"],
      controls: [
        "Centralized directory synchronization with identity deduplication",
        "Just-In-Time (JIT) privilege elevation with full SSH/RDP session video capture",
        "Automated Joiner-Mover-Leaver (JML) provisioning linked to HRMS",
        "Contextual risk-based adaptive MFA with FIDO2 hardware token enforcement"
      ],
      slug: "iamControls"
    },
    {
      id: "endpoint",
      title: "Autonomous Endpoint & XDR",
      category: "Endpoint Defense",
      headline: "Behavioral AI Defense with 1-Click Cryptographic Rollback",
      desc: "On-device AI endpoint protection stopping zero-day ransomware, memory-based exploits, and unauthorized peripheral exfiltration even offline.",
      metrics: "99.8% Ransomware Neutralization",
      oems: ["SentinelOne", "Tenable", "Check Point", "Forcepoint"],
      controls: [
        "On-device behavioral AI analyzing process execution trees in real time",
        "1-click volume shadow rollback returning infected machines to pristine state",
        "Endpoint privilege management eliminating local administrative credentials",
        "Continuous vulnerability assessment and automated patch prioritization"
      ],
      slug: "endpointControls"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-900">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">Specialized Stacks</span>
          </div>

          {/* Hero Header */}
          <div className="mt-8 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:border-orange-400/25 dark:bg-orange-500/15 dark:text-orange-300">
              <IValueEmblem className="size-3.5" />
              <span>Multi-Vendor Pre-Validated Blueprints</span>
            </div>

            <h1 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
              Specialized Solution Stacks
            </h1>

            <p className="mt-3 font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Curated by certified solutions architects to resolve complex hybrid multi-brand enterprise use cases. Tested inside our Bangalore and Singapore CoE live lab environments.
            </p>
          </div>

          {/* Stacks Grid */}
          <div className="mt-14 space-y-8">
            {specializedItems.map((item, idx) => (
              <Card
                key={idx}
                className="overflow-hidden border border-neutral-200/90 bg-white/90 p-6 sm:p-10 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/80 hover:border-amber-500/40 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-display text-[10px] font-bold text-amber-700 uppercase dark:border-orange-400/30 dark:bg-orange-500/15 dark:text-orange-300">
                        {item.category}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="size-3.5" />
                        {item.metrics}
                      </span>
                    </div>

                    <h2 className="mt-3 font-sans text-2xl font-bold text-neutral-900 dark:text-white">
                      {item.title}
                    </h2>

                    <p className="mt-1 font-display text-sm font-semibold text-amber-700 dark:text-orange-400">
                      {item.headline}
                    </p>

                    <p className="mt-3 font-sans text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {item.desc}
                    </p>

                    {/* Integrated OEM Partners */}
                    <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-white/5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                        Certified OEM Technology Partners
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {item.oems.map((oem, oIdx) => (
                          <span
                            key={oIdx}
                            className="rounded-lg border border-neutral-200 bg-neutral-100/80 px-2.5 py-1 text-xs font-medium text-neutral-800 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-200"
                          >
                            {oem}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Architecture Blueprint Controls */}
                  <div className="w-full lg:w-96 shrink-0 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-5 dark:border-white/10 dark:bg-neutral-950/60">
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-3">
                      Validated Architecture Controls
                    </div>
                    <div className="space-y-2.5">
                      {item.controls.map((ctrl, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300 font-sans">
                          <ShieldCheck className="size-3.5 text-amber-600 dark:text-orange-400 shrink-0 mt-0.5" />
                          <span>{ctrl}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-neutral-200/80 dark:border-white/10">
                      <Link
                        href={`/stack/${item.slug}`}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 py-2.5 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 shadow-sm transition-all"
                      >
                        <span>View Blueprint Controls</span>
                        <ChevronRight className="size-3.5" />
                      </Link>
                      <Link
                        href={`/request-poc?stack=${encodeURIComponent(item.slug)}`}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300/80 bg-white py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-all"
                      >
                        <span>Schedule Architecture Briefing</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
