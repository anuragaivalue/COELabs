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
  Key,
  Check,
  XCircle,
  Server,
  User,
  Loader2,
  ArrowUpRight,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Filter,
  Database,
  Trash2,
  Archive,
  RotateCcw
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
  } catch { }
  return { formattedRange: `${start || "?"} – ${end || "?"}`, durationDays: null };
}

function formatRequestDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr.replace(" ", "T"));
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  } catch { }
  return dateStr.split(" ")[0];
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

export default function RequestedUsersPage() {
  const router = useRouter();

  // State
  const [requests, setRequests] = useState([]);
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

  // Modal & Dossier State
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Archive / Soft Delete State
  const [archiveModalReq, setArchiveModalReq] = useState(null);
  const [archiving, setArchiving] = useState(false);

  // Multi-Select Batch Action State
  const [selectedIds, setSelectedIds] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchArchiveModalOpen, setBatchArchiveModalOpen] = useState(false);

  const isSelected = (id) => selectedIds.includes(id);

  const toggleSelectOne = (id, e) => {
    e?.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  // Edit fields within Dossier
  const [editStatus, setEditStatus] = useState("");
  const [editAdminComment, setEditAdminComment] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editAccessKeys, setEditAccessKeys] = useState("");

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  const openArchiveConfirm = (req, e) => {
    e?.stopPropagation();
    setArchiveModalReq(req);
  };

  const handleArchiveConfirm = async () => {
    if (!archiveModalReq) return;
    setArchiving(true);
    try {
      const res = await fetch(`/api/admin/requested-users?id=${archiveModalReq.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Application #${archiveModalReq.id} moved to Archived Users. Redirecting...`);
        setArchiveModalReq(null);
        setIsDossierOpen(false);
        fetchRequests();
        setTimeout(() => {
          router.push("/dashboard/admin/archived-users");
        }, 700);
      } else {
        showToast("error", data.message || "Failed to archive request.");
      }
    } catch {
      showToast("error", "Network error archiving request.");
    } finally {
      setArchiving(false);
    }
  };

  // Fetch Requests
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/requested-users?limit=all");
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
        if (data.stats) setStats(data.stats);
        if (Array.isArray(data.availableOems)) setAvailableOems(data.availableOems);
      } else {
        showToast("error", data.message || "Failed to fetch user requests.");
      }
    } catch {
      showToast("error", "Network error: Failed to connect to /api/admin/requested-users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/requested-users?limit=all");
        const data = await res.json();
        if (active && data.success && Array.isArray(data.requests)) {
          setRequests(data.requests);
          if (data.stats) setStats(data.stats);
          if (Array.isArray(data.availableOems)) setAvailableOems(data.availableOems);
        }
      } catch {
        // Handled on manual fetch
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    let result = [...requests];

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
          (r.comments || "").toLowerCase().includes(q)
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
  }, [requests, searchQuery, statusFilter, oemFilter]);

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

  // Batch Approve Action
  const handleBatchApprove = async () => {
    if (!selectedIds.length) return;
    setBatchLoading(true);
    try {
      const res = await fetch("/api/admin/requested-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          status: "Approved with VDI",
          adminComment: "Batch approved with VDI credentials by Administrator.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Approved ${selectedIds.length} access request(s) with VDI.`);
        clearSelection();
        fetchRequests();
      } else {
        showToast("error", data.message || "Failed to batch approve requests.");
      }
    } catch {
      showToast("error", "Network error during batch approval.");
    } finally {
      setBatchLoading(false);
    }
  };

  // Batch Reject Action
  const handleBatchReject = async () => {
    if (!selectedIds.length) return;
    setBatchLoading(true);
    try {
      const res = await fetch("/api/admin/requested-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          status: "Rejected",
          adminComment: "Declined by Administrator.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Marked ${selectedIds.length} request(s) as Rejected.`);
        clearSelection();
        fetchRequests();
      } else {
        showToast("error", data.message || "Failed to batch reject requests.");
      }
    } catch {
      showToast("error", "Network error during batch reject.");
    } finally {
      setBatchLoading(false);
    }
  };

  // Batch Expiry Action
  const handleBatchExpire = async () => {
    if (!selectedIds.length) return;
    setBatchLoading(true);
    try {
      const res = await fetch("/api/admin/requested-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          status: "Expiry",
          adminComment: "Access timeline concluded (Expired session).",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Marked ${selectedIds.length} request(s) as Expired.`);
        clearSelection();
        fetchRequests();
      } else {
        showToast("error", data.message || "Failed to batch expire requests.");
      }
    } catch {
      showToast("error", "Network error during batch expiry.");
    } finally {
      setBatchLoading(false);
    }
  };

  // Batch Archive Action
  const handleBatchArchiveConfirm = async () => {
    if (!selectedIds.length) return;
    setBatchLoading(true);
    try {
      const res = await fetch("/api/admin/requested-users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Moved ${selectedIds.length} request(s) to Archived Users. Redirecting...`);
        setBatchArchiveModalOpen(false);
        clearSelection();
        fetchRequests();
        setTimeout(() => {
          router.push("/dashboard/admin/archived-users");
        }, 700);
      } else {
        showToast("error", data.message || "Failed to batch archive requests.");
      }
    } catch {
      showToast("error", "Network error during batch archive.");
    } finally {
      setBatchLoading(false);
    }
  };

  // Open Dossier Drawer/Modal
  const openDossier = (req) => {
    setSelectedRequest(req);
    setEditStatus(req.status || "Requested");
    setEditAdminComment(req.adminComment || "");
    setEditStartDate(req.startDate || "");
    setEditEndDate(req.endDate || "");
    setEditAccessKeys(req.userAccessKeys || "");
    setIsDossierOpen(true);
  };

  // Quick Action: Approve
  const handleQuickApprove = async (req, e) => {
    e?.stopPropagation();
    try {
      const res = await fetch("/api/admin/requested-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: req.id,
          status: "Approved with VDI",
          adminComment: req.adminComment || "Approved with VDI access. Please follow instructions.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Request #${req.id} for "${req.userName}" approved.`);
        fetchRequests();
      } else {
        showToast("error", data.message || "Failed to approve request.");
      }
    } catch {
      showToast("error", "Network error updating request status.");
    }
  };

  // Quick Action: Reject
  const handleQuickReject = async (req, e) => {
    e?.stopPropagation();
    try {
      const res = await fetch("/api/admin/requested-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: req.id,
          status: "Rejected",
          adminComment: req.adminComment || "Request could not be approved at this time.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Request #${req.id} marked as Declined.`);
        fetchRequests();
      } else {
        showToast("error", data.message || "Failed to decline request.");
      }
    } catch {
      showToast("error", "Network error updating request status.");
    }
  };

  // Save changes from Dossier
  const handleSaveDossier = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/requested-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedRequest.id,
          status: editStatus,
          adminComment: editAdminComment,
          startDate: editStartDate,
          endDate: editEndDate,
          userAccessKeys: editAccessKeys,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Request #${selectedRequest.id} successfully updated.`);
        setIsDossierOpen(false);
        fetchRequests();
      } else {
        showToast("error", data.message || "Failed to update request.");
      }
    } catch {
      showToast("error", "Network error updating request.");
    } finally {
      setSubmitting(false);
    }
  };

  // Pre-set Quick Comments
  const insertQuickComment = (text) => {
    setEditAdminComment((prev) => (prev ? `${prev}\n${text}` : text));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setOemFilter("all");
    setPage(1);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!filteredRequests.length) {
      showToast("error", "No requests to export.");
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
      "Requested Date",
      "Start Date",
      "End Date",
      "Status",
      "User Comments",
      "Admin Comment",
      "Access Keys",
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
      `"${(r.requestedDate || "").replace(/"/g, '""')}"`,
      `"${(r.startDate || "").replace(/"/g, '""')}"`,
      `"${(r.endDate || "").replace(/"/g, '""')}"`,
      `"${(r.status || "").replace(/"/g, '""')}"`,
      `"${(r.comments || "").replace(/"/g, '""')}"`,
      `"${(r.adminComment || "").replace(/"/g, '""')}"`,
      `"${(r.userAccessKeys || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ivaluecoe_requested_users_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("success", "Exported requested users list to CSV.");
  };

  // Realistic Enterprise SaaS Status Pill
  const renderStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "requested") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300">
          <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Pending Review</span>
        </span>
      );
    }
    if (s.includes("approved")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Approved</span>
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
            <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="size-4 shrink-0 text-red-400" />
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

      {/* Header Banner (ChaiUI Restrained Corporate Card) */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-500">
                Approvals &amp; Evaluation
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-mono border border-neutral-200 dark:border-white/10 text-neutral-500">
                <Database className="size-2.5" />
                ivaluecoe.requesteduserlist
              </span>
            </div>

            <h1 className="text-2xl font-medium tracking-tight text-neutral-900 dark:text-white font-sans">
              Laboratory <span className="font-montserrat font-medium tracking-tight capitalize text-yellow-800 dark:text-orange-100">access requests</span>
            </h1>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              Inspect user applications, review requested OEM solutions with official brand verification, and approve VDI lab credentials.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/dashboard/admin/archived-users"
              className="rounded-none rounded-tl-lg rounded-br-lg border border-neutral-300 dark:border-white/15 bg-transparent px-3.5 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Archive className="size-3 text-neutral-400" />
              <span>Archived Users</span>
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
              onClick={fetchRequests}
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
            <span className="text-[10px] font-mono uppercase tracking-wider">Total Inquiries</span>
            <ClipboardList className="size-3.5 text-neutral-400" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.total}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Historical submissions</p>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-yellow-800 dark:text-orange-100">Action Required</span>
            <Clock className="size-3.5 text-yellow-800 dark:text-orange-200" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.pending}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Awaiting decision</p>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Active Environments</span>
            <CheckCircle2 className="size-3.5 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.approved}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">VDI provisioned</p>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Concluded</span>
            <Clock className="size-3.5 text-neutral-400" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.expired}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Past access timeline</p>
        </div>
      </div>

      {/* Interactive Status Segmented Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-gold-scrollbar">
        {[
          { key: "all", label: "All Inquiries", count: stats.total },
          { key: "requested", label: "Pending Review", count: stats.pending, alert: stats.pending > 0 },
          { key: "approved", label: "Approved with VDI", count: stats.approved },
          { key: "expiry", label: "Expired", count: stats.expired },
          { key: "rejected", label: "Declined", count: stats.rejected },
        ].map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setStatusFilter(tab.key);
                setPage(1);
              }}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0 border",
                isActive
                  ? "border-neutral-900 dark:border-white/20 bg-neutral-900 text-white dark:bg-white/10 dark:text-white font-semibold"
                  : "border-neutral-200 dark:border-white/10 bg-white dark:bg-black/30 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "font-mono text-[10px] px-1.5 py-0.2 rounded",
                  isActive
                    ? "bg-white/20 text-white"
                    : tab.alert
                      ? "bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold"
                      : "bg-neutral-100 dark:bg-white/5 text-neutral-500"
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
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
                placeholder="Search by user, email, organization, OEM, or country..."
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

            {/* Quick Suggestions */}
            <button
              type="button"
              onClick={() => {
                setStatusFilter("requested");
                setPage(1);
              }}
              className="inline-flex items-center gap-1 text-[11px] rounded-full px-2.5 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
            >
              <span>⚡ Pending Action</span>
              <span className="font-mono text-[9px] font-bold">({stats.pending})</span>
            </button>

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

            <button
              type="button"
              onClick={() => {
                setSearchQuery("India");
                setPage(1);
              }}
              className="inline-flex items-center gap-1 text-[11px] rounded-full px-2.5 py-0.5 border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
            >
              <span>🇮🇳 India</span>
            </button>

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
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[10px] font-mono text-neutral-500 hover:text-red-500 underline ml-1 cursor-pointer"
                >
                  Reset all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Requests Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-white/[0.02] text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllCurrentSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all on this page"
                    className="size-3.5 rounded border-neutral-300 dark:border-white/20 accent-neutral-900 dark:accent-white cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">OEM &amp; Solution</th>
                <th className="py-3 px-4">Evaluation Window &amp; Timezone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 dark:divide-white/5 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <Loader2 className="size-5 animate-spin text-neutral-400 mx-auto mb-1.5" />
                    <span className="text-xs">Loading submissions...</span>
                  </td>
                </tr>
              ) : paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <p className="font-medium text-neutral-800 dark:text-neutral-200 text-xs">No records matched your search</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Try clearing filters or search query.</p>
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => {
                  const initial = (req.userName || req.userEmail || "U").charAt(0).toUpperCase();
                  const isPending = (req.status || "").toLowerCase() === "requested";
                  const oemLogo = resolveOemLogo(req.oemName, req.oemImage);
                  const timeline = formatTimelineDates(req.startDate, req.endDate);
                  const requestedFormatted = formatRequestDate(req.requestedDate);
                  const tzLocation = formatTimezoneLocation(req.timezone, req.countryName);

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
                      {/* Selection Checkbox */}
                      <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected(req.id)}
                          onChange={(e) => toggleSelectOne(req.id, e)}
                          aria-label={`Select request #${req.id}`}
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
                          {/* OEM Logo Card with exact aspect ratio */}
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

                          {/* Solution Title */}
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

                      {/* Professional Timeline & Timezone (Chennai, Mumbai, Kolkata) */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 max-w-[260px]">
                          {/* Scheduled Range */}
                          <div className="flex items-center gap-1.5 text-xs text-neutral-900 dark:text-neutral-100 font-medium">
                            <Calendar className="size-3 text-neutral-400 shrink-0" />
                            <span className="truncate">{timeline.formattedRange}</span>
                            {timeline.durationDays && (
                              <span className="rounded bg-neutral-100 dark:bg-white/10 px-1.5 py-0.2 text-[9px] font-mono text-neutral-600 dark:text-neutral-300 shrink-0">
                                {timeline.durationDays}
                              </span>
                            )}
                          </div>

                          {/* Request Timestamp */}
                          <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono">
                            <Clock className="size-2.5 text-neutral-400 shrink-0" />
                            <span>Submitted: {requestedFormatted}</span>
                          </div>

                          {/* Timezone Context Pill */}
                          <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono truncate" title={tzLocation}>
                            <Globe className="size-2.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{tzLocation}</span>
                          </div>
                        </div>
                      </td>

                      {/* Realistic Enterprise Status Badge */}
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(req.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => handleQuickApprove(req, e)}
                                title="Approve with VDI Access"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-medium transition cursor-pointer"
                              >
                                <Check className="size-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleQuickReject(req, e)}
                                title="Decline Request"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-rose-500/30 text-rose-700 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-medium transition cursor-pointer"
                              >
                                <X className="size-3" />
                                <span>Decline</span>
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => openDossier(req)}
                            title="Inspect full dossier"
                            className="p-1.5 rounded border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition cursor-pointer"
                          >
                            <Eye className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => openArchiveConfirm(req, e)}
                            title="Move to Archived Users"
                            className="p-1.5 rounded border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
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
            <span className="font-mono text-neutral-900 dark:text-white">{filteredRequests.length}</span> submissions
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

      {/* Request Dossier Modal with OEM Logo in exact ratio */}
      {isDossierOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto custom-gold-scrollbar rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#121212] p-6 shadow-xl animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                  Application #{selectedRequest.id}
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

              {/* OEM Details Card with Exact Logo Ratio */}
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

              {/* User Justification / Comments */}
              <div className="rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50/70 dark:bg-white/[0.02] p-3 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  Business Justification (User Comments)
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap bg-white dark:bg-black/30 p-2.5 rounded border border-neutral-200/60 dark:border-white/5">
                  {selectedRequest.comments || "No comments provided."}
                </p>
              </div>

              {/* VDI Credentials */}
              {selectedRequest.userAccessKeys && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                    VDI Access Credentials
                  </div>
                  <div className="font-mono text-[11px] text-emerald-900 dark:text-emerald-300 break-all select-all">
                    {selectedRequest.userAccessKeys}
                  </div>
                </div>
              )}

              {/* Admin Evaluation Form */}
              <form onSubmit={handleSaveDossier} className="rounded-lg border border-neutral-200 dark:border-white/10 p-3 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-yellow-800 dark:text-orange-100 font-medium">
                  Administrator Evaluation &amp; Provisioning
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1 font-mono">STATUS ACTION</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full rounded border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#161616] px-2 py-1 text-xs text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="Requested">Pending Review</option>
                      <option value="Approved with VDI">Approved with VDI</option>
                      <option value="Expiry">Expired Session</option>
                      <option value="Rejected">Declined</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1 font-mono">START DATE</label>
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className="w-full rounded border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#161616] px-2 py-1 text-xs text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1 font-mono">END DATE</label>
                    <input
                      type="date"
                      value={editEndDate}
                      onChange={(e) => setEditEndDate(e.target.value)}
                      className="w-full rounded border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#161616] px-2 py-1 text-xs text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-neutral-500 font-mono">ADMINISTRATOR REMARKS (adminComment)</label>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                    {[
                      "Approved: Follow instructions provided to connect to VDI",
                      "Access extended for additional 3 days",
                      "Declined: Please contact your iValue account representative",
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => insertQuickComment(chip)}
                        className="text-[10px] bg-neutral-100 dark:bg-white/5 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                      >
                        + {chip.split(":")[0]}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    value={editAdminComment}
                    onChange={(e) => setEditAdminComment(e.target.value)}
                    placeholder="Enter provisioning instructions, notes, or justification..."
                    className="w-full rounded border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#161616] p-2 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-neutral-200/60 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDossierOpen(false);
                      openArchiveConfirm(selectedRequest);
                    }}
                    className="rounded px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 border border-rose-500/25 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="size-3" />
                    <span>Archive Request</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDossierOpen(false)}
                      className="rounded px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-none rounded-tr-lg rounded-bl-lg bg-neutral-900 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 transition-colors disabled:opacity-50"
                    >
                      {submitting && <Loader2 className="size-3 animate-spin" />}
                      <span>Save Decision</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {archiveModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#121212] p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                  Move to Archived Users?
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Application #{archiveModalReq.id} • {archiveModalReq.userName || archiveModalReq.userEmail}
                </p>
              </div>
            </div>

            <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-white/[0.02] p-3 rounded-lg border border-neutral-200/60 dark:border-white/5 space-y-1.5">
              <p>
                This request will be moved to <span className="font-semibold text-neutral-900 dark:text-white">Archived Users</span> (<code className="font-mono text-[10px] text-amber-700 dark:text-amber-300">ivaluecoe.deletedrequesteduser</code>).
              </p>
              <p className="text-[11px] text-neutral-500">
                ✓ Not permanently deleted — can be restored at any time with a single click.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setArchiveModalReq(null)}
                disabled={archiving}
                className="rounded px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleArchiveConfirm}
                disabled={archiving}
                className="rounded-none rounded-tr-lg rounded-bl-lg bg-rose-600 hover:bg-rose-700 text-white inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {archiving ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>Archiving...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3" />
                    <span>Move to Archive</span>
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
            {/* 1. Approve */}
            <button
              type="button"
              onClick={handleBatchApprove}
              disabled={batchLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 transition cursor-pointer disabled:opacity-50"
            >
              {batchLoading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <CheckCircle2 className="size-3.5 text-emerald-400" />
              )}
              <span>Approve ({selectedIds.length})</span>
            </button>

            {/* 2. Reject */}
            <button
              type="button"
              onClick={handleBatchReject}
              disabled={batchLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-rose-500/40 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 transition cursor-pointer disabled:opacity-50"
            >
              {batchLoading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <XCircle className="size-3.5 text-rose-400" />
              )}
              <span>Reject ({selectedIds.length})</span>
            </button>

            {/* 3. Expiry */}
            <button
              type="button"
              onClick={handleBatchExpire}
              disabled={batchLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 transition cursor-pointer disabled:opacity-50"
            >
              {batchLoading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Clock className="size-3.5 text-amber-400" />
              )}
              <span>Expire ({selectedIds.length})</span>
            </button>

            {/* 4. Archive */}
            <button
              type="button"
              onClick={() => setBatchArchiveModalOpen(true)}
              disabled={batchLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-neutral-600 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer disabled:opacity-50"
            >
              <Archive className="size-3.5 text-neutral-400" />
              <span>Archive ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Batch Archive Confirmation Modal */}
      {batchArchiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#121212] p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                  Archive {selectedIds.length} Selected Requests?
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Batch moving {selectedIds.length} application(s) to Archived Users
                </p>
              </div>
            </div>

            <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-white/[0.02] p-3 rounded-lg border border-neutral-200/60 dark:border-white/5 space-y-1.5">
              <p>
                These <span className="font-semibold text-neutral-900 dark:text-white">{selectedIds.length} requests</span> will be transferred to <span className="font-semibold text-neutral-900 dark:text-white">Archived Users</span> (<code className="font-mono text-[10px] text-amber-700 dark:text-amber-300">ivaluecoe.deletedrequesteduser</code>).
              </p>
              <p className="text-[11px] text-neutral-500">
                ✓ No data loss — you can restore any or all of them anytime with one click.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setBatchArchiveModalOpen(false)}
                disabled={batchLoading}
                className="rounded px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBatchArchiveConfirm}
                disabled={batchLoading}
                className="rounded-none rounded-tr-lg rounded-bl-lg bg-rose-600 hover:bg-rose-700 text-white inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {batchLoading ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>Archiving...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3" />
                    <span>Archive {selectedIds.length} Requests</span>
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
