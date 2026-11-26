"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Building2,
  Plus,
  Search,
  Download,
  RefreshCw,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Database,
  Loader2,
  ArrowUpRight,
  UploadCloud,
  ImageIcon,
  LayoutGrid,
  List,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic CDN Base URL configured via environment variables with standard default
const DEFAULT_CDN_BASE = "https://storage.googleapis.com/cdn.ivaluetv.com/oem";

export default function AdminOEMsPage() {
  // Data & Pagination
  const [oems, setOems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"
  const [stats, setStats] = useState({
    total: 0,
    withLogo: 0,
    withoutLogo: 0,
  });

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState([]);
  const [batchDeleteModalOpen, setBatchDeleteModalOpen] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);

  // Modals & Feedback
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOem, setSelectedOem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    oemName: "",
    logo: "",
  });
  const [fileToUpload, setFileToUpload] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  // Resolve dynamic logo image URL
  const resolveLogoUrl = useCallback((logoFilename) => {
    if (!logoFilename) return null;
    if (
      logoFilename.startsWith("http://") ||
      logoFilename.startsWith("https://") ||
      logoFilename.startsWith("/")
    ) {
      return logoFilename;
    }
    const base = process.env.NEXT_PUBLIC_GCP_STORAGE_BASE_URL || DEFAULT_CDN_BASE;
    return `${base.replace(/\/+$/, "")}/${logoFilename.replace(/^\/+/, "")}`;
  }, []);

  // Fetch OEMs
  const fetchOems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/oems?limit=all");
      const data = await res.json();
      if (data.success && Array.isArray(data.oems)) {
        setOems(data.oems);
        if (data.stats) setStats(data.stats);
      } else {
        showToast("error", data.message || "Failed to load OEMs.");
      }
    } catch {
      showToast("error", "Network error: Failed to connect to /api/admin/oems.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/oems?limit=all");
        const data = await res.json();
        if (active && data.success && Array.isArray(data.oems)) {
          setOems(data.oems);
          if (data.stats) setStats(data.stats);
        }
      } catch {
        // Handled on user action
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Filtered & Paginated OEMs
  const filteredOems = useMemo(() => {
    let result = [...oems];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          String(o.id).includes(q) ||
          (o.oemName || "").toLowerCase().includes(q) ||
          (o.logo || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [oems, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredOems.length / limit));
  const safePage = Math.min(page, totalPages);

  const paginatedOems = useMemo(() => {
    const start = (safePage - 1) * limit;
    return filteredOems.slice(start, start + limit);
  }, [filteredOems, safePage, limit]);

  // Multi-Select Handlers
  const isAllSelected =
    paginatedOems.length > 0 &&
    paginatedOems.every((o) => selectedIds.includes(o.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = paginatedOems.map((o) => o.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedOems.map((o) => o.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  // Copy URL / Filename to Clipboard
  const handleCopy = (text, id) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      showToast("success", "Copied to clipboard!");
    }
  };

  // Handle File Selection with Live Preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    }
  };

  // Open Modals
  const openAddModal = () => {
    setFormData({ id: null, oemName: "", logo: "" });
    setFileToUpload(null);
    setFilePreview(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (oem) => {
    setSelectedOem(oem);
    setFormData({ id: oem.id, oemName: oem.oemName, logo: oem.logo });
    setFileToUpload(null);
    setFilePreview(resolveLogoUrl(oem.logo));
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (oem) => {
    setSelectedOem(oem);
    setIsDeleteModalOpen(true);
  };

  // Form Submissions
  const handleCreateOem = async (e) => {
    e.preventDefault();
    if (!formData.oemName.trim()) {
      showToast("error", "Please provide a valid OEM name.");
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (fileToUpload) {
        // Send as FormData for GCP bucket upload
        const data = new FormData();
        data.append("oemName", formData.oemName.trim());
        data.append("logoFile", fileToUpload);
        res = await fetch("/api/admin/oems", {
          method: "POST",
          body: data,
        });
      } else {
        // Send as JSON
        res = await fetch("/api/admin/oems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oemName: formData.oemName.trim(),
            logo: formData.logo.trim(),
          }),
        });
      }

      const result = await res.json();
      if (result.success) {
        showToast("success", result.message || "OEM created successfully.");
        setIsAddModalOpen(false);
        fetchOems();
      } else {
        showToast("error", result.message || "Failed to create OEM.");
      }
    } catch {
      showToast("error", "Network error creating OEM.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateOem = async (e) => {
    e.preventDefault();
    if (!formData.oemName.trim()) {
      showToast("error", "OEM Name cannot be empty.");
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (fileToUpload) {
        // Send as FormData for GCP bucket upload
        const data = new FormData();
        data.append("id", String(formData.id));
        data.append("oemName", formData.oemName.trim());
        data.append("logoFile", fileToUpload);
        res = await fetch("/api/admin/oems", {
          method: "PUT",
          body: data,
        });
      } else {
        // Send as JSON
        res = await fetch("/api/admin/oems", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: formData.id,
            oemName: formData.oemName.trim(),
            logo: formData.logo.trim(),
          }),
        });
      }

      const result = await res.json();
      if (result.success) {
        showToast("success", result.message || "OEM updated successfully.");
        setIsEditModalOpen(false);
        fetchOems();
      } else {
        showToast("error", result.message || "Failed to update OEM.");
      }
    } catch {
      showToast("error", "Network error updating OEM.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!selectedOem?.id) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/oems?id=${selectedOem.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message || `OEM #${selectedOem.id} deleted.`);
        setIsDeleteModalOpen(false);
        setSelectedIds((prev) => prev.filter((id) => id !== selectedOem.id));
        fetchOems();
      } else {
        showToast("error", data.message || "Failed to delete OEM.");
      }
    } catch {
      showToast("error", "Network error deleting OEM.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBatchDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    setBatchLoading(true);
    try {
      const res = await fetch("/api/admin/oems", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message || `Deleted ${selectedIds.length} OEM(s).`);
        setSelectedIds([]);
        setBatchDeleteModalOpen(false);
        fetchOems();
      } else {
        showToast("error", data.message || "Failed to delete selected OEMs.");
      }
    } catch {
      showToast("error", "Network error during batch deletion.");
    } finally {
      setBatchLoading(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (oems.length === 0) {
      showToast("error", "No data to export.");
      return;
    }
    const headers = ["ID", "OEM Name", "Logo Filename", "Full CDN URL"];
    const rows = oems.map((o) => [
      o.id,
      `"${(o.oemName || "").replace(/"/g, '""')}"`,
      `"${(o.logo || "").replace(/"/g, '""')}"`,
      `"${resolveLogoUrl(o.logo)}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ivaluecoe_oems_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("success", "Exported OEM directory to CSV.");
  };

  return (
    <div className="space-y-6 pb-36 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg px-4 py-3 border text-xs font-medium backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200",
            feedback.type === "success"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-700 dark:border-white shadow-xl"
              : "bg-red-950 text-red-200 border-red-800 shadow-xl"
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

      {/* Header Banner (ChaiUI Restrained Hairline) */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-500">
                Partner Ecosystem
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-mono border border-neutral-200 dark:border-white/10 text-neutral-500">
                <Database className="size-2.5" />
                ivaluecoe.oem
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-mono border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                <UploadCloud className="size-2.5" />
                GCP Bucket: cdn.ivaluetv.com
              </span>
            </div>

            <h1 className="text-2xl font-medium tracking-tight text-neutral-900 dark:text-white font-sans">
              OEM{" "}
              <span className="font-montserrat font-medium tracking-tight capitalize text-yellow-800 dark:text-orange-100">
                brands &amp; technology partners
              </span>
            </h1>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              Manage original equipment manufacturers and vendor partner logos. When an image is uploaded, it is automatically delivered via Google Cloud Storage CDN while only the clean filename is stored in MySQL.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={exportToCSV}
              className="rounded-none rounded-tl-lg rounded-br-lg border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="size-3" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={fetchOems}
              disabled={loading}
              className="rounded-none rounded-tl-lg rounded-br-lg border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={cn("size-3", loading && "animate-spin text-neutral-400")} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="rounded-none rounded-tr-lg rounded-bl-lg bg-neutral-900 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add OEM</span>
              <ArrowUpRight className="size-3" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total OEMs</span>
            <Building2 className="size-3.5 text-neutral-400" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.total}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Database entities</p>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Active Brand Logos
            </span>
            <ImageIcon className="size-3.5 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.withLogo}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">CDN assets connected</p>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-yellow-800 dark:text-orange-100">
              CDN Storage Root
            </span>
            <UploadCloud className="size-3.5 text-yellow-800 dark:text-orange-200" />
          </div>
          <p className="text-xs font-mono font-medium text-neutral-900 dark:text-white truncate pt-1">
            cdn.ivaluetv.com/oem
          </p>
          <p className="text-[10px] text-neutral-500 mt-1">Google Cloud Storage</p>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Filtered View</span>
            <span className="text-[10px] font-mono text-neutral-400">
              Page {safePage}/{totalPages}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {filteredOems.length}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Matching criteria</p>
        </div>
      </div>

      {/* Table Container (ChaiUI Restrained Hairline) */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-neutral-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search OEM name, logo, or ID..."
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

          {/* View Toggle & Rows per Page */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-neutral-100 dark:bg-white/5 rounded-md p-0.5 border border-neutral-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded text-xs transition cursor-pointer",
                  viewMode === "table"
                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs font-medium"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                )}
                title="Table List View"
              >
                <List className="size-3" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded text-xs transition cursor-pointer",
                  viewMode === "grid"
                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs font-medium"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                )}
                title="Grid Brand Card View"
              >
                <LayoutGrid className="size-3" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

            {/* Rows Per Page */}
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-white/5 rounded-md px-2 py-1 border border-neutral-200 dark:border-white/10">
              <span className="text-[10px] font-mono uppercase text-neutral-500">Rows</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-transparent text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
              >
                <option value={10} className="dark:bg-neutral-900">10</option>
                <option value={20} className="dark:bg-neutral-900">20</option>
                <option value={50} className="dark:bg-neutral-900">50</option>
                <option value={100} className="dark:bg-neutral-900">100</option>
              </select>
            </div>
          </div>
        </div>

        {/* View Mode: Table */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-white/[0.02] text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      disabled={paginatedOems.length === 0}
                      className="size-3.5 rounded border-neutral-300 dark:border-white/20 text-neutral-900 focus:ring-0 cursor-pointer accent-neutral-900 dark:accent-white disabled:opacity-40"
                      title="Select all on this page"
                    />
                  </th>
                  <th className="py-3 px-4 w-16">ID</th>
                  <th className="py-3 px-4">Brand Logo</th>
                  <th className="py-3 px-4">OEM Partner Name</th>
                  <th className="py-3 px-4">Logo Filename</th>
                  <th className="py-3 px-4">CDN Public Link</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60 dark:divide-white/5 font-sans">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-500">
                      <Loader2 className="size-5 animate-spin text-neutral-400 mx-auto mb-1.5" />
                      <span className="text-xs">Loading OEM directory...</span>
                    </td>
                  </tr>
                ) : paginatedOems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-500">
                      <p className="font-medium text-neutral-800 dark:text-neutral-200 text-xs">
                        No OEMs found
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Try modifying your search or click &quot;Add OEM&quot; above.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedOems.map((oem) => {
                    const fullUrl = resolveLogoUrl(oem.logo);
                    const isSelected = selectedIds.includes(oem.id);

                    return (
                      <tr
                        key={oem.id}
                        className={cn(
                          "hover:bg-neutral-500/[0.03] dark:hover:bg-white/[0.02] transition-colors",
                          isSelected && "bg-neutral-100/60 dark:bg-white/[0.04]"
                        )}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(oem.id)}
                            className="size-3.5 rounded border-neutral-300 dark:border-white/20 text-neutral-900 focus:ring-0 cursor-pointer accent-neutral-900 dark:accent-white"
                            title={`Select OEM #${oem.id}`}
                          />
                        </td>

                        {/* ID */}
                        <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                          #{oem.id}
                        </td>

                        {/* Brand Logo in Natural Aspect Ratio */}
                        <td className="py-3 px-4">
                          <div className="flex h-10 w-24 shrink-0 items-center justify-center rounded-md border border-neutral-200/90 bg-white p-1.5 shadow-2xs dark:border-white/10 dark:bg-white overflow-hidden">
                            {oem.logo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={fullUrl}
                                alt={oem.oemName}
                                className="max-h-7 max-w-full object-contain select-none"
                                onError={(e) => {
                                  // Fallback to monogram if remote logo is 404
                                  e.currentTarget.style.display = "none";
                                  if (e.currentTarget.nextElementSibling) {
                                    e.currentTarget.nextElementSibling.classList.remove("hidden");
                                  }
                                }}
                              />
                            ) : null}
                            <span className={cn("font-montserrat text-xs font-bold text-neutral-800", oem.logo && "hidden")}>
                              {oem.oemName.slice(0, 3).toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* OEM Name */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-neutral-900 dark:text-white">
                              {oem.oemName}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              Entity #{oem.id}
                            </span>
                          </div>
                        </td>

                        {/* Stored Filename */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <code className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 max-w-[180px] truncate">
                              {oem.logo || "No logo file"}
                            </code>
                            {oem.logo && (
                              <button
                                type="button"
                                onClick={() => handleCopy(oem.logo, `file-${oem.id}`)}
                                title="Copy filename"
                                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition cursor-pointer"
                              >
                                {copiedId === `file-${oem.id}` ? (
                                  <Check className="size-3 text-emerald-500" />
                                ) : (
                                  <Copy className="size-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Public Link */}
                        <td className="py-3 px-4">
                          {fullUrl ? (
                            <a
                              href={fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition"
                              title={fullUrl}
                            >
                              <span className="max-w-[160px] truncate">{fullUrl}</span>
                              <ExternalLink className="size-2.5 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-neutral-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(oem)}
                              title="Edit OEM"
                              className="p-1.5 rounded border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
                            >
                              <Edit3 className="size-3" />
                            </button>

                            <button
                              type="button"
                              onClick={() => openDeleteModal(oem)}
                              title="Delete OEM"
                              className="p-1.5 rounded border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
                            >
                              <Trash2 className="size-3" />
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
        ) : (
          /* View Mode: Grid Cards */
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full py-12 text-center text-neutral-500">
                <Loader2 className="size-5 animate-spin text-neutral-400 mx-auto mb-1.5" />
                <span className="text-xs">Loading OEM directory...</span>
              </div>
            ) : paginatedOems.length === 0 ? (
              <div className="col-span-full py-12 text-center text-neutral-500">
                <p className="font-medium text-neutral-800 dark:text-neutral-200 text-xs">
                  No OEMs found
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Try clearing your search.
                </p>
              </div>
            ) : (
              paginatedOems.map((oem) => {
                const fullUrl = resolveLogoUrl(oem.logo);
                const isSelected = selectedIds.includes(oem.id);

                return (
                  <div
                    key={oem.id}
                    className={cn(
                      "relative rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] p-4 flex flex-col justify-between gap-3 backdrop-blur-xs transition hover:border-neutral-400 dark:hover:border-white/25",
                      isSelected && "ring-2 ring-yellow-800/60 dark:ring-orange-200/60 bg-amber-500/[0.03]"
                    )}
                  >
                    {/* Top Row: Checkbox & ID */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(oem.id)}
                          className="size-3.5 rounded border-neutral-300 dark:border-white/20 text-neutral-900 focus:ring-0 cursor-pointer accent-neutral-900 dark:accent-white"
                        />
                        <span className="font-mono text-[10px] text-neutral-400">
                          #{oem.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(oem)}
                          title="Edit"
                          className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        >
                          <Edit3 className="size-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(oem)}
                          title="Delete"
                          className="p-1 rounded text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </div>

                    {/* Logo Display Card */}
                    <div className="flex h-16 w-full items-center justify-center rounded-lg border border-neutral-200/90 bg-white p-2 shadow-2xs dark:border-white/10 dark:bg-white">
                      {oem.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={fullUrl}
                          alt={oem.oemName}
                          className="max-h-12 max-w-full object-contain select-none"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.classList.remove("hidden");
                            }
                          }}
                        />
                      ) : null}
                      <span className={cn("font-montserrat text-sm font-bold text-neutral-800", oem.logo && "hidden")}>
                        {oem.oemName}
                      </span>
                    </div>

                    {/* Brand Info */}
                    <div>
                      <h4 className="font-semibold text-xs text-neutral-900 dark:text-white truncate">
                        {oem.oemName}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono mt-0.5">
                        <span className="truncate max-w-[140px]">{oem.logo}</span>
                        {fullUrl && (
                          <a
                            href={fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-neutral-900 dark:hover:text-white"
                            title="Open in new tab"
                          >
                            <ExternalLink className="size-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-3 border-t border-neutral-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div>
            Showing <span className="font-mono text-neutral-900 dark:text-white">{filteredOems.length === 0 ? 0 : (safePage - 1) * limit + 1}</span> to{" "}
            <span className="font-mono text-neutral-900 dark:text-white">{Math.min(safePage * limit, filteredOems.length)}</span> of{" "}
            <span className="font-mono text-neutral-900 dark:text-white">{filteredOems.length}</span>
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

      {/* Floating Executive Bulk Action Bar - Multi Delete Only */}
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
            <button
              type="button"
              onClick={() => setBatchDeleteModalOpen(true)}
              disabled={batchLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-rose-500/40 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 transition cursor-pointer disabled:opacity-50"
            >
              {batchLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5 text-rose-400" />
              )}
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Add OEM Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#121212] p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-neutral-700 dark:text-neutral-300" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                  Add New OEM Partner
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOem} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  OEM Partner Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palo Alto Networks, CrowdStrike, Fortinet"
                  value={formData.oemName}
                  onChange={(e) => setFormData({ ...formData, oemName: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              {/* File Upload to GCP Bucket */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Upload Brand Logo (SVG, PNG, WebP)
                </label>
                <div className="border-2 border-dashed border-neutral-300 dark:border-white/15 rounded-lg p-3 text-center hover:border-neutral-400 dark:hover:border-white/30 transition">
                  {filePreview ? (
                    <div className="space-y-2">
                      <div className="h-16 w-36 mx-auto rounded border border-neutral-200 bg-white p-2 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <p className="text-[10px] text-neutral-500 font-mono">
                        {fileToUpload?.name || "Selected logo preview"}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setFileToUpload(null);
                          setFilePreview(null);
                        }}
                        className="text-[11px] text-rose-500 hover:underline"
                      >
                        Remove and choose another
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block space-y-1.5">
                      <UploadCloud className="size-6 text-neutral-400 mx-auto" />
                      <div className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                        Click or drag logo file here
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        SVG, PNG, WEBP up to 5MB • Stored in GCP Bucket
                      </div>
                      <input
                        type="file"
                        accept="image/svg+xml,image/png,image/jpeg,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Or manual filename */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                  Or specify existing filename
                </label>
                <input
                  type="text"
                  placeholder="e.g. checkpoint.png, OpenText_logo.svg"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none"
                />
                <span className="text-[10px] text-neutral-400 mt-0.5 block">
                  Only the clean filename is stored in MySQL. The base URL is prepended dynamically.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-none rounded-tr-lg rounded-bl-lg bg-neutral-900 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 className="size-3 animate-spin" />}
                  <span>{submitting ? "Uploading & Saving..." : "Save OEM"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit OEM Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#121212] p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Edit3 className="size-4 text-neutral-700 dark:text-neutral-300" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                  Edit OEM #{formData.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateOem} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  OEM Partner Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.oemName}
                  onChange={(e) => setFormData({ ...formData, oemName: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Logo Preview and Replace */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Brand Logo
                </label>
                <div className="border border-neutral-200 dark:border-white/15 rounded-lg p-3 space-y-3">
                  {filePreview ? (
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-28 shrink-0 rounded border border-neutral-200 bg-white p-2 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={filePreview}
                          alt="Current Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300 truncate">
                          {fileToUpload?.name || formData.logo || "Current logo"}
                        </span>
                        <label className="text-[11px] text-yellow-800 dark:text-orange-200 hover:underline cursor-pointer mt-1">
                          Replace with new image
                          <input
                            type="file"
                            accept="image/svg+xml,image/png,image/jpeg,image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center py-3">
                      <UploadCloud className="size-5 text-neutral-400 mx-auto mb-1" />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        Upload new logo to GCP Bucket
                      </span>
                      <input
                        type="file"
                        accept="image/svg+xml,image/png,image/jpeg,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                  Logo Filename (stored in database)
                </label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-none rounded-tr-lg rounded-bl-lg bg-neutral-900 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 className="size-3 animate-spin" />}
                  <span>{submitting ? "Saving Changes..." : "Save changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedOem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#121212] p-6 shadow-xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                  Delete {selectedOem.oemName}?
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Removing OEM partner #{selectedOem.id} from MySQL database
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed bg-neutral-50 dark:bg-white/[0.02] p-3 rounded-lg border border-neutral-200/60 dark:border-white/5">
              This will permanently delete <span className="font-semibold text-neutral-900 dark:text-white">{selectedOem.oemName}</span> (logo: <code className="font-mono text-[10px]">{selectedOem.logo}</code>).
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={submitting}
                className="rounded px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSingle}
                disabled={submitting}
                className="rounded bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Delete Confirmation Modal */}
      {batchDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-xl border border-rose-500/30 dark:border-rose-500/20 bg-white dark:bg-[#121212] p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                  Delete {selectedIds.length} Selected OEMs?
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Batch removing {selectedIds.length} OEM partner(s) from MySQL database
                </p>
              </div>
            </div>

            <div className="text-xs text-rose-700 dark:text-rose-300 bg-rose-500/5 p-3 rounded-lg border border-rose-500/20 space-y-1">
              <p className="font-semibold">
                ⚠️ Warning: This action cannot be undone.
              </p>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                These {selectedIds.length} records will be permanently erased from <code className="font-mono text-[10px]">ivaluecoe.oem</code>.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setBatchDeleteModalOpen(false)}
                disabled={batchLoading}
                className="rounded px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBatchDeleteConfirm}
                disabled={batchLoading}
                className="rounded-none rounded-tr-lg rounded-bl-lg bg-red-700 hover:bg-red-800 text-white inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {batchLoading ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3" />
                    <span>Delete {selectedIds.length} Permanently</span>
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
