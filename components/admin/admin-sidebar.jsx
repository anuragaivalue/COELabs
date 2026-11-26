"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Database,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldAlert,
  X,
  ClipboardList,
  ArrowUpRight,
  Archive,
  Building2,
  FileText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const currentUser = session?.user || {};
  const userName = currentUser.name || "Administrator";
  const userImage = currentUser.image || "";
  const userInitial = userName.charAt(0).toUpperCase();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
      active: pathname === "/dashboard/admin",
    },
    {
      label: "Users",
      href: "/dashboard/admin/userlist",
      icon: Users,
      active:
        pathname.startsWith("/dashboard/admin/users") ||
        pathname.startsWith("/dashboard/admin/userlist"),
      badge: "Manage",
    },
    {
      label: "Requested Users",
      href: "/dashboard/admin/requested-users",
      icon: ClipboardList,
      active:
        pathname.startsWith("/dashboard/admin/requested-users") ||
        pathname.startsWith("/dashboard/admin/requesteduserlist"),
      badge: "Labs",
    },
    {
      label: "Archived Users",
      href: "/dashboard/admin/archived-users",
      icon: Archive,
      active:
        pathname.startsWith("/dashboard/admin/archived-users") ||
        pathname.startsWith("/dashboard/admin/deletedrequesteduser"),
      badge: "Vault",
    },
    {
      label: "OEMs",
      href: "/dashboard/admin/oems",
      icon: Building2,
      active:
        pathname.startsWith("/dashboard/admin/oems") ||
        pathname.startsWith("/dashboard/admin/oem"),
      badge: "Brands",
    },
    {
      label: "New Content",
      href: "/dashboard/admin/new-content",
      icon: FileText,
      active:
        pathname.startsWith("/dashboard/admin/new-content") ||
        pathname.startsWith("/dashboard/admin/content"),
      badge: "Studio",
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
      icon: ShieldAlert,
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
            href="/dashboard/admin"
            className={cn(
              "flex items-center gap-2.5 transition-opacity hover:opacity-90",
              collapsed ? "justify-center" : "overflow-hidden"
            )}
            title={collapsed ? "iValue COE Enterprise Admin" : undefined}
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
                  Enterprise Admin
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
                Administration
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
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors relative",
                      item.active
                        ? "bg-neutral-100 dark:bg-white/5 text-neutral-900 dark:text-white border-l-2 border-yellow-800 dark:border-orange-100 font-semibold"
                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-200",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        item.active
                          ? "text-neutral-900 dark:text-white"
                          : "text-neutral-400 group-hover:text-neutral-700 dark:text-neutral-500 dark:group-hover:text-neutral-300"
                      )}
                    />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="rounded px-1.5 py-0.2 text-[9px] font-mono border border-neutral-300 dark:border-white/10 text-neutral-500 dark:text-neutral-400">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* System Telemetry */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                Telemetry
              </p>
            )}
            <div className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 select-none",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate text-[11px]">{item.label}</span>
                        {item.tag && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                            <span className="size-1 rounded-full bg-emerald-500" />
                            {item.tag}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Portal Switch */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                External
              </p>
            )}
            <div className="space-y-1">
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-1.5 text-[11px] text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? "Public Website" : undefined}
              >
                <ArrowUpRight className="size-3.5 shrink-0" />
                {!collapsed && <span>Public Website</span>}
              </Link>
              <Link
                href="/dashboard/user"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-1.5 text-[11px] text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? "User Dashboard View" : undefined}
              >
                <Sparkles className="size-3.5 shrink-0 text-yellow-800 dark:text-orange-200" />
                {!collapsed && <span>User View</span>}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Profile & Sign Out Footer */}
      <div
        className={cn(
          "border-t border-neutral-200/80 dark:border-white/10 bg-neutral-100/50 dark:bg-black/40",
          collapsed ? "p-2" : "p-3"
        )}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-2 py-1">
            <div
              className="size-8 rounded-full bg-neutral-800 dark:bg-neutral-700 flex items-center justify-center text-white font-medium text-xs shrink-0 overflow-hidden border border-white/10 shadow-2xs"
              title={`${userName} (Super Admin)`}
            >
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userImage} alt={userName} className="size-full object-cover" />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign Out"
              className="flex size-7 items-center justify-center rounded text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer transition-colors"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2.5">
            <Link
              href="/dashboard/user/profile"
              className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity group"
              title="View Account Profile"
            >
              <div className="size-8 rounded-full bg-neutral-800 dark:bg-neutral-700 flex items-center justify-center text-white font-medium text-xs shrink-0 overflow-hidden border border-white/10 shadow-2xs">
                {userImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={userImage} alt={userName} className="size-full object-cover" />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
                  {userName}
                </span>
                <span className="text-[10px] text-neutral-500 truncate">
                  Super Admin
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              title="Sign Out"
              className="flex size-7 items-center justify-center rounded text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-200/60 dark:hover:bg-white/5 cursor-pointer transition-colors"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Static Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 border-r border-neutral-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0c0c0c]/98 backdrop-blur-md transition-all duration-300 z-30 sticky top-0 h-screen relative",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {sidebarContent}

        {/* Floating Expand Toggle Button on the Right Border */}
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

      {/* Mobile Slide-in Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-64 max-w-[85vw] h-full bg-white dark:bg-[#0c0c0c] border-r border-neutral-200 dark:border-white/10 z-10 shadow-xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
