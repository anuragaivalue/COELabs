import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { audienceBenefits } from "@/data/benefits";
import {
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  Layers
} from "lucide-react";

export const metadata = {
  title: "Ecosystem Advantages | iValue Center of Excellence",
  description:
    "Explore tailored advantages for Enterprises, Channel Partners, and Technology OEMs across the iValue Center of Excellence ecosystem."
};

export default function AdvantagesPage() {
  const icons = {
    enterprise: Building2,
    partners: Users,
    oems: Layers
  };

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
            <span className="text-neutral-900 dark:text-white font-semibold">Advantages</span>
          </div>

          {/* Hero Header */}
          <div className="mt-8 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:border-orange-400/25 dark:bg-orange-500/15 dark:text-orange-300">
              <IValueEmblem className="size-3.5" />
              <span>Tailored Advantages for the Ecosystem</span>
            </div>

            <h1 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
              Ecosystem Advantages
            </h1>

            <p className="mt-3 font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Discover how the <span className="highlight">iValue Center of Excellence</span> empowers enterprises to reduce procurement risk, enables channel partners to scale margin, and gives OEMs pre-validated multi-brand integrations.
            </p>
          </div>

          {/* Audience Benefits Sections */}
          <div className="mt-16 space-y-16">
            {audienceBenefits.map((audience, idx) => {
              const IconComp = icons[audience.id] || Building2;
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={audience.id}
                  className="rounded-3xl border border-neutral-200/90 bg-white/90 p-8 sm:p-12 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/80"
                >
                  <div className={`grid grid-cols-1 gap-10 lg:grid-cols-12 items-center ${isEven ? "lg:flex-row-reverse" : ""}`}>
                    {/* Content Column */}
                    <div className="lg:col-span-7">
                      <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-700 dark:bg-orange-500/15 dark:text-orange-300">
                        <IconComp className="size-3.5" />
                        <span>{audience.title}</span>
                      </div>

                      <h2 className="mt-3 font-sans text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                        {audience.subtitle}
                      </h2>

                      <p className="mt-4 font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {audience.summary}
                      </p>

                      {/* Key Points Grid */}
                      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {audience.keyPoints.map((point, pIdx) => (
                          <div
                            key={pIdx}
                            className="rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-4 dark:border-white/5 dark:bg-neutral-800/50"
                          >
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="size-4 text-amber-600 dark:text-orange-400 shrink-0 mt-0.5" />
                              <h3 className="font-display text-xs font-bold text-neutral-900 dark:text-white">
                                {point.title}
                              </h3>
                            </div>
                            <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed">
                              {point.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* CTA Link */}
                      <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-white/5 flex items-center gap-4">
                        <Link
                          href="/request-poc"
                          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 shadow-sm transition-all"
                        >
                          <span>Request Architecture Blueprint</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Image Column */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 shadow-xl dark:border-white/10 bg-neutral-100 dark:bg-neutral-800/80 min-h-[300px] sm:min-h-[380px] w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={audience.image}
                          alt={audience.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
