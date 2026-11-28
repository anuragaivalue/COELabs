"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Globe,
  ShieldCheck,
  Building2,
  Sparkles
} from "lucide-react";
import { IValueEmblem } from "@/components/ui/ivalue-logo";

const INTEREST_AREAS = [
  "Multi-OEM Solution Blueprints",
  "Zero Trust & SASE Architecture",
  "Cloud SecOps & SIEM Telemetry",
  "Enterprise Database & HCI Resiliency",
  "Exposure Management & Threat Emulation",
  "Identity Governance & PKI Digital Trust",
  "Executive Lab Briefing / Proof of Value (PoV)",
  "Custom Architecture Blueprint for RFP"
];

export function ContactSection() {
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
    <section id="contact" className="section-divider py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
            <IValueEmblem className="size-3.5" />
            <span>Center of Excellence Engagement</span>
          </div>

          <h2 className="mt-4 font-sans text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            Connect with Our Solutions Architecture Team
          </h2>

          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
            Schedule an executive architecture briefing, validate an upcoming enterprise RFP, or test multi-OEM blueprints in our live laboratory.
          </p>
        </div>

        {/* Main Grid: Contact Info & Locations on Left, Responsive Form on Right */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Direct Info & Locations */}
          <div className="lg:col-span-5 space-y-6">
            {/* Global HQ Bangalore */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white/90 p-5 dark:border-white/10 dark:bg-neutral-900/80 shadow-xs backdrop-blur-md">
              <div className="flex items-start gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:bg-orange-500/15 dark:text-orange-400">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-neutral-900 dark:text-white">
                    India Global Headquarters
                  </h4>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    No. 903/1/1, 19th Main Road, 4th Sector, H.S.R. Layout, Bangalore - 560102, Karnataka, India
                  </p>
                </div>
              </div>
            </div>

            {/* Regional Office Singapore */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white/90 p-5 dark:border-white/10 dark:bg-neutral-900/80 shadow-xs backdrop-blur-md">
              <div className="flex items-start gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:bg-orange-500/15 dark:text-orange-400">
                  <Globe className="size-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-neutral-900 dark:text-white">
                    Singapore Regional Office
                  </h4>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    No. 31, Cantonment Road, Singapore - 089747
                  </p>
                </div>
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a
                href="mailto:info@ivalue.co.in"
                className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/90 p-4 hover:border-amber-500/40 dark:border-white/10 dark:bg-neutral-900/80 transition-all shadow-xs"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-orange-950/40 dark:text-orange-400">
                  <Mail className="size-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Email Us</span>
                  <p className="font-display text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    info@ivalue.co.in
                  </p>
                </div>
              </a>

              <a
                href="tel:+919535999473"
                className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/90 p-4 hover:border-amber-500/40 dark:border-white/10 dark:bg-neutral-900/80 transition-all shadow-xs"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-orange-950/40 dark:text-orange-400">
                  <Phone className="size-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Call Us</span>
                  <p className="font-display text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    +91 95359 99473
                  </p>
                </div>
              </a>
            </div>

            {/* Embedded Google Map */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/90 shadow-xs dark:border-white/10 dark:bg-neutral-900/80">
              <div className="p-3.5 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span>Bangalore CoE Physical Lab</span>
                <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Facilities
                </span>
              </div>
              <div className="h-56 w-full">
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
            </div>
          </div>

          {/* Right Column: Interactive Enterprise Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-neutral-200/90 bg-white/95 p-6 sm:p-10 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/90">
              {successTicket ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-400">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="size-8" />
                  </div>

                  <span className="mt-4 font-display text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Inquiry Logged • Ticket #{successTicket.slice(-8).toUpperCase()}
                  </span>

                  <h3 className="mt-2 font-sans text-2xl font-bold text-neutral-900 dark:text-white">
                    Thank You for Reaching Out
                  </h3>

                  <p className="mt-2 max-w-md text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                    Thank you, <strong>{formData.fullName}</strong>. An iValue solutions architect will review your inquiry for <strong>{formData.company}</strong> and reach out to <strong>{formData.workEmail}</strong> within 1 business day.
                  </p>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-6 rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 transition-all cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="font-sans text-xl font-bold text-neutral-900 dark:text-white">
                      Enterprise Architecture Inquiry
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-sans">
                      Request dedicated solutions architect consultation, POC sizing, or RFP blueprint defense.
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
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Vikram Chandra"
                        className={`mt-1.5 w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 dark:bg-neutral-800/80 dark:text-white transition-all ${
                          errors.fullName
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-neutral-200 focus:border-amber-500 focus:ring-amber-500/20 dark:border-white/10"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.fullName[0]}</p>
                      )}
                    </div>

                    {/* Corporate Work Email */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Corporate Work Email *
                      </label>
                      <input
                        type="email"
                        name="workEmail"
                        value={formData.workEmail}
                        onChange={handleChange}
                        placeholder="e.g. vikram.c@enterprise.com"
                        className={`mt-1.5 w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 dark:bg-neutral-800/80 dark:text-white transition-all ${
                          errors.workEmail
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-neutral-200 focus:border-amber-500 focus:ring-amber-500/20 dark:border-white/10"
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
                        placeholder="e.g. Apex Financial Corp"
                        className={`mt-1.5 w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 dark:bg-neutral-800/80 dark:text-white transition-all ${
                          errors.company
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-neutral-200 focus:border-amber-500 focus:ring-amber-500/20 dark:border-white/10"
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
                        className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-neutral-800/80 dark:text-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Area of Interest */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Primary Area of Architecture Interest
                    </label>
                    <select
                      name="interestArea"
                      value={formData.interestArea}
                      onChange={handleChange}
                      className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-neutral-800/80 dark:text-white transition-all cursor-pointer"
                    >
                      {INTEREST_AREAS.map((area, idx) => (
                        <option key={idx} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Project Requirements & Technical Inquiry *
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please outline your solution stack requirements, existing OEM technologies in use, timeline, and compliance goals (e.g. RBI, SEBI CSCRF, DPDP Act 2023)..."
                      className={`mt-1.5 w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 dark:bg-neutral-800/80 dark:text-white transition-all resize-y ${
                        errors.message
                          ? "border-red-500 focus:ring-red-500/20"
                          : "border-neutral-200 focus:border-amber-500 focus:ring-amber-500/20 dark:border-white/10"
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.message[0]}</p>
                    )}
                  </div>

                  {/* Privacy Policy Consent Checkbox */}
                  <div className="pt-2">
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
                        and consent to iValue Center of Excellence processing my contact and business evaluation information in accordance with DPDP Act 2023.
                      </span>
                    </label>
                    {errors.privacyConsent && (
                      <p className="mt-1.5 text-[11px] text-red-600 dark:text-red-400">{errors.privacyConsent[0]}</p>
                    )}
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-neutral-100 dark:border-white/5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="size-4 animate-spin rounded-full border-2 border-white dark:border-black border-t-transparent" />
                          <span>Submitting Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Enterprise Inquiry</span>
                          <Send className="size-3.5" />
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
                      <span>Reset Form</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 rounded-3xl border border-neutral-200/90 bg-gradient-to-r from-neutral-900 to-neutral-950 p-8 sm:p-12 text-white shadow-xl dark:border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                <IValueEmblem className="size-3.5" />
                <span>Hands-on Live Lab Testing</span>
              </div>
              <h3 className="mt-3 font-sans text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready to Validate in our Live Lab?
              </h3>
              <p className="mt-2 text-sm text-neutral-300 font-sans leading-relaxed">
                Access multi-vendor sandboxes, test detection efficacy, and receive an RFP-ready architectural blueprint customized for your enterprise environment.
              </p>
            </div>

            <Link
              href="/request-poc"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-display text-xs sm:text-sm font-bold text-neutral-900 hover:bg-neutral-100 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span>Request Architecture Blueprint</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
