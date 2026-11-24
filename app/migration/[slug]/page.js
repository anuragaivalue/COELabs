"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MigrationFlowDiagram } from "@/components/migration/flow-diagram";
import migrationsData from "@/data/migrations-data.json";
import {
  LuChevronLeft,
  LuArrowRight,
  LuShieldCheck,
  LuFileText,
  LuLayers,
  LuCalendar,
  LuCircleCheck,
  LuDownload,
  LuPrinter,
  LuWorkflow,
  LuDatabase,
  LuShare2
} from "react-icons/lu";

const MIGRATION_GUIDES = [
  { slug: "CyberArkPAM", label: "Any PAM to CyberArk", short: "CyberArk PAM" },
  { slug: "GoogleChronicleSIEM", label: "Qradar to Google Chronicle", short: "Google Chronicle" },
  { slug: "SplunkSIEM", label: "Qradar to Splunk SIEM", short: "Splunk SIEM" }
];

export default function MigrationGuidePage() {
  const params = useParams();
  const rawSlug = params?.slug || "CyberArkPAM";
  
  // Normalize slug matching
  const guideKey = useMemo(() => {
    const found = Object.keys(migrationsData).find(
      (k) => k.toLowerCase() === rawSlug.toLowerCase()
    );
    return found || "CyberArkPAM";
  }, [rawSlug]);

  const guide = migrationsData[guideKey] || migrationsData["CyberArkPAM"];

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-900">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <Link
                href="/"
                className="inline-flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <LuChevronLeft className="size-3.5" />
                <span>Home</span>
              </Link>
              <span>/</span>
              <span className="text-neutral-500 dark:text-neutral-400">Accelerators</span>
              <span>/</span>
              <span className="text-neutral-500 dark:text-neutral-400">Migration Services</span>
              <span>/</span>
              <span className="text-neutral-900 dark:text-white font-semibold truncate max-w-xs sm:max-w-md">
                {guide.title}
              </span>
            </div>

            {/* Quick Print Button */}
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              <LuPrinter className="size-3.5" />
              <span>Print Guide</span>
            </button>
          </div>

          {/* Mini Guide Switcher Bar */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 custom-gold-scrollbar">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 shrink-0 mr-1">
              Active Guides:
            </span>
            {MIGRATION_GUIDES.map((item) => {
              const isActive = guideKey.toLowerCase() === item.slug.toLowerCase();
              return (
                <Link
                  key={item.slug}
                  href={`/migration/${item.slug}`}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-amber-600 text-white shadow-md"
                      : "bg-white/80 dark:bg-neutral-800/80 border border-neutral-200/90 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-amber-500/50 hover:text-amber-800 dark:hover:text-amber-300"
                  }`}
                >
                  <LuFileText className="size-3" />
                  <span>{item.short}</span>
                </Link>
              );
            })}
          </div>

          {/* Guide Header Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 p-6 sm:p-10 shadow-xl backdrop-blur-xl mb-10">
            <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-50/80 dark:bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-4">
                <LuShieldCheck className="size-3.5 text-amber-600 dark:text-amber-400" />
                <span>{guide.badge || "Migration Accelerator"}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-display">
                {guide.title}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
                {guide.subtitle}
              </p>

              {/* Status Pills */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 font-mono">
                  Version 1.0.0
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 font-semibold">
                  <LuCircleCheck className="size-3" />
                  Status: Vetted & Approved
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 px-2.5 py-1 font-semibold">
                  COE Reference Architecture
                </span>
              </div>
            </div>
          </div>

          {/* Left-to-Right Flow Diagram (for CyberArk PAM) */}
          {guide.flow && (
            <div className="mb-10 rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
              <MigrationFlowDiagram steps={guide.flow} />
            </div>
          )}

          {/* Content Renderers */}
          {guide.sections && guide.sections.length > 0 ? (
            /* CyberArk PAM Sections */
            <div className="space-y-8">
              {guide.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 p-6 sm:p-8 shadow-md backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-100 dark:border-white/10">
                    <span className="flex items-center justify-center size-7 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold text-xs font-mono">
                      {idx + 1}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white font-display">
                      {sec.title}
                    </h2>
                  </div>

                  {sec.intro && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                      {sec.intro}
                    </p>
                  )}

                  {/* Subsections */}
                  {sec.subsections && sec.subsections.length > 0 && (
                    <div className="space-y-4">
                      {sec.subsections.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="rounded-2xl border border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-neutral-800/40 p-4"
                        >
                          <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-display mb-2 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-amber-500" />
                            <span>{sub.title}</span>
                          </h3>
                          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            {sub.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tables */}
                  {sec.tables && sec.tables.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {sec.tables.map((tdata, tIdx) => (
                        <div
                          key={tIdx}
                          className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-white/10 custom-gold-scrollbar"
                        >
                          <table className="w-full text-left text-xs border-collapse">
                            <tbody>
                              {tdata.map((row, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className={
                                    rIdx === 0
                                      ? "bg-amber-50/80 dark:bg-amber-500/10 font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10"
                                      : "border-b border-neutral-100 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                                  }
                                >
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="p-3 sm:p-3.5 leading-snug">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : guide.blocks && guide.blocks.length > 0 ? (
            /* GoogleChronicle / Splunk Blocks */
            <div className="rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 p-6 sm:p-10 shadow-md backdrop-blur-xl space-y-4">
              {guide.blocks.map((block, bIdx) => {
                if (block.type === "heading") {
                  return (
                    <div key={bIdx} className="pt-4 first:pt-0">
                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white font-display border-l-2 border-amber-500 pl-3">
                        {block.text}
                      </h3>
                    </div>
                  );
                }

                if (block.type === "table") {
                  return (
                    <div
                      key={bIdx}
                      className="overflow-x-auto my-4 rounded-xl border border-neutral-200 dark:border-white/10 custom-gold-scrollbar"
                    >
                      <table className="w-full text-left text-xs border-collapse">
                        <tbody>
                          {block.data.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className={
                                rIdx === 0
                                  ? "bg-amber-50/80 dark:bg-amber-500/10 font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10"
                                  : "border-b border-neutral-100 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                              }
                            >
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3 sm:p-3.5 leading-snug">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                return (
                  <p key={bIdx} className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {block.text}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 p-8 text-center">
              <p className="text-sm text-neutral-500">Guide content loading...</p>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-12 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 p-8 text-center shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white font-display">
              Ready to execute this migration blueprint?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto">
              Our certified Center of Excellence engineers can stage, benchmark, and validate this exact migration in a zero-risk lab environment before production rollout.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/request-poc"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-amber-700 transition-all"
              >
                <span>Request PoC Migration Lab</span>
                <LuArrowRight className="size-4" />
              </Link>
              <Link
                href="/calculator/pam"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-white/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:border-amber-500 transition-all"
              >
                <span>Calculate PAM ROI</span>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
