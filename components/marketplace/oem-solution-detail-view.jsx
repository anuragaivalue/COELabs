"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { OEM_PARTNER_SOLUTIONS } from "@/data/oem-partner-solutions";
import {
  Building2,
  Layers,
  ArrowRight,
  ArrowLeft,
  Laptop2,
  Clock,
  CheckCircle2,
  Info,
  Headphones,
  FileText,
  Mail,
  ShieldCheck,
  Sparkles,
  ExternalLink
} from "lucide-react";

export function OemSolutionDetailView({ solution }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Other solutions from the same OEM
  const relatedSolutions = useMemo(() => {
    return OEM_PARTNER_SOLUTIONS.filter(
      (s) => s.oem.toLowerCase() === solution.oem.toLowerCase() && s.id !== solution.id
    ).slice(0, 3);
  }, [solution]);

  return (
    <div className="w-full">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400 pb-6 border-b border-neutral-200/80 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/portal/marketplace" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
            Marketplace
          </Link>
          <span>/</span>
          <Link href="/portal/marketplace#oem-partners" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
            OEM Partners
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white font-semibold truncate max-w-[200px] sm:max-w-none">
            {solution.oem} - {solution.title}
          </span>
        </div>

        <Link
          href="/portal/marketplace#oem-partners"
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:border-amber-500 hover:text-amber-700 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-all shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to OEM Library</span>
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="mt-8 rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white/95 p-6 sm:p-8 md:p-10 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/90">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          {/* Left / Center: Logo & Metadata */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 max-w-3xl">
            {/* Logo container */}
            <div className="flex h-20 w-auto min-w-[140px] max-w-[180px] shrink-0 items-center justify-center rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm dark:border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={solution.logoUrl}
                alt={solution.oem}
                className="max-h-12 max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            {/* Title & Tagline */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-md border border-neutral-200 bg-neutral-100/90 px-2.5 py-0.5 text-[11px] font-bold text-neutral-700 uppercase dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300">
                  {solution.oem}
                </span>

                {solution.comingSoon ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-orange-500/15 dark:text-orange-300 border border-amber-500/20">
                    <Clock className="size-3" />
                    <span>Launching Soon</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Certified Lab Ready</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-display">
                {solution.title}
              </h1>

              <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                {solution.tagline}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col gap-2.5 shrink-0 min-w-[200px] w-full sm:w-auto">
            <Link
              href={`/request-poc?oem=${encodeURIComponent(solution.oem)}&solution=${encodeURIComponent(solution.title)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:from-amber-700 hover:to-amber-800 transition-all text-center"
            >
              <Laptop2 className="size-4" />
              <span>Request Lab Access / POC</span>
            </Link>

            <Link
              href={`/contact?type=partner&solution=${encodeURIComponent(solution.title)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-neutral-800 hover:border-amber-500 hover:text-amber-700 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-all text-center"
            >
              <Mail className="size-4 text-amber-600 dark:text-orange-400" />
              <span>Contact Solution Specialist</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Tabs Navigation Card */}
      <div className="mt-8 rounded-2xl border border-neutral-200/90 bg-white/90 p-4 sm:p-6 shadow-md dark:border-white/10 dark:bg-neutral-900/80">
        
        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-neutral-100 dark:border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            <Info className="size-4" />
            <span>Product Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("support")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "support"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            <Headphones className="size-4" />
            <span>Support & Operations</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("access")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "access"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            <FileText className="size-4" />
            <span>Lab Access & Specs</span>
          </button>
        </div>

        {/* Tab 1: Product Overview Content */}
        {activeTab === "overview" && (
          <div className="pt-6">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white font-display mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-amber-600 dark:text-orange-400" />
              <span>Solution Architecture & Capabilities</span>
            </h3>

            {solution.overviewHtml ? (
              <div
                className="prose prose-neutral dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed prose-headings:font-display prose-headings:font-bold prose-headings:text-neutral-900 dark:prose-headings:text-white prose-p:text-neutral-600 dark:prose-p:text-neutral-300 prose-img:rounded-xl prose-img:border prose-img:border-neutral-200/80 dark:prose-img:border-white/10 prose-img:shadow-sm prose-hr:border-neutral-200 dark:prose-hr:border-white/10 prose-li:text-neutral-600 dark:prose-li:text-neutral-300 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: solution.overviewHtml }}
              />
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Detailed architecture specifications and deployment documentation are available upon request for certified enterprise evaluations.
              </p>
            )}
          </div>
        )}

        {/* Tab 2: Support & Operations Content */}
        {activeTab === "support" && (
          <div className="pt-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-display mb-2 flex items-center gap-2">
                <Headphones className="size-4 text-amber-600 dark:text-orange-400" />
                <span>Certified OEM Support & Escalation</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Direct contacts and designated solutions architects assigned to this solution.
              </p>
            </div>

            {solution.supportHtml ? (
              <div
                className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 dark:border-white/10 dark:bg-neutral-800/60 p-5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed"
                dangerouslySetInnerHTML={{ __html: solution.supportHtml }}
              />
            ) : (
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 dark:border-white/10 dark:bg-neutral-800/60 p-5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                <p className="font-semibold text-neutral-900 dark:text-white">CoE Technical Escalation Desk</p>
                <p className="mt-1 text-neutral-500 dark:text-neutral-400">Email: <a href="mailto:coe@ivaluegroup.com" className="text-amber-600 underline">coe@ivaluegroup.com</a></p>
                <p className="text-neutral-500 dark:text-neutral-400">Escalation SLA: Within 4 business hours for active POC engagements</p>
              </div>
            )}

            {/* Enterprise Support Guarantees */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-950/20 p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-orange-400 flex items-center gap-1.5">
                <ShieldCheck className="size-4" />
                <span>iValue Center of Excellence Enterprise SLA</span>
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Dedicated L2/L3 certified technical architects during full evaluation cycle.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Direct hardware vaulting and high-fidelity simulated cyber range environments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Joint OEM escalation management for configuration benchmarking and custom RFP validations.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Lab Access & Specs */}
        {activeTab === "access" && (
          <div className="pt-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-display mb-2 flex items-center gap-2">
                <FileText className="size-4 text-amber-600 dark:text-orange-400" />
                <span>Deployment Blueprints & Lab Documentation</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Access parameters, test documentation, and integration requirements.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 dark:border-white/10 dark:bg-neutral-800/60 p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Documentation Reference:</div>
              <div className="text-sm font-mono text-neutral-800 dark:text-neutral-200">
                {solution.howToAccess || "iVCoE-Lab-Spec-v2.4.pdf (Pre-Loaded in Virtual Test Bench)"}
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex flex-wrap items-center gap-3">
                <Link
                  href={`/request-poc?oem=${encodeURIComponent(solution.oem)}&solution=${encodeURIComponent(solution.title)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 transition-all"
                >
                  <Laptop2 className="size-3.5" />
                  <span>Schedule Lab Demo</span>
                </Link>
                <Link
                  href="/portal/marketplace#oem-partners"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 transition-all"
                >
                  <span>Browse More OEM Solutions</span>
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Related Solutions from the same OEM */}
      {relatedSolutions.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-display">
                More Solutions from {solution.oem}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Complementary modules verified in the iValue Center of Excellence.
              </p>
            </div>
            <Link
              href={`/portal/marketplace#oem-partners`}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 dark:text-orange-400 dark:hover:text-orange-300 inline-flex items-center gap-1"
            >
              <span>View All Solutions</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedSolutions.map((item) => (
              <Card
                key={`${item.id}-${item.idKey}`}
                className="flex flex-col justify-between p-5 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 hover:border-amber-500/40 hover:-translate-y-1 transition-all shadow-sm group"
              >
                <div>
                  <span className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600 uppercase dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300">
                    {item.oem}
                  </span>
                  <h4 className="mt-3 font-display text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {item.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
                  <Link
                    href={item.destinationUrl}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 dark:text-orange-400"
                  >
                    <span>View Solution</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Consultation Banner */}
      <div className="mt-16 rounded-2xl border border-neutral-200/90 bg-neutral-900 p-8 text-white shadow-xl dark:border-white/15 dark:bg-neutral-900/90">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-orange-300">
              <Sparkles className="size-3.5" />
              <span>Enterprise Evaluation Program</span>
            </div>
            <h3 className="mt-3 font-sans text-2xl font-bold">
              Ready to Benchmark {solution.title} in Your Environment?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
              Our certified solutions engineers in Bangalore and Singapore will architect, benchmark, and deploy a custom architecture proof-of-value tailored specifically to your enterprise infrastructure and regulatory audit requirements.
            </p>
          </div>

          <Link
            href={`/request-poc?oem=${encodeURIComponent(solution.oem)}&solution=${encodeURIComponent(solution.title)}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs font-bold text-neutral-900 hover:bg-neutral-100 shadow-md transition-all shrink-0"
          >
            <span>Schedule Evaluation</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
