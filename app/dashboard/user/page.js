"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Send,
  Loader2,
  X,
  FileText,
  Video,
  Key,
  KeyRound,
  Check,
  ChevronRight,
  Laptop,
  Tv2,
  Headphones,
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

export default function UserDashboardPage() {
  const { data: session } = useSession();

  const [products, setProducts] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [requestsStats, setRequestsStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    expired: 0,
  });

  // Selected product modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Request modal
  const [requestModalProduct, setRequestModalProduct] = useState(null);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Request form state
  const [requestForm, setRequestForm] = useState({
    startDate: "",
    endDate: "",
    timezone: DEFAULT_TIMEZONE,
    accessPurpose: "Evaluation",
    organizationName: "",
    countryName: "India",
    comments: "",
  });

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
      const el = document.getElementById(`dash-modal-${firstKey}`);
      if (el) el.focus();
    }
    return Object.keys(errors).length === 0;
  };

  const currentUser = session?.user || {};
  const userName = currentUser.name || "Authenticated User";
  const userEmail = currentUser.email || "";
  const userRole = currentUser.userType || currentUser.role || "user";
  const userProvider = currentUser.provider || "google";
  const userInitial = userName.charAt(0).toUpperCase();

  const showToast = (type, message) => {
    setRequestFeedback({ type, message });
    setTimeout(() => {
      setRequestFeedback((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Fetch initial data
  const loadDashboardData = useCallback(async () => {
    try {
      const [pRes, rRes] = await Promise.all([
        fetch("/api/user/products?limit=5"),
        fetch("/api/user/requests"),
      ]);
      const [pData, rData] = await Promise.all([pRes.json(), rRes.json()]);

      if (pData.success && Array.isArray(pData.products)) {
        setProducts(pData.products);
        if (pData.pagination) {
          setTotalProductsCount(pData.pagination.totalUnfiltered || pData.products.length);
        }
      }
      if (rData.success && rData.stats) {
        setRequestsStats(rData.stats);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [pRes, rRes] = await Promise.all([
          fetch("/api/user/products?limit=5"),
          fetch("/api/user/requests"),
        ]);
        const [pData, rData] = await Promise.all([pRes.json(), rRes.json()]);

        if (active) {
          if (pData.success && Array.isArray(pData.products)) {
            setProducts(pData.products);
            if (pData.pagination) {
              setTotalProductsCount(pData.pagination.totalUnfiltered || pData.products.length);
            }
          }
          if (rData.success && rData.stats) {
            setRequestsStats(rData.stats);
          }
        }
      } catch (err) {
        console.error("Dashboard initial load error:", err);
      } finally {
        if (active) setLoadingProducts(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Handle Access Request Submission
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
        loadDashboardData();
      } else {
        showToast("error", data.message || "Failed to submit request.");
      }
    } catch {
      showToast("error", "Network error: Request submission failed.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
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

      {/* ======================================================== */}
      {/* SECTION 1: EXECUTIVE USER PROFILE BANNER                */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0f0f11] p-6 shadow-xs backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Identity & Status */}
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-xl shadow-xs shrink-0 overflow-hidden">
              {currentUser.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={currentUser.image}
                  alt={userName}
                  className="size-full object-cover"
                />
              ) : (
                userInitial
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-black">
                  COE Evaluator
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Session
                </span>
                <span className="text-[10px] font-mono text-neutral-400 uppercase">
                  {userProvider}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Welcome back, {userName}
              </h1>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
                {userEmail} • Role: {userRole}
              </p>
            </div>
          </div>

          {/* Quick Track Link */}
          <Link
            href="/dashboard/user/track"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs shadow-xs transition-all self-start md:self-auto shrink-0 group"
          >
            <Clock className="size-3.5 text-amber-500" />
            <span>Track My Requests</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 text-[10px] font-mono font-bold">
              {requestsStats.total}
            </span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: 4 CRISP KPI STAT CARDS (EXACT ADMIN STYLE)    */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Products */}
        <div className="rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0f0f11]/70 p-4.5 backdrop-blur-sm shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Active Products
            </span>
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Layers className="size-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
              {loadingProducts ? "..." : (totalProductsCount || products.length || 0)}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              Available
            </span>
          </div>
        </div>

        {/* Card 2: My Total Requests */}
        <div className="rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0f0f11]/70 p-4.5 backdrop-blur-sm shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              My Total Requests
            </span>
            <span className="p-1 rounded-md bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <Clock className="size-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
              {requestsStats.total}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              Submitted
            </span>
          </div>
        </div>

        {/* Card 3: Approved VDI Solutions */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4.5 backdrop-blur-sm shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Approved Solutions
            </span>
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300">
              {requestsStats.approved}
            </span>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
              VDI Ready
            </span>
          </div>
        </div>

        {/* Card 4: Pending Inquiries */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4.5 backdrop-blur-sm shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Pending Inquiries
            </span>
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-300">
              {requestsStats.pending}
            </span>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-medium">
              Under Review
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 3: FEATURED OEM SOLUTIONS                        */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {/* Section Header with "See All Products" */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
                <Layers className="size-4" />
              </span>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Featured OEM Solutions
              </h2>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Explore leading enterprise technologies available for reservation, testing,
              and evaluation.
            </p>
          </div>

          <Link
            href="/dashboard/user/products"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-amber-500 bg-white dark:bg-neutral-900 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 shadow-2xs transition-all group shrink-0"
          >
            <span>See All Products</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Product Cards Grid (First 4-5) */}
        {loadingProducts ? (
          <div className="p-16 flex flex-col items-center justify-center text-neutral-400">
            <Loader2 className="size-7 animate-spin text-amber-500 mb-2" />
            <p className="text-xs">Loading featured OEM products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10">
            <Layers className="size-8 mx-auto text-neutral-300 dark:text-neutral-700 mb-2" />
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              No solutions published yet
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              New OEM solutions will appear here as soon as they are published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0f0f11] shadow-2xs hover:shadow-md hover:border-amber-500/40 transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-3">
                  {/* Top Row: OEM Logo & Status */}
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

                  {/* Heading & Details */}
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {item.head}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.headDetails ||
                        "Explore architecture, implementation guides, and hands-on lab sandbox access."}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3 bg-neutral-50/70 dark:bg-neutral-900/60 border-t border-neutral-200/70 dark:border-white/5 flex items-center justify-between gap-3">
                  <Link
                    href={`/dashboard/user/products/${item.id}`}
                    className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer group/btn"
                  >
                    <span>Overview & Details</span>
                    <ExternalLink className="size-3 transition-transform group-hover/btn:translate-x-0.5" />
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
      </div>

      {/* ======================================================== */}
      {/* SECTION 4: QUICK TRACKING STRIP                          */}
      {/* ======================================================== */}
      <div className="rounded-xl border border-neutral-200/80 dark:border-white/10 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Track Your Solution Requests in Real Time
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Review review approvals, provisioned sandbox VDI credentials, and
              scheduled evaluation timeframes.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/user/track"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:border-amber-500 text-xs font-bold text-neutral-900 dark:text-white shadow-2xs transition-colors self-start sm:self-auto shrink-0"
        >
          <span>Open Track My Product</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* ======================================================== */}
      {/* MODAL: OVERVIEW & SOLUTION DETAILS MODAL                 */}
      {/* ======================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
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
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-gold-scrollbar text-xs">
              {selectedProduct.headDetails && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-neutral-700 dark:text-neutral-300">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                    Executive Summary
                  </h4>
                  <p className="leading-relaxed">{selectedProduct.headDetails}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                  Technical Architecture & Overview
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

              {selectedProduct.supportContent && (
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Headphones className="size-3.5 text-amber-500" />
                    <span>Support & Assigned Solution Lead</span>
                  </h4>
                  <div
                    className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700
                               prose prose-sm dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 font-sans leading-relaxed
                               prose-h1:text-sm prose-h1:font-bold prose-h1:text-neutral-900 dark:prose-h1:text-white prose-h1:my-1
                               prose-h2:text-xs prose-h2:font-bold prose-h2:text-neutral-900 dark:prose-h2:text-white prose-h2:my-1
                               prose-p:text-xs prose-p:my-1 prose-p:text-neutral-700 dark:prose-p:text-neutral-300"
                    dangerouslySetInnerHTML={{
                      __html: decodeHtmlEntities(selectedProduct.supportContent),
                    }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 bg-neutral-50/50 dark:bg-neutral-800/50">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const p = selectedProduct;
                  setSelectedProduct(null);
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
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs shadow-2xs cursor-pointer"
              >
                <KeyRound className="size-3.5 text-amber-500" />
                <span>Request Access</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REQUEST ACCESS FORM                               */}
      {/* ======================================================== */}
      {requestModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Evaluation Access Request
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
                    htmlFor="dash-modal-startDate"
                    className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                  >
                    Preferred Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="dash-modal-startDate"
                    type="date"
                    min={getMinStartDate()}
                    value={requestForm.startDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleInputChange("startDate", val);
                      handleInputChange("endDate", val);
                    }}
                    className={cn(
                      "w-full p-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white transition-all outline-none",
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
                    htmlFor="dash-modal-endDate"
                    className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                  >
                    Preferred End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="dash-modal-endDate"
                    type="date"
                    min={requestForm.startDate || getMinStartDate()}
                    value={requestForm.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className={cn(
                      "w-full p-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white transition-all outline-none",
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
                  htmlFor="dash-modal-timezone"
                  className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                >
                  Evaluation Timezone (Worldwide) <span className="text-rose-500">*</span>
                </label>
                <select
                  id="dash-modal-timezone"
                  value={requestForm.timezone}
                  onChange={(e) => handleInputChange("timezone", e.target.value)}
                  className={cn(
                    "w-full p-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white transition-all outline-none cursor-pointer",
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
                    htmlFor="dash-modal-organizationName"
                    className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                  >
                    Company / Organization <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="dash-modal-organizationName"
                    type="text"
                    placeholder="e.g. iValue / Enterprise Corp"
                    value={requestForm.organizationName}
                    onChange={(e) =>
                      handleInputChange("organizationName", e.target.value)
                    }
                    className={cn(
                      "w-full p-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white transition-all outline-none",
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
                    htmlFor="dash-modal-countryName"
                    className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                  >
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="dash-modal-countryName"
                    type="text"
                    placeholder="e.g. India"
                    value={requestForm.countryName}
                    onChange={(e) => handleInputChange("countryName", e.target.value)}
                    className={cn(
                      "w-full p-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white transition-all outline-none",
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

              {/* Access Purpose (Demo vs Evaluation) - Positioned directly above Evaluation Purpose / Comments */}
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
                  id="dash-modal-accessPurpose"
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
                  htmlFor="dash-modal-comments"
                  className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                >
                  Evaluation Purpose / Project Comments <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="dash-modal-comments"
                  rows={3}
                  placeholder="Specify POC objectives, technical requirements, or demo agenda..."
                  value={requestForm.comments}
                  onChange={(e) => handleInputChange("comments", e.target.value)}
                  className={cn(
                    "w-full p-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white resize-none transition-all outline-none",
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
                  className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-2xs disabled:opacity-50 cursor-pointer"
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
