import React from "react";
import Link from "next/link";
import { IValueLogo } from "@/components/ui/ivalue-logo";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-neutral-200/80 bg-neutral-50 px-6 pt-16 pb-12 font-display dark:border-white/10 dark:bg-neutral-950/60 sm:px-12 before:absolute before:top-0 before:left-1/2 before:h-px before:w-full before:max-w-6xl before:-translate-x-1/2 before:bg-amber-600 before:opacity-20 before:[mask-image:linear-gradient(90deg,transparent_0%,black_50%,transparent_100%)] dark:before:bg-orange-400">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info with Official iValue Emblem / Logo */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <IValueLogo className="h-8" />
            </div>
            <p className="mt-4 max-w-md text-sm text-neutral-600 leading-relaxed dark:text-neutral-400 font-sans">
              iValue Group&apos;s Center of Excellence is the premier multi-vendor cybersecurity and cloud innovation hub, empowering enterprises, partners, and OEMs to validate, integrate, and scale robust solutions.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-orange-400" />
                <span>
                  <strong>India HQ:</strong> No. 903/1/1, 19th Main Road, 4th Sector, H.S.R. Layout, Bangalore - 560102
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-orange-400" />
                <span>
                  <strong>Singapore Office:</strong> No.31, Cantonment Road, Singapore - 089747
                </span>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="mailto:info@ivalue.co.in"
                  className="flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-orange-400 transition-colors"
                >
                  <Mail className="size-3.5" />
                  info@ivalue.co.in
                </a>
                <a
                  href="tel:+919535999473"
                  className="flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-orange-400 transition-colors"
                >
                  <Phone className="size-3.5" />
                  +91 95359 99473
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Quick Navigation
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
              <li>
                <Link href="/" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/oem" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  Top OEM Directory
                </Link>
              </li>
              <li>
                <Link href="/#values" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  iValue Stacks
                </Link>
              </li>
              <li>
                <Link href="/specialized-stacks" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  Specialized Stacks
                </Link>
              </li>
              <li>
                <Link href="/advantages" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  iVCoE Advantages
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  Cyber Security News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Stacks */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Featured Stacks
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
              <li>
                <Link href="/stack/cloudSecurityControls" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  Cloud Security Stack
                </Link>
              </li>
              <li>
                <Link href="/stack/scoControls" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  SOC & Incident Response
                </Link>
              </li>
              <li>
                <Link href="/stack/iamControls" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  Identity & Access (IAM)
                </Link>
              </li>
              <li>
                <Link href="/stack/endpointControls" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  Endpoint & XDR Stack
                </Link>
              </li>
              <li>
                <Link href="/stack/BFSIControls" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  BFSI & Fintech Stacks
                </Link>
              </li>
            </ul>
          </div>

          {/* Accelerators */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Accelerators
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
              <li>
                <Link href="/multiplier/ztnamultiplier" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  ZTNA Revenue Multiplier
                </Link>
              </li>
              <li>
                <Link href="/multiplier/SoCmultiplier" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  SoC Revenue Multiplier
                </Link>
              </li>
              <li>
                <Link href="/multiplier/bfsimultiplier" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  BFSI Multiplier
                </Link>
              </li>
              <li>
                <Link href="/multiplier/digitalnativesmultiplier" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  Digital Natives Multiplier
                </Link>
              </li>
              <li>
                <Link href="/multiplier/energymultiplier" className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors">
                  Energy Revenue Multiplier
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between border-t border-neutral-200/80 pt-6 text-xs text-neutral-500 dark:border-white/10 dark:text-neutral-400 sm:flex-row font-sans gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p>© 2026 iValue InfoSolutions Limited. All rights reserved.</p>
            <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
            <div className="flex items-center gap-3">
              <Link
                href="/about-us"
                className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors"
              >
                About Us
              </Link>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <Link
                href="/privacy-policy"
                className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <Link
                href="/terms-and-conditions"
                className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Social Links from MAIN site */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/company/ivalue-infosolutions-pvt-ltd"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <a
              href="https://twitter.com/iValueInfoSoln"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors"
            >
              Twitter
            </a>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <a
              href="https://www.facebook.com/iValueInfoSoln/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-600 dark:hover:text-orange-400 transition-colors"
            >
              Facebook
            </a>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              COE Live Labs Operational
            </span>
            <a
              href="https://ivaluegroup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              ivaluegroup.com <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
