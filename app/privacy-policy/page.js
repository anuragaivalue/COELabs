import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import {
  ShieldCheck,
  Lock,
  Database,
  UserCheck,
  Scale,
  Calendar,
  Mail,
  Building2,
  FileText,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | iValue Center of Excellence",
  description:
    "Review iValue InfoSolutions' Privacy Policy for the Center of Excellence (CoE), detailing our data collection, security safeguards, Data Principal rights, and compliance with India's DPDP Act 2023.",
};

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    icon: Database,
    summary:
      "We collect strictly necessary corporate and technical details required to fulfill solution inquiries and deliver hands-on architectural demonstrations.",
    items: [
      {
        heading: "Contact & Identity Information",
        details:
          "Full Name, corporate work email address, organization name, job title, and commercial contact number submitted via our inquiry forms or PoC request portals."
      },
      {
        heading: "Business Evaluation & Architectural Parameters",
        details:
          "Target technology stacks, compliance objectives (e.g. ISO 27001, PCI-DSS, RBI mandates), existing infrastructure constraints, and preferred deployment timelines provided during solution scoping."
      },
      {
        heading: "Technical & System Telemetry",
        details:
          "Basic browser metadata, access timestamps, IP address for regional routing, and laboratory security logs generated when interacting with our secure demo sandboxes."
      }
    ]
  },
  {
    number: "02",
    title: "How We Use Information",
    icon: FileText,
    summary:
      "All collected data is processed strictly in accordance with specified, legitimate commercial and engineering purposes.",
    items: [
      {
        heading: "Solution Consultations & Inquiry Response",
        details:
          "Evaluating your enterprise technology requirements and connecting you with the appropriate iValue Solutions Architects."
      },
      {
        heading: "Provisioning Hands-On Lab Demonstrations",
        details:
          "Configuring, provisioning, and scheduling physical walkthroughs at our Bangalore or Singapore facilities, as well as multi-tenant remote virtual testbeds."
      },
      {
        heading: "Architectural Blueprint Generation",
        details:
          "Delivering custom multi-vendor technical architecture blueprints, ROI calculations, and compliance mapping documentation."
      },
      {
        heading: "Security & Fraud Prevention",
        details:
          "Enforcing access authorization, protecting against unauthorized network intrusion into laboratory sandboxes, and auditing administrative events."
      }
    ]
  },
  {
    number: "03",
    title: "Data Protection, Storage & Confidentiality",
    icon: Lock,
    summary:
      "Enterprise-grade security controls govern our infrastructure, ensuring complete confidentiality of your architectural designs.",
    items: [
      {
        heading: "Robust Encryption Protocols",
        details:
          "All sensitive data is encrypted both in transit (TLS 1.3) and at rest (AES-256) across our secure cloud and on-premises storage arrays."
      },
      {
        heading: "Zero Third-Party Commercial Sale",
        details:
          "iValue maintains a strict policy: we NEVER sell, lease, rent, trade, or commercialize your personal or business data to third-party data brokers, marketers, or advertisers."
      },
      {
        heading: "Strict Confidentiality & NDA Governance",
        details:
          "All test configurations, workload parameters, and custom interoperability findings generated within the CoE are treated as proprietary and confidential under bilateral non-disclosure agreements."
      },
      {
        heading: "Role-Based Access Control (RBAC)",
        details:
          "Strict principle-of-least-privilege access is enforced. Only credentialed iValue personnel with explicit business need are granted access to evaluation records."
      }
    ]
  },
  {
    number: "04",
    title: "Data Principal Rights",
    icon: UserCheck,
    summary:
      "In compliance with applicable privacy regulations, you have clear rights regarding the personal data we hold about you.",
    items: [
      {
        heading: "Right to Access & Summary",
        details:
          "You may request a clear summary of personal data held by iValue, the processing activities carried out, and identities of any authorized processors."
      },
      {
        heading: "Right to Correction & Rectification",
        details:
          "You have the right to correct inaccurate data, complete incomplete records, or update obsolete business contact information."
      },
      {
        heading: "Right to Erasure & Withdrawal of Consent",
        details:
          "You may withdraw consent at any time and request the deletion of your contact records, provided retention is not required by statutory audit obligations."
      },
      {
        heading: "Right of Grievance Redressal",
        details:
          "You have access to an expeditious grievance redressal mechanism managed directly by our Data Protection Officer."
      }
    ]
  },
  {
    number: "05",
    title: "Regulatory Compliance: DPDP Act 2023",
    icon: Scale,
    summary:
      "Our governance frameworks are built to meet the requirements of India's landmark Digital Personal Data Protection Act, 2023.",
    items: [
      {
        heading: "Notice & Lawful Purpose",
        details:
          "Personal data is collected strictly upon transparent notice and for explicit, specified purposes agreed to during inquiry submission."
      },
      {
        heading: "Data Minimization & Storage Limitation",
        details:
          "We collect only what is strictly necessary to fulfill technical PoC engagements and retain records only for the duration required to achieve that purpose."
      },
      {
        heading: "Reasonable Security Safeguards",
        details:
          "Technical and organizational safeguards aligned with ISO/IEC 27001:2022 and ISO/IEC 27701 standards are maintained to prevent unauthorized disclosure or breach."
      }
    ]
  }
];

export default function PrivacyPolicyPage() {
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
            <span className="text-neutral-900 dark:text-white font-semibold">Privacy Policy</span>
          </nav>

          {/* Header & Title Area */}
          <div className="border-b border-neutral-200/80 pb-10 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-orange-400 shadow-sm">
                <IValueEmblem className="size-3.5" />
                <span>iValue Group • Data Governance & Trust</span>
              </div>

              {/* Last Updated Badge */}
              <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-600 shadow-xs dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 font-sans">
                <Calendar className="size-3.5 text-amber-600 dark:text-orange-400" />
                <span>Last Updated: November 2026</span>
              </div>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl text-neutral-900 dark:text-white">
              Privacy Policy
            </h1>

            <p className="mt-4 max-w-3xl text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
              iValue InfoSolutions Limited (&quot;iValue&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to upholding the highest standards of data integrity, confidentiality, and statutory privacy. 
              This policy explains how we collect, safeguard, and process personal and enterprise evaluation data in connection with the iValue Center of Excellence (CoE) and its associated laboratory services.
            </p>

            {/* DPDP Act 2023 Compliance Notice Banner */}
            <div className="mt-6 flex items-start gap-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4.5 dark:border-emerald-500/20 dark:bg-emerald-500/5 font-sans">
              <ShieldCheck className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
                <strong className="font-semibold text-emerald-900 dark:text-emerald-300">
                  Compliance Alignment: Digital Personal Data Protection Act, 2023 (DPDP Act)
                </strong>
                <p className="mt-0.5 text-neutral-600 dark:text-neutral-400">
                  This privacy policy is formatted in accordance with India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act 2023), ISO/IEC 27001:2022 information security principles, and international business data protection standards.
                </p>
              </div>
            </div>
          </div>

          {/* Numbered Section Cards */}
          <div className="mt-12 space-y-8">
            {sections.map((section) => {
              const IconComponent = section.icon;

              return (
                <div
                  key={section.number}
                  className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-amber-500/40 dark:border-white/10 dark:bg-neutral-900/80"
                >
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

                  <p className="mt-4 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 font-sans">
                    {section.summary}
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-4 font-sans">
                    {section.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="rounded-xl border border-neutral-200/70 bg-neutral-50/60 p-4 dark:border-white/5 dark:bg-neutral-800/40"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
                          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{item.heading}</span>
                        </div>
                        <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pl-5.5">
                          {item.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 06: Data Protection Officer & Grievance Mechanism Card */}
          <div className="mt-10 rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900/80">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-5 dark:border-white/5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 font-mono text-xs font-bold text-amber-700 dark:text-orange-400 border border-amber-500/20">
                06
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                Grievance Officer & Contact Details
              </h2>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              In accordance with the DPDP Act 2023 and applicable information technology rules, if you have any questions, wish to exercise your Data Principal rights, or wish to report a privacy concern, please contact our designated Grievance Officer:
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
              <div className="flex items-start gap-3 rounded-xl border border-neutral-200/70 bg-neutral-50/60 p-4 dark:border-white/5 dark:bg-neutral-800/40">
                <Mail className="size-4.5 text-amber-600 dark:text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Data Protection Officer (DPO)
                  </h3>
                  <a
                    href="mailto:dpo@ivalue.co.in"
                    className="text-xs text-amber-700 dark:text-orange-400 font-semibold hover:underline block mt-0.5"
                  >
                    dpo@ivalue.co.in
                  </a>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                    Direct channel for data access, rectification, and erasure requests.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-neutral-200/70 bg-neutral-50/60 p-4 dark:border-white/5 dark:bg-neutral-800/40">
                <Building2 className="size-4.5 text-amber-600 dark:text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Corporate Headquarters
                  </h3>
                  <address className="not-italic text-xs text-neutral-600 dark:text-neutral-300 mt-0.5 leading-snug">
                    iValue InfoSolutions Limited<br />
                    No. 903/1/1, 19th Main Road, 4th Sector,<br />
                    H.S.R. Layout, Bangalore - 560102, India
                  </address>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-neutral-200/60 bg-neutral-100/50 p-4 text-xs text-neutral-500 dark:border-white/5 dark:bg-neutral-800/30 font-sans flex items-center gap-2.5">
              <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-orange-400" />
              <span>
                <strong>Grievance Resolution:</strong> We acknowledge requests within 24 hours and resolve inquiries within the statutory timelines prescribed under India&apos;s DPDP Act.
              </span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
