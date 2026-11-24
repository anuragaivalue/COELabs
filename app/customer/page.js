import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import {
  LuShieldCheck,
  LuCpu,
  LuClock,
  LuFileCheck,
  LuCalendar,
  LuArrowRight,
  LuChevronLeft,
  LuChevronRight,
  LuSparkles,
  LuLayers,
  LuTrendingUp,
  LuZap,
  LuScale,
  LuBuilding2,
  LuCircleCheck,
  LuCheck,
  LuWorkflow
} from "react-icons/lu";

export const metadata = {
  title: "Customer - iValue Center of Excellence",
  description:
    "The iValue Center of Excellence helps CXOs make high-stakes decisions with validated, demo-ready architectures — turning multi-OEM complexity into production confidence."
};

const outcomes = [
  {
    number: "01",
    title: "Certainty Before Procurement",
    description:
      "Experience integrated architectures working in live environments — reducing decision risk before RFPs and committees.",
    icon: LuShieldCheck,
    tag: "Pre-Procurement Proof"
  },
  {
    number: "02",
    title: "Validated Multi-OEM Architectures",
    description:
      "Production-ready reference stacks across security, cloud, data/AI, and observability — designed for enterprise scale.",
    icon: LuCpu,
    tag: "Multi-Brand Stacks"
  },
  {
    number: "03",
    title: "Faster Decisions, Faster Outcomes",
    description:
      "Reduce evaluation cycles by eliminating technical uncertainty and standardizing proof with repeatable demos.",
    icon: LuClock,
    tag: "Accelerated Velocity"
  },
  {
    number: "04",
    title: "Compliance-Ready by Design",
    description:
      "Pre-mapped controls and architectures aligned to frameworks like RBI, SEBI CSCRF, CERT-IN, DORA, NIS2, IEC 62443.",
    icon: LuFileCheck,
    tag: "Regulatory Alignment"
  }
];

const keyPillars = [
  {
    title: "Multi-Brand Multi-Cloud Solutions",
    description:
      "Bridge the gap with empowered multi-vendor solution stacks that work seamlessly and in an integrated fashion across hybrid enterprise architectures.",
    icon: LuLayers
  },
  {
    title: "Cost-Effective ROIs & Risk Mitigation",
    description:
      "Validate architectures through pre-integrated blueprints before purchasing capex, ensuring lower total cost of ownership.",
    icon: LuTrendingUp
  },
  {
    title: "Accelerated Deployment Cycles",
    description:
      "Go live faster with pre-tested OEM interoperability playbooks, minimizing implementation friction and unforeseen dependencies.",
    icon: LuZap
  },
  {
    title: "End-to-End Enterprise Governance",
    description:
      "Integrated compliance mappings for ISO 27001, PCI-DSS, GDPR, RBI, and CIS Controls tested in real-world scenarios.",
    icon: LuScale
  }
];

const technologyStacks = [
  {
    name: "Security Operations Center",
    href: "/stack/scoControls",
    desc: "Next-gen SIEM, SOAR & telemetry normalization"
  },
  {
    name: "IAM (Identity & Access)",
    href: "/stack/iamControls",
    desc: "Zero Trust access, IGA & privileged session security"
  },
  {
    name: "Endpoint Security",
    href: "/stack/endpointControls",
    desc: "Unified EDR, vulnerability management & device posture"
  },
  {
    name: "Cloud Security",
    href: "/stack/cloudSecurityControls",
    desc: "CSPM, CWPP & multi-cloud posture governance"
  },
  {
    name: "Application Security",
    href: "/stack/applicationSecurity",
    desc: "SAST, DAST, API protection & secure CI/CD pipelines"
  }
];

const verticalStacks = [
  {
    name: "BFSI",
    href: "/stack/BFSIControls",
    desc: "Banking & financial compliance frameworks"
  },
  {
    name: "Manufacturing",
    href: "/stack/Manufacturingcontrols",
    desc: "OT/ICS security & industrial telemetry"
  },
  {
    name: "Energy & Power",
    href: "/stack/EnergyPowerControls",
    desc: "Critical infrastructure & SCADA resilience"
  },
  {
    name: "Insurance",
    href: "/stack/InsuranceControls",
    desc: "Digital policyholder data protection"
  },
  {
    name: "Enterprise",
    href: "/stack/EnterpriseControls",
    desc: "Cross-functional corporate governance"
  },
  {
    name: "Pharma & Healthcare",
    href: "/stack/PharmaControls",
    desc: "GxP integrity & research data security"
  },
  {
    name: "Digital Natives",
    href: "/stack/DigitalNativesControls",
    desc: "Kubernetes & cloud-scale security"
  },
  {
    name: "Fintech",
    href: "/stack/FintechControls",
    desc: "Real-time payment fraud prevention"
  }
];

export default function CustomerPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-900">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <LuChevronLeft className="size-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">
              Customer
            </span>
          </div>

          {/* Section 1: Hero Section */}
          <section className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-white/95 p-6 sm:p-10 md:p-14 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/95">
              {/* Ambient radial glows */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-600/10 dark:bg-amber-600/10 blur-3xl" />

              <div className="relative z-10 max-w-4xl">
                {/* Category Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300 mb-5">
                  <span>Customer • Center of Excellence</span>
                </div>

                <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
                  Enterprises Don't Buy Technology. They Buy{" "}
                  <span className="highlight">Certainty</span>.
                </h1>

                <p className="mt-5 max-w-3xl text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                  The iValue Center of Excellence helps CXOs make high-stakes decisions with validated, demo-ready architectures — turning multi-OEM complexity into production confidence.
                </p>

                {/* Primary Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/contact?type=enterprise"
                    className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-all cursor-pointer"
                  >
                    <LuCalendar className="size-4 text-amber-500 dark:text-amber-600" />
                    <span>Schedule Executive Walkthrough</span>
                  </Link>

                  <Link
                    href="/#values"
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-300/90 bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-neutral-800 hover:border-amber-500/50 hover:bg-neutral-50 dark:border-white/20 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:border-amber-400/60 dark:hover:bg-neutral-700/90 dark:hover:text-amber-300 transition-all cursor-pointer"
                  >
                    <LuWorkflow className="size-4 text-amber-600 dark:text-amber-400" />
                    <span>Explore the CoE</span>
                    <LuArrowRight className="size-3.5 text-neutral-400 dark:text-neutral-300" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Complexity to Confidence (Value Pillars) */}
          <section className="mt-16 sm:mt-24">
            <div className="rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 p-6 sm:p-10 md:p-12 shadow-sm backdrop-blur-md">
              <div className="max-w-3xl mx-auto text-center mb-10">
                <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-2">
                  IVALUE CENTER OF EXCELLENCE
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  From Technology Complexity to Enterprise Confidence
                </h2>
                <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  iValue Center of Excellence empowers businesses with cutting-edge multi-brand, multi-cloud solutions. We bridge the gap between technology and business needs with integrated security and infrastructure stacks.
                </p>
              </div>

              {/* 4 Strategic Value Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {keyPillars.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={idx}
                      className="group flex items-start gap-4 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-neutral-800/40 p-5 sm:p-6 hover:border-amber-500/40 hover:bg-amber-50/30 dark:hover:bg-amber-500/5 transition-all duration-200"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 group-hover:scale-105 transition-transform">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white">
                          {pillar.title}
                        </h3>
                        <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section 3: Outcomes You Can Validate */}
          <section id="coe-outcomes" className="mt-16 sm:mt-24">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1 text-xs font-semibold text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <LuShieldCheck className="size-3.5 text-amber-600 dark:text-amber-400" />
                <span>Enterprise Outcomes</span>
              </div>
              <h2 className="mt-3 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Outcomes You Can <span className="highlight">Validate</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                Make informed technology decisions with validated architectures, repeatable demonstrations, and compliance-aware designs.
              </p>
            </div>

            {/* 4 Outcome Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {outcomes.map((outcome) => {
                const Icon = outcome.icon;
                return (
                  <article
                    key={outcome.number}
                    className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div>
                      {/* Top Bar with Number & Icon */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">
                          {outcome.number}
                        </span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          <Icon className="size-4.5" />
                        </div>
                      </div>

                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md mb-2">
                        {outcome.tag}
                      </span>

                      <h3 className="font-display text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                        {outcome.title}
                      </h3>

                      <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {outcome.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                      <LuCircleCheck className="size-3.5" />
                      <span>Validated in CoE Lab</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Section 4: Validated Technology & Vertical Stacks */}
          <section id="technology-stacks" className="mt-16 sm:mt-24">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1 text-xs font-semibold text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <LuLayers className="size-3.5 text-amber-600 dark:text-amber-400" />
                <span>COE Capabilities</span>
              </div>
              <h2 className="mt-3 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Explore Validated <span className="highlight">Technology Stacks</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
                Explore integrated technology stacks designed around enterprise security and infrastructure requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Column 1: Technology Stacks */}
              <div className="rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 p-6 sm:p-8 shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-1 h-4 rounded-full bg-amber-500 shrink-0" />
                    <h3 className="font-display text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                      Technology Stacks
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    5 Architecture Blueprints
                  </span>
                </div>

                <div className="space-y-2.5">
                  {technologyStacks.map((stack, idx) => (
                    <Link
                      key={idx}
                      href={stack.href}
                      className="group flex items-center justify-between rounded-2xl border border-neutral-100 dark:border-white/5 bg-neutral-50/70 dark:bg-neutral-800/40 p-3.5 hover:border-amber-500/40 hover:bg-amber-50/40 dark:hover:bg-amber-500/10 transition-all duration-150"
                    >
                      <div>
                        <span className="block font-display text-sm font-bold text-neutral-900 dark:text-neutral-200 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                          {stack.name}
                        </span>
                        <span className="block text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {stack.desc}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0 ml-2">
                        <span>View Stack</span>
                        <LuChevronRight className="size-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Column 2: Vertical Stacks */}
              <div className="rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 p-6 sm:p-8 shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-1 h-4 rounded-full bg-amber-500 shrink-0" />
                    <h3 className="font-display text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                      Vertical Industry Stacks
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    8 Sector Controls
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {verticalStacks.map((stack, idx) => (
                    <Link
                      key={idx}
                      href={stack.href}
                      className="group flex flex-col justify-between rounded-2xl border border-neutral-100 dark:border-white/5 bg-neutral-50/70 dark:bg-neutral-800/40 p-3 hover:border-amber-500/40 hover:bg-amber-50/40 dark:hover:bg-amber-500/10 transition-all duration-150"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-display text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-200 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                          {stack.name}
                        </span>
                        <LuChevronRight className="size-3.5 text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {stack.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* Section 5: Closing CTA */}
          <section className="mt-16 sm:mt-24">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-gradient-to-r from-amber-50/90 via-white to-amber-50/90 dark:from-neutral-900 dark:via-neutral-800/90 dark:to-neutral-900 p-8 sm:p-12 md:p-16 shadow-xl backdrop-blur-xl text-center">
              <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-600/10 dark:bg-amber-600/10 blur-3xl" />

              <div className="relative z-10 max-w-3xl mx-auto">
                <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-amber-800 dark:text-amber-300 mb-3">
                  MAKE DECISIONS WITH CONFIDENCE
                </span>

                <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
                  Decide with <span className="highlight">Confidence</span> — Before Procurement Begins.
                </h2>

                <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  See validated stacks, understand the architecture, and align stakeholders early — so procurement finalizes terms, not feasibility.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                  <Link
                    href="/contact?type=enterprise"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-amber-700 transition-all cursor-pointer"
                  >
                    <LuCalendar className="size-4" />
                    <span>Schedule Walkthrough</span>
                  </Link>

                  <Link
                    href="/partners"
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-300/90 bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-neutral-800 hover:border-amber-500/50 hover:bg-neutral-50 dark:border-white/20 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:border-amber-400/60 dark:hover:bg-neutral-700/90 dark:hover:text-amber-300 transition-all cursor-pointer"
                  >
                    <span>For Partners</span>
                    <LuArrowRight className="size-3.5 text-neutral-400 dark:text-neutral-300" />
                  </Link>

                  <Link
                    href="/calculator/soc"
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-300/90 bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-neutral-800 hover:border-amber-500/50 hover:bg-neutral-50 dark:border-white/20 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:border-amber-400/60 dark:hover:bg-neutral-700/90 dark:hover:text-amber-300 transition-all cursor-pointer"
                  >
                    <span>Calculate SOC ROI</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
