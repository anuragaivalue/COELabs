"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  CheckCircle2,
  Layers,
  ShieldCheck,
  FileCheck2,
  Zap,
  ArrowRight,
  ExternalLink,
  Laptop2,
  Building2,
  Check
} from "lucide-react";
import { OemImage } from "@/components/ui/oem-image";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { stackControlsData } from "@/data/stack-controls";

export function Dialog({ open, onClose, stack }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key and scroll locking
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open || !stack) return null;

  // Cross-reference stack with rich stackControlsData if available
  const findMatchingControls = () => {
    const slugKey = Object.keys(stackControlsData).find((key) => {
      const item = stackControlsData[key];
      return (
        key.toLowerCase() === stack.id?.toLowerCase() ||
        item.title?.toLowerCase().includes(stack.title?.toLowerCase()) ||
        stack.title?.toLowerCase().includes(item.shortTitle?.toLowerCase() || "")
      );
    });

    return slugKey ? stackControlsData[slugKey] : null;
  };

  const detailedMeta = findMatchingControls();

  // Combine compliance frameworks
  const complianceList = detailedMeta?.compliance || [
    { name: "CERT-In Guidelines", desc: "Mandatory incident response, logging & baseline security controls" },
    { name: "RBI Cybersecurity Framework", desc: "Enterprise governance, third-party risk & continuous auditing" },
    { name: "SEBI CSCRF", desc: "Critical cyber-resilience controls and automated evidence capture" },
    { name: "ISO 27001:2022 / PCI-DSS v4.0", desc: "Turnkey mappings for enterprise audits and risk assessment" }
  ];

  // Combine controls list prioritizing exact stack verbatim controls from MAIN site
  const rawControls = (stack.controls && stack.controls.length > 0)
    ? stack.controls
    : (detailedMeta?.controls || []);

  const controlsList = rawControls.map((c, i) => {
    if (typeof c === "string") {
      return {
        id: `CTL-${String(i + 1).padStart(2, "0")}`,
        name: c,
        desc: ""
      };
    }
    return {
      id: c.id || `CTL-${String(i + 1).padStart(2, "0")}`,
      name: c.name || c.title || `Security Control ${i + 1}`,
      desc: c.desc || "",
      domain: c.domain,
      methods: c.methods,
      erl: c.erl
    };
  });

  const oemsList = (stack.oems && stack.oems.length > 0)
    ? stack.oems
    : (detailedMeta?.oems || []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-stack-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto"
    >
      {/* Darkened Opaque Backdrop with blur */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-200 cursor-pointer"
      />

      {/* Centered High-Contrast Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 my-auto flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-neutral-300/90 bg-white shadow-2xl dark:border-white/20 dark:bg-neutral-900 transition-all duration-200 animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200/90 bg-neutral-50/80 px-6 py-5 dark:border-white/10 dark:bg-neutral-950/80">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-500/10 px-3 py-0.5 text-[11px] font-semibold text-amber-800 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300">
                <Layers className="size-3" />
                {stack.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Live CoE Blueprint Certified
              </span>
            </div>
            <h2
              id="modal-stack-title"
              className="mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
            >
              {stack.title}
            </h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-sans">
              {detailedMeta?.tagline || "Validated Multi-OEM Enterprise Solution Stack • iValue Center of Excellence"}
            </p>
          </div>

          {/* Close Trigger Button */}
          <button
            onClick={onClose}
            aria-label="Close modal dialog"
            className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white transition-all cursor-pointer shadow-xs shrink-0 ml-4"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">

          {/* Stack Architecture Overview */}
          <div>
            <h4 className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-orange-400">
              <ShieldCheck className="size-4" />
              <span>Stack Architecture Overview</span>
            </h4>
            <p className="mt-2 text-sm text-neutral-700 leading-relaxed dark:text-neutral-300 font-sans">
              {stack.overview || stack.description || detailedMeta?.overview}
            </p>

            {/* Architectural Tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-100/80 px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300">
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                Pre-Tested Blueprint
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-100/80 px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300">
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                Zero-Trust Ready
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-100/80 px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300">
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                RFP Fast-Track
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-100/80 px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300">
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                Cross-Vendor Telemetry
              </span>
            </div>
          </div>

          {/* Integrated OEM Ecosystem with Enlarged High-Contrast Logos */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-orange-400">
                <Building2 className="size-4" />
                <span>Integrated OEM Solutions ({oemsList.length})</span>
              </h4>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                High-Contrast Validated Assets
              </span>
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
              {oemsList.length > 0 ? (
                oemsList.map((oem, idx) => {
                  const name = typeof oem === "string" ? oem : oem.name;
                  const logo = typeof oem === "string" ? null : oem.logo;

                  return (
                    <div
                      key={idx}
                      className="group/oem flex flex-col items-center justify-between rounded-xl border border-neutral-200/90 bg-neutral-50/70 p-3 text-center transition-all duration-200 hover:border-amber-500/50 hover:shadow-md dark:border-white/10 dark:bg-neutral-800/40"
                    >
                      {/* Prominent High-Contrast Logo Container */}
                      <div className="flex h-14 sm:h-16 w-full items-center justify-center rounded-lg bg-white p-2.5 shadow-2xs border border-neutral-200/80 dark:bg-white dark:border-white/25 transition-transform duration-200 group-hover/oem:scale-105">
                        <OemImage
                          src={logo}
                          alt={name}
                          className="max-h-11 max-w-[125px] object-contain"
                          placeholderClassName="h-11 w-full"
                        />
                      </div>

                      <div className="mt-2.5 w-full">
                        <span className="block font-display text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {name}
                        </span>
                        <span className="mt-0.5 inline-block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ Lab Certified
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full rounded-xl border border-dashed border-neutral-300 p-6 text-center text-xs text-neutral-500 dark:border-white/10">
                  OEM Partner Architectures Active in Live Lab
                </div>
              )}
            </div>
          </div>

          {/* Core Security Controls & Blueprint Verification */}
          {controlsList.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-orange-400">
                  <FileCheck2 className="size-4" />
                  <span>Core Security Controls & Blueprint Verification ({controlsList.length})</span>
                </h4>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Live Testbed Certified
                </span>
              </div>

              <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {controlsList.map((ctl, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-neutral-200/90 bg-neutral-50/60 p-3.5 text-xs text-neutral-700 dark:border-white/10 dark:bg-neutral-800/40 dark:text-neutral-300 shadow-2xs"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {ctl.id && (
                          <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-orange-400">
                            {ctl.id}
                          </span>
                        )}
                        <h5 className="font-display text-xs font-bold text-neutral-900 dark:text-white">
                          {ctl.name}
                        </h5>
                      </div>
                      {ctl.desc && (
                        <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                          {ctl.desc}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance & Regulatory Framework Alignment */}
          <div>
            <h4 className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-orange-400">
              <Zap className="size-4" />
              <span>Compliance & Regulatory Framework Alignment</span>
            </h4>
            <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {complianceList.map((comp, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-3 dark:border-white/10 dark:bg-neutral-800/30"
                >
                  <span className="font-display text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {comp.name}
                  </span>
                  <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed">
                    {comp.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Business Impact Multiplier */}
          {detailedMeta?.multiplier && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 dark:border-orange-500/30 dark:bg-orange-500/15">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-orange-300">
                Revenue & Deployment Multiplier
              </span>
              <p className="mt-1 font-display text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
                {detailedMeta.multiplier}
              </p>
            </div>
          )}

        </div>

        {/* High-Contrast Footer Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-200/90 bg-neutral-50/90 px-6 py-4 dark:border-white/10 dark:bg-neutral-950/90">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <IValueEmblem className="size-4 shrink-0" />
            <span>Validated by iValue Center of Excellence Labs (Bangalore & Singapore)</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href={`/request-poc?stack=${encodeURIComponent(stack.title)}`}
              onClick={onClose}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-md transition-all cursor-pointer"
            >
              <span>Request Live PoC & Blueprint</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
