"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Globe
} from "lucide-react";

const INTEREST_AREAS = [
  "Executive Architecture Briefing",
  "Live Lab Blueprint Validation",
  "Enterprise RFP Scoping",
  "Zero Trust & SASE Architecture",
  "Cloud SecOps & SIEM Telemetry",
  "Enterprise Database & HCI Resiliency",
  "Channel Partner Enablement",
  "OEM Onboarding & Certification"
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    company: "",
    title: "",
    interestArea: INTEREST_AREAS[0],
    message: "",
    privacyConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successTicket, setSuccessTicket] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      workEmail: "",
      company: "",
      title: "",
      interestArea: INTEREST_AREAS[0],
      message: "",
      privacyConsent: false
    });
    setErrors({});
    setSubmitError("");
    setSuccessTicket(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        setSubmitError(data.message || "Failed to submit inquiry. Please review the highlighted fields.");
        return;
      }

      setSuccessTicket(data.id);
    } catch (err) {
      console.error("Contact inquiry submission error:", err);
      setSubmitError("Network connection error. Please verify your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            <span className="text-neutral-900 dark:text-white font-semibold">Contact Us</span>
          </div>

          {/* Hero Header */}
          <div className="mt-8 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:border-orange-400/25 dark:bg-orange-500/15 dark:text-orange-300">
              <IValueEmblem className="size-3.5" />
              <span>Center of Excellence Engagement</span>
            </div>

            <h1 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
              Contact Our Solutions Team
            </h1>

            <p className="mt-3 font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Schedule an executive architecture briefing, test an integrated multistack blueprint in our live lab, or validate an upcoming enterprise RFP.
            </p>
          </div>

          {/* Contact Details & Form Grid */}
          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
            {/* Left Column: Office Locations & Channels */}
            <div className="lg:col-span-5 space-y-6">
              {/* India HQ */}
              <Card className="p-6 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:bg-orange-500/15 dark:text-orange-400">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-neutral-900 dark:text-white">
                      India Global Headquarters
                    </h3>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                      No. 903/1/1, 19th Main Road, 4th Sector, H.S.R. Layout, Bangalore - 560102, Karnataka, India
                    </p>
                  </div>
                </div>
              </Card>

              {/* Singapore Regional Office */}
              <Card className="p-6 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:bg-orange-500/15 dark:text-orange-400">
                    <Globe className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-neutral-900 dark:text-white">
                      Singapore Regional Office
                    </h3>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                      No. 31, Cantonment Road, Singapore - 089747
                    </p>
                  </div>
                </div>
              </Card>

              {/* Email & Phone Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="p-5 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:bg-orange-500/15 dark:text-orange-400">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-neutral-400">Email Us</div>
                      <a href="mailto:info@ivalue.co.in" className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline truncate block">
                        info@ivalue.co.in
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:bg-orange-500/15 dark:text-orange-400">
                      <Phone className="size-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-neutral-400">Call Us</div>
                      <a href="tel:+919535999473" className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline truncate block">
                        +91 95359 99473
                      </a>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Embedded Google Map */}
              <Card className="overflow-hidden p-0 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 shadow-sm">
                <div className="p-4 border-b border-neutral-100 dark:border-white/5">
                  <h4 className="font-display text-xs font-bold text-neutral-900 dark:text-white">
                    Bangalore CoE Live Lab Location
                  </h4>
                </div>
                <div className="h-64 w-full">
                  <iframe
                    title="iValue Global Headquarters Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.752329381744!2d77.63972237494444!3d12.923643987387343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae14878a8731ad%3A0xe4a1985eeea493b8!2siValue%20InfoSolutions%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Card>
            </div>

            {/* Right Column: Executive Briefing & Architecture Inquiry Form */}
            <div className="lg:col-span-7">
              <Card className="p-6 sm:p-10 border border-neutral-200/90 bg-white/90 dark:border-white/10 dark:bg-neutral-900/90 backdrop-blur-md shadow-lg">
                {successTicket ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-400">
                    <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <CheckCircle2 className="size-9" />
                    </div>
                    <span className="mt-4 font-display text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      Message Received • Ticket #{successTicket.slice(-8).toUpperCase()}
                    </span>
                    <h3 className="mt-2 font-sans text-2xl font-bold text-neutral-900 dark:text-white">
                      Thank You for Reaching Out
                    </h3>
                    <p className="mt-3 max-w-md text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                      Thank you, <strong>{formData.fullName}</strong>. An iValue solutions architect will review your message for <strong>{formData.company}</strong> and reach out to <strong>{formData.workEmail}</strong> within 1 business day.
                    </p>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-8 rounded-lg bg-neutral-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="font-sans text-xl font-bold text-neutral-900 dark:text-white">
                        Executive Architecture Inquiry
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-sans">
                        Fill in your requirements below for dedicated architect access and consultation.
                      </p>
                    </div>

                    {submitError && (
                      <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-50/70 p-3.5 text-xs text-red-700 dark:border-red-500/20 dark:bg-red-950/30 dark:text-red-400">
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Vikram Chandra"
                          className={`mt-2 w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs font-sans text-neutral-900 focus:outline-none dark:bg-neutral-800 dark:text-white ${
                            errors.fullName
                              ? "border-red-500 focus:border-red-500"
                              : "border-neutral-300 focus:border-amber-500 dark:border-white/10"
                          }`}
                        />
                        {errors.fullName && (
                          <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.fullName[0]}</p>
                        )}
                      </div>

                      {/* Work Email */}
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          name="workEmail"
                          value={formData.workEmail}
                          onChange={handleChange}
                          placeholder="e.g. vikram.c@enterprise.com"
                          className={`mt-2 w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs font-sans text-neutral-900 focus:outline-none dark:bg-neutral-800 dark:text-white ${
                            errors.workEmail
                              ? "border-red-500 focus:border-red-500"
                              : "border-neutral-300 focus:border-amber-500 dark:border-white/10"
                          }`}
                        />
                        {errors.workEmail ? (
                          <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.workEmail[0]}</p>
                        ) : (
                          <span className="block mt-1 text-[10px] text-neutral-400">
                            Corporate domains only (generic public emails are rejected).
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Company Name */}
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Company / Organization *
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Enterprise"
                          className={`mt-2 w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs font-sans text-neutral-900 focus:outline-none dark:bg-neutral-800 dark:text-white ${
                            errors.company
                              ? "border-red-500 focus:border-red-500"
                              : "border-neutral-300 focus:border-amber-500 dark:border-white/10"
                          }`}
                        />
                        {errors.company && (
                          <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.company[0]}</p>
                        )}
                      </div>

                      {/* Job Title */}
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. Chief Information Security Officer"
                          className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-sans text-neutral-900 focus:border-amber-500 focus:outline-none dark:border-white/10 dark:bg-neutral-800 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Inquiry Subject */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Inquiry Subject / Area of Interest
                      </label>
                      <select
                        name="interestArea"
                        value={formData.interestArea}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-sans text-neutral-900 focus:border-amber-500 focus:outline-none dark:border-white/10 dark:bg-neutral-800 dark:text-white"
                      >
                        {INTEREST_AREAS.map((subj, idx) => (
                          <option key={idx} value={subj}>
                            {subj}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Inquiry Details or Enterprise Use Case *
                      </label>
                      <textarea
                        rows={4}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your current tech stack, evaluation timeline, compliance framework (e.g., RBI, SEBI CSCRF, CERT-In), or specific objectives..."
                        className={`mt-2 w-full rounded-lg border bg-white p-3 text-xs font-sans text-neutral-900 focus:outline-none dark:bg-neutral-800 dark:text-white resize-y ${
                          errors.message
                            ? "border-red-500 focus:border-red-500"
                            : "border-neutral-300 focus:border-amber-500 dark:border-white/10"
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.message[0]}</p>
                      )}
                    </div>

                    {/* Privacy Policy Consent Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="privacyConsent"
                          checked={formData.privacyConsent}
                          onChange={handleChange}
                          className="mt-0.5 size-4 rounded border-neutral-300 text-amber-600 focus:ring-amber-500 dark:border-white/20 dark:bg-neutral-800 dark:checked:bg-amber-600"
                        />
                        <span className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                          I agree to the{" "}
                          <Link
                            href="/privacy-policy"
                            target="_blank"
                            className="font-semibold text-amber-700 hover:text-amber-800 dark:text-orange-400 dark:hover:text-orange-300 underline"
                          >
                            Privacy Policy
                          </Link>{" "}
                          and consent to iValue Center of Excellence processing my inquiry under DPDP Act 2023.
                        </span>
                      </label>
                      {errors.privacyConsent && (
                        <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.privacyConsent[0]}</p>
                      )}
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-neutral-100 dark:border-white/5">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="size-3.5 animate-spin rounded-full border-2 border-white dark:border-black border-t-transparent" />
                            <span>Submitting Inquiry...</span>
                          </>
                        ) : (
                          <>
                            <Send className="size-3.5" />
                            <span>Submit Architecture Inquiry</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-all cursor-pointer"
                      >
                        <RotateCcw className="size-3.5 text-neutral-400" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
