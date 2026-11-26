"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  KeyRound,
  ExternalLink,
  Loader2,
  X,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  Check,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  Laptop,
  Tv2,
  Headphones,
  Mail,
  UserCheck,
  LifeBuoy,
  Share2,
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

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const productId = unwrappedParams?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedLink, setCopiedLink] = useState(false);

  // Request Access Modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [requestFeedback, setRequestFeedback] = useState(null);

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

  const handleCopyShareLink = () => {
    try {
      if (typeof window !== "undefined") {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        showToast("success", "OEM Solution link copied to clipboard!");
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      showToast("error", "Unable to copy link to clipboard.");
    }
  };

  // Fetch Product Details
  useEffect(() => {
    let active = true;
    async function load() {
      if (!productId) return;
      try {
        const res = await fetch(`/api/user/products?id=${productId}`);
        const data = await res.json();
        if (active) {
          if (data.success && data.product) {
            setProduct(data.product);
            // Pre-populate form comments
            const start = getDefaultStartDate();
            const end = getDefaultEndDate(start);
            setRequestForm((prev) => ({
              ...prev,
              startDate: start,
              endDate: end,
              comments: `Requesting access for ${data.product.head}`,
            }));
          } else {
            setError(data.message || "Product solution not found.");
          }
        }
      } catch {
        if (active) setError("Failed to load solution details. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [productId]);

  // Handle Form Change with real-time error clearing
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

  // Strict Form Validation
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
    if (!requestForm.timezone?.trim()) {
      errors.timezone = "Timezone selection is required";
    }
    if (!requestForm.organizationName?.trim()) {
      errors.organizationName = "Company / Organization name is required";
    }
    if (!requestForm.countryName?.trim()) {
      errors.countryName = "Country is required";
    }
    if (!requestForm.accessPurpose?.trim()) {
      errors.accessPurpose = "Access purpose is required";
    }
    if (!requestForm.comments?.trim()) {
      errors.comments = "Please specify evaluation purpose or project comments";
    }

    setFormErrors(errors);

    // Focus first invalid element
    const firstKey = Object.keys(errors)[0];
    if (firstKey) {
      const el = document.getElementById(`form-${firstKey}`);
      if (el) el.focus();
    }

    return Object.keys(errors).length === 0;
  };

  // Submit Access Request
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
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
          contentID: product.id,
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
        showToast(
          "success",
          `Access request for "${product.head}" has been successfully submitted! Redirecting to tracking...`
        );
        setTimeout(() => {
          router.push("/dashboard/user/track");
        }, 1800);
      } else {
        showToast("error", data.message || "Request submission failed.");
      }
    } catch {
      showToast("error", "Network failure while sending request.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="p-24 flex flex-col items-center justify-center text-neutral-400 min-h-[60vh]">
        <Loader2 className="size-9 animate-spin text-amber-500 mb-3" />
        <p className="text-sm font-medium">Loading solution specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 max-w-xl mx-auto my-12 space-y-4">
        <AlertCircle className="size-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-neutral-900 dark:text-white">
          Solution Unavailable
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {error || "The requested OEM solution was not found or has been archived."}
        </p>
        <Link
          href="/dashboard/user/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs shadow-2xs hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const decodedOverview = decodeHtmlEntities(product.overView);
  const decodedSupport = decodeHtmlEntities(product.supportContent);
  const supportEmailMatch = decodedSupport.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );
  const supportEmail = supportEmailMatch ? supportEmailMatch[0] : null;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Toast Feedback */}
      {requestFeedback && (
        <div
          className={cn(
            "fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold backdrop-blur-md border animate-in slide-in-from-top-4 duration-300",
            requestFeedback.type === "success"
              ? "bg-emerald-500/90 text-white border-emerald-600/30"
              : "bg-rose-500/90 text-white border-rose-600/30"
          )}
        >
          {requestFeedback.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{requestFeedback.message}</span>
          <button
            type="button"
            onClick={() => setRequestFeedback(null)}
            className="ml-2 hover:opacity-75"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Top Header Bar: Back to Products + Breadcrumbs + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/user/products"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 font-semibold text-xs shadow-2xs transition-all shrink-0 group"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Products</span>
          </Link>

          <div className="h-4 w-px bg-neutral-200 dark:bg-white/10 hidden sm:block" />

          {/* Breadcrumb trail */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-400">
            <Link
              href="/dashboard/user/products"
              className="hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              Solutions Catalog
            </Link>
            <ChevronRight className="size-3 text-neutral-300 dark:text-neutral-600" />
            <span className="font-mono text-neutral-600 dark:text-neutral-300 font-medium">
              {product.oem}
            </span>
            <ChevronRight className="size-3 text-neutral-300 dark:text-neutral-600" />
            <span className="text-neutral-900 dark:text-white font-semibold truncate max-w-xs">
              {product.head}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer"
            title="Copy link to this OEM solution"
          >
            {copiedLink ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="size-3.5 text-amber-500" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormErrors({});
              setRequestModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <KeyRound className="size-3.5 text-amber-500" />
            <span>Request Access</span>
          </button>
        </div>
      </div>

      {/* Hero Banner: Solution Overview & Identity */}
      <div className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0f0f11] p-6 lg:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            {/* OEM Logo Badge */}
            <div className="h-16 w-32 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-2.5 flex items-center justify-center shrink-0 shadow-2xs">
              {product.oemImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={resolveOemLogoUrl(product.oemImage)}
                  alt={product.oem}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <Building2 className="size-8 text-neutral-400" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {product.oem}
                </span>

                {product.comingSoon === "Yes" ? (
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

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {product.head}
              </h1>

              <p className="text-xs text-neutral-400 font-mono">
                Product ID: #{product.id} • Key: {product.idKey?.slice(0, 16)}...
              </p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        {product.headDetails && (
          <div className="mt-6 p-4.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              <span>Executive Briefing</span>
            </h3>
            <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
              {product.headDetails}
            </p>
          </div>
        )}
      </div>

      {/* Main Content Tabs: Overview & Architecture | Playbooks & Docs | Videos & Demos */}
      <div className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0f0f11] overflow-hidden shadow-2xs">
        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-2 px-6 border-b border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-900/60 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "py-4 px-2 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer",
              activeTab === "overview"
                ? "border-amber-500 text-neutral-900 dark:text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            )}
          >
            Technical Overview & Architecture
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("videos")}
            className={cn(
              "py-4 px-2 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5",
              activeTab === "videos"
                ? "border-amber-500 text-neutral-900 dark:text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            )}
          >
            <Video className="size-3.5 text-amber-500" />
            <span>Videos & Demonstrations</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-mono",
                (product.ytvideos?.length || 0) > 0
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
              )}
            >
              {product.ytvideos?.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("support")}
            className={cn(
              "py-4 px-2 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5",
              activeTab === "support"
                ? "border-amber-500 text-neutral-900 dark:text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            )}
          >
            <Headphones className="size-3.5 text-amber-500" />
            <span>Support</span>
            {product.supportContent ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                Active
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-500">
                Available
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Technical Overview & Architecture (Clean Decoded HTML) */}
        {activeTab === "overview" && (
          <div className="p-6 lg:p-8 space-y-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4 font-mono">
                Architecture & Solution Specifications
              </h2>
              {decodedOverview ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans
                             prose-headings:text-neutral-900 dark:prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                             prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:my-3 prose-ul:my-3 prose-li:my-1 prose-strong:text-neutral-900 dark:prose-strong:text-white"
                  dangerouslySetInnerHTML={{ __html: decodedOverview }}
                />
              ) : (
                <div className="p-8 text-center rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 text-neutral-400">
                  <p className="text-xs italic">
                    No technical overview documentation has been published for this solution.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Videos & Demonstrations */}
        {activeTab === "videos" && (
          <div className="p-6 lg:p-8 space-y-6">
            <div className="pb-2 border-b border-neutral-200/80 dark:border-white/10">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Video Demonstrations & Walkthroughs
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Stream officially published solution walkthroughs and configuration demos.
              </p>
            </div>

            {Array.isArray(product.ytvideos) && product.ytvideos.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {product.ytvideos.map((yt, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black shadow-md flex flex-col"
                  >
                    <div className="aspect-video w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${yt.ytCode}`}
                        title={`Product video ${idx + 1}`}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-3 bg-neutral-900 text-white flex items-center justify-between text-xs">
                      <span className="font-semibold truncate">
                        {yt.ytCode}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Video #{idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/10 space-y-3">
                <Video className="size-10 mx-auto text-neutral-300 dark:text-neutral-700" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Not Available
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  No demonstration videos have been uploaded for this solution yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Support (Solution Lead & Engineering Matrix) */}
        {activeTab === "support" && (
          <div className="p-6 lg:p-8 space-y-6">
            <div className="pb-3 border-b border-neutral-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Headphones className="size-4 text-amber-500" />
                  <span>Technical Support & Assigned Solution Lead</span>
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Designated enterprise engineers and escalation matrix responsible for this OEM solution.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold self-start sm:self-auto">
                {product.oem} Solution Desk
              </span>
            </div>

            {decodedSupport ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Designated Engineer Card */}
                <div className="lg:col-span-2 p-6 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-gradient-to-br from-neutral-50/70 via-white to-amber-500/5 dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-800/40 shadow-xs space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <UserCheck className="size-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-0.5">
                        Assigned Solution Lead / Engineer
                      </span>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        Official Technical Point of Contact
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Coordinates architecture sizing, technical proof-of-concept, and evaluation sandbox support.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 space-y-2">
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 font-sans leading-relaxed
                                 prose-h1:text-base prose-h1:font-bold prose-h1:text-neutral-900 dark:prose-h1:text-white prose-h1:my-1
                                 prose-h2:text-sm prose-h2:font-bold prose-h2:text-neutral-900 dark:prose-h2:text-white prose-h2:my-1
                                 prose-p:text-xs prose-p:my-1 prose-p:text-neutral-700 dark:prose-p:text-neutral-300"
                      dangerouslySetInnerHTML={{ __html: decodedSupport }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {supportEmail && (
                      <a
                        href={`mailto:${supportEmail}?subject=${encodeURIComponent(
                          `COE Support Inquiry: ${product.head} (${product.oem})`
                        )}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs shadow-2xs transition-all"
                      >
                        <Mail className="size-3.5 text-amber-500" />
                        <span>Email Lead Engineer</span>
                        <ExternalLink className="size-2.5 opacity-60" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setFormErrors({});
                        setRequestModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-amber-500 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                    >
                      <KeyRound className="size-3.5 text-amber-500" />
                      <span>Request Guided Sandbox Session</span>
                    </button>
                  </div>
                </div>

                {/* Central Escalation Matrix */}
                <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-900/60 shadow-xs flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
                      <LifeBuoy className="size-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                        Enterprise COE Helpdesk
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        For cross-OEM solutions, architecture reviews, or sandbox credential escalation.
                      </p>
                    </div>
                    <div className="pt-2 text-xs font-mono space-y-1 text-neutral-600 dark:text-neutral-400">
                      <p>
                        Desk:{" "}
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          coe.support@ivaluegroup.com
                        </span>
                      </p>
                      <p>
                        Hours:{" "}
                        <span className="text-neutral-700 dark:text-neutral-300">
                          09:30 - 18:30 IST (Mon - Fri)
                        </span>
                      </p>
                      <p>
                        SLA:{" "}
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          &lt; 24 Business Hours
                        </span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={`mailto:coe.support@ivaluegroup.com?subject=${encodeURIComponent(
                      `Assistance Request: ${product.head}`
                    )}`}
                    className="w-full text-center py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                  >
                    Contact COE Helpdesk
                  </a>
                </div>
              </div>
            ) : (
              /* If no specific engineer assigned, show clean Central Desk */
              <div className="p-12 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/10 space-y-4 max-w-xl mx-auto">
                <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                  <Headphones className="size-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Enterprise COE Support Desk
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    Technical evaluation support for {product.head} is managed directly by the centralized iValue COE Solution Engineering team.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <a
                    href={`mailto:coe.support@ivaluegroup.com?subject=${encodeURIComponent(
                      `Support Query for ${product.head}`
                    )}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs shadow-2xs"
                  >
                    <Mail className="size-3.5 text-amber-500" />
                    <span>Contact Support Desk</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setFormErrors({});
                      setRequestModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:border-amber-500"
                  >
                    <KeyRound className="size-3.5 text-amber-500" />
                    <span>Request Sandbox</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: REQUEST ACCESS FORM WITH GLOBAL TIMEZONES & PURPOSE */}
      {/* ======================================================== */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] rounded-2xl bg-white dark:bg-[#0f0f11] border border-neutral-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-200 dark:border-white/10 flex items-start justify-between gap-3 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  COE Solution Access
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                  Request Access: {product.head}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form
              onSubmit={handleRequestSubmit}
              noValidate
              className="flex-1 overflow-y-auto p-6 space-y-4 text-xs custom-gold-scrollbar"
            >
              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="form-startDate"
                    className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                  >
                    Preferred Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-startDate"
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
                    htmlFor="form-endDate"
                    className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                  >
                    Preferred End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-endDate"
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

              {/* Full Global Timezones across globe (IST default) */}
              <div>
                <label
                  htmlFor="form-timezone"
                  className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                >
                  Evaluation Timezone (Worldwide) <span className="text-rose-500">*</span>
                </label>
                <select
                  id="form-timezone"
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
                    htmlFor="form-organizationName"
                    className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                  >
                    Company / Organization <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-organizationName"
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
                    htmlFor="form-countryName"
                    className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                  >
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-countryName"
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

              {/* Access Purpose Selection: Demo vs Evaluation - Placed directly ABOVE Evaluation Purpose */}
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
                  id="form-accessPurpose"
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
                  htmlFor="form-comments"
                  className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1"
                >
                  Evaluation Purpose / Project Comments <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="form-comments"
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

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
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
