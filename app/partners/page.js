import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { PartnerRegistrationForm } from "@/components/partners/partner-registration-form";
import { partnersData } from "@/data/partners";
import {
  TrendingUp,
  ShieldCheck,
  Scale,
  GraduationCap,
  Globe2,
  ShieldAlert,
  Repeat,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronLeft,
  Briefcase,
  Handshake
} from "lucide-react";

export const metadata = {
  title: "CoE Benefits to iValue Partners | iValue Center of Excellence",
  description:
    "The iValue Center of Excellence transforms channel partners from transactional resellers into strategic advisors by institutionalizing proof — accelerating sales velocity, increasing deal size, and improving win rates."
};

export default function PartnersPage() {
  const heroData = partnersData[0];
  const revenueSec = partnersData[1];
  const diffSec = partnersData[2];
  const costSec = partnersData[3];
  const enablementSec = partnersData[4];
  const marketSec = partnersData[5];
  const riskSec = partnersData[6];
  const recurringSec = partnersData[7];
  const scenariosSec = partnersData[8];
  const nextStepsSec = partnersData[9];

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-900">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-amber-600 dark:hover:text-orange-400 transition-colors"
            >
              <ChevronLeft className="size-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">
              Partners
            </span>
          </div>

          {/* Section 1: Hero & Executive Summary */}
          <section className="mt-8">
            <div className="rounded-3xl border border-neutral-200/90 bg-white/95 p-6 sm:p-10 md:p-12 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/90">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300">
                <IValueEmblem className="size-3.5" />
                <span>{heroData.badge}</span>
              </div>

              <h1 className="mt-4 font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                <span className="highlight">CoE Benefits</span> to iValue Partners
              </h1>

              <p className="mt-4 max-w-3xl font-sans text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {heroData.description}
              </p>

              {/* Executive Summary & The Core Shift Grid */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-neutral-200/80 dark:border-white/10">
                <div>
                  <h2 className="font-display text-xl font-bold text-neutral-900 dark:text-white">
                    {heroData.executiveSummary.title}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {heroData.executiveSummary.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-sans">
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-500 dark:bg-orange-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8 dark:border-orange-500/20 dark:bg-orange-500/5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-orange-400">
                      {heroData.executiveSummary.coreShift.title}
                    </span>
                    <h3 className="mt-2 font-display text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                      {heroData.executiveSummary.coreShift.headline}
                    </h3>
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                      {heroData.executiveSummary.coreShift.subtext}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-100 transition-all cursor-pointer"
                    >
                      <span>Schedule Partner CoE Tour</span>
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href="/request-poc"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300/90 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:border-amber-500/50 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-all cursor-pointer"
                    >
                      <span>Request a Demo Walkthrough</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Revenue Acceleration Benefits */}
          <section className="mt-16 sm:mt-24">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-2xs dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Sales Velocity</span>
              </div>
              <h2 className="mt-3 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {revenueSec.title}
              </h2>
              {revenueSec.subtitle && (
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                  {revenueSec.subtitle}
                </p>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {revenueSec.cards.map((card, cIdx) => (
                <Card
                  key={cIdx}
                  className="flex flex-col justify-between p-6 sm:p-8 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-lg dark:hover:border-orange-500/50"
                >
                  <div>
                    <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className="mt-2 text-xs sm:text-sm font-medium text-amber-700 dark:text-orange-400 font-sans">
                        {card.description}
                      </p>
                    )}
                    <ul className="mt-4 space-y-2.5">
                      {card.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {card.example && (
                    <div className="mt-6 rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-4 dark:border-white/10 dark:bg-neutral-800/60">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                        EXAMPLE
                      </span>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed">
                        {card.example}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* Section 3: Competitive Differentiation */}
          <section className="mt-16 sm:mt-24">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-2xs dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <ShieldCheck className="size-3.5 text-amber-600 dark:text-orange-400" />
                <span>Market Positioning</span>
              </div>
              <h2 className="mt-3 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {diffSec.title}
              </h2>
              {diffSec.subtitle && (
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                  {diffSec.subtitle}
                </p>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {diffSec.cards.map((card, cIdx) => (
                <Card
                  key={cIdx}
                  className="flex flex-col justify-between p-6 sm:p-8 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-lg dark:hover:border-orange-500/50"
                >
                  <div>
                    <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className="mt-2 text-xs sm:text-sm font-medium text-amber-700 dark:text-orange-400 font-sans">
                        {card.description}
                      </p>
                    )}
                    <ul className="mt-4 space-y-2.5">
                      {card.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 4: Cost & Resource Optimization */}
          <section className="mt-16 sm:mt-24">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-2xs dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <Scale className="size-3.5 text-blue-600 dark:text-blue-400" />
                <span>Capital Efficiency</span>
              </div>
              <h2 className="mt-3 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {costSec.title}
              </h2>
              {costSec.subtitle && (
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                  {costSec.subtitle}
                </p>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {costSec.cards.map((card, cIdx) => (
                <Card
                  key={cIdx}
                  className="flex flex-col justify-between p-6 sm:p-8 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-lg dark:hover:border-orange-500/50"
                >
                  <div>
                    <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className="mt-2 text-xs sm:text-sm font-medium text-amber-700 dark:text-orange-400 font-sans">
                        {card.description}
                      </p>
                    )}
                    <ul className="mt-4 space-y-2.5">
                      {card.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 5: Enablement & Capability Building */}
          <section className="mt-16 sm:mt-24">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-2xs dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <GraduationCap className="size-3.5 text-purple-600 dark:text-purple-400" />
                <span>Partner Readiness</span>
              </div>
              <h2 className="mt-3 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {enablementSec.title}
              </h2>
              {enablementSec.subtitle && (
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                  {enablementSec.subtitle}
                </p>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {enablementSec.cards.map((card, cIdx) => (
                <Card
                  key={cIdx}
                  className="flex flex-col justify-between p-6 sm:p-8 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-lg dark:hover:border-orange-500/50"
                >
                  <div>
                    <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className="mt-2 text-xs sm:text-sm font-medium text-amber-700 dark:text-orange-400 font-sans">
                        {card.description}
                      </p>
                    )}
                    <ul className="mt-4 space-y-2.5">
                      {card.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 6: Market Access & Expansion */}
          <section className="mt-16 sm:mt-24">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-2xs dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <Globe2 className="size-3.5 text-teal-600 dark:text-teal-400" />
                <span>Territory & Verticals</span>
              </div>
              <h2 className="mt-3 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {marketSec.title}
              </h2>
              {marketSec.subtitle && (
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                  {marketSec.subtitle}
                </p>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketSec.cards.map((card, cIdx) => (
                <Card
                  key={cIdx}
                  className="flex flex-col justify-between p-6 sm:p-8 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-lg dark:hover:border-orange-500/50"
                >
                  <div>
                    <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className="mt-2 text-xs sm:text-sm font-medium text-amber-700 dark:text-orange-400 font-sans">
                        {card.description}
                      </p>
                    )}
                    <ul className="mt-4 space-y-2.5">
                      {card.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 7: Risk Mitigation & Customer Confidence */}
          <section className="mt-16 sm:mt-24">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-2xs dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <ShieldAlert className="size-3.5 text-rose-600 dark:text-rose-400" />
                <span>Zero Deployment Risk</span>
              </div>
              <h2 className="mt-3 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {riskSec.title}
              </h2>
              {riskSec.subtitle && (
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                  {riskSec.subtitle}
                </p>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {riskSec.cards.map((card, cIdx) => (
                <Card
                  key={cIdx}
                  className="flex flex-col justify-between p-6 sm:p-8 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-lg dark:hover:border-orange-500/50"
                >
                  <div>
                    <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className="mt-2 text-xs sm:text-sm font-medium text-amber-700 dark:text-orange-400 font-sans">
                        {card.description}
                      </p>
                    )}
                    <ul className="mt-4 space-y-2.5">
                      {card.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 8: Recurring Revenue Opportunities */}
          <section className="mt-16 sm:mt-24">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-2xs dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <Repeat className="size-3.5 text-amber-600 dark:text-orange-400" />
                <span>Services Attachment</span>
              </div>
              <h2 className="mt-3 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {recurringSec.title}
              </h2>
              {recurringSec.subtitle && (
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                  {recurringSec.subtitle}
                </p>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {recurringSec.cards.map((card, cIdx) => (
                <Card
                  key={cIdx}
                  className="flex flex-col justify-between p-6 sm:p-8 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-lg dark:hover:border-orange-500/50"
                >
                  <div>
                    <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className="mt-2 text-xs sm:text-sm font-medium text-amber-700 dark:text-orange-400 font-sans">
                        {card.description}
                      </p>
                    )}
                    <ul className="mt-4 space-y-2.5">
                      {card.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 9: Real Partner Success Scenarios */}
          <section className="mt-16 sm:mt-24">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-2xs dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <Trophy className="size-3.5 text-amber-500" />
                <span>Empirical Case Studies</span>
              </div>
              <h2 className="mt-3 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {scenariosSec.title}
              </h2>
              {scenariosSec.subtitle && (
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                  {scenariosSec.subtitle}
                </p>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {scenariosSec.cards.map((card, cIdx) => (
                <Card
                  key={cIdx}
                  className="flex flex-col justify-between p-6 sm:p-8 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-lg dark:hover:border-orange-500/50"
                >
                  <div>
                    <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                      {card.title}
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {card.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-500 dark:bg-orange-400" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 10: Next Steps for Interested Partners */}
          <section className="mt-20 sm:mt-28 mb-12">
            <div className="rounded-3xl border border-neutral-200/90 bg-white/95 p-8 sm:p-12 md:p-16 text-center shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/90">
              <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {nextStepsSec.title}
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                {nextStepsSec.description}
              </p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
                {nextStepsSec.boxes.map((box, bIdx) => (
                  <div
                    key={bIdx}
                    className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-6 dark:border-white/10 dark:bg-neutral-800/50"
                  >
                    <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white">
                      {box.title}
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {box.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-sans">
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
                <a
                  href="#partner-registration"
                  className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 transition-all cursor-pointer"
                >
                  <Handshake className="size-4" />
                  <span>Register as iValue Partner</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-300/90 bg-white px-6 py-3.5 text-sm font-bold text-neutral-800 hover:border-amber-500/50 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-all cursor-pointer"
                >
                  <Briefcase className="size-4" />
                  <span>Talk to a Solution Architect</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Section 11: Enterprise Partner Registration System */}
          <section id="partner-registration" className="mt-16 sm:mt-24 mb-16 scroll-mt-24">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300">
                <Handshake className="size-3.5 text-amber-600 dark:text-orange-400" />
                <span>Ecosystem Onboarding</span>
              </div>
              <h2 className="mt-3 font-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Register as an Authorized iValue CoE Partner
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                Complete your partner registration below to access multi-vendor CoE lab testbeds, joint GTM enablement, and validated pre-sales solution blueprints.
              </p>
            </div>

            <PartnerRegistrationForm />
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
