import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { termsMeta, termsSections } from "@/data/terms-content";
import {
  FileText,
  Calendar,
  MapPin,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Gavel,
  Mail,
  Building2,
  ArrowRight
} from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | iValue Center of Excellence",
  description:
    "Review the Terms and Conditions governing the use of iValue InfoSolutions' Center of Excellence (CoE) portal, multi-vendor solution blueprints, and hands-on laboratory testing environments.",
};

const sectionIcons = {
  "01": CheckCircle2,
  "02": Terminal,
  "03": ShieldCheck,
  "04": AlertTriangle,
  "05": Scale,
  "06": Gavel
};

export default function TermsAndConditionsPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-900 font-display">
      <Navbar />

      <main className="flex-1 py-12 md:py-16 px-6 sm:px-10">
        <div className="mx-auto max-w-5xl">
          
          {/* Breadcrumbs Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 font-sans">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">Terms & Conditions</span>
          </nav>

          {/* Header & Title Area */}
          <div className="border-b border-neutral-200/80 pb-10 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-orange-400 shadow-sm">
                <IValueEmblem className="size-3.5" />
                <span>iValue Group • Enterprise Legal Terms</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
                {/* Last Updated Badge */}
                <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 font-semibold text-neutral-600 shadow-xs dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                  <Calendar className="size-3.5 text-amber-600 dark:text-orange-400" />
                  <span>Last Updated: {termsMeta.lastUpdated}</span>
                </div>

                {/* Jurisdiction Badge */}
                <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 font-semibold text-neutral-600 shadow-xs dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                  <MapPin className="size-3.5 text-amber-600 dark:text-orange-400" />
                  <span>Jurisdiction: Bangalore, India</span>
                </div>
              </div>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl text-neutral-900 dark:text-white">
              Terms and Conditions
            </h1>

            <p className="mt-4 max-w-3xl text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
              These Terms and Conditions govern your access to and utilization of the iValue Center of Excellence (&quot;CoE&quot;) portal, 
              associated proof-of-concept testing facilities, technical architecture blueprints, and advisory demonstrations provided by iValue InfoSolutions Limited.
            </p>
          </div>

          {/* Quick-Jump Section Index Pills */}
          <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-white/70 p-4.5 backdrop-blur-sm shadow-xs dark:border-white/10 dark:bg-neutral-900/60 font-sans">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
              <FileText className="size-4 text-amber-600 dark:text-orange-400" />
              <span>Quick Navigation Index</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {termsSections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-amber-500/50 hover:bg-neutral-50 hover:text-amber-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-orange-500/50 dark:hover:bg-neutral-700 dark:hover:text-orange-400 transition-all shadow-2xs"
                >
                  <span className="font-mono text-[10px] text-amber-600 dark:text-orange-400">
                    {sec.number}.
                  </span>
                  <span>{sec.shortTitle}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Numbered Section Cards */}
          <div className="mt-12 space-y-8">
            {termsSections.map((section) => {
              const IconComponent = sectionIcons[section.number] || FileText;

              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-amber-500/40 dark:border-white/10 dark:bg-neutral-900/80"
                >
                  {/* Section Title Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 font-mono text-xs font-bold text-amber-700 dark:text-orange-400 border border-amber-500/20">
                        {section.number}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>

                    <div className="flex size-9 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300 shrink-0">
                      <IconComponent className="size-4.5" />
                    </div>
                  </div>

                  {/* Highlight Summary Box */}
                  <div className="mt-4 rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3.5 dark:border-white/5 dark:bg-neutral-800/40 font-sans">
                    <p className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-200 leading-snug">
                      {section.summary}
                    </p>
                  </div>

                  {/* Paragraph Clauses */}
                  <div className="mt-5 space-y-3 font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {section.paragraphs.map((paragraph, pIdx) => (
                      <p key={pIdx}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Legal Advisory & Queries Card */}
          <div className="mt-12 rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900/80">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-5 dark:border-white/5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 font-mono text-xs font-bold text-amber-700 dark:text-orange-400 border border-amber-500/20">
                07
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                Legal Inquiries & Official Notices
              </h2>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              For formal legal communications, contractual clarifications, or inquiries concerning these Terms, please contact our Legal & Corporate Affairs Department:
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
              <div className="flex items-start gap-3 rounded-xl border border-neutral-200/70 bg-neutral-50/60 p-4 dark:border-white/5 dark:bg-neutral-800/40">
                <Mail className="size-4.5 text-amber-600 dark:text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Legal & Corporate Affairs
                  </h3>
                  <a
                    href="mailto:legal@ivalue.co.in"
                    className="text-xs text-amber-700 dark:text-orange-400 font-semibold hover:underline block mt-0.5"
                  >
                    legal@ivalue.co.in
                  </a>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                    Formal legal correspondence and master agreement inquiries.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-neutral-200/70 bg-neutral-50/60 p-4 dark:border-white/5 dark:bg-neutral-800/40">
                <Building2 className="size-4.5 text-amber-600 dark:text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Registered Office
                  </h3>
                  <address className="not-italic text-xs text-neutral-600 dark:text-neutral-300 mt-0.5 leading-snug">
                    iValue InfoSolutions Limited<br />
                    No. 903/1/1, 19th Main Road, 4th Sector,<br />
                    H.S.R. Layout, Bangalore - 560102, India
                  </address>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100 dark:border-white/5 text-xs text-neutral-500 dark:text-neutral-400 font-sans">
              <p>Looking to explore custom enterprise agreements or bilateral NDA execution?</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 font-semibold text-amber-700 dark:text-orange-400 hover:underline"
              >
                Contact Enterprise Legal Support <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
