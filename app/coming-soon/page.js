"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  LuSparkles,
  LuClock,
  LuArrowRight,
  LuChevronLeft,
  LuShieldCheck,
  LuCircleCheck,
  LuLayers,
  LuWrench,
  LuMail,
  LuCpu
} from "react-icons/lu";

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const serviceName = searchParams.get("service") || "Enterprise Accelerator Module";
  const serviceType = searchParams.get("type") || "implementation";
  
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isMigration = serviceType === "migration";
  const typeLabel = isMigration ? "Migration Service Accelerator" : "Implementation Service Accelerator";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-900">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-8">
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
            <span className="text-neutral-900 dark:text-white font-semibold truncate max-w-xs sm:max-w-md">
              {serviceName}
            </span>
          </div>

          {/* Central Hero Card */}
          <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
            {/* Ambient Gold Glow Corner */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-600/10 dark:bg-amber-600/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-50/80 dark:bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-6">
                <LuClock className="size-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span>{typeLabel} • In Active Development</span>
              </div>

              {/* Service Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-display">
                {serviceName}
              </h1>

              {/* Subheading */}
              <p className="mt-4 max-w-2xl text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Our Center of Excellence engineering team is currently engineering this accelerator module to deliver pre-validated architecture blueprints, sizing calculations, and automated deployment runbooks.
              </p>

              {/* Development Pillars Grid */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
                <div className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-neutral-800/40 p-5">
                  <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400 font-semibold text-sm mb-2">
                    <LuShieldCheck className="size-4" />
                    <span>Validated Blueprints</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Zero-day reference architectures and hardened configuration templates vetted by OEM engineers.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-neutral-800/40 p-5">
                  <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400 font-semibold text-sm mb-2">
                    <LuCpu className="size-4" />
                    <span>Automated Deployment</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Pre-packaged migration scripts, API connectors, and telemetry integrations for rapid time-to-value.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-neutral-800/40 p-5">
                  <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400 font-semibold text-sm mb-2">
                    <LuLayers className="size-4" />
                    <span>Day-2 Operations</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Comprehensive monitoring runbooks, health check checklists, and operational governance handover.
                  </p>
                </div>
              </div>

              {/* Notification / Early Access Form */}
              <div className="mt-10 w-full max-w-md">
                {submitted ? (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2 text-sm font-semibold">
                    <LuCircleCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Thank you! We will notify you when this accelerator launches.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <LuMail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter work email for early access..."
                        className="w-full rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-neutral-800/80 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:from-amber-700 hover:to-amber-800 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <LuSparkles className="size-4" />
                      <span>Request Preview</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Navigation Actions */}
              <div className="mt-8 pt-8 border-t border-neutral-200/80 dark:border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
                <Link
                  href="/calculator/soc"
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-all"
                >
                  <LuWrench className="size-3.5" />
                  <span>Try SOC Calculator</span>
                </Link>

                <Link
                  href="/multiplier/bfsimultiplier"
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-all"
                >
                  <LuLayers className="size-3.5" />
                  <span>Explore Stack Multipliers</span>
                </Link>

                <Link
                  href="/migration/CyberArkPAM"
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition-all"
                >
                  <span>CyberArk PAM Migration</span>
                  <LuArrowRight className="size-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-transparent">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent" />
        </div>
      }
    >
      <ComingSoonContent />
    </Suspense>
  );
}
