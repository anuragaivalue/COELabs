import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { OemImage } from "@/components/ui/oem-image";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { stackControlsData } from "@/data/stack-controls";
import { solutionStacks } from "@/data/stacks";
import {
  Shield,
  Layers,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  TrendingUp,
  FileCheck2,
  ExternalLink,
  Laptop2
} from "lucide-react";

export async function generateStaticParams() {
  const customSlugs = Object.keys(stackControlsData).map((slug) => ({ slug }));
  const dataSlugs = solutionStacks.map((s) => ({ slug: s.id }));
  return [...customSlugs, ...dataSlugs];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const customStack = stackControlsData[slug];
  if (customStack) {
    return {
      title: `${customStack.title} | iValue Center of Excellence`,
      description: customStack.tagline
    };
  }
  const fallback = solutionStacks.find((s) => s.id === slug);
  if (fallback) {
    return {
      title: `${fallback.title} | iValue Center of Excellence`,
      description: fallback.description
    };
  }
  return {
    title: "Stack Controls | iValue Center of Excellence"
  };
}

export default async function StackControlsPage({ params }) {
  const { slug } = await params;

  // Prioritize solutionStacks for 1:1 verbatim data matching the MAIN site
  const fromSolution = solutionStacks.find(
    (s) => s.id === slug || s.id.toLowerCase() === slug.toLowerCase()
  );

  let stack = null;

  if (fromSolution) {
    stack = {
      slug: fromSolution.id,
      title: fromSolution.title,
      shortTitle: fromSolution.title,
      category: fromSolution.category || "Technology Stack",
      tagline: fromSolution.overview || fromSolution.description || "Validated Multi-OEM Enterprise Solution Stack",
      overview:
        fromSolution.overview ||
        fromSolution.description ||
        "Enterprise-grade solution architecture integrating pre-validated multi-vendor blueprints and automated compliance controls from iValue Center of Excellence.",
      compliance: [
        { name: "CERT-In Guidelines", desc: "Mandatory incident response, logging & baseline security controls" },
        { name: "RBI Cybersecurity Framework", desc: "Enterprise governance, third-party risk & continuous auditing" },
        { name: "SEBI CSCRF", desc: "Critical cyber-resilience controls and automated evidence capture" },
        { name: "ISO 27001:2022 / PCI-DSS v4.0", desc: "Turnkey mappings for enterprise audits and risk assessment" }
      ],
      oems: (fromSolution.oems || []).map((o) => ({
        name: typeof o === "string" ? o : o.name,
        role: "Certified OEM Partner",
        logo: typeof o === "string" ? null : o.logo
      })),
      controls: (fromSolution.controls || []).map((c, i) => ({
        id: typeof c === "object" && c.id ? c.id : `CTL-${String(i + 1).padStart(2, "0")}`,
        name: typeof c === "object" ? (c.name || c.title) : c,
        desc: typeof c === "object" && c.desc ? c.desc : ""
      })),
      multiplier: "Accelerate deployment timeline by 3.5x while minimizing procurement risk."
    };
  } else if (stackControlsData[slug]) {
    stack = stackControlsData[slug];
  } else {
    notFound();
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-900">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-amber-600 dark:hover:text-orange-400 transition-colors"
            >
              <ChevronLeft className="size-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link
              href="/#values"
              className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors"
            >
              Solution Stacks
            </Link>
            <span>/</span>
            <span className="text-neutral-800 dark:text-neutral-200 font-semibold truncate max-w-[200px] sm:max-w-none">
              {stack.shortTitle}
            </span>
          </div>

          {/* Hero Header */}
          <div className="mt-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 pb-10 border-b border-neutral-200/80 dark:border-white/10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:border-orange-400/25 dark:bg-orange-500/15 dark:text-orange-300">
                <IValueEmblem className="size-3.5" />
                <span>{stack.category}</span>
              </div>

              <h1 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
                {stack.title}
              </h1>

              <p className="mt-4 font-display text-base sm:text-lg font-medium text-amber-700 dark:text-orange-400">
                {stack.tagline}
              </p>

              <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                {stack.overview}
              </p>
            </div>

            {/* Quick Actions Card */}
            <div className="w-full lg:w-80 shrink-0 rounded-2xl border border-neutral-200/90 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-neutral-900/90">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-orange-400">
                <Laptop2 className="size-4" />
                <span>Live Lab Access</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-neutral-900 dark:text-white">
                Test in Live CoE Lab
              </h3>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-sans">
                Experience this multi-stack blueprint running live with dedicated solution architects.
              </p>

              <div className="mt-5 flex flex-col gap-2.5">
                <Link
                  href={`/request-poc?stack=${encodeURIComponent(stack.slug)}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 shadow-md transition-all"
                >
                  <span>Request Architecture Blueprint & Demo</span>
                  <ArrowRight className="size-3.5" />
                </Link>

                <Link
                  href="/portal/marketplace"
                  className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300/80 bg-white py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800/80 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-all"
                >
                  <span>Browse Full Marketplace</span>
                </Link>
              </div>
            </div>
          </div>

          {/* OEM Ecosystem Section */}
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-sans text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Validated OEM Ecosystem
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans">
                  Best-of-breed technology partners pre-integrated and certified into this stack architecture.
                </p>
              </div>
              <span className="hidden sm:inline-block rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                {stack.oems.length} OEM Partners
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stack.oems.map((oem, idx) => (
                <Card
                  key={idx}
                  className="flex flex-col justify-between p-5 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 hover:border-amber-500/40 transition-all shadow-sm"
                >
                  <div>
                    {/* Clean white backdrop in dark mode for 100% logo visibility */}
                    <div className="flex h-14 w-full items-center justify-center rounded-xl bg-neutral-100/90 dark:bg-white/95 p-2 shadow-2xs border border-neutral-200/50 dark:border-white/20 transition-all">
                      <OemImage
                        src={oem.logo}
                        alt={oem.name}
                        className="max-h-9 max-w-[130px] object-contain"
                        placeholderClassName="h-9 w-full"
                      />
                    </div>
                    <CardTitle className="mt-3.5 text-sm font-bold text-neutral-900 dark:text-white">
                      {oem.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs font-sans text-neutral-500 dark:text-neutral-400">
                      {oem.role}
                    </CardDescription>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-700 dark:text-orange-400">
                      Certified Integration
                    </span>
                    <a
                      href="https://coe.ivaluegroup.com/index"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Blueprint Controls Section */}
          {stack.controls && stack.controls.length > 0 && (
            <section className="mt-16">
              <div className="max-w-2xl">
                <h2 className="font-sans text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Pre-Engineered Architecture Controls
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans">
                  Turnkey controls mapped to regulatory frameworks to guarantee compliance and operational readiness.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {stack.controls.map((control, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 rounded-xl border border-neutral-200/80 bg-white/80 p-5 shadow-xs dark:border-white/10 dark:bg-neutral-900/70"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 font-display text-xs font-bold text-amber-700 dark:bg-orange-500/15 dark:text-orange-400">
                      {control.id || `0${idx + 1}`}
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-neutral-900 dark:text-white">
                        {control.name}
                      </h3>
                      {control.desc && (
                        <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                          {control.desc}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Compliance & Regulatory Mappings */}
          <section className="mt-16">
            <div className="max-w-2xl">
              <h2 className="font-sans text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Regulatory Framework Mappings
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans">
                Pre-audited against major national and international cybersecurity compliance frameworks.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stack.compliance.map((comp, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-200/80 bg-white/70 p-4 shadow-2xs dark:border-white/10 dark:bg-neutral-900/60"
                >
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-display text-xs font-bold text-neutral-900 dark:text-white">
                      {comp.name}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-sans">
                    {comp.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Revenue Multiplier Box */}
          <section className="mt-16 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-8 dark:border-orange-500/25 dark:from-orange-500/15 dark:via-orange-500/5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-orange-500/25 dark:text-orange-300">
                  <TrendingUp className="size-3.5" />
                  <span>Revenue Multiplier Impact</span>
                </div>
                <h3 className="mt-3 font-sans text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
                  Why Enterprises Choose This Stack Architecture
                </h3>
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed">
                  {stack.multiplier}
                </p>
              </div>

              <Link
                href={`/request-poc?stack=${encodeURIComponent(stack.slug)}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 shadow-md transition-all shrink-0"
              >
                <span>Schedule Executive Blueprint Briefing</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
