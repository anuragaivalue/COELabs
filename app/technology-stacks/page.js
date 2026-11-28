import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TechnologyStackMatrix } from "@/components/stacks/technology-stack-matrix";
import {
  Layers,
  ShieldCheck,
  Cpu,
  Terminal,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  FlaskConical,
  Server
} from "lucide-react";

export const metadata = {
  title: "Multi-Stack Technology Matrices | iValue Center of Excellence (CoE)",
  description:
    "Explore verified multi-OEM security architectures across SOC & SIEM, Identity & Access (IAM), Endpoint Detection, Cloud Security (CNAPP), and DevSecOps validated at iValue CoE.",
};

export default function TechnologyStacksPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-foreground transition-colors duration-900">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden border-b border-neutral-200/80 bg-gradient-to-b from-amber-50/40 via-white to-neutral-50 pt-32 pb-16 dark:border-white/10 dark:from-amber-950/20 dark:via-neutral-950 dark:to-neutral-950">
          {/* Ambient Grid Background */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:bg-[radial-gradient(#333_1px,transparent_1px)] dark:opacity-25" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-6">
              <Link href="/" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3 text-neutral-400" />
              <span className="text-neutral-700 dark:text-neutral-300">Multi Stacks</span>
              <ChevronRight className="size-3 text-neutral-400" />
              <span className="text-amber-600 dark:text-orange-400">Technology Stacks Suite</span>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-800 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300 mb-4">
                <Layers className="size-3.5 text-amber-600 dark:text-orange-400" />
                <span>Multi-Vendor Interoperability Testbed</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
                Enterprise Technology <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent dark:from-orange-400 dark:via-amber-400 dark:to-orange-500">
                  Stacks Suite
                </span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Lab-validated, interoperable multi-OEM architectural matrices mapped to NIST CSF 2.0, ISO 27001, and zero-trust design benchmarks. Compare control requirements, verified OEM platforms, and pre-integrated blueprints ready for production deployment.
              </p>

              {/* Quick metrics banner */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-neutral-200/80 bg-white/70 p-3.5 shadow-sm dark:border-white/10 dark:bg-neutral-900/60">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Domains
                  </div>
                  <div className="mt-1 text-2xl font-black text-neutral-900 dark:text-white">5 Core</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">SOC to DevSecOps</div>
                </div>

                <div className="rounded-xl border border-neutral-200/80 bg-white/70 p-3.5 shadow-sm dark:border-white/10 dark:bg-neutral-900/60">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Controls
                  </div>
                  <div className="mt-1 text-2xl font-black text-amber-600 dark:text-orange-400">25+ Standard</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">NIST & ISO aligned</div>
                </div>

                <div className="rounded-xl border border-neutral-200/80 bg-white/70 p-3.5 shadow-sm dark:border-white/10 dark:bg-neutral-900/60">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Blueprints
                  </div>
                  <div className="mt-1 text-2xl font-black text-neutral-900 dark:text-white">10+ Verified</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Turnkey architectures</div>
                </div>

                <div className="rounded-xl border border-neutral-200/80 bg-white/70 p-3.5 shadow-sm dark:border-white/10 dark:bg-neutral-900/60">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Lab Telemetry
                  </div>
                  <div className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">100% Validated</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Physical & cloud testbeds</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Matrix Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
          <TechnologyStackMatrix />
        </div>

        {/* Bottom CTA / Lab Testing Invitation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/60 p-8 sm:p-12 text-white shadow-xl">
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 mb-3">
                  <FlaskConical className="size-3.5 text-amber-400" />
                  <span>Interactive Proof-of-Value (POV)</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Test Your Multi-Vendor Security Blueprint in Our Physical Cyber Range
                </h3>
                <p className="mt-3 text-neutral-300 text-sm sm:text-base leading-relaxed">
                  Avoid costly interoperability blindspots. Simulate attack traffic, evaluate real-time API integrations, and stress-test failover configurations across OEM platforms before committing production capital.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Server className="size-4 text-amber-400" /> Bare-Metal Hardware & Cloud Interconnects
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-400" /> Certified Multi-OEM Engineers
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-amber-500/25 cursor-pointer"
                >
                  <span>Schedule Lab POV Session</span>
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/portal/marketplace"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 cursor-pointer"
                >
                  <span>Explore Marketplace</span>
                  <ExternalLink className="size-4" />
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
