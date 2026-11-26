"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  Building2,
  ExternalLink,
  Loader2,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  KeyRound,
  ListOrdered,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Send,
  Boxes,
  Laptop,
  Tv2,
  ArrowRight,
  Headphones,
  Mail,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  resolveOemLogoUrl,
  decodeHtmlEntities,
  GLOBAL_TIMEZONES,
  DEFAULT_TIMEZONE,
  ACCESS_PURPOSES,
  getMinStartDate,
  getDefaultStartDate,
  getDefaultEndDate,
} from "@/lib/solution-utils";

export default function UserProductsPage() {
  const [products, setProducts] = useState([]);
  const [availableOems, setAvailableOems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [oemFilter, setOemFilter] = useState("all");

  // 15 Products per page pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    totalUnfiltered: 0,
  });

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetailsLoading, setProductDetailsLoading] = useState(false);
  const [fullProductData, setFullProductData] = useState(null);
  const [modalTab, setModalTab] = useState("overview");

  // Request modal
  const [requestModalProduct, setRequestModalProduct] = useState(null);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [requestForm, setRequestForm] = useState({
    startDate: "",
    endDate: "",
    timezone: DEFAULT_TIMEZONE,
    accessPurpose: "Evaluation",
    organizationName: "",
    countryName: "India",
    comments: "",
  });

  const showToast = (type, message) => {
    setRequestFeedback({ type, message });
    setTimeout(() => {
      setRequestFeedback((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const handleInputChange = (field, value) => {
    setRequestForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const minStart = getMinStartDate();

    if (!requestForm.startDate?.trim()) {
      errors.startDate = "Start date is required";
    } else if (requestForm.startDate < minStart) {
      errors.startDate = "Start date must be at least 2 days ahead of today";
    }

    if (!requestForm.endDate?.trim()) {
      errors.endDate = "End date is required";
    } else if (
      requestForm.startDate &&
      requestForm.endDate < requestForm.startDate
    ) {
      errors.endDate = "End date cannot be prior to start date";
    }
    if (!requestForm.timezone?.trim()) errors.timezone = "Timezone selection is required";
    if (!requestForm.organizationName?.trim()) errors.organizationName = "Company / Organization is required";
    if (!requestForm.countryName?.trim()) errors.countryName = "Country is required";
    if (!requestForm.accessPurpose?.trim()) errors.accessPurpose = "Access purpose is required";
    if (!requestForm.comments?.trim()) errors.comments = "Please specify evaluation purpose or project comments";

    setFormErrors(errors);
    const firstKey = Object.keys(errors)[0];
    if (firstKey) {
      const el = document.getElementById(`prod-modal-${firstKey}`);
      if (el) el.focus();
    }
    return Object.keys(errors).length === 0;
  };

  // Submit Access Request
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestModalProduct) return;

    if (!validateForm()) {
      showToast("error", "Please fill in all highlighted required boxes.");
      return;
    }

    setSubmittingRequest(true);
    try {
      const res = await fetch("/api/user/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentID: requestModalProduct.id,
          startDate: requestForm.startDate,
          endDate: requestForm.endDate,
          timezone: requestForm.timezone,
          accessPurpose: requestForm.accessPurpose,
          organizationName: requestForm.organizationName,
          countryName: requestForm.countryName,
          comments: requestForm.comments,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("success", data.message || "Request submitted successfully!");
        setRequestModalProduct(null);
      } else {
        showToast("error", data.message || "Failed to submit request.");
      }
    } catch {
      showToast("error", "Network error: Request submission failed.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Fetch Products with 15 items per page
  const fetchProducts = useCallback(
    async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const q = encodeURIComponent(searchQuery);
        const res = await fetch(
          `/api/user/products?page=${page}&limit=${limit}&search=${q}&oem=${oemFilter}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
          if (data.pagination) setPagination(data.pagination);
          if (data.availableOems) setAvailableOems(data.availableOems);
        } else {
          showToast("error", data.message || "Failed to load products.");
        }
      } catch {
        showToast("error", "Network error: Failed to fetch OEM solutions.");
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [page, limit, searchQuery, oemFilter]
  );

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const q = encodeURIComponent(searchQuery);
        const res = await fetch(
          `/api/user/products?page=${page}&limit=${limit}&search=${q}&oem=${oemFilter}`
        );
        const data = await res.json();
        if (active && data.success && Array.isArray(data.products)) {
          setProducts(data.products);
          if (data.pagination) setPagination(data.pagination);
          if (data.availableOems) setAvailableOems(data.availableOems);
        }
      } catch {
        // silent initial load
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [page, limit, searchQuery, oemFilter]);

  // Load single product details with relations
  const openProductOverview = async (product) => {
    setSelectedProduct(product);
    setProductDetailsLoading(true);
    setModalTab("overview");
    try {
      const res = await fetch(`/api/user/products?id=${product.id}`);
      const data = await res.json();
      if (data.success && data.product) {
        setFullProductData(data.product);
      } else {
        setFullProductData(product);
      }
    } catch {
      setFullProductData(product);
    } finally {
      setProductDetailsLoading(false);
    }
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Feedback */}
      {requestFeedback && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium animate-in fade-in slide-in-from-bottom-5 transition-all duration-300",
            requestFeedback.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-100 backdrop-blur-md"
              : "bg-rose-950/90 border-rose-500/30 text-rose-100 backdrop-blur-md"
          )}
        >
          {requestFeedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{requestFeedback.message}</span>
          <button
            onClick={() => setRequestFeedback(null)}
            className="ml-2 hover:opacity-75 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-2xs text-neutral-800 dark:text-neutral-200">
              <Boxes className="size-5 text-amber-500" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              COE Products & Solutions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 border border-neutral-300/60 dark:border-white/10 font-mono">
              {pagination.total} Solutions
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Browse verified enterprise OEM solutions. Review technical
            architecture and submit direct requests for sandbox evaluation.
          </p>
        </div>

        <Link
          href="/dashboard/user/track"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 shadow-2xs transition-colors self-start md:self-auto"
        >
          <Clock className="size-3.5 text-amber-500" />
          <span>My Requested Solutions</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar with Quick Partner Tags */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by solution title, OEM brand, or technology keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-neutral-900 dark:text-white placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={oemFilter}
              onChange={(e) => {
                setOemFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              <option value="all">All OEM Partners</option>
              {availableOems.map((o) => (
                <option key={o.id} value={o.oemName}>
                  {o.oemName}
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchProducts(true)}
              disabled={loading}
              className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
              title="Refresh Catalog"
            >
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Quick OEM Partner Filter Pills */}
        {availableOems.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 custom-gold-scrollbar">
            <span className="text-[10px] font-mono uppercase text-neutral-400 shrink-0 mr-1">
              Quick Filter:
            </span>
            <button
              onClick={() => {
                setOemFilter("all");
                setPage(1);
              }}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0",
                oemFilter === "all"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold shadow-2xs"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              All Partners
            </button>
            {availableOems.slice(0, 8).map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setOemFilter(o.oemName);
                  setPage(1);
                }}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0",
                  oemFilter.toLowerCase() === o.oemName.toLowerCase()
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold shadow-2xs"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                {o.oemName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products Grid (15 per page) */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-neutral-400">
          <Loader2 className="size-8 animate-spin text-amber-500 mb-3" />
          <p className="text-xs">Loading solutions catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 space-y-3">
          <Boxes className="size-10 mx-auto text-neutral-300 dark:text-neutral-700" />
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            No solutions match your search criteria
          </p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search terms or selecting a different OEM partner.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setOemFilter("all");
              setPage(1);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0f0f11] shadow-2xs hover:shadow-md hover:border-amber-500/40 transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3">
                {/* Header row: OEM Logo & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="h-10 w-24 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {item.oemImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={resolveOemLogoUrl(item.oemImage)}
                        alt={item.oem}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Building2 className="size-5 text-neutral-400" />
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {item.oem}
                    </span>
                    {item.comingSoon === "Yes" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <span className="size-1 rounded-full bg-amber-500" />
                        Coming Soon
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="size-1 rounded-full bg-emerald-500" />
                        Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.head}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.headDetails ||
                      "Explore technical architecture, evaluation playbooks, and reserve your solution instance."}
                  </p>
                </div>
              </div>

              {/* Actions footer */}
              <div className="px-5 py-3 bg-neutral-50/70 dark:bg-neutral-900/60 border-t border-neutral-200/70 dark:border-white/5 flex items-center justify-between gap-3">
                <Link
                  href={`/dashboard/user/products/${item.id}`}
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 transition-colors group/link cursor-pointer"
                >
                  <span>Overview & Details</span>
                  <ExternalLink className="size-3 transition-transform group-hover/link:translate-x-0.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setRequestModalProduct(item);
                    setFormErrors({});
                    const start = getDefaultStartDate();
                    const end = getDefaultEndDate(start);
                    setRequestForm({
                      startDate: start,
                      endDate: end,
                      timezone: DEFAULT_TIMEZONE,
                      accessPurpose: "Evaluation",
                      organizationName: "",
                      countryName: "India",
                      comments: `Requesting access for ${item.head}`,
                    });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                >
                  <KeyRound className="size-3.5 text-amber-500" />
                  <span>Request Access</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* PAGINATION CONTROLS (15 PRODUCTS PER PAGE)               */}
      {/* ======================================================== */}
      {pagination.total > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            Showing{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">
              {(page - 1) * limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">
              {Math.min(page * limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">
              {pagination.total}
            </span>{" "}
            solutions
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setPage(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="size-4" />
            </button>
            <button
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-neutral-800 dark:text-neutral-200">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => {
                setPage((p) => Math.min(pagination.totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              onClick={() => {
                setPage(pagination.totalPages);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: FULL SOLUTION OVERVIEW & DETAILS                  */}
      {/* ======================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[85vh] rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-800/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-20 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-1 flex items-center justify-center shrink-0">
                  {selectedProduct.oemImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={resolveOemLogoUrl(selectedProduct.oemImage)}
                      alt={selectedProduct.oem}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Building2 className="size-6 text-neutral-400" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {selectedProduct.oem}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {selectedProduct.head}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/user/products/${selectedProduct.id}`}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500 shadow-2xs transition-colors"
                >
                  <span>Full Page View</span>
                  <ExternalLink className="size-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(null);
                    setFullProductData(null);
                  }}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModalTab("overview")}
                className={cn(
                  "py-3 border-b-2 transition-colors cursor-pointer",
                  modalTab === "overview"
                    ? "border-amber-500 text-amber-600 dark:text-amber-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                )}
              >
                Overview & Architecture
              </button>
              <button
                type="button"
                onClick={() => setModalTab("videos")}
                className={cn(
                  "py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer",
                  modalTab === "videos"
                    ? "border-amber-500 text-amber-600 dark:text-amber-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                )}
              >
                <Video className="size-3.5 text-amber-500" />
                <span>Videos & Demos</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {fullProductData?.ytvideos?.length || 0}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("support")}
                className={cn(
                  "py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer",
                  modalTab === "support"
                    ? "border-amber-500 text-amber-600 dark:text-amber-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                )}
              >
                <Headphones className="size-3.5 text-amber-500" />
                <span>Support</span>
                {selectedProduct.supportContent ? (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    Active
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-500">
                    Desk
                  </span>
                )}
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-gold-scrollbar text-xs">
              {productDetailsLoading ? (
                <div className="p-12 flex flex-col items-center justify-center text-neutral-400">
                  <Loader2 className="size-6 animate-spin text-amber-500 mb-2" />
                  <p className="text-xs">Loading complete solution details...</p>
                </div>
              ) : (
                <>
                  {modalTab === "overview" && (
                    <div className="space-y-6">
                      {selectedProduct.headDetails && (
                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-neutral-700 dark:text-neutral-300">
                          <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                            Executive Summary
                          </h4>
                          <p className="leading-relaxed">
                            {selectedProduct.headDetails}
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                          Technical Details & Use Cases
                        </h4>
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans
                                     prose-headings:text-neutral-900 dark:prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                                     prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:my-3 prose-ul:my-3 prose-li:my-1 prose-strong:text-neutral-900 dark:prose-strong:text-white"
                          dangerouslySetInnerHTML={{
                            __html:
                              decodeHtmlEntities(selectedProduct.overView) ||
                              "<p class='italic text-neutral-400'>No detailed technical overview provided.</p>",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {modalTab === "videos" && (
                    <div className="space-y-4">
                      {Array.isArray(fullProductData?.ytvideos) &&
                      fullProductData.ytvideos.length > 0 ? (
                        fullProductData.ytvideos.map((yt, idx) => {
                          const ytCode = yt.ytCode;
                          return (
                            <div
                              key={idx}
                              className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-black aspect-video max-w-xl mx-auto"
                            >
                              <iframe
                                src={`https://www.youtube.com/embed/${ytCode}`}
                                title={`Product video ${idx}`}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center text-neutral-400 italic py-8">
                          No product demonstration videos published for this
                          solution.
                        </p>
                      )}
                    </div>
                  )}

                  {modalTab === "support" && (
                    <div className="space-y-4">
                      {selectedProduct.supportContent ? (
                        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                              <UserCheck className="size-5" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                                Designated Solution Lead / Engineer
                              </span>
                              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                                {selectedProduct.oem} Solution Contact Matrix
                              </h4>
                            </div>
                          </div>

                          <div
                            className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700
                                       prose prose-sm dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 font-sans leading-relaxed
                                       prose-h1:text-sm prose-h1:font-bold prose-h1:text-neutral-900 dark:prose-h1:text-white prose-h1:my-1
                                       prose-h2:text-xs prose-h2:font-bold prose-h2:text-neutral-900 dark:prose-h2:text-white prose-h2:my-1
                                       prose-p:text-xs prose-p:my-1 prose-p:text-neutral-700 dark:prose-p:text-neutral-300"
                            dangerouslySetInnerHTML={{
                              __html: decodeHtmlEntities(selectedProduct.supportContent),
                            }}
                          />
                        </div>
                      ) : (
                        <div className="p-12 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-2">
                          <Headphones className="size-8 mx-auto text-neutral-400" />
                          <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                            Enterprise COE Support Desk
                          </h4>
                          <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                            No dedicated individual engineer assigned. Contact our central support desk at{" "}
                            <span className="font-mono text-amber-600 dark:text-amber-400">coe-support@ivaluegroup.com</span> for assistance.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 bg-neutral-50/50 dark:bg-neutral-800/50">
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setFullProductData(null);
                }}
                className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const p = selectedProduct;
                  setSelectedProduct(null);
                  setFullProductData(null);
                  setRequestModalProduct(p);
                  setFormErrors({});
                  const start = getDefaultStartDate();
                  const end = getDefaultEndDate(start);
                  setRequestForm({
                    startDate: start,
                    endDate: end,
                    timezone: DEFAULT_TIMEZONE,
                    accessPurpose: "Evaluation",
                    organizationName: "",
                    countryName: "India",
                    comments: `Requesting evaluation sandbox for ${p.head}`,
                  });
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-md shadow-amber-500/20"
              >
                <KeyRound className="size-3.5" />
                <span>Request Access</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SUBMIT LAB REQUEST FORM                           */}
      {/* ======================================================== */}
      {requestModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  COE Reservation
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                  Request Access: {requestModalProduct.head}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalProduct(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={handleRequestSubmit}
              noValidate
              className="space-y-4 text-xs"
            >
              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="prod-modal-startDate"
                    className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                  >
                    Preferred Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="prod-modal-startDate"
                    type="date"
                    min={getMinStartDate()}
                    value={requestForm.startDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleInputChange("startDate", val);
                      handleInputChange("endDate", val);
                    }}
                    className={cn(
                      "w-full p-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white transition-all outline-none",
                      formErrors.startDate
                        ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/30 dark:bg-rose-950/20"
                        : "border-neutral-300 dark:border-neutral-700 focus:border-amber-500"
                    )}
                  />
                  {formErrors.startDate && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="size-3 shrink-0" />
                      <span>{formErrors.startDate}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="prod-modal-endDate"
                    className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                  >
                    Preferred End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="prod-modal-endDate"
                    type="date"
                    min={requestForm.startDate || getMinStartDate()}
                    value={requestForm.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className={cn(
                      "w-full p-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white transition-all outline-none",
                      formErrors.endDate
                        ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/30 dark:bg-rose-950/20"
                        : "border-neutral-300 dark:border-neutral-700 focus:border-amber-500"
                    )}
                  />
                  {formErrors.endDate && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="size-3 shrink-0" />
                      <span>{formErrors.endDate}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Worldwide Timezones */}
              <div>
                <label
                  htmlFor="prod-modal-timezone"
                  className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                >
                  Evaluation Timezone (Worldwide) <span className="text-rose-500">*</span>
                </label>
                <select
                  id="prod-modal-timezone"
                  value={requestForm.timezone}
                  onChange={(e) => handleInputChange("timezone", e.target.value)}
                  className={cn(
                    "w-full p-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white transition-all outline-none cursor-pointer",
                    formErrors.timezone
                      ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/30 dark:bg-rose-950/20"
                      : "border-neutral-300 dark:border-neutral-700 focus:border-amber-500"
                  )}
                >
                  {GLOBAL_TIMEZONES.map((tz, i) => (
                    <option key={i} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
                {formErrors.timezone && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="size-3 shrink-0" />
                    <span>{formErrors.timezone}</span>
                  </p>
                )}
              </div>

              {/* Company & Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="prod-modal-organizationName"
                    className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                  >
                    Company / Organization <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="prod-modal-organizationName"
                    type="text"
                    placeholder="e.g. iValue / Enterprise Corp"
                    value={requestForm.organizationName}
                    onChange={(e) =>
                      handleInputChange("organizationName", e.target.value)
                    }
                    className={cn(
                      "w-full p-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white transition-all outline-none",
                      formErrors.organizationName
                        ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/30 dark:bg-rose-950/20"
                        : "border-neutral-300 dark:border-neutral-700 focus:border-amber-500"
                    )}
                  />
                  {formErrors.organizationName && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="size-3 shrink-0" />
                      <span>{formErrors.organizationName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="prod-modal-countryName"
                    className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                  >
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="prod-modal-countryName"
                    type="text"
                    placeholder="e.g. India"
                    value={requestForm.countryName}
                    onChange={(e) => handleInputChange("countryName", e.target.value)}
                    className={cn(
                      "w-full p-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white transition-all outline-none",
                      formErrors.countryName
                        ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/30 dark:bg-rose-950/20"
                        : "border-neutral-300 dark:border-neutral-700 focus:border-amber-500"
                    )}
                  />
                  {formErrors.countryName && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="size-3 shrink-0" />
                      <span>{formErrors.countryName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Access Purpose (Demo vs Evaluation) - Positioned directly above Evaluation Purpose / Project Comments */}
              <div className="space-y-1.5 pt-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                  <span>
                    Access Purpose <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal">
                    Select engagement objective
                  </span>
                </label>

                <div
                  id="prod-modal-accessPurpose"
                  className={cn(
                    "grid grid-cols-2 gap-3 p-1 rounded-xl transition-all",
                    formErrors.accessPurpose &&
                      "p-1.5 rounded-xl border border-rose-500 bg-rose-50/30 dark:bg-rose-950/20"
                  )}
                >
                  {ACCESS_PURPOSES.map((purpose) => {
                    const isSelected = requestForm.accessPurpose === purpose.id;
                    const Icon = purpose.id === "Evaluation" ? Laptop : Tv2;

                    return (
                      <button
                        key={purpose.id}
                        type="button"
                        onClick={() => handleInputChange("accessPurpose", purpose.id)}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between",
                          isSelected
                            ? "border-amber-500 bg-amber-500/10 text-neutral-900 dark:text-white shadow-2xs ring-1 ring-amber-500/30"
                            : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-bold text-xs flex items-center gap-1.5">
                            <Icon
                              className={cn(
                                "size-3.5",
                                isSelected ? "text-amber-500" : "text-neutral-400"
                              )}
                            />
                            <span>{purpose.title}</span>
                          </span>
                          <span
                            className={cn(
                              "size-3 rounded-full border flex items-center justify-center",
                              isSelected
                                ? "border-amber-500 bg-amber-500"
                                : "border-neutral-400"
                            )}
                          >
                            {isSelected && (
                              <span className="size-1 rounded-full bg-black dark:bg-white" />
                            )}
                          </span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                          {purpose.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {formErrors.accessPurpose && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="size-3 shrink-0" />
                    <span>{formErrors.accessPurpose}</span>
                  </p>
                )}
              </div>

              {/* Purpose / Project Comments */}
              <div>
                <label
                  htmlFor="prod-modal-comments"
                  className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                >
                  Evaluation Purpose / Project Comments <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="prod-modal-comments"
                  rows={3}
                  placeholder="Specify POC objectives, technical requirements, or demo agenda..."
                  value={requestForm.comments}
                  onChange={(e) => handleInputChange("comments", e.target.value)}
                  className={cn(
                    "w-full p-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white resize-none transition-all outline-none",
                    formErrors.comments
                      ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/30 dark:bg-rose-950/20"
                      : "border-neutral-300 dark:border-neutral-700 focus:border-amber-500"
                  )}
                />
                {formErrors.comments && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="size-3 shrink-0" />
                    <span>{formErrors.comments}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setRequestModalProduct(null)}
                  disabled={submittingRequest}
                  className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submittingRequest ? (
                    <Loader2 className="size-4 animate-spin text-amber-500" />
                  ) : (
                    <KeyRound className="size-3.5 text-amber-500" />
                  )}
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
