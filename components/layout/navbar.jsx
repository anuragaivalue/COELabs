"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { IValueLogo } from "@/components/ui/ivalue-logo";
import { navigationConfig } from "@/data/navigation";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  Cpu,
  Building2,
  ArrowRight,
  Calculator
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Navbar - Locked to Gold Accents on White Palette
 * Exactly preserves middle item ordering (Home, OEM, Customer, Partners, Multi Stacks, Accelerators, iValue Cloud)
 * and right action buttons (Marketplace, Login) with single-line fit and zero horizontal overflow.
 */
export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const isAuthenticated = status === "authenticated" && !!session?.user;
  const currentUser = session?.user;
  const userType = currentUser?.userType || currentUser?.role || "user";
  const userImage = currentUser?.image;
  const userName = currentUser?.name || currentUser?.email || "User";
  const userInitial = (userName.charAt(0) || "U").toUpperCase();
  const dashboardLink = userType === "admin" ? "/dashboard/admin" : "/dashboard/user";

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (dropdownKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(dropdownKey);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 140);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Safe fallback accessors
  const techStacks = navigationConfig?.multiStacks?.techStacks || [];
  const verticalStacks = navigationConfig?.multiStacks?.verticalStacks || [];
  const revenueMultipliers = navigationConfig?.accelerators?.revenueMultipliers || [];
  const implementationServices = navigationConfig?.accelerators?.implementationServices || [];
  const migrationServices = navigationConfig?.accelerators?.migrationServices || [];
  const calculators = navigationConfig?.accelerators?.calculators || [];

  // Active state calculations
  const isHomeActive = pathname === "/";
  const isOemActive = pathname === "/oem";
  const isCustomerActive = pathname === "/customer";
  const isPartnersActive = pathname === "/partners";
  const isMultiStacksActive =
    pathname.startsWith("/stack") ||
    pathname === "/technology-stacks" ||
    pathname === "/vertical-stacks";
  const isMarketplaceActive = pathname?.startsWith("/portal/marketplace");
  const isLoginActive = pathname === "/login" || pathname === "/loginWithOutlook";

  const getNavLinkClass = (isActive) =>
    cn(
      "relative rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-[13px] font-medium transition-all duration-150 cursor-pointer inline-flex items-center gap-1 shrink-0 whitespace-nowrap",
      isActive
        ? "text-amber-700 dark:text-amber-400 font-semibold"
        : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100/70 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800/60"
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-neutral-200/80 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/95 shadow-2xs"
          : "border-b border-transparent bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xs"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">

        {/* ======================================================== */}
        {/* CONTAINER 1 (LEFT): iValue logo / brand mark             */}
        {/* ======================================================== */}
        <div className="flex items-center shrink-0 min-w-max mr-3 lg:mr-4 xl:mr-6">
          <Link href="/" className="flex items-center group cursor-pointer shrink-0">
            <IValueLogo className="h-6 sm:h-7 lg:h-7.5" showCoe={true} />
          </Link>
        </div>

        {/* ======================================================== */}
        {/* CONTAINER 2 (CENTER): Exact MAIN Site Structure (Image 1)*/}
        {/* Single horizontal line alignment (whitespace-nowrap)     */}
        {/* Order: Home, OEM, Customer, Partners, Multi Stacks,      */}
        {/*        Accelerators, iValue Cloud                        */}
        {/* ======================================================== */}
        <nav className="hidden lg:flex items-center justify-center flex-nowrap whitespace-nowrap gap-0.5 xl:gap-1.5 2xl:gap-2.5 shrink-0">

          {/* 1. Home (Internal) */}
          <Link href="/" className={getNavLinkClass(isHomeActive)}>
            <span>Home</span>
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1.5 right-1.5 h-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 animate-in fade-in zoom-in-90 duration-200" />
            )}
          </Link>

          {/* 2. OEM (Internal) */}
          <a href="/oem" className={getNavLinkClass(isOemActive)}>
            <span>OEM</span>
            {isOemActive && (
              <span className="absolute -bottom-1 left-1.5 right-1.5 h-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 animate-in fade-in zoom-in-90 duration-200" />
            )}
          </a>

          {/* 3. Customer (Internal link to /customer) */}
          <Link
            href="/customer"
            className={getNavLinkClass(isCustomerActive)}
          >
            <span>Customer</span>
            {isCustomerActive && (
              <span className="absolute -bottom-1 left-1.5 right-1.5 h-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 animate-in fade-in zoom-in-90 duration-200" />
            )}
          </Link>

          {/* 4. Partners (Internal link to /partners) */}
          <Link
            href="/partners"
            className={getNavLinkClass(isPartnersActive)}
          >
            <span>Partners</span>
          </Link>

          {/* 5. Multi Stacks Dropdown (2 Distinct Columns per Image 2) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("multistacks")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-[13px] font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap",
                isMultiStacksActive
                  ? "text-amber-700 dark:text-amber-400 font-semibold"
                  : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100/70 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800/60",
                activeDropdown === "multistacks" && "bg-amber-500/10 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300"
              )}
            >
              <span>Multi Stacks</span>
              <ChevronDown
                className={cn(
                  "size-3 transition-transform duration-200",
                  activeDropdown === "multistacks" && "rotate-180 text-amber-600 dark:text-amber-400"
                )}
              />
              {isMultiStacksActive && (
                <span className="absolute -bottom-1 left-1.5 right-1.5 h-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 animate-in fade-in zoom-in-90 duration-200" />
              )}
            </button>

            {/* Dropdown Card: Split into 2 Columns (Image 2) */}
            {activeDropdown === "multistacks" && (
              <div
                className="absolute top-full left-0 pt-2 z-[100] animate-in fade-in-0 zoom-in-95 slide-in-from-top-1.5 duration-150 ease-out max-w-[calc(100vw-2rem)]"
                onMouseEnter={() => handleMouseEnter("multistacks")}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  style={{ backgroundColor: "var(--card)" }}
                  className="w-[580px] xl:w-[620px] max-w-full rounded-2xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#111113] p-4 shadow-2xl overflow-x-hidden isolate"
                >
                  <div className="grid grid-cols-2 gap-4">

                    {/* Column 1: Technology Stacks */}
                    <div>
                      <Link
                        href="/technology-stacks"
                        onClick={() => setActiveDropdown(null)}
                        className="mb-2.5 flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <Cpu className="size-3.5" />
                          <span>Technology Stacks</span>
                        </div>
                        <ArrowRight className="size-3" />
                      </Link>
                      <div className="space-y-1">
                        {techStacks.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start justify-between rounded-lg p-2 hover:bg-amber-50/80 dark:hover:bg-amber-500/10 transition-all duration-150"
                          >
                            <div>
                              <span className="block font-display text-xs font-semibold text-neutral-900 group-hover:text-amber-700 dark:text-neutral-200 dark:group-hover:text-amber-400 transition-colors">
                                {item.label}
                              </span>
                              <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                {item.desc}
                              </span>
                            </div>
                            <ChevronRight className="size-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 ml-1" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Vertical Stacks */}
                    <div>
                      <Link
                        href="/vertical-stacks"
                        onClick={() => setActiveDropdown(null)}
                        className="mb-2.5 flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-neutral-600 hover:text-amber-700 dark:text-neutral-400 dark:hover:text-amber-300 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <Building2 className="size-3.5" />
                          <span>Vertical Stacks</span>
                        </div>
                        <ArrowRight className="size-3" />
                      </Link>
                      <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1 custom-gold-scrollbar">
                        {verticalStacks.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start justify-between rounded-lg p-2 hover:bg-amber-50/80 dark:hover:bg-amber-500/10 transition-all duration-150"
                          >
                            <div>
                              <span className="block font-display text-xs font-semibold text-neutral-900 group-hover:text-amber-700 dark:text-neutral-200 dark:group-hover:text-amber-400 transition-colors">
                                {item.label}
                              </span>
                              <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                {item.desc}
                              </span>
                            </div>
                            <ChevronRight className="size-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 ml-1" />
                          </a>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Dropdown Footer */}
                  <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] px-2 gap-2">
                    <span className="text-neutral-400">34 Validated Multistack Blueprints</span>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/technology-stacks"
                        onClick={() => setActiveDropdown(null)}
                        className="font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 inline-flex items-center gap-1"
                      >
                        <span>Tech Suite</span>
                        <ArrowRight className="size-3" />
                      </Link>
                      <span className="text-neutral-300 dark:text-neutral-700">•</span>
                      <Link
                        href="/vertical-stacks"
                        onClick={() => setActiveDropdown(null)}
                        className="font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 inline-flex items-center gap-1"
                      >
                        <span>Vertical Suite</span>
                        <ArrowRight className="size-3" />
                      </Link>
                      <span className="text-neutral-300 dark:text-neutral-700">•</span>
                      <Link
                        href="/#values"
                        onClick={() => setActiveDropdown(null)}
                        className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 inline-flex items-center gap-1"
                      >
                        <span>All 34+</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. Accelerators Dropdown (Exact match to Image 3) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("accelerators")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-[13px] font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap",
                activeDropdown === "accelerators" && "bg-amber-500/10 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300",
                "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100/70 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800/60"
              )}
            >
              <span>Accelerators</span>
              <ChevronDown
                className={cn(
                  "size-3 transition-transform duration-200",
                  activeDropdown === "accelerators" && "rotate-180 text-amber-600 dark:text-amber-400"
                )}
              />
            </button>

            {/* Dropdown Card: Replicating Image 2 Structure with Gold on White Palette */}
            {activeDropdown === "accelerators" && (
              <div
                className="fixed left-1/2 -translate-x-1/2 top-[52px] sm:top-[56px] lg:top-[58px] z-[100] pt-2 animate-in fade-in-0 zoom-in-95 duration-150 ease-out"
                onMouseEnter={() => handleMouseEnter("accelerators")}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  style={{ backgroundColor: "var(--card)" }}
                  className="w-[min(94vw,1140px)] rounded-2xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#111113] p-5 sm:p-6 shadow-2xl overflow-x-hidden isolate"
                >

                  {/* Top 3-Column Grid matching Image 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

                    {/* Column 1: REVENUE MULTIPLIERS */}
                    <div className="flex flex-col">
                      <div className="mb-3 flex items-center text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 font-display">
                        <span className="inline-block w-1 h-3.5 rounded-full bg-amber-500 mr-2 shrink-0" />
                        <span>REVENUE MULTIPLIERS</span>
                      </div>
                      <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-gold-scrollbar">
                        {revenueMultipliers.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            title={item.label}
                            className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50/80 dark:hover:bg-amber-500/10 transition-all duration-150"
                          >
                            <span className="truncate">{item.label}</span>
                            <ChevronRight className="size-3 text-amber-600 dark:text-amber-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 ml-1.5" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: IMPLEMENTATION SERVICES */}
                    <div className="flex flex-col">
                      <div className="mb-3 flex items-center text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 font-display">
                        <span className="inline-block w-1 h-3.5 rounded-full bg-amber-500 mr-2 shrink-0" />
                        <span>IMPLEMENTATION SERVICES</span>
                      </div>
                      <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-gold-scrollbar">
                        {implementationServices.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            title={item.label}
                            className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50/80 dark:hover:bg-amber-500/10 transition-all duration-150"
                          >
                            <span className="truncate">{item.label}</span>
                            <ChevronRight className="size-3 text-amber-600 dark:text-amber-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 ml-1.5" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: MIGRATION SERVICES */}
                    <div className="flex flex-col">
                      <div className="mb-3 flex items-center text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 font-display">
                        <span className="inline-block w-1 h-3.5 rounded-full bg-amber-500 mr-2 shrink-0" />
                        <span>MIGRATION SERVICES</span>
                      </div>
                      <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-gold-scrollbar">
                        {migrationServices.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            title={item.label}
                            className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50/80 dark:hover:bg-amber-500/10 transition-all duration-150"
                          >
                            <span className="truncate">{item.label}</span>
                            <ChevronRight className="size-3 text-amber-600 dark:text-amber-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 ml-1.5" />
                          </Link>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Bottom Section: CALCULATOR matching Image 2 */}
                  <div className="mt-6 pt-4 border-t border-neutral-200/80 dark:border-white/10">
                    <div className="mb-3 flex items-center text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 font-display">
                      <span className="inline-block w-1 h-3.5 rounded-full bg-amber-500 mr-2 shrink-0" />
                      <span>CALCULATOR</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {calculators.map((calc, idx) => (
                        <Link
                          key={idx}
                          href={calc.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-3 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-neutral-800/40 p-3 hover:border-amber-500/50 hover:bg-amber-50/70 dark:hover:border-amber-400/40 dark:hover:bg-amber-500/10 transition-all duration-150 group"
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300 group-hover:scale-105 transition-transform shrink-0">
                            <Calculator className="size-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors truncate">
                              {calc.label}
                            </span>
                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                              Interactive ROI Model
                            </span>
                          </div>
                          <ChevronRight className="size-3.5 text-neutral-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all ml-auto shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* 7. iValue Cloud (Placeholder href="#") */}
          <a href="#" className={getNavLinkClass(false)}>
            <span>iValue Cloud</span>
          </a>

        </nav>

        {/* ======================================================== */}
        {/* CONTAINER 3 (RIGHT): Marketplace & Login Buttons         */}
        {/* ======================================================== */}
        <div className="hidden sm:flex items-center gap-2 xl:gap-2.5 shrink-0 min-w-max ml-3 lg:ml-4 xl:ml-6">

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Marketplace Button (linked to internal /portal/marketplace with Gold accent) */}
          <a
            href="/portal/marketplace"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs xl:text-sm font-semibold transition-all whitespace-nowrap shadow-2xs cursor-pointer",
              isMarketplaceActive
                ? "border-amber-500 bg-amber-500/20 text-amber-950 dark:border-amber-400 dark:bg-amber-500/25 dark:text-amber-200"
                : "border-amber-500/40 bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 hover:border-amber-500/60 dark:border-amber-400/40 dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-500/25 dark:hover:border-amber-400/70"
            )}
          >
            <ShoppingBag className="size-3.5 text-amber-600 dark:text-amber-400" />
            <span>Marketplace</span>
          </a>

          {/* Authentication Section: Circular Profile Avatar (Logged In) or Login Button */}
          {isAuthenticated ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="relative flex items-center justify-center size-8 sm:size-8.5 rounded-full ring-2 ring-amber-500/70 hover:ring-amber-500 dark:ring-amber-400/80 transition-all shadow-xs cursor-pointer overflow-hidden bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xs focus:outline-none"
                title={`${userName} (${userType}) - Click for options`}
                aria-label="User Profile Menu"
              >
                {userImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userImage}
                    alt={userName}
                    className="size-full object-cover rounded-full"
                  />
                ) : (
                  <span>{userInitial}</span>
                )}
                <span className="absolute bottom-0 right-0 block size-2 rounded-full ring-1 ring-white dark:ring-neutral-900 bg-emerald-500" />
              </button>

              {/* Minimal Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-[#141416]/95 backdrop-blur-xl p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-2.5 pb-2.5 mb-2 border-b border-neutral-200/80 dark:border-white/10">
                    <div className="size-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden">
                      {userImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={userImage} alt={userName} className="size-full object-cover" />
                      ) : (
                        <span>{userInitial}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {userName}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                        {currentUser?.email}
                      </p>
                      <span
                        className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          userType === "admin"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        {userType}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Link
                      href={dashboardLink}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    >
                      <ShieldCheck className="size-3.5 text-amber-600 dark:text-amber-400" />
                      <span>{userType === "admin" ? "Admin Dashboard" : "User Dashboard"}</span>
                    </Link>

                    <button
                      type="button"
                      onClick={async () => {
                        setProfileDropdownOpen(false);
                        if (typeof window !== "undefined") {
                          localStorage.removeItem("ivalue_auth_token");
                          localStorage.removeItem("ivalue_auth_user");
                        }
                        await signOut({ callbackUrl: "/login" });
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer text-left w-full"
                    >
                      <LogOut className="size-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs xl:text-sm font-semibold transition-all whitespace-nowrap shadow-2xs cursor-pointer",
                isLoginActive
                  ? "border-amber-500 bg-amber-500/20 text-amber-950 dark:border-amber-400 dark:bg-amber-500/25 dark:text-amber-200"
                  : "border-neutral-300 dark:border-white/20 bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 hover:border-amber-500/40 dark:hover:bg-neutral-800 dark:hover:border-amber-400/30"
              )}
            >
              <LogIn className="size-3.5 text-neutral-700 dark:text-neutral-300" />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Toggle navigation menu"
            className="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MOBILE DRAWER MENU                                       */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 bg-white/98 px-6 py-6 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/98 lg:hidden animate-in slide-in-from-top-4 max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                isHomeActive
                  ? "bg-amber-500/15 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 border-l-4 border-amber-500 dark:border-amber-400"
                  : "text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              )}
            >
              Home
            </Link>

            <Link
              href="/oem"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                isOemActive
                  ? "bg-amber-500/15 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 border-l-4 border-amber-500 dark:border-amber-400"
                  : "text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              )}
            >
              OEM
            </Link>

            <Link
              href="/customer"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                isCustomerActive
                  ? "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 font-bold"
                  : "text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              )}
            >
              Customer
            </Link>

            <Link
              href="/partners"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                isPartnersActive
                  ? "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 font-bold"
                  : "text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              )}
            >
              Partners
            </Link>

            {/* Mobile Multi-Stacks Submenu Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setMobileSubmenu(mobileSubmenu === "multistacks" ? null : "multistacks")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <span>Multi Stacks</span>
                <ChevronDown className={cn("size-4 transition-transform", mobileSubmenu === "multistacks" && "rotate-180")} />
              </button>
              {mobileSubmenu === "multistacks" && (
                <div className="ml-3 mt-1 space-y-1 border-l-2 border-neutral-200 pl-3 dark:border-white/10">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 pt-1">
                    Technology Stacks
                  </span>
                  {techStacks.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-amber-700 dark:hover:text-amber-300"
                    >
                      {s.label}
                    </a>
                  ))}
                  <Link
                    href="/technology-stacks"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    → Explore All Technology Stacks
                  </Link>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 pt-2">
                    Vertical Stacks
                  </span>
                  {verticalStacks.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-amber-700 dark:hover:text-amber-300"
                    >
                      {s.label}
                    </a>
                  ))}
                  <Link
                    href="/vertical-stacks"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    → Explore All Vertical Stacks
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Accelerators Submenu Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setMobileSubmenu(mobileSubmenu === "accelerators" ? null : "accelerators")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <span>Accelerators</span>
                <ChevronDown className={cn("size-4 transition-transform", mobileSubmenu === "accelerators" && "rotate-180")} />
              </button>
              {mobileSubmenu === "accelerators" && (
                <div className="ml-3 mt-1 space-y-2 border-l-2 border-neutral-200 pl-3 dark:border-white/10 max-h-[300px] overflow-y-auto custom-gold-scrollbar">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 pt-1">
                    Revenue Multipliers
                  </span>
                  {revenueMultipliers.map((a, idx) => (
                    <Link
                      key={idx}
                      href={a.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-0.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-amber-700 dark:hover:text-amber-300"
                    >
                      {a.label}
                    </Link>
                  ))}
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 pt-2">
                    Implementation Services
                  </span>
                  {implementationServices.slice(0, 8).map((a, idx) => (
                    <Link
                      key={idx}
                      href={a.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-0.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-amber-700 dark:hover:text-amber-300"
                    >
                      {a.label}
                    </Link>
                  ))}
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 pt-2">
                    Migration Services
                  </span>
                  {migrationServices.slice(0, 6).map((m, idx) => (
                    <Link
                      key={idx}
                      href={m.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-0.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-amber-700 dark:hover:text-amber-300"
                    >
                      {m.label}
                    </Link>
                  ))}
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 pt-2">
                    Calculators
                  </span>
                  {calculators.map((c, idx) => (
                    <Link
                      key={idx}
                      href={c.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-0.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-amber-700 dark:hover:text-amber-300"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              iValue Cloud
            </a>

            {/* Mobile Action Buttons */}
            <div className="mt-4 flex flex-col gap-2 border-t border-neutral-200/80 pt-4 dark:border-white/10">
              <a
                href="/portal/marketplace"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 py-2.5 text-center text-xs font-semibold text-amber-900 dark:text-amber-300 dark:border-amber-400/40 dark:bg-amber-500/15 shadow-2xs"
              >
                <ShoppingBag className="size-4 text-amber-600 dark:text-amber-400" />
                <span>Marketplace</span>
              </a>
              {isAuthenticated ? (
                <div className="flex flex-col gap-2 pt-2 border-t border-neutral-200/80 dark:border-white/10 mt-1">
                  <Link
                    href={dashboardLink}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs font-semibold text-neutral-900 dark:text-white"
                  >
                    <div className="size-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs overflow-hidden shrink-0">
                      {userImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={userImage} alt={userName} className="size-full object-cover" />
                      ) : (
                        <span>{userInitial}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="truncate font-bold text-neutral-900 dark:text-white">{userName}</p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 capitalize">{userType} Dashboard</p>
                    </div>
                    <ChevronRight className="size-4 text-amber-600 dark:text-amber-400" />
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      if (typeof window !== "undefined") {
                        localStorage.removeItem("ivalue_auth_token");
                        localStorage.removeItem("ivalue_auth_user");
                      }
                      await signOut({ callbackUrl: "/login" });
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-50/60 dark:bg-red-500/10 py-2.5 text-center text-xs font-semibold text-red-600 dark:text-red-400 cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border py-2.5 text-center text-xs font-semibold shadow-2xs transition-all",
                    isLoginActive
                      ? "border-amber-500 bg-amber-500/15 text-amber-900 dark:border-amber-400 dark:bg-amber-500/20 dark:text-amber-300"
                      : "border-neutral-300 dark:border-white/20 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
                  )}
                >
                  <LogIn className="size-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
