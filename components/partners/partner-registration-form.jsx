"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Handshake,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Send,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  Zap,
  Globe,
  Briefcase
} from "lucide-react";
import { PARTNER_TIERS } from "@/lib/validations/partner";

const TIER_LABELS = {
  standard: "Standard Partner",
  silver: "Silver Partner",
  gold: "Gold Partner",
  platinum: "Platinum Partner",
  strategic_oem: "Strategic Technology OEM",
  system_integrator: "Tier-1 System Integrator"
};

const REGIONS = [
  "India - South (HQ Bangalore)",
  "India - West (Mumbai / Pune)",
  "India - North (Delhi NCR)",
  "India - East (Kolkata)",
  "Singapore & Southeast Asia (SEA)",
  "SAARC Region (Sri Lanka, Bangladesh, Nepal)",
  "Middle East & Africa (MEA)",
  "Global / Multi-Region"
];

export function PartnerRegistrationForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    partnerTier: "standard",
    contactName: "",
    workEmail: "",
    phone: "",
    region: REGIONS[0],
    message: "",
    privacyConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Handshake verification testing state
  const [isVerifying, setIsVerifying] = useState(false);
  const [handshakeResult, setHandshakeResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear field error on change
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
      companyName: "",
      partnerTier: "standard",
      contactName: "",
      workEmail: "",
      phone: "",
      region: REGIONS[0],
      message: "",
      privacyConsent: false
    });
    setErrors({});
    setSubmitError("");
    setSuccessData(null);
    setHandshakeResult(null);
    setCopiedKey(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setErrors({});

    try {
      const response = await fetch("/api/partners", {
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
        setSubmitError(data.message || "Failed to register partner application. Please verify your entries.");
        return;
      }

      setSuccessData(data);
    } catch (err) {
      console.error("Partner registration submission error:", err);
      setSubmitError("Network connection error. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyHandshake = async () => {
    if (!successData?.id || !successData?.handshakeKey) return;
    setIsVerifying(true);

    try {
      const response = await fetch("/api/partners/handshake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          partnerId: successData.id,
          handshakeKey: successData.handshakeKey
        })
      });

      const data = await response.json();
      setHandshakeResult(data);
    } catch (err) {
      console.error("Handshake verification error:", err);
      setHandshakeResult({
        success: false,
        message: "Failed to connect to handshake verification service."
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyKey = () => {
    if (successData?.handshakeKey) {
      navigator.clipboard.writeText(successData.handshakeKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  // SUCCESS STATE
  if (successData) {
    return (
      <div className="rounded-2xl border border-neutral-200/90 bg-white/95 p-6 sm:p-10 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/90 animate-in fade-in zoom-in-95 duration-400">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="size-8" />
          </div>

          <span className="mt-4 font-display text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Application Registered Successfully
          </span>

          <h3 className="mt-2 font-sans text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
            Welcome to the iValue Partner Ecosystem
          </h3>

          <p className="mt-2 max-w-lg text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
            Thank you, <strong>{formData.contactName}</strong>. Your partner registration for <strong>{formData.companyName}</strong> has been logged in our regional database.
          </p>

          {/* Credentials Display Card */}
          <div className="mt-6 w-full max-w-md rounded-xl border border-neutral-200 bg-neutral-50/90 p-4 text-left dark:border-white/10 dark:bg-neutral-800/80">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200 dark:border-white/10">
              <span className="font-semibold text-neutral-500 dark:text-neutral-400">Partner Application ID</span>
              <code className="font-mono text-neutral-900 dark:text-white font-bold">{successData.id}</code>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-500 dark:text-neutral-400">Security Handshake Key</span>
              <div className="flex items-center gap-1.5">
                <code className="font-mono text-amber-700 dark:text-orange-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {successData.handshakeKey}
                </code>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  title="Copy Handshake Key"
                >
                  {copiedKey ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Live Security Handshake Verification Action */}
          <div className="mt-6 w-full max-w-md pt-4 border-t border-neutral-100 dark:border-white/5 flex flex-col items-center">
            {handshakeResult ? (
              <div className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Handshake Status: Verified</span>
                </div>
                <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                  {handshakeResult.message}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleVerifyHandshake}
                disabled={isVerifying}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 transition-all disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <div className="size-3.5 animate-spin rounded-full border-2 border-white dark:border-black border-t-transparent" />
                    <span>Verifying Security Handshake...</span>
                  </>
                ) : (
                  <>
                    <Zap className="size-3.5 text-amber-400" />
                    <span>Test Security Handshake Verification</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="mt-4 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Register Another Partner Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REGISTRATION FORM
  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white/95 p-6 sm:p-10 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/90">
      <div className="flex items-center gap-2.5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:bg-orange-500/15 dark:text-orange-400 border border-amber-500/20">
          <Handshake className="size-5" />
        </div>
        <div>
          <h3 className="font-sans text-xl font-bold text-neutral-900 dark:text-white">
            Partner Registration Application
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Join 6,000+ regional channel partners and global technology OEMs in the iValue CoE.
          </p>
        </div>
      </div>

      {submitError && (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-50/70 p-3.5 text-xs text-red-700 dark:border-red-500/20 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Company / Organization Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Acme Cyber Systems Ltd"
              className={`mt-1.5 w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 dark:bg-neutral-800/80 dark:text-white transition-all ${
                errors.companyName
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-neutral-200 focus:border-amber-500 focus:ring-amber-500/20 dark:border-white/10"
              }`}
            />
            {errors.companyName && (
              <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.companyName[0]}</p>
            )}
          </div>

          {/* Partner Tier */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Target Partner Tier *
            </label>
            <select
              name="partnerTier"
              value={formData.partnerTier}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-neutral-800/80 dark:text-white transition-all cursor-pointer"
            >
              {PARTNER_TIERS.map((tier) => (
                <option key={tier} value={tier}>
                  {TIER_LABELS[tier] || tier}
                </option>
              ))}
            </select>
          </div>

          {/* Contact Representative Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Contact Representative Full Name *
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="e.g. Rajesh Sharma"
              className={`mt-1.5 w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 dark:bg-neutral-800/80 dark:text-white transition-all ${
                errors.contactName
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-neutral-200 focus:border-amber-500 focus:ring-amber-500/20 dark:border-white/10"
              }`}
            />
            {errors.contactName && (
              <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.contactName[0]}</p>
            )}
          </div>

          {/* Business Work Email */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Corporate Business Email *
            </label>
            <input
              type="email"
              name="workEmail"
              value={formData.workEmail}
              onChange={handleChange}
              placeholder="e.g. rajesh.s@acmecyber.com"
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
                Corporate domains only. Generic public domains (gmail, yahoo) are rejected.
              </span>
            )}
          </div>

          {/* Contact Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Contact Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-neutral-800/80 dark:text-white transition-all"
            />
          </div>

          {/* Primary Operating Region */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Primary Operating Region *
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-neutral-800/80 dark:text-white transition-all cursor-pointer"
            >
              {REGIONS.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Partnership Scope / Message */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Partnership Scope & Technical Specialization
          </label>
          <textarea
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="Briefly describe your solution capabilities, existing OEM partnerships, or regional GTM focus..."
            className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-neutral-800/80 dark:text-white transition-all resize-y"
          />
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
              and consent to iValue Center of Excellence processing my business registration information under the Digital Personal Data Protection (DPDP) Act 2023.
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
                <span>Submitting Registration...</span>
              </>
            ) : (
              <>
                <span>Submit Partner Application</span>
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
    </div>
  );
}

export default PartnerRegistrationForm;
