"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, ShieldCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 antialiased font-sans selection:bg-neutral-800 selection:text-white dark:selection:bg-white dark:selection:text-black relative isolate overflow-hidden">
      {/* ChaiUI Ambient Background Glow */}
      <div
        className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[500px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(249,115,22,0.06),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(249,115,22,0.08),rgba(0,0,0,0))] opacity-80"
        aria-hidden="true"
      />

      {/* Responsive Admin Sidebar (Frozen / Constant on Left) */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Admin Top Header Bar (ChaiUI Restrained Hairline) - 100% Constant / Frozen */}
        <header className="h-16 shrink-0 z-20 flex items-center justify-between border-b border-neutral-200/80 bg-white/80 px-4 sm:px-8 backdrop-blur-md dark:border-white/10 dark:bg-[#0a0a0a]/80">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden flex size-8 items-center justify-center rounded-md border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
            >
              <Menu className="size-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1 text-xs font-medium text-neutral-800 dark:text-neutral-200">
                <ShieldCheck className="size-3.5 text-neutral-500 dark:text-neutral-400" />
                <span className="font-montserrat font-medium tracking-tight text-yellow-800 dark:text-orange-100">
                  COE Console
                </span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-neutral-200/80 dark:border-white/10 px-2.5 py-0.5 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                MySQL: ivaluecoe
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <span>Main site</span>
              <ArrowUpRight className="size-3" />
            </Link>

            <div className="h-4 w-px bg-neutral-200 dark:bg-white/10 hidden sm:block" />

            {/* Theme Switcher */}
            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Page Content - Only This Scrolls Smoothly */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 lg:p-10 custom-gold-scrollbar">
          <div className="max-w-6xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
