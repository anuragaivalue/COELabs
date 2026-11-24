"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { solutionStacks } from "@/data/stacks";
import {
  CheckCircle2,
  Send,
  ShieldCheck,
  Cpu,
  Clock,
  FileText,
  ArrowLeft,
  Sparkles,
  Layers,
  Check
} from "lucide-react";

function PocContent() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedStack, setSelectedStack] = useState("Cloud Security Stack");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    timeline: "Within 2 Weeks",
    stackInterest: "Cloud Security Stack",
    message: ""
  });

  // Read preselected stack or migration target from URL query param if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const stackParam = params.get("stack");
      const migrationParam = params.get("migration");

      if (stackParam) {
        setSelectedStack(stackParam);
        setFormData((prev) => ({ ...prev, stackInterest: stackParam }));
      } else if (migrationParam) {
        const migrationTitle = migrationParam
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        setFormData((prev) => ({
          ...prev,
          stackInterest: "Custom Architecture Assessment",
          message: `Interested in Live CoE Migration Assessment: ${migrationTitle}`
        }));
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const steps = [
    {
      num: "01",
      title: "Architectural Scoping",
      desc: "Dedicated briefing to define technical prerequisites, threat scenarios, and success criteria."
    },
    {
      num: "02",
      title: "Lab Environment Provisioning",
      desc: "Multi-vendor sandbox deployed with pre-configured integrations and live test data."
    },
    {
      num: "03",
      title: "Benchmark & Attack Validation",
      desc: "Hands-on simulation validating detection efficacy, interoperability, and throughput."
    },
    {
      num: "04",
      title: "Executive Blueprint Delivery",
      desc: "Comprehensive RFP-ready architecture report with sizing, TCO analysis, and playbooks."
    }
  ];

  return (
    <div className="relative isolate min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          {/* Breadcrumb / Back Navigation */}
          <div className="mb-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Homepage</span>
            </a>
          </div>

          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
              <IValueEmblem className="size-3.5" />
              <span>Center of Excellence Live Lab</span>
            </div>
            <h1 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-white">
              Request Live Architecture Blueprint & Demo
            </h1>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
              Test an integrated multi-vendor security blueprint in our real-world lab environment before capex commitment, guided by certified solutions specialists.
            </p>
          </div>

          {/* Form & Roadmap Grid */}
          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <Card className="p-6 sm:p-10 shadow-lg border border-neutral-200/90 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <CheckCircle2 className="size-9" />
                    </div>
                    <span className="mt-4 font-display text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      Request Confirmed • Ticket #IV-REQ-{Math.floor(1000 + Math.random() * 9000)}
                    </span>
                    <h3 className="mt-2 font-sans text-2xl font-bold text-neutral-900 dark:text-white">
                      Your Blueprint Request Has Been Received
                    </h3>
                    <p className="mt-3 max-w-md text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                      Thank you, <strong>{formData.name || "Customer"}</strong>. An iValue Solutions Specialist will contact you at <strong>{formData.email}</strong> within 24 business hours to coordinate your custom lab environment.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="rounded-lg bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        Submit Another Request
                      </button>
                      <a
                        href="/"
                        className="rounded-lg border border-neutral-300 px-5 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 dark:border-white/15 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                      >
                        Return Home
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h2 className="font-sans text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                        Lab Scoping & Blueprint Application
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-sans">
                        Complete your details below for prioritized testbed allocation and architect assignment.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 font-display mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Jane Doe"
                          className="w-full rounded-lg border border-neutral-300 bg-neutral-50/80 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-neutral-800/80 dark:text-white transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 font-display mb-1.5">
                          Corporate Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jane@enterprise.com"
                          className="w-full rounded-lg border border-neutral-300 bg-neutral-50/80 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-neutral-800/80 dark:text-white transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 font-display mb-1.5">
                          Company / Organization *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Acme Financial"
                          className="w-full rounded-lg border border-neutral-300 bg-neutral-50/80 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-neutral-800/80 dark:text-white transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 font-display mb-1.5">
                          Target Evaluation Timeline
                        </label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full rounded-lg border border-neutral-300 bg-neutral-50/80 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-neutral-800/80 dark:text-white transition-colors"
                        >
                          <option>Within 2 Weeks (Immediate)</option>
                          <option>1 Month</option>
                          <option>Quarterly RFP Scoping</option>
                          <option>Exploratory / Architectural Review</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 font-display mb-1.5">
                        Solution Stack of Interest *
                      </label>
                      <select
                        value={formData.stackInterest}
                        onChange={(e) => setFormData({ ...formData, stackInterest: e.target.value })}
                        className="w-full rounded-lg border border-neutral-300 bg-neutral-50/80 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-neutral-800/80 dark:text-white transition-colors"
                      >
                        {solutionStacks.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title} ({s.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 font-display mb-1.5">
                        Lab Requirements & Technical Objectives
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Detail your target use cases, current security telemetry tools, specific OEM combinations to test, or upcoming RFP deadlines..."
                        className="w-full rounded-lg border border-neutral-300 bg-neutral-50/80 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-neutral-800/80 dark:text-white transition-colors"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans">
                        🔒 Enterprise confidential under reciprocal NDA.
                      </p>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-xs font-display font-semibold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors shadow-md cursor-pointer"
                      >
                        <Send className="size-3.5" />
                        <span>Submit Architecture Lab Request</span>
                      </button>
                    </div>
                  </form>
                )}
              </Card>
            </div>

            {/* Right Column: 4-Step Solution Delivery Journey */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-6 sm:p-8 dark:border-white/10 dark:bg-neutral-900/60">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-orange-400">
                  Methodology
                </span>
                <h3 className="mt-2 font-sans text-xl font-bold text-neutral-900 dark:text-white">
                  The iVCoE Blueprint Journey
                </h3>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
                  Rigorous, reproducible validation methodology trusted by over 700+ enterprises.
                </p>

                <div className="mt-6 space-y-4">
                  {steps.map((st, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold text-white dark:bg-white dark:text-black shadow-sm">
                        {st.num}
                      </div>
                      <div>
                        <h4 className="font-display text-xs font-bold text-neutral-900 dark:text-white">
                          {st.title}
                        </h4>
                        <p className="mt-0.5 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Reach Out Card */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-white/10 dark:bg-neutral-900/40">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Direct Lab Access Lines
                </h4>
                <div className="mt-3 space-y-2 text-xs text-neutral-700 dark:text-neutral-300 font-sans">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:info@ivalue.co.in" className="text-amber-700 dark:text-orange-400 hover:underline">
                      info@ivalue.co.in
                    </a>
                  </p>
                  <p>
                    <strong>Global Hotline:</strong>{" "}
                    <a href="tel:+919535999473" className="text-amber-700 dark:text-orange-400 hover:underline">
                      +91 95359 99473
                    </a>
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-white/5">
                    H.S.R Layout, Bangalore, India • Cantonment Road, Singapore
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RequestPocPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PocContent />
    </Suspense>
  );
}
