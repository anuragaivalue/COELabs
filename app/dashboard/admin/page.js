"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Shield,
  Users,
  RefreshCw,
  Database,
  ArrowUpRight,
  Lock,
  Loader2,
  Globe,
  Sparkles,
  Server,
  ClipboardList
} from "lucide-react";

export default function AdminDashboardOverview() {
  const { data: session, status } = useSession();

  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    regularUsers: 0,
    googleCount: 0,
    msCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users?limit=all");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function loadInitialStats() {
      try {
        const res = await fetch("/api/admin/users?limit=all");
        const data = await res.json();
        if (active && data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to load initial stats:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (status === "authenticated") {
      loadInitialStats();
    }
    return () => {
      active = false;
    };
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  const currentUser = session?.user || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Section (ChaiUI Restrained Card) */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-6 sm:p-8 backdrop-blur-sm transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-100/60 dark:bg-white/5 px-3 py-1 text-xs text-neutral-700 dark:text-neutral-300">
              <Lock className="size-3 text-neutral-500" />
              <span>Restricted administrator environment</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900 dark:text-white">
              Administrator <span className="font-montserrat font-medium tracking-tight capitalize text-yellow-800 dark:text-orange-100">control centre</span>
            </h1>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Signed in as <span className="font-medium text-neutral-900 dark:text-white">{currentUser.name || currentUser.email}</span>. Configure permissions, review lab access requests, and manage authentication across the COE platform.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* ChaiUI Secondary Button with asymmetric corners */}
            <button
              type="button"
              onClick={fetchStats}
              disabled={loading}
              className="rounded-none rounded-tl-lg rounded-br-lg border border-neutral-300 dark:border-white/15 bg-transparent px-4 py-2 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-neutral-400" : ""}`} />
              <span>Refresh</span>
            </button>

            {/* ChaiUI Signature Asymmetric Button */}
            <Link
              href="/dashboard/admin/userlist"
              className="rounded-none rounded-tr-lg rounded-bl-lg bg-neutral-900 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 transition-colors"
            >
              <span>Manage users</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/admin/userlist"
          className="group rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-5 backdrop-blur-sm hover:border-neutral-300 dark:hover:border-white/20 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-mono tracking-wider uppercase">Userlist</span>
            <Users className="size-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.total}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>Database accounts</span>
            <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
        </Link>

        <Link
          href="/dashboard/admin/userlist?role=admin"
          className="group rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-5 backdrop-blur-sm hover:border-neutral-300 dark:hover:border-white/20 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-mono tracking-wider uppercase">Admins</span>
            <Shield className="size-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.admins}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>Privileged roles</span>
            <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
        </Link>

        <Link
          href="/dashboard/admin/requested-users"
          className="group rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-5 backdrop-blur-sm hover:border-neutral-300 dark:hover:border-white/20 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-mono tracking-wider uppercase">Lab requests</span>
            <ClipboardList className="size-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-medium text-neutral-900 dark:text-white font-montserrat">
            21
          </p>
          <p className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>OEM evaluations</span>
            <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
        </Link>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-mono tracking-wider uppercase">SSO Split</span>
            <Globe className="size-4 text-neutral-400" />
          </div>
          <div className="flex items-center gap-2 pt-1 font-montserrat">
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {stats.googleCount} Google
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {stats.msCount} MS
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Bifurcated sign-in</p>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Userlist Deep Link */}
        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-6 backdrop-blur-sm flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-500">
              Directory
            </span>
            <h2 className="text-lg font-medium text-neutral-900 dark:text-white font-montserrat">
              Userlist <span className="text-yellow-800 dark:text-orange-100 font-normal">management</span>
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Maintain accounts in the MySQL <code className="font-mono text-neutral-900 dark:text-neutral-200">userlist</code> table. Create accounts, update details, switch userType between <code className="font-mono">&apos;user&apos;</code> and <code className="font-mono">&apos;admin&apos;</code>, or manage access expiry.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200/80 dark:border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-500">/dashboard/admin/userlist</span>
            <Link
              href="/dashboard/admin/userlist"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white hover:underline"
            >
              <span>Open userlist</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Requested Users Deep Link */}
        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-6 backdrop-blur-sm flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-500">
              Approvals
            </span>
            <h2 className="text-lg font-medium text-neutral-900 dark:text-white font-montserrat">
              Requested <span className="text-yellow-800 dark:text-orange-100 font-normal">lab access</span>
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Evaluate and process user submissions in <code className="font-mono text-neutral-900 dark:text-neutral-200">requesteduserlist</code>. Review OEM requirements, configure timeline access, and issue VDI credentials.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200/80 dark:border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-500">/dashboard/admin/requested-users</span>
            <Link
              href="/dashboard/admin/requested-users"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white hover:underline"
            >
              <span>Review requests</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
