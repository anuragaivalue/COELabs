"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Layers,
  Clock,
  User,
  Database,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldCheck,
  X,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function UserSidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const currentUser = session?.user || {};
  const userName = currentUser.name || "Authenticated User";
  const userImage = currentUser.image || "";
  const userInitial = userName.charAt(0).toUpperCase();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard/user",
      icon: LayoutDashboard,
      active: pathname === "/dashboard/user",
    },
    {
      label: "Products",
      href: "/dashboard/user/products",
      icon: Layers,
      active: pathname.startsWith("/dashboard/user/products"),
      badge: "Catalog",
    },
    {
      label: "Track My Product",
      href: "/dashboard/user/track",
      icon: Clock,
      active: pathname.startsWith("/dashboard/user/track"),
      badge: "Requests",
    },
    {
      label: "Profile",
      href: "/dashboard/user/profile",
      icon: User,
      active: pathname.startsWith("/dashboard/user/profile"),
      badge: "Account",
    },
  ];

  const secondaryNavItems = [
    {
      label: "Database",
      icon: Database,
      badge: "ivaluecoe",
      tag: "Live",
    },
    {
      label: "RBAC Security",
      icon: ShieldCheck,
      tag: "Active",
    },
  ];

  const handleSignOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ivalue_auth_token");
      localStorage.removeItem("ivalue_auth_user");
    }
    await signOut({ callbackUrl: "/login" });
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto custom-gold-scrollbar">
      {/* Top Section: Brand Header & Navigations */}
      <div>
        {/* Brand Header with Official iValue Company Logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-neutral-200/80 dark:border-white/10 bg-white/50 dark:bg-black/30",
            collapsed ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          <Link
            href="/dashboard/user"
            className={cn(
              "flex items-center gap-2.5 transition-opacity hover:opacity-90",
              collapsed ? "justify-center" : "overflow-hidden"
            )}
            title={collapsed ? "iValue COE User Portal" : undefined}
          >
            {/* Official iValue Logo / Favicon */}
            <div className="size-8 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-1 flex items-center justify-center shrink-0 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/favicon.png"
                alt="iValue Group"
                className="size-full object-contain select-none"
              />
            </div>

            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/ivalue.png"
                    alt="iValue"
                    className="h-4 w-auto object-contain dark:brightness-0 dark:invert"
                  />
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-neutral-900 text-white dark:bg-white dark:text-black font-mono tracking-tight">
                    COE
                  </span>
                </div>
                <span className="text-[9px] text-neutral-500 font-mono tracking-wider uppercase mt-0.5">
                  COE Portal
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle button (When Expanded) */}
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              className="hidden lg:flex size-7 items-center justify-center rounded border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors"
            >
              <ChevronLeft className="size-3.5" />
            </button>
          )}

          {/* Mobile close toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close mobile sidebar"
            className="lg:hidden size-7 flex items-center justify-center rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-6">
          {/* Main Navigation */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                Workspace
              </p>
            )}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all group relative",
                      item.active
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold shadow-2xs border border-amber-500/20"
                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-200"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        item.active
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-neutral-500 group-hover:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-neutral-200"
                      )}
                    />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          "text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider",
                          item.active
                            ? "bg-amber-500/20 text-amber-800 dark:text-amber-200"
                            : "bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Active Indicator Bar on Left */}
                    {item.active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-amber-500 rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Telemetry / Live Status */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                System Status
              </p>
            )}
            <div className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400 cursor-default"
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="size-4 shrink-0 text-neutral-400" />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>
                    {!collapsed && item.tag && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {item.tag}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: User Profile & Actions */}
      <div className="p-3 border-t border-neutral-200/80 dark:border-white/10 bg-neutral-50/50 dark:bg-black/20">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-2",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {/* User info */}
          <Link
            href="/dashboard/user/profile"
            className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity group"
            title="View User Profile & Identity"
          >
            <div className="size-8 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
              {userImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={userImage}
                  alt={userName}
                  className="size-full object-cover"
                />
              ) : (
                userInitial
              )}
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {userName}
                </p>
                <p className="text-[10px] font-mono text-neutral-400 truncate">
                  {currentUser.email || "user@enterprise"}
                </p>
              </div>
            )}
          </Link>

          {/* Sign Out Button */}
          {!collapsed && (
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign out of account"
              className="size-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Static Sidebar: Constant / Frozen on the left */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 border-r border-neutral-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0c0c0c]/98 backdrop-blur-md transition-all duration-300 z-30 sticky top-0 h-screen relative select-none",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {sidebarContent}

        {/* Floating Expand Toggle Button on the Right Border at TOP along with Logo */}
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="hidden lg:flex absolute -right-3 top-5 z-50 size-6 rounded-full border border-neutral-300 dark:border-white/20 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white shadow-xs items-center justify-center cursor-pointer transition-transform hover:scale-110"
            title="Expand sidebar"
          >
            <ChevronRight className="size-3" />
          </button>
        )}
      </aside>

      {/* Mobile Drawer (When Open) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-white dark:bg-[#0c0c0e] shadow-2xl z-10 border-r border-neutral-200 dark:border-white/10 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
