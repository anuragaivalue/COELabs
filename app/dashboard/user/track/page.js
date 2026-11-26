"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Clock,
  Layers,
  Building2,
  CheckCircle2,
  AlertCircle,
  Key,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Search,
  Calendar,
  Globe,
  Loader2,
  X,
  FileText,
  ShieldCheck,
  ArrowRight,
  Info,
  Trash2,
  XCircle,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Format date nicely e.g. "26 Nov 2026"
function formatDisplayDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  } catch {}
  return dateStr;
}

// Resolve OEM logo URL
function resolveOemLogoUrl(logoFilename) {
  if (!logoFilename) return "";
  if (
    logoFilename.startsWith("http://") ||
    logoFilename.startsWith("https://") ||
    logoFilename.startsWith("/")
  ) {
    return logoFilename;
  }
  const clean = logoFilename.replace(/^\/+/, "");
  return `https://storage.googleapis.com/cdn.ivaluetv.com/oem/${clean}`;
}

export default function UserTrackMyProductPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    expired: 0,
    rejected: 0,
  });

  // Feedback notifications
  const [feedback, setFeedback] = useState(null);
  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Modal for Viewing Approved VDI & Credentials
  const [credentialsModalRequest, setCredentialsModalRequest] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Modal for Cancelling a Request (User Privilege to Reverse Decision)
  const [cancelModalReq, setCancelModalReq] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  // Fetch Requests
  const fetchUserRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/requests");
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load user requests:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/user/requests");
        const data = await res.json();
        if (active && data.success && Array.isArray(data.requests)) {
          setRequests(data.requests);
          if (data.stats) setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to load user requests:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Handle Cancel Request Execution
  const handleCancelConfirm = async () => {
    if (!cancelModalReq) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/user/requests?id=${cancelModalReq.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          "success",
          data.message || `Request #${cancelModalReq.id} has been cancelled.`
        );
        setCancelModalReq(null);
        fetchUserRequests();
      } else {
        showToast("error", data.message || "Failed to cancel request.");
      }
    } catch {
      showToast("error", "Network error cancelling your request.");
    } finally {
      setCancelling(false);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const s = (r.status || "").toLowerCase();

    // Status filter
    if (statusFilter === "requested" && s !== "requested") return false;
    if (statusFilter === "approved" && !s.includes("approved")) return false;
    if (statusFilter === "expired" && s !== "expired" && s !== "expiry")
      return false;
    if (statusFilter === "rejected" && s !== "rejected") return false;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchSolution = (r.solutionTitle || "").toLowerCase().includes(q);
      const matchOem = (r.oemName || "").toLowerCase().includes(q);
      const matchComments = (r.comments || "").toLowerCase().includes(q);
      const matchId = String(r.id).includes(q);
      return matchSolution || matchOem || matchComments || matchId;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium animate-in fade-in slide-in-from-bottom-5 transition-all duration-300",
            feedback.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-100 backdrop-blur-md"
              : "bg-rose-950/90 border-rose-500/30 text-rose-100 backdrop-blur-md"
          )}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="ml-2 hover:opacity-75 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
              <Clock className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Track My Product Requests
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/50">
              {requests.length} Requests
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Real-time tracking of your OEM evaluation requests, scheduled
            timeframes, and provisioned sandbox VDI credentials.
          </p>
        </div>

        <Link
          href="/dashboard/user/products"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold shadow-md shadow-amber-500/20 transition-all self-start md:self-auto"
        >
          <Layers className="size-3.5" />
          <span>Explore More Products</span>
        </Link>
      </div>

      {/* KPI Status Strip (Exact Admin Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter("all")}
          className={cn(
            "p-4 rounded-xl border transition-all cursor-pointer shadow-2xs backdrop-blur-sm",
            statusFilter === "all"
              ? "bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20"
              : "bg-white/70 dark:bg-[#0f0f11]/70 border-neutral-200/80 dark:border-white/10 hover:border-neutral-300"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              All Inquiries
            </span>
            <Clock className="size-3.5 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1.5">
            {stats.total}
          </p>
        </div>

        <div
          onClick={() => setStatusFilter("requested")}
          className={cn(
            "p-4 rounded-xl border transition-all cursor-pointer shadow-2xs backdrop-blur-sm",
            statusFilter === "requested"
              ? "bg-amber-500/15 border-amber-500/50 ring-1 ring-amber-500/30"
              : "bg-white/70 dark:bg-[#0f0f11]/70 border-neutral-200/80 dark:border-white/10 hover:border-neutral-300"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Pending Review
            </span>
            <AlertCircle className="size-3.5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-300 mt-1.5">
            {stats.pending}
          </p>
        </div>

        <div
          onClick={() => setStatusFilter("approved")}
          className={cn(
            "p-4 rounded-xl border transition-all cursor-pointer shadow-2xs backdrop-blur-sm",
            statusFilter === "approved"
              ? "bg-emerald-500/15 border-emerald-500/50 ring-1 ring-emerald-500/30"
              : "bg-white/70 dark:bg-[#0f0f11]/70 border-neutral-200/80 dark:border-white/10 hover:border-neutral-300"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Approved VDI Ready
            </span>
            <CheckCircle2 className="size-3.5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1.5">
            {stats.approved}
          </p>
        </div>

        <div
          onClick={() => setStatusFilter("expired")}
          className={cn(
            "p-4 rounded-xl border transition-all cursor-pointer shadow-2xs backdrop-blur-sm",
            statusFilter === "expired"
              ? "bg-neutral-500/15 border-neutral-500/50 ring-1 ring-neutral-500/30"
              : "bg-white/70 dark:bg-[#0f0f11]/70 border-neutral-200/80 dark:border-white/10 hover:border-neutral-300"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              Past Window
            </span>
            <Calendar className="size-3.5 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-700 dark:text-neutral-300 mt-1.5">
            {stats.expired}
          </p>
        </div>
      </div>

      {/* Search & Actions Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search my requests by solution title, OEM, or comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-neutral-900 dark:text-white placeholder:text-neutral-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={fetchUserRequests}
          disabled={loading}
          className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
          title="Refresh Statuses"
        >
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-neutral-400">
          <Loader2 className="size-8 animate-spin text-amber-500 mb-3" />
          <p className="text-xs">Loading request history...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 space-y-3">
          <Clock className="size-10 mx-auto text-neutral-300 dark:text-neutral-700" />
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            No product requests found
          </p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            You haven&apos;t submitted any solution access inquiries yet, or no requests
            match the selected filter.
          </p>
          <Link
            href="/dashboard/user/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold"
          >
            <Layers className="size-3.5" />
            <span>Browse OEM Products</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const statusLower = (req.status || "").toLowerCase();
            const isApproved = statusLower.includes("approved");
            const isPending = statusLower === "requested";
            const isExpired =
              statusLower === "expired" || statusLower === "expiry";
            const isRejected = statusLower === "rejected";

            return (
              <div
                key={req.id}
                className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0f0f11] p-6 shadow-2xs hover:border-amber-500/30 transition-all space-y-6"
              >
                {/* Header: OEM Logo + Title + Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-24 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                      {req.oemImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={resolveOemLogoUrl(req.oemImage)}
                          alt={req.oemName || "OEM"}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <Building2 className="size-6 text-neutral-400" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        {req.oemName || "OEM Solution"}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {req.solutionTitle || `Solution #${req.contentID}`}
                        </span>
                        <span className="mx-1.5 text-neutral-300 dark:text-neutral-700">•</span>
                        <span>Requested on {formatDisplayDate(req.requestedDate)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="size-3.5" />
                        <span>Approved VDI Ready</span>
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Clock className="size-3.5" />
                        <span>Under Review</span>
                      </span>
                    )}
                    {isExpired && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-500/10 text-neutral-500 border border-neutral-500/20">
                        <Calendar className="size-3.5" />
                        <span>Past Window</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        <AlertCircle className="size-3.5" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 2-Column Responsive Body: Left Stepper (7 cols) + Right Info Details (5 cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: 4-Step Progression Timeline */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="relative pl-7 space-y-5">
                      {/* Vertical Connecting Line */}
                      <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-neutral-200 dark:bg-neutral-800 -translate-x-1/2" />

                      {/* Step 1: Request Submitted */}
                      <div className="relative flex items-start gap-3">
                        <div className="absolute -left-7 top-0.5 size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white dark:ring-[#0f0f11] shadow-2xs">
                          <Check className="size-3.5 stroke-[3]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                            Request submitted
                          </h4>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
                            {formatDisplayDate(req.requestedDate)}
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Under Review */}
                      <div className="relative flex items-start gap-3">
                        <div
                          className={cn(
                            "absolute -left-7 top-0.5 size-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-[#0f0f11] shadow-2xs",
                            isPending
                              ? "bg-amber-500 text-black ring-amber-500/20"
                              : isApproved || isExpired
                              ? "bg-emerald-500 text-white"
                              : "bg-rose-500 text-white"
                          )}
                        >
                          {isPending ? (
                            <Search className="size-3" />
                          ) : isApproved || isExpired ? (
                            <Check className="size-3.5 stroke-[3]" />
                          ) : (
                            <AlertCircle className="size-3.5" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                            Under review
                          </h4>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                            {isPending
                              ? "Your request is waiting for an administrator to review it."
                              : isApproved || isExpired
                              ? "Administrative verification completed."
                              : "Review concluded."}
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Decision Pending */}
                      <div className="relative flex items-start gap-3">
                        <div
                          className={cn(
                            "absolute -left-7 top-0.5 size-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-[#0f0f11] shadow-2xs",
                            isPending
                              ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                              : isApproved || isExpired
                              ? "bg-emerald-500 text-white"
                              : "bg-rose-500 text-white"
                          )}
                        >
                          {isPending ? (
                            <MoreHorizontal className="size-3.5" />
                          ) : isApproved || isExpired ? (
                            <Check className="size-3.5 stroke-[3]" />
                          ) : (
                            <XCircle className="size-3.5" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                            {isPending
                              ? "Decision pending"
                              : isApproved || isExpired
                              ? "Request Approved"
                              : "Request Declined"}
                          </h4>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                            {isPending
                              ? "You will see the outcome here once it is decided."
                              : isApproved || isExpired
                              ? "Approved by administration and assigned to VDI cluster."
                              : "Access request declined by administration."}
                          </p>
                        </div>
                      </div>

                      {/* Step 4: Access Period */}
                      <div className="relative flex items-start gap-3">
                        <div
                          className={cn(
                            "absolute -left-7 top-0.5 size-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-[#0f0f11] shadow-2xs",
                            isApproved
                              ? "bg-emerald-500 text-white"
                              : isExpired
                              ? "bg-neutral-400 text-white"
                              : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400"
                          )}
                        >
                          <Key className="size-3" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                            Access period
                          </h4>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed font-mono">
                            {isApproved
                              ? `${formatDisplayDate(req.startDate)} → ${formatDisplayDate(req.endDate)} (${req.timezone || "IST"})`
                              : isExpired
                              ? `Window completed on ${formatDisplayDate(req.endDate)}`
                              : "Dates will appear once the request is approved."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Parameters & Comments Panel */}
                  <div className="lg:col-span-5 p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-white/5 space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-neutral-200/60 dark:border-white/5">
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-neutral-400 block mb-0.5">
                          Organization
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {req.organizationName || "iValue"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold uppercase text-neutral-400 block mb-0.5">
                          Country
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {req.countryName || "India"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold uppercase text-neutral-400 block mb-1">
                        Timezone
                      </span>
                      <span className="font-mono text-neutral-700 dark:text-neutral-300 block truncate text-[11px]">
                        {req.timezone || "IST (UTC+05:30)"}
                      </span>
                    </div>

                    {/* User Comments Box */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                        Your comments
                      </span>
                      <p className="text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[11px] leading-relaxed">
                        {req.comments || "No comments provided"}
                      </p>
                    </div>

                    {/* Admin Note if provided */}
                    {req.adminComment && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px]">
                        <span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                          Administrator Note:
                        </span>
                        <p className="text-neutral-700 dark:text-neutral-300">
                          {req.adminComment}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Bar: View Product + Cancel / Credentials */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 dark:border-white/5">
                  {/* View Product Button -> Redirects to requested OEM overview */}
                  <Link
                    href={`/dashboard/user/products/${req.contentID || req.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-amber-500 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-xs shadow-2xs transition-all group"
                  >
                    <Eye className="size-3.5 text-amber-500 transition-transform group-hover:scale-110" />
                    <span>View product</span>
                    <ExternalLink className="size-3 text-neutral-400 group-hover:text-amber-500 transition-colors" />
                  </Link>

                  <div className="flex items-center gap-2.5">
                    {/* User Privilege: Cancel Request Button */}
                    {(isPending || isApproved) && (
                      <button
                        type="button"
                        onClick={() => setCancelModalReq(req)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors"
                        title="Cancel this reservation"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Cancel My Request</span>
                      </button>
                    )}

                    {/* View Credentials & VDI (if approved) */}
                    {isApproved && (
                      <button
                        type="button"
                        onClick={() => setCredentialsModalRequest(req)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
                      >
                        <Key className="size-3.5" />
                        <span>View Credentials & VDI</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CANCEL REQUEST CONFIRMATION MODAL                 */}
      {/* ======================================================== */}
      {cancelModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-500/10">
                <AlertCircle className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Cancel Request
                </h3>
                <span className="text-xs text-neutral-400 font-mono">
                  Application #{cancelModalReq.id}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Are you sure you want to reverse your decision and withdraw your
              evaluation request for{" "}
              <strong className="text-neutral-900 dark:text-white">
                {cancelModalReq.solutionTitle || `Solution #${cancelModalReq.contentID}`}
              </strong>
              ? Your scheduled reservation will be cancelled immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setCancelModalReq(null)}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Keep Request
              </button>

              <button
                type="button"
                onClick={handleCancelConfirm}
                disabled={cancelling}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {cancelling ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                <span>Yes, Cancel Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: APPROVED LAB CREDENTIALS & VDI VIEWER             */}
      {/* ======================================================== */}
      {credentialsModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Key className="size-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Authorized Solution Access
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {credentialsModalRequest.solutionTitle || "Access Credentials"}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCredentialsModalRequest(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Credentials Card Display */}
            <div className="space-y-4 text-xs">
              {/* Access URL */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-0.5">
                    Access Portal / VDI Endpoint
                  </span>
                  <p className="font-mono font-medium text-neutral-900 dark:text-white truncate">
                    https://ivcoe.ivaluegroup.com/vdi/{credentialsModalRequest.id}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `https://ivcoe.ivaluegroup.com/vdi/${credentialsModalRequest.id}`,
                        "url"
                      )
                    }
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                    title="Copy URL"
                  >
                    {copiedField === "url" ? (
                      <Check className="size-4 text-emerald-500" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                  <a
                    href={`https://ivcoe.ivaluegroup.com/vdi/${credentialsModalRequest.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                    title="Open in new tab"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-0.5">
                      Username
                    </span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      {credentialsModalRequest.userEmail?.split("@")[0] ||
                        "coe-evaluator"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        credentialsModalRequest.userEmail?.split("@")[0] ||
                          "coe-evaluator",
                        "username"
                      )
                    }
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                    title="Copy Username"
                  >
                    {copiedField === "username" ? (
                      <Check className="size-4 text-emerald-500" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-0.5">
                      Temporary Access Password
                    </span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                      iValue@COE2026!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard("iValue@COE2026!", "password")
                    }
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                    title="Copy Password"
                  >
                    {copiedField === "password" ? (
                      <Check className="size-4 text-emerald-500" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-neutral-700 dark:text-neutral-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 text-xs">
                  <Info className="size-4" />
                  <span>Important Access Guidance:</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Please ensure your VDI session is initiated within your
                  scheduled window ({credentialsModalRequest.startDate} &rarr;{" "}
                  {credentialsModalRequest.endDate}). Instances are reset upon
                  evaluation window closure.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setCredentialsModalRequest(null)}
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
