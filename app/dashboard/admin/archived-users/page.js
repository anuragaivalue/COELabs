"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Search,
  Download,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Clock,
  Building,
  Globe,
  Check,
  XCircle,
  Server,
  User,
  Loader2,
  Filter,
  Database,
  Trash2,
  Archive,
  RotateCcw,
  ArrowLeft,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { oemPartners } from "@/data/oems";

/**
 * Helper to resolve OEM Logo URL with strict aspect ratio containment
 */
function resolveOemLogo(oemName, oemImage) {
  if (oemImage) {
    if (oemImage.startsWith("http") || oemImage.startsWith("/")) return oemImage;
    return `https://cdn.ivaluetv.com/oem/${oemImage}`;
  }
  const cleanName = (oemName || "").toLowerCase().trim();
  const match = oemPartners.find(
    (p) =>
      p.name.toLowerCase().trim() === cleanName ||
      cleanName.includes(p.name.toLowerCase().trim()) ||
      p.name.toLowerCase().trim().includes(cleanName)
  );
  if (match?.logo) return match.logo;
  return null;
}

/**
 * Human-readable executive date formatting
 */
function formatTimelineDates(start, end) {
  if (!start && !end) return { formattedRange: "Timeline not scheduled", durationDays: null };
  try {
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    if (s && !isNaN(s.getTime()) && e && !isNaN(e.getTime())) {
      const diffTime = Math.abs(e - s);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const sStr = s.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const eStr = e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return {
        formattedRange: `${sStr} – ${eStr}`,
        durationDays: `${diffDays} Day${diffDays > 1 ? "s" : ""}`,
      };
    }
  } catch {}
  return { formattedRange: `${start || "?"} – ${end || "?"}`, durationDays: null };
}

function formatRequestDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr.replace(" ", "T"));
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  } catch {}
  return dateStr.split(" ")[0];
}

function formatAuditDate(dateStr) {
  if (!dateStr) return "Timestamp unrecorded";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch {}
  return String(dateStr);
}

function formatTimezoneLocation(tz, country) {
  const c = country && country.toLowerCase() !== "unspecified" ? country : "";
  if (tz) {
    if (tz.includes("Chennai") || tz.includes("Kolkata") || tz.includes("Mumbai") || tz.includes("New Delhi")) {
      return "IST (UTC+05:30) • Kolkata, Mumbai, Chennai";
    }
    return tz;
  }
  if (c && c.toLowerCase() === "india") {
    return "IST (UTC+05:30) • Kolkata, Mumbai, Chennai";
  }
  return c || "Global (UTC)";
}

export default function ArchivedUsersPage() {
  const router = useRouter();

  // State
  const [archivedRequests, setArchivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [oemFilter, setOemFilter] = useState("all");
  const [availableOems, setAvailableOems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    expired: 0,
    rejected: 0,
  });

  // Modal & Action State
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Restore Modal State
  const [restoreModalReq, setRestoreModalReq] = useState(null);
  const [restoring, setRestoring] = useState(false);

  // Purge Modal State
  const [purgeModalReq, setPurgeModalReq] = useState(null);
  const [purging, setPurging] = useState(false);

  // Multi-Select Batch Action State
  const [selectedIds, setSelectedIds] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchPurgeModalOpen, setBatchPurgeModalOpen] = useState(false);

  const isSelected = (id) => selectedIds.includes(id);

  const toggleSelectOne = (id, e) => {
    e?.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  // Fetch Archived Requests
  const fetchArchived = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/archived-users?limit=all");
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setArchivedRequests(data.requests);
        if (data.stats) setStats(data.stats);
        if (Array.isArray(data.availableOems)) setAvailableOems(data.availableOems);
      } else {
        showToast("error", data.message || "Failed to fetch archived requests.");
      }
    } catch {
      showToast("error", "Network error: Failed to connect to /api/admin/archived-users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      try {
        const res = await fetch("/api/admin/archived-users?limit=all");
        const data = await res.json();
        if (!isMounted) return;
        if (data.success && Array.isArray(data.requests)) {
          setArchivedRequests(data.requests);
          if (data.stats) setStats(data.stats);
          if (Array.isArray(data.availableOems)) setAvailableOems(data.availableOems);
        }
      } catch {
        // silent fail on initial mount
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  // Restore Action
  const openRestoreConfirm = (req, e) => {
    e?.stopPropagation();
    setRestoreModalReq(req);
  };

  const handleRestoreConfirm = async () => {
    if (!restoreModalReq) return;
    setRestoring(true);
    try {
      const res = await fetch("/api/admin/archived-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: restoreModalReq.id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Application #${restoreModalReq.id} restored to Requested Users! Redirecting...`);
        setRestoreModalReq(null);
        setIsDossierOpen(false);
        fetchArchived();
        setTimeout(() => {
          router.push("/dashboard/admin/requested-users");
        }, 700);
      } else {
        showToast("error", data.message || "Failed to restore application.");
      }
    } catch {
      showToast("error", "Network error restoring application.");
    } finally {
      setRestoring(false);
    }
  };

  // Permanent Purge Action
  const openPurgeConfirm = (req, e) => {
    e?.stopPropagation();
    setPurgeModalReq(req);
  };

  const handlePurgeConfirm = async () => {
    if (!purgeModalReq) return;
    setPurging(true);
    try {
      const res = await fetch(`/api/admin/archived-users?id=${purgeModalReq.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Application #${purgeModalReq.id} permanently purged.`);
        setPurgeModalReq(null);
        setIsDossierOpen(false);
        fetchArchived();
      } else {
        showToast("error", data.message || "Failed to purge record.");
      }
    } catch {
      showToast("error", "Network error purging record.");
    } finally {
      setPurging(false);
    }
  };

  // Filtered & Paginated List
  const filteredRequests = useMemo(() => {
    let result = archivedRequests;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          String(r.id).includes(q) ||
          (r.userName || "").toLowerCase().includes(q) ||
          (r.userEmail || "").toLowerCase().includes(q) ||
          (r.organizationName || "").toLowerCase().includes(q) ||
          (r.countryName || "").toLowerCase().includes(q) ||
          (r.oemName || "").toLowerCase().includes(q) ||
          (r.solutionTitle || "").toLowerCase().includes(q) ||
          (r.comments || "").toLowerCase().includes(q) ||
          (r.deletedBy || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((r) => {
        const s = (r.status || "").toLowerCase();
        if (statusFilter === "requested") return s === "requested";
        if (statusFilter === "approved") return s.includes("approved");
        if (statusFilter === "expiry") return s === "expiry" || s === "expired";
        if (statusFilter === "rejected") return s === "rejected";
        return s === statusFilter;
      });
    }

    if (oemFilter !== "all") {
      result = result.filter((r) => (r.oemName || "").toLowerCase() === oemFilter.toLowerCase());
    }

    return result;
  }, [archivedRequests, searchQuery, statusFilter, oemFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / limit));
  const safePage = Math.min(page, totalPages);

  const paginatedRequests = useMemo(() => {
    const start = (safePage - 1) * limit;
    return filteredRequests.slice(start, start + limit);
  }, [filteredRequests, safePage, limit]);

  // Master Select All on Page
  const isAllCurrentSelected =
    paginatedRequests.length > 0 && paginatedRequests.every((r) => selectedIds.includes(r.id));

  const toggleSelectAll = () => {
    if (isAllCurrentSelected) {
      const pageIds = new Set(paginatedRequests.map((r) => r.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const pageIds = paginatedRequests.map((r) => r.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  // Batch Restore Action
  const handleBatchRestore = async () => {
    if (!selectedIds.length) return;
    setBatchLoading(true);
    try {
      const res = await fetch("/api/admin/archived-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Restored ${selectedIds.length} application(s) to Requested Users! Redirecting...`);
        clearSelection();
        fetchArchived();
        setTimeout(() => {
          router.push("/dashboard/admin/requested-users");
        }, 700);
      } else {
        showToast("error", data.message || "Failed to batch restore applications.");
      }
    } catch {
      showToast("error", "Network error during batch restore.");
    } finally {
      setBatchLoading(false);
    }
  };

  // Batch Purge Action
  const handleBatchPurgeConfirm = async () => {
    if (!selectedIds.length) return;
    setBatchLoading(true);
    try {
      const res = await fetch("/api/admin/archived-users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Permanently purged ${selectedIds.length} record(s) from archive.`);
        setBatchPurgeModalOpen(false);
        clearSelection();
        fetchArchived();
      } else {
        showToast("error", data.message || "Failed to batch purge records.");
      }
    } catch {
      showToast("error", "Network error during batch purge.");
    } finally {
      setBatchLoading(false);
    }
  };

  const openDossier = (req) => {
    setSelectedRequest(req);
    setIsDossierOpen(true);
  };

  const renderStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "requested") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300">
          <span className="size-1.5 rounded-full bg-amber-500" />
          <span>Pending Review</span>
        </span>
      );
    }
    if (s.includes("approved")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Approved (VDI Active)</span>
        </span>
      );
    }
    if (s === "expiry" || s === "expired") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-neutral-300 dark:border-white/15 bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400">
          <Clock className="size-3 text-neutral-400" />
          <span>Expired Session</span>
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400">
          <XCircle className="size-3.5 text-rose-500" />
          <span>Declined</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-neutral-300 dark:border-white/10 text-neutral-600 dark:text-neutral-400">
        {status}
      </span>
    );
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || oemFilter !== "all";

  // CSV Export
  const exportToCSV = () => {
    if (!filteredRequests.length) {
      showToast("error", "No archived requests to export.");
      return;
    }

    const headers = [
      "ID",
      "User Name",
      "User Email",
      "Organization",
      "Country",
      "Timezone",
      "Requested OEM",
      "Solution Title",
      "Original Status",
      "Archived At",
      "Archived By",
    ];

    const rows = filteredRequests.map((r) => [
      r.id,
      `"${(r.userName || "").replace(/"/g, '""')}"`,
      `"${(r.userEmail || "").replace(/"/g, '""')}"`,
      `"${(r.organizationName || "").replace(/"/g, '""')}"`,
      `"${(r.countryName || "").replace(/"/g, '""')}"`,
      `"${(r.timezone || "").replace(/"/g, '""')}"`,
      `"${(r.oemName || "").replace(/"/g, '""')}"`,
      `"${(r.solutionTitle || "").replace(/"/g, '""')}"`,
      `"${(r.status || "").replace(/"/g, '""')}"`,
      `"${(r.deletedAt || "").replace(/"/g, '""')}"`,
      `"${(r.deletedBy || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ivaluecoe_archived_requests_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("success", "Exported archived requests to CSV.");
  };

  return (
    <div className="space-y-6 pb-36 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg px-4 py-3 border text-xs font-medium backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200",
            feedback.type === "success"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-700 dark:border-white"
              : "bg-red-950 text-red-200 border-red-800"
          )}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="size-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="ml-2 rounded p-0.5 hover:opacity-70 transition-opacity"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-500">
                Archive Vault &amp; Audit
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-mono border border-neutral-200 dark:border-white/10 text-neutral-500">
                <Database className="size-2.5" />
                ivaluecoe.deletedrequesteduser
              </span>
            </div>

            <h1 className="text-2xl font-medium tracking-tight text-neutral-900 dark:text-white font-sans">
              Archived <span className="font-montserrat font-medium tracking-tight capitalize text-yellow-800 dark:text-orange-100">access requests</span>
            </h1>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              Historical laboratory inquiries moved to archive. Any archived request can be restored back to active review with all original fields preserved.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/dashboard/admin/requested-users"
              className="rounded-none rounded-tl-lg rounded-br-lg border border-neutral-300 dark:border-white/15 bg-transparent px-3.5 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="size-3 text-neutral-400" />
              <span>Active Requests</span>
            </Link>

            <button
              type="button"
              onClick={exportToCSV}
              className="rounded-none rounded-tl-lg rounded-br-lg border border-neutral-300 dark:border-white/15 bg-transparent px-3.5 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="size-3" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={fetchArchived}
              disabled={loading}
              className="rounded-none rounded-tl-lg rounded-br-lg border border-neutral-300 dark:border-white/15 bg-transparent px-3.5 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={cn("size-3", loading && "animate-spin text-neutral-400")} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total In Vault</span>
            <Archive className="size-3.5 text-neutral-400" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.total}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Archived submissions</p>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">Originally Pending</span>
            <Clock className="size-3.5 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.pending}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Archived while pending</p>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Originally Approved</span>
            <CheckCircle2 className="size-3.5 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.approved}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Had active VDI</p>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Restore Readiness</span>
            <RotateCcw className="size-3.5 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-emerald-700 dark:text-emerald-400 font-montserrat">
            100%
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Full schema restorable</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur-sm overflow-hidden">
        {/* Search & Tag Bar */}
        <div className="p-4 border-b border-neutral-200/80 dark:border-white/10 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search archived by user, email, OEM, or admin who deleted..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-neutral-200 dark:border-white/10 bg-white dark:bg-black/40 pl-8 pr-8 py-1.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-white/25 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-white/5 rounded-md px-2.5 py-1 border border-neutral-200 dark:border-white/10">
                <Server className="size-3 text-neutral-400" />
                <span className="text-[10px] font-mono uppercase text-neutral-500">OEM:</span>
                <select
                  value={oemFilter}
                  onChange={(e) => {
                    setOemFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="dark:bg-neutral-900">All Partners</option>
                  {availableOems.map((oem) => (
                    <option key={oem} value={oem} className="dark:bg-neutral-900">
                      {oem}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-white/5 rounded-md px-2.5 py-1 border border-neutral-200 dark:border-white/10">
                <span className="text-[10px] font-mono uppercase text-neutral-500">Rows:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-transparent text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
                >
                  <option value={5} className="dark:bg-neutral-900">5</option>
                  <option value={10} className="dark:bg-neutral-900">10</option>
                  <option value={25} className="dark:bg-neutral-900">25</option>
                  <option value={50} className="dark:bg-neutral-900">50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Filter Tag Suggestions & Active Tag Chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-neutral-200/50 dark:border-white/5">
            <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
              Quick Tags:
            </span>

            {availableOems.slice(0, 4).map((oem) => (
              <button
                key={oem}
                type="button"
                onClick={() => {
                  setOemFilter(oem);
                  setPage(1);
                }}
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] rounded-full px-2.5 py-0.5 border transition cursor-pointer",
                  oemFilter.toLowerCase() === oem.toLowerCase()
                    ? "border-neutral-800 bg-neutral-800 text-white dark:border-white dark:bg-white dark:text-black font-semibold"
                    : "border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                <span>{oem}</span>
              </button>
            ))}

            {/* Active Tag Chips (Dismissible) */}
            {hasActiveFilters && (
              <div className="ml-auto flex items-center gap-1.5">
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
                    Status: {statusFilter}
                    <button
                      type="button"
                      onClick={() => setStatusFilter("all")}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                )}
                {oemFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
                    OEM: {oemFilter}
                    <button
                      type="button"
                      onClick={() => setOemFilter("all")}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
                    &quot;{searchQuery}&quot;
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setOemFilter("all");
                    setPage(1);
                  }}
                  className="text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline cursor-pointer"
                >
                  Reset all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-white/10 bg-neutral-100/50 dark:bg-white/[0.02] text-[10px] font-mono uppercase text-neutral-500">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllCurrentSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all on this page"
                    className="size-3.5 rounded border-neutral-300 dark:border-white/20 accent-neutral-900 dark:accent-white cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Requester</th>
                <th className="py-3 px-4 font-semibold">OEM &amp; Solution</th>
                <th className="py-3 px-4 font-semibold">Timeline &amp; Location</th>
                <th className="py-3 px-4 font-semibold">Archived Audit</th>
                <th className="py-3 px-4 font-semibold">Original Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 dark:divide-white/5 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    <Loader2 className="size-5 animate-spin text-neutral-400 mx-auto mb-1.5" />
                    <span className="text-xs">Loading archived submissions...</span>
                  </td>
                </tr>
              ) : paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    <Archive className="size-6 text-neutral-400 mx-auto mb-2 opacity-50" />
                    <p className="font-medium text-neutral-800 dark:text-neutral-200 text-xs">No archived submissions found</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      When applications are deleted from Requested Users, they appear here safely restorable.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => {
                  const initial = (req.userName || req.userEmail || "U").charAt(0).toUpperCase();
                  const oemLogo = resolveOemLogo(req.oemName, req.oemImage);
                  const timeline = formatTimelineDates(req.startDate, req.endDate);
                  const tzLocation = formatTimezoneLocation(req.timezone, req.countryName);
                  const auditTime = formatAuditDate(req.deletedAt);

                  return (
                    <tr
                      key={req.id}
                      onClick={() => openDossier(req)}
                      className={cn(
                        "transition-colors cursor-pointer group",
                        isSelected(req.id)
                          ? "bg-amber-500/[0.08] dark:bg-amber-400/[0.08]"
                          : "hover:bg-neutral-500/[0.03] dark:hover:bg-white/[0.02]"
                      )}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected(req.id)}
                          onChange={(e) => toggleSelectOne(req.id, e)}
                          aria-label={`Select archived request #${req.id}`}
                          className="size-3.5 rounded border-neutral-300 dark:border-white/20 accent-neutral-900 dark:accent-white cursor-pointer"
                        />
                      </td>

                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-400">
                        #{req.id}
                      </td>

                      {/* Requester Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full bg-neutral-800 dark:bg-neutral-700 flex items-center justify-center text-white font-medium text-xs border border-white/10 shrink-0">
                            <span>{initial}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-neutral-900 dark:text-white truncate">
                              {req.userName || "Unnamed User"}
                            </span>
                            <span className="text-[11px] text-neutral-500 truncate">
                              {req.userEmail}
                            </span>
                            {req.organizationName && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-neutral-600 dark:text-neutral-400 font-mono mt-0.5 truncate">
                                <Building className="size-2.5 shrink-0 text-neutral-400" />
                                {req.organizationName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* OEM & Solution in Natural Aspect Ratio */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-24 shrink-0 items-center justify-center rounded-md border border-neutral-200/90 bg-white p-1.5 shadow-2xs dark:border-white/10 dark:bg-white">
                            {oemLogo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={oemLogo}
                                alt={req.oemName || "OEM"}
                                className="max-h-6 max-w-full object-contain select-none"
                              />
                            ) : (
                              <span className="font-montserrat text-xs font-bold text-neutral-800">
                                {req.oemName || "OEM"}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col min-w-0 max-w-[200px]">
                            <span className="font-semibold text-xs text-neutral-900 dark:text-white truncate" title={req.solutionTitle}>
                              {req.solutionTitle || "Solution Evaluation"}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono truncate">
                              {req.oemName || "Partner"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Timeline & Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 max-w-[240px]">
                          <div className="flex items-center gap-1.5 text-xs text-neutral-900 dark:text-neutral-100 font-medium">
                            <Calendar className="size-3 text-neutral-400 shrink-0" />
                            <span className="truncate">{timeline.formattedRange}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono truncate" title={tzLocation}>
                            <Globe className="size-2.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{tzLocation}</span>
                          </div>
                        </div>
                      </td>

                      {/* Archived Audit */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-700 dark:text-neutral-300 font-mono">
                            <Clock className="size-2.5 text-neutral-400 shrink-0" />
                            <span>{auditTime}</span>
                          </div>
                          {req.deletedBy && (
                            <span className="text-[10px] text-neutral-500 font-mono truncate max-w-[180px]" title={req.deletedBy}>
                              by {req.deletedBy}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Original Status */}
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(req.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => openRestoreConfirm(req, e)}
                            title="Restore application to Requested Users"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-medium transition cursor-pointer"
                          >
                            <RotateCcw className="size-3" />
                            <span>Restore</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openDossier(req)}
                            title="Inspect archived dossier"
                            className="p-1.5 rounded border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition cursor-pointer"
                          >
                            <Eye className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => openPurgeConfirm(req, e)}
                            title="Permanently purge record"
                            className="p-1.5 rounded border border-neutral-200 dark:border-white/10 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-neutral-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div>
            Showing <span className="font-mono text-neutral-900 dark:text-white">{filteredRequests.length === 0 ? 0 : (safePage - 1) * limit + 1}</span> to{" "}
            <span className="font-mono text-neutral-900 dark:text-white">{Math.min(safePage * limit, filteredRequests.length)}</span> of{" "}
            <span className="font-mono text-neutral-900 dark:text-white">{filteredRequests.length}</span> archived submissions
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={safePage <= 1}
              className="p-1 rounded border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronsLeft className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1 rounded border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="size-3.5" />
            </button>

            <span className="px-2 font-mono text-neutral-900 dark:text-white">
              {safePage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1 rounded border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={safePage >= totalPages}
              className="p-1 rounded border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronsRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Archived Dossier Modal */}
      {isDossierOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto custom-gold-scrollbar rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#121212] p-6 shadow-xl animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                  Archived Application #{selectedRequest.id}
                </h3>
                {renderStatusBadge(selectedRequest.status)}
              </div>
              <button
                type="button"
                onClick={() => setIsDossierOpen(false)}
                className="rounded p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-4 text-xs">
              {/* Archive Meta */}
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Archive Audit Log
                </div>
                <div className="text-xs text-neutral-800 dark:text-neutral-200">
                  Archived on <span className="font-semibold">{formatAuditDate(selectedRequest.deletedAt)}</span>
                  {selectedRequest.deletedBy && (
                    <span> by <code className="font-mono text-[11px] text-amber-700 dark:text-amber-300">{selectedRequest.deletedBy}</code></span>
                  )}
                </div>
              </div>

              {/* Requester Info */}
              <div className="rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50/70 dark:bg-white/[0.02] p-3 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  Applicant Profile
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-mono">FULL NAME</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">{selectedRequest.userName || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-mono">EMAIL</span>
                    <span className="font-mono text-neutral-900 dark:text-white">{selectedRequest.userEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-mono">ORGANIZATION</span>
                    <span className="text-neutral-900 dark:text-white">{selectedRequest.organizationName || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-mono">TIMEZONE / LOCATION</span>
                    <span className="text-neutral-900 dark:text-white font-mono text-[11px]">
                      {formatTimezoneLocation(selectedRequest.timezone, selectedRequest.countryName)}
                    </span>
                  </div>
                </div>
              </div>

              {/* OEM Details Card */}
              <div className="rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50/70 dark:bg-white/[0.02] p-3 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  Requested Technology
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-28 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white p-2 shadow-2xs">
                    {resolveOemLogo(selectedRequest.oemName, selectedRequest.oemImage) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveOemLogo(selectedRequest.oemName, selectedRequest.oemImage)}
                        alt={selectedRequest.oemName}
                        className="max-h-7 max-w-full object-contain"
                      />
                    ) : (
                      <span className="font-montserrat text-xs font-bold text-neutral-800">
                        {selectedRequest.oemName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-xs text-neutral-900 dark:text-white">
                      {selectedRequest.solutionTitle || "Solution Lab"}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Partner: {selectedRequest.oemName} • Content ID: #{selectedRequest.contentID}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Justification */}
              <div className="rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50/70 dark:bg-white/[0.02] p-3 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  Applicant Business Justification
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap bg-white dark:bg-black/30 p-2.5 rounded border border-neutral-200/60 dark:border-white/5">
                  {selectedRequest.comments || "No comments provided."}
                </p>
              </div>

              {/* Admin Note */}
              {selectedRequest.adminComment && (
                <div className="rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50/70 dark:bg-white/[0.02] p-3 space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    Administrator Comment
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap bg-white dark:bg-black/30 p-2.5 rounded border border-neutral-200/60 dark:border-white/5">
                    {selectedRequest.adminComment}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-3 flex items-center justify-between border-t border-neutral-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsDossierOpen(false);
                  openPurgeConfirm(selectedRequest);
                }}
                className="rounded px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 border border-rose-500/25 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="size-3" />
                <span>Permanently Purge</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDossierOpen(false)}
                  className="rounded px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDossierOpen(false);
                    openRestoreConfirm(selectedRequest);
                  }}
                  className="rounded-none rounded-tr-lg rounded-bl-lg bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Restore Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {restoreModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#121212] p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <RotateCcw className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                  Restore Access Request?
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Application #{restoreModalReq.id} • {restoreModalReq.userName || restoreModalReq.userEmail}
                </p>
              </div>
            </div>

            <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-white/[0.02] p-3 rounded-lg border border-neutral-200/60 dark:border-white/5 space-y-1.5">
              <p>
                This request will be moved back to <span className="font-semibold text-neutral-900 dark:text-white">Requested Users</span> (<code className="font-mono text-[10px] text-emerald-700 dark:text-emerald-300">ivaluecoe.requesteduserlist</code>).
              </p>
              <p className="text-[11px] text-neutral-500">
                ✓ All original dates, OEM parameters, comments, and VDI credentials are fully restored.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setRestoreModalReq(null)}
                disabled={restoring}
                className="rounded px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRestoreConfirm}
                disabled={restoring}
                className="rounded-none rounded-tr-lg rounded-bl-lg bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {restoring ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>Restoring...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="size-3" />
                    <span>Confirm Restore</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Purge Confirmation Modal */}
      {purgeModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-xl border border-rose-500/30 dark:border-rose-500/20 bg-white dark:bg-[#121212] p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                  Permanently Purge Record?
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Application #{purgeModalReq.id} • {purgeModalReq.userName || purgeModalReq.userEmail}
                </p>
              </div>
            </div>

            <div className="text-xs text-rose-700 dark:text-rose-300 bg-rose-500/5 p-3 rounded-lg border border-rose-500/20 space-y-1">
              <p className="font-semibold">
                ⚠️ Warning: This action cannot be undone.
              </p>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                This record will be permanently deleted from <code className="font-mono text-[10px]">deletedrequesteduser</code> and cannot be recovered.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPurgeModalReq(null)}
                disabled={purging}
                className="rounded px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePurgeConfirm}
                disabled={purging}
                className="rounded-none rounded-tr-lg rounded-bl-lg bg-red-700 hover:bg-red-800 text-white inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {purging ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>Purging...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3" />
                    <span>Purge Forever</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Executive Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-neutral-700/80 bg-[#121212]/95 dark:bg-[#121212]/95 text-white shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 max-w-[95vw] overflow-x-auto custom-gold-scrollbar ring-1 ring-white/10">
          <div className="flex items-center gap-2 pl-1 pr-2.5 border-r border-white/15 shrink-0">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white">
              {selectedIds.length}
            </span>
            <span className="text-xs text-neutral-300 hidden sm:inline">
              selected
            </span>
            <button
              type="button"
              onClick={clearSelection}
              className="text-[11px] text-neutral-400 hover:text-white underline ml-1 cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Batch Restore Button */}
            <button
              type="button"
              onClick={handleBatchRestore}
              disabled={batchLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 transition cursor-pointer disabled:opacity-50"
            >
              {batchLoading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <RotateCcw className="size-3.5 text-emerald-400" />
              )}
              <span>Restore Selected ({selectedIds.length})</span>
            </button>

            {/* Batch Delete (Purge) Button */}
            <button
              type="button"
              onClick={() => setBatchPurgeModalOpen(true)}
              disabled={batchLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-rose-500/40 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 transition cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="size-3.5 text-rose-400" />
              <span>Delete Permanently ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Batch Purge Confirmation Modal */}
      {batchPurgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-xl border border-rose-500/30 dark:border-rose-500/20 bg-white dark:bg-[#121212] p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                  Permanently Purge {selectedIds.length} Records?
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Batch deleting {selectedIds.length} archived record(s) forever
                </p>
              </div>
            </div>

            <div className="text-xs text-rose-700 dark:text-rose-300 bg-rose-500/5 p-3 rounded-lg border border-rose-500/20 space-y-1">
              <p className="font-semibold">
                ⚠️ Warning: This action cannot be undone.
              </p>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                These {selectedIds.length} records will be permanently erased from <code className="font-mono text-[10px]">deletedrequesteduser</code>.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setBatchPurgeModalOpen(false)}
                disabled={batchLoading}
                className="rounded px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBatchPurgeConfirm}
                disabled={batchLoading}
                className="rounded-none rounded-tr-lg rounded-bl-lg bg-red-700 hover:bg-red-800 text-white inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {batchLoading ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>Purging...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3" />
                    <span>Purge {selectedIds.length} Forever</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
