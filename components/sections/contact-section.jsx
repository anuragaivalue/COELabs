"use client";

import React from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { IValueEmblem } from "@/components/ui/ivalue-logo";

export function ContactSection() {
  return (
    <section id="contact" className="section-divider py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        {/* Top Section: Contact Info on Left, Embedded Map on Right */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-stretch">
          {/* Left Column: Direct Info & Global Presence */}
          <div className="card-reveal flex flex-col justify-between" style={{ transitionDelay: "100ms" }}>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                <IValueEmblem className="size-3.5" />
                <span>Center of Excellence Engagement</span>
              </div>
              <h2 className="mt-4 font-sans text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
                Contact Us
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                Schedule an executive briefing, test an integrated multistack blueprint in our live lab, or validate an upcoming enterprise RFP.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 dark:border-white/10 dark:bg-neutral-900/40">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-orange-950/40 dark:text-orange-400">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-neutral-900 dark:text-white">
                      India Global Headquarters
                    </h4>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                      No. 903/1/1, 19th Main Road, 4th Sector, H.S.R. Layout, Bangalore - 560102, Karnataka, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 dark:border-white/10 dark:bg-neutral-900/40">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-orange-950/40 dark:text-orange-400">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-neutral-900 dark:text-white">
                      Singapore Regional Office
                    </h4>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                      No.31, Cantonment Road, Singapore - 089747
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1">
                  <a
                    href="mailto:info@ivalue.co.in"
                    className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 hover:border-amber-500/40 dark:border-white/10 dark:bg-neutral-900/40 transition-colors"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-orange-950/40 dark:text-orange-400">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Email Us</span>
                      <p className="font-display text-xs font-semibold text-neutral-900 dark:text-white">
                        info@ivalue.co.in
                      </p>
                    </div>
                  </a>

                  <a
                    href="tel:+919535999473"
                    className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 hover:border-amber-500/40 dark:border-white/10 dark:bg-neutral-900/40 transition-colors"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-orange-950/40 dark:text-orange-400">
                      <Phone className="size-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Call Us</span>
                      <p className="font-display text-xs font-semibold text-neutral-900 dark:text-white">
                        +91 95359 99473
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Google Map matching the MAIN site */}
          <div className="card-reveal flex flex-col h-full min-h-[380px] rounded-2xl border border-neutral-200 overflow-hidden shadow-sm dark:border-white/10" style={{ transitionDelay: "200ms" }}>
            <iframe
              title="iValue Global Headquarters & Regional Presence"
              src="https://www.google.com/maps/d/embed?mid=1HUXRBn0TK7oV5Nm4r6hEpOtfCoWPYUI&ehbc=2E312F"
              width="100%"
              height="100%"
              className="h-full min-h-[420px] w-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Bottom Area: Request Architecture Blueprint Standalone Page Gateway */}
        <div
          className="card-reveal mt-14 rounded-2xl border border-neutral-200/90 bg-gradient-to-r from-neutral-900 to-neutral-950 p-8 sm:p-12 text-white shadow-xl dark:border-white/10 dark:from-neutral-950 dark:to-neutral-900"
          style={{ transitionDelay: "150ms" }}
        >
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

            <a
              href="/request-poc"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-display text-xs sm:text-sm font-bold text-neutral-900 hover:bg-neutral-100 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span>Request Architecture Blueprint</span>
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
