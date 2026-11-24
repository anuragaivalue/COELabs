"use client";

import React from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { MotionReveal } from "@/components/ui/motion-reveal";
import {
  ShieldCheck,
  Activity,
  Cpu,
  Database,
  KeyRound,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

export function SpecializedBento() {
  const specializedItems = [
    {
      title: "Regulation stacks",
      category: "Governance & Mandates",
      icon: ShieldCheck,
      description:
        "Turnkey mappings for ISO 27001:2022, PCI-DSS v4.0, RBI Cyber Security Framework, GDPR, and NIST 800-53.",
      url: "https://regulation.ivaluegroup.com/"
    },
    {
      title: "SIEM Optimization",
      category: "Analytics & Telemetry",
      icon: Activity,
      description:
        "Fine-tune high-volume telemetry ingestion, filter noise, and optimize SIEM pipeline costs while strengthening threat correlation.",
      url: "https://confluent.ivaluegroup.com/"
    },
    {
      title: "SecOps",
      category: "Automated Incident Response",
      icon: Cpu,
      description:
        "Automate triage, containment, and forensics across multi-vendor EDR, NDR, and cloud security infrastructures using dynamic playbooks.",
      url: "https://www.sec360.ai/"
    },
    {
      title: "Data Engineering",
      category: "Cloud Data Lakes",
      icon: Database,
      description:
        "Protect sensitive data-in-transit, at-rest, and during analytics workloads with tokenization, DLP, and automated classification.",
      url: "https://dataengineering.ivaluegroup.com/"
    },
    {
      title: "Identity Management",
      category: "Zero Trust Perimeter",
      icon: KeyRound,
      description:
        "Unified privileged access management (PAM), federated single sign-on, and credential vaults safeguarding enterprise keys.",
      url: "https://iam.ivaluegroup.com/"
    },
    {
      title: "AI Ops & Observability",
      category: "Cognitive Operations",
      icon: Sparkles,
      description:
        "Proactive topology health diagnostics, cross-cloud anomaly prediction, and automated root-cause detection for zero downtime.",
      url: "https://aiops.ivaluegroup.com/"
    }
  ];

  return (
    <section
      id="topstack"
      className="section-divider py-20 bg-neutral-50/60 dark:bg-neutral-900/40 border-y border-neutral-200/80 dark:border-white/10"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <MotionReveal direction="up">
          <div className="text-center">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              Core Technical Domains
            </p>
            <h2 className="mt-2 font-sans text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
              Specialized Stacks
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
              Engineered to address{" "}
              <span className="text-amber-700 dark:text-amber-400 font-semibold">
                mission-critical enterprise pain points
              </span>{" "}
              with validated blueprints and reproducible labs.
            </p>
          </div>
        </MotionReveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {specializedItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="card-reveal h-full"
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Explore ${item.title} specialized stack blueprint`}
                  className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                >
                  <TiltCard className="h-full rounded-2xl">
                    <Card className="flex h-full flex-col justify-between border border-neutral-200/80 bg-white/95 dark:border-white/10 dark:bg-neutral-900/90 p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-xl hover:border-amber-500/60 dark:hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-1">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 transition-transform duration-300 group-hover:scale-110">
                            <Icon className="size-5" />
                          </div>
                          <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            {item.category}
                          </span>
                        </div>
                        <CardTitle className="mt-4 font-sans text-lg font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                          {item.description}
                        </CardDescription>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-3.5 text-xs dark:border-white/5">
                        <span className="inline-flex items-center gap-1 font-display text-xs font-semibold text-neutral-700 group-hover:text-amber-600 dark:text-neutral-300 dark:group-hover:text-amber-400 transition-colors">
                          <span>Explore Blueprint</span>
                          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                        <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
                          External Portal
                        </span>
                      </div>
                    </Card>
                  </TiltCard>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
