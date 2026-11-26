"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Sparkles,
  FileText,
  Building2,
  Plus,
  Search,
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
  UploadCloud,
  FileCheck,
  Video,
  Key,
  ListOrdered,
  Tag,
  Eye,
  Check,
  Save,
  Send,
  Lock,
  Globe,
  SlidersHorizontal,
  FolderOpen,
  ArrowRight,
  Copy,
  ExternalLink,
  Code,
  Bold,
  Italic,
  Underline,
  List,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// CDN Base Fallbacks
const DEFAULT_CDN_BASE = "https://storage.googleapis.com/test-coe-portal";
const OEM_CDN_FALLBACK = "https://storage.googleapis.com/cdn.ivaluetv.com/oem";

function resolveAssetUrl(filename, folder = "") {
  if (!filename) return "";
  if (
    filename.startsWith("http://") ||
    filename.startsWith("https://") ||
    filename.startsWith("data:") ||
    filename.startsWith("/")
  ) {
    return filename;
  }
  const bucketBase =
    process.env.NEXT_PUBLIC_GCP_STORAGE_BASE_URL || DEFAULT_CDN_BASE;
  const cleanBase = bucketBase.replace(/\/+$/, "");
  const cleanFolder = folder ? `${folder.replace(/^\/+|\/+$/g, "")}/` : "";
  const cleanFile = filename.replace(/^\/+/, "");
  return `${cleanBase}/${cleanFolder}${cleanFile}`;
}

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
  return `${OEM_CDN_FALLBACK}/${clean}`;
}

// Extract YouTube embed code or ID
function extractYouTubeId(urlOrCode) {
  if (!urlOrCode) return "";
  const str = urlOrCode.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  const match = str.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : str;
}

const WIZARD_STEPS = [
  { id: 1, key: "basic", title: "Basic Info", desc: "Title, OEM & Summary" },
  { id: 2, key: "overview", title: "Overview", desc: "Detailed Description" },
  { id: 3, key: "playbooks", title: "Playbooks", desc: "Documents & Guides" },
  { id: 4, key: "support", title: "Support", desc: "Engineering Contacts" },
  { id: 5, key: "access", title: "How to Access", desc: "Steps & Credentials" },
  { id: 6, key: "videos", title: "Videos", desc: "YouTube & CDN Demos" },
  { id: 7, key: "review", title: "Review & Publish", desc: "Live Preview & Actions" },
];

export default function AdminNewContentPage() {
  // Mode: "studio" (wizard) | "directory" (table list)
  const [activeTab, setActiveTab] = useState("studio");

  // Directory Data
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | published | draft | private
  const [oemFilter, setOemFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    private: 0,
    comingSoon: 0,
  });

  // Dropdown Lookups from backend
  const [availableOems, setAvailableOems] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  // Multi-select for directory batch delete
  const [selectedIds, setSelectedIds] = useState([]);
  const [batchDeleteModalOpen, setBatchDeleteModalOpen] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [singleDeleteId, setSingleDeleteId] = useState(null);

  // Feedback notifications
  const [feedback, setFeedback] = useState(null);
  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Studio Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [editingContentId, setEditingContentId] = useState(null);
  const [submittingStatus, setSubmittingStatus] = useState(null); // 'published' | 'draft' | 'private' | null
  const [uploadingFile, setUploadingFile] = useState(false);

  // Form State matching the database schema
  const [formData, setFormData] = useState({
    head: "",
    headDetails: "",
    oem: "",
    oemImage: "",
    overView: "",
    howToAccess: "",
    supportContent: "",
    accessSteps: [
      {
        stepNumber: 1,
        stepTitle: "Access Portal",
        stepDescription: "Open the URL in the browser to log in to ivcoe.",
        stepImage: "",
      },
    ],
    accessCredentials: [
      {
        type: "Web Console",
        username: "admin",
        password: "",
        url: "https://ivcoe.ivaluegroup.com",
        description: "Primary Administrator Portal Credentials",
      },
    ],
    comingSoon: "No",
    contentStatus: "draft",
    ytvideos: [
      {
        ytCode: "",
        ytType: "single",
      },
    ],
    cdnvideos: [],
    categories: [],
    playbooks: [],
    resources: [],
  });

  // Access Subtab (Steps vs Credentials in Step 5)
  const [accessSubTab, setAccessSubTab] = useState("steps");

  // Overview Editor Mode: 'wysiwyg' | 'code'
  const [editorMode, setEditorMode] = useState("wysiwyg");
  const wysiwygRef = useRef(null);

  // Load Content List & Lookups
  const fetchContents = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const q = encodeURIComponent(searchQuery);
      const res = await fetch(
        `/api/admin/content?page=${page}&limit=${limit}&search=${q}&status=${statusFilter}&oem=${oemFilter}`
      );
      const data = await res.json();
      if (data.success) {
        setContents(data.contents || []);
        if (data.pagination) setPagination(data.pagination);
        if (data.stats) setStats(data.stats);
        if (data.availableOems) setAvailableOems(data.availableOems);
        if (data.availableCategories)
          setAvailableCategories(data.availableCategories);
      } else {
        showToast("error", data.message || "Failed to fetch content library.");
      }
    } catch {
      showToast("error", "Network error: Unable to load content items.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter, oemFilter]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const q = encodeURIComponent(searchQuery);
        const res = await fetch(
          `/api/admin/content?page=${page}&limit=${limit}&search=${q}&status=${statusFilter}&oem=${oemFilter}`
        );
        const data = await res.json();
        if (active && data.success) {
          setContents(data.contents || []);
          if (data.pagination) setPagination(data.pagination);
          if (data.stats) setStats(data.stats);
          if (data.availableOems) setAvailableOems(data.availableOems);
          if (data.availableCategories)
            setAvailableCategories(data.availableCategories);
        }
      } catch {
        // silent initial load catch
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [page, limit, searchQuery, statusFilter, oemFilter]);

  // Load Single Content for Editing
  const loadContentForEdit = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content?id=${id}`);
      const data = await res.json();
      if (data.success && data.content) {
        const c = data.content;
        let parsedSteps = [];
        try {
          parsedSteps = c.accessSteps ? JSON.parse(c.accessSteps) : [];
        } catch {
          parsedSteps = [];
        }
        if (!Array.isArray(parsedSteps) || parsedSteps.length === 0) {
          parsedSteps = [
            {
              stepNumber: 1,
              stepTitle: "Access Portal",
              stepDescription: "Open the URL in the browser to log in to ivcoe.",
              stepImage: "",
            },
          ];
        }

        let parsedCreds = [];
        try {
          parsedCreds = c.accessCredentials
            ? JSON.parse(c.accessCredentials)
            : [];
        } catch {
          parsedCreds = [];
        }
        if (!Array.isArray(parsedCreds) || parsedCreds.length === 0) {
          parsedCreds = [
            {
              type: "Web Console",
              username: "admin",
              password: "",
              url: "",
              description: "",
            },
          ];
        }

        setFormData({
          head: c.head || "",
          headDetails: c.headDetails || "",
          oem: c.oem || "",
          oemImage: c.oemImage || "",
          overView: c.overView || "",
          howToAccess: c.howToAccess || "",
          supportContent: c.supportContent || "",
          accessSteps: parsedSteps,
          accessCredentials: parsedCreds,
          comingSoon: c.comingSoon || "No",
          contentStatus: c.contentStatus || "draft",
          ytvideos:
            Array.isArray(c.ytvideos) && c.ytvideos.length > 0
              ? c.ytvideos
              : [{ ytCode: "", ytType: "single" }],
          cdnvideos: c.cdnvideos || [],
          categories: (c.categories || []).map((cat) => cat.category),
          playbooks: c.playbooks || [],
          resources: c.resources || [],
        });

        setEditingContentId(c.id);
        setCurrentStep(1);
        setActiveTab("studio");
        showToast("success", `Editing: "${c.head}" (#${c.id})`);
      } else {
        showToast("error", data.message || "Failed to load content record.");
      }
    } catch {
      showToast("error", "Failed to retrieve content details.");
    } finally {
      setLoading(false);
    }
  };

  // Reset Studio Form to New Content Defaults
  const resetStudioForm = () => {
    setEditingContentId(null);
    setCurrentStep(1);
    setFormData({
      head: "",
      headDetails: "",
      oem: "",
      oemImage: "",
      overView: "",
      howToAccess: "",
      supportContent: "",
      accessSteps: [
        {
          stepNumber: 1,
          stepTitle: "Access Portal",
          stepDescription: "Open the URL in the browser to log in to ivcoe.",
          stepImage: "",
        },
      ],
      accessCredentials: [
        {
          type: "Web Console",
          username: "admin",
          password: "",
          url: "https://ivcoe.ivaluegroup.com",
          description: "Primary Administrator Portal Credentials",
        },
      ],
      comingSoon: "No",
      contentStatus: "draft",
      ytvideos: [{ ytCode: "", ytType: "single" }],
      cdnvideos: [],
      categories: [],
      playbooks: [],
      resources: [],
    });
  };

  // Upload handler to GCS via /api/admin/content/upload
  const handleFileUpload = async (file, folder = "content") => {
    if (!file) return null;
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);

    setUploadingFile(true);
    try {
      const res = await fetch("/api/admin/content/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Uploaded ${data.filename} to Cloud Storage.`);
        return data;
      } else {
        showToast("error", data.message || "Upload failed.");
        return null;
      }
    } catch (err) {
      showToast("error", "File upload failed: " + err.message);
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  // Auto-fill OEM logo when OEM dropdown changes
  const handleOemChange = (selectedOemName) => {
    const matched = availableOems.find((o) => o.oemName === selectedOemName);
    setFormData((prev) => ({
      ...prev,
      oem: selectedOemName,
      oemImage: matched?.logo || prev.oemImage,
    }));
  };

  // Step Validation before progressing
  const validateStep = (stepNumber) => {
    if (stepNumber === 1) {
      if (!formData.head.trim()) {
        showToast("error", "Please provide a Solution Heading.");
        return false;
      }
      if (!formData.oem.trim()) {
        showToast("error", "Please select an OEM Partner.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Publishing Handlers for the 3 distinct buttons:
  // 1. "Publish" -> status: "published"
  // 2. "Publish Draft" -> status: "draft"
  // 3. "Private" -> status: "private"
  const handleFinalPublish = async (targetStatus) => {
    if (!formData.head.trim()) {
      showToast("error", "Solution Heading is required before publishing.");
      setCurrentStep(1);
      return;
    }
    if (!formData.oem.trim()) {
      showToast("error", "OEM partner is required before publishing.");
      setCurrentStep(1);
      return;
    }

    setSubmittingStatus(targetStatus);

    try {
      const payload = {
        ...formData,
        contentStatus: targetStatus,
      };

      const isUpdate = Boolean(editingContentId);
      const url = "/api/admin/content";
      const method = isUpdate ? "PUT" : "POST";

      if (isUpdate) {
        payload.id = editingContentId;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        const actionLabel =
          targetStatus === "published"
            ? "Published Live"
            : targetStatus === "draft"
            ? "Saved as Draft"
            : "Marked as Private";
        showToast("success", `Content successfully ${actionLabel}!`);
        fetchContents();
        setActiveTab("directory");
        resetStudioForm();
      } else {
        showToast("error", data.message || "Failed to save content.");
      }
    } catch {
      showToast("error", "Network error: Unable to submit content.");
    } finally {
      setSubmittingStatus(null);
    }
  };

  // Single & Batch Delete
  const handleDeleteConfirm = async () => {
    if (!singleDeleteId && selectedIds.length === 0) return;
    setBatchLoading(true);
    try {
      let res;
      if (singleDeleteId) {
        res = await fetch(`/api/admin/content?id=${singleDeleteId}`, {
          method: "DELETE",
        });
      } else {
        res = await fetch("/api/admin/content", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedIds }),
        });
      }
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message || "Content removed successfully.");
        setSingleDeleteId(null);
        setSelectedIds([]);
        setBatchDeleteModalOpen(false);
        fetchContents();
      } else {
        showToast("error", data.message || "Delete operation failed.");
      }
    } catch {
      showToast("error", "Error executing delete operation.");
    } finally {
      setBatchLoading(false);
    }
  };

  // Multi-Select helpers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(contents.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // WYSIWYG command helpers
  const execFormat = (command, value = null) => {
    if (typeof document !== "undefined") {
      document.execCommand(command, false, value);
      if (wysiwygRef.current) {
        setFormData((prev) => ({
          ...prev,
          overView: wysiwygRef.current.innerHTML,
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-4 md:p-8">
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

      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
                <FileText className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                OEM Content Studio
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/50">
                Studio Suite
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Create, configure, and publish rich multi-asset OEM solution
              overviews, playbooks, lab steps, and video resources.
            </p>
          </div>

          {/* Navigation Mode Switcher: Studio vs Content Library */}
          <div className="flex items-center gap-2 bg-neutral-200/70 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-300/60 dark:border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("studio")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200",
                activeTab === "studio"
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {editingContentId ? "Edit Studio" : "Publishing Studio"}
            </button>
            <button
              onClick={() => {
                setActiveTab("directory");
                fetchContents();
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200",
                activeTab === "directory"
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <FolderOpen className="w-3.5 h-3.5 text-neutral-500" />
              Content Library ({stats.total})
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* ======================================================== */}
        {/* VIEW 1: STUDIO 7-STEP PUBLISHING WIZARD                 */}
        {/* ======================================================== */}
        {activeTab === "studio" && (
          <div className="space-y-6">
            {/* Active OEM Preview Card if selected */}
            {formData.oem && (
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-white/10 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-1.5 flex items-center justify-center overflow-hidden">
                    {formData.oemImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={resolveOemLogoUrl(formData.oemImage)}
                        alt={formData.oem}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-neutral-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        {formData.oem}
                      </span>
                      {formData.comingSoon === "Yes" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {formData.head || "Untitled Solution"}
                    </h2>
                    {formData.headDetails && (
                      <p className="text-xs text-neutral-500 line-clamp-1 max-w-2xl">
                        {formData.headDetails}
                      </p>
                    )}
                  </div>
                </div>

                {editingContentId && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                      ID: #{editingContentId}
                    </span>
                    <button
                      onClick={resetStudioForm}
                      className="text-xs px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      New Content
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Stepper Navigation Indicator */}
            <div className="bg-white dark:bg-neutral-900/90 rounded-2xl border border-neutral-200/80 dark:border-white/10 p-4 shadow-sm overflow-x-auto">
              <div className="flex items-center justify-between min-w-[700px] gap-2">
                {WIZARD_STEPS.map((step, idx) => {
                  const isActive = currentStep === step.id;
                  const isDone = currentStep > step.id;
                  return (
                    <React.Fragment key={step.id}>
                      <button
                        onClick={() => {
                          if (step.id < currentStep || validateStep(currentStep)) {
                            setCurrentStep(step.id);
                          }
                        }}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-xl text-left transition-all duration-200 group",
                          isActive
                            ? "bg-amber-500/10 ring-1 ring-amber-500/30"
                            : "hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 shrink-0",
                            isActive
                              ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                              : isDone
                              ? "bg-emerald-500 text-white"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
                          )}
                        >
                          {isDone ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            step.id
                          )}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "text-xs font-semibold leading-tight",
                              isActive
                                ? "text-amber-600 dark:text-amber-400"
                                : isDone
                                ? "text-neutral-900 dark:text-white"
                                : "text-neutral-500 dark:text-neutral-400"
                            )}
                          >
                            {step.title}
                          </p>
                          <p className="text-[10px] text-neutral-400 truncate max-w-[90px]">
                            {step.desc}
                          </p>
                        </div>
                      </button>

                      {idx < WIZARD_STEPS.length - 1 && (
                        <div
                          className={cn(
                            "h-[2px] flex-1 mx-1 rounded-full transition-colors",
                            currentStep > idx + 1
                              ? "bg-emerald-500"
                              : "bg-neutral-200 dark:bg-neutral-800"
                          )}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Linear Progress Bar */}
              <div className="mt-4 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-300"
                  style={{
                    width: `${((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Wizard Body Cards */}
            <div className="bg-white dark:bg-neutral-900/90 rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-sm p-6 md:p-8">
              {/* STEP 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-neutral-200 dark:border-white/10 pb-4">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                      Step 1: Add New Content - Core Details
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Define the solution heading, partner OEM association, and
                      executive summary.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Heading */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        Heading <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CyberArk Privilege Cloud (P-Cloud) or Akamai App & API Protector"
                        value={formData.head}
                        onChange={(e) =>
                          setFormData({ ...formData, head: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                      />
                    </div>

                    {/* OEM Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        Partner OEM <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.oem}
                        onChange={(e) => handleOemChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-neutral-900 dark:text-white"
                      >
                        <option value="">-- Select an OEM Partner --</option>
                        {availableOems.map((o) => (
                          <option key={o.id} value={o.oemName}>
                            {o.oemName}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-neutral-400">
                        Select from your active OEM repository. The OEM logo will
                        be linked automatically.
                      </p>
                    </div>

                    {/* Launching Soon Toggle */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        Launching Soon / Coming Soon
                      </label>
                      <select
                        value={formData.comingSoon}
                        onChange={(e) =>
                          setFormData({ ...formData, comingSoon: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-neutral-900 dark:text-white"
                      >
                        <option value="No">No - Ready for Lab Engagement</option>
                        <option value="Yes">Yes - Display Coming Soon Badge</option>
                      </select>
                      <p className="text-[11px] text-neutral-400">
                        When enabled, visitors will see a preview badge before
                        direct lab reservation opens.
                      </p>
                    </div>

                    {/* Heading Details */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        Heading Details / Executive Summary
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Provide a concise 2-3 sentence overview highlighting the business context and technical capabilities of this lab solution..."
                        value={formData.headDetails}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headDetails: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-neutral-900 dark:text-white placeholder:text-neutral-400 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Overview (WYSIWYG Editor) */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-white/10 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                        Step 2: Add Solution Overview
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Author comprehensive solution architecture, typical use
                        cases, and why customers choose this solution.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setEditorMode(
                            editorMode === "wysiwyg" ? "code" : "wysiwyg"
                          )
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <Code className="w-3.5 h-3.5" />
                        {editorMode === "wysiwyg" ? "HTML Source" : "Visual Mode"}
                      </button>
                    </div>
                  </div>

                  {/* WYSIWYG Toolbar */}
                  {editorMode === "wysiwyg" && (
                    <div className="flex flex-wrap items-center gap-1 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs">
                      <button
                        type="button"
                        onClick={() => execFormat("bold")}
                        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        title="Bold"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execFormat("italic")}
                        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        title="Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execFormat("underline")}
                        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        title="Underline"
                      >
                        <Underline className="w-4 h-4" />
                      </button>

                      <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-600 mx-1" />

                      <button
                        type="button"
                        onClick={() => execFormat("formatBlock", "<h1>")}
                        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        title="Heading 1"
                      >
                        <Heading1 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execFormat("formatBlock", "<h2>")}
                        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        title="Heading 2"
                      >
                        <Heading2 className="w-4 h-4" />
                      </button>

                      <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-600 mx-1" />

                      <button
                        type="button"
                        onClick={() => execFormat("insertUnorderedList")}
                        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        title="Bullet List"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execFormat("insertOrderedList")}
                        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        title="Numbered List"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>

                      <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-600 mx-1" />

                      <button
                        type="button"
                        onClick={() => execFormat("justifyLeft")}
                        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        title="Align Left"
                      >
                        <AlignLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execFormat("justifyCenter")}
                        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        title="Align Center"
                      >
                        <AlignCenter className="w-4 h-4" />
                      </button>

                      <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-600 mx-1" />

                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt("Enter hyperlink URL:");
                          if (url) execFormat("createLink", url);
                        }}
                        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        title="Insert Link"
                      >
                        <Link2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* WYSIWYG Editable Area or HTML Code View */}
                  {editorMode === "wysiwyg" ? (
                    <div
                      ref={wysiwygRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) =>
                        setFormData({
                          ...formData,
                          overView: e.currentTarget.innerHTML,
                        })
                      }
                      dangerouslySetInnerHTML={{ __html: formData.overView }}
                      className="min-h-[340px] max-h-[600px] overflow-y-auto p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 prose prose-sm dark:prose-invert max-w-none"
                      style={{ whiteSpace: "pre-wrap" }}
                    />
                  ) : (
                    <textarea
                      rows={14}
                      value={formData.overView}
                      onChange={(e) =>
                        setFormData({ ...formData, overView: e.target.value })
                      }
                      className="w-full font-mono text-xs p-4 rounded-xl bg-neutral-900 text-emerald-400 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  )}
                </div>
              )}

              {/* STEP 3: Playbooks & Resources */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-neutral-200 dark:border-white/10 pb-4">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                      Step 3: Upload Playbooks & Documentation
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Upload solution deployment playbooks, lab guides, or
                      whitepapers directly to Google Cloud Storage.
                    </p>
                  </div>

                  {/* Primary Playbook File Dropzone */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Primary Solution Playbook (PDF / Doc)
                    </label>

                    <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-amber-500 rounded-2xl p-8 text-center transition-colors bg-neutral-50/50 dark:bg-neutral-800/40">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.zip"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const result = await handleFileUpload(
                              file,
                              "playbooks"
                            );
                            if (result?.filename) {
                              setFormData((prev) => ({
                                ...prev,
                                howToAccess: result.filename,
                                playbooks: [
                                  ...prev.playbooks,
                                  { fileName: result.filename },
                                ],
                              }));
                            }
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingFile}
                      />
                      <div className="flex flex-col items-center pointer-events-none">
                        {uploadingFile ? (
                          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-3" />
                        ) : (
                          <UploadCloud className="w-10 h-10 text-neutral-400 mb-3" />
                        )}
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                          {uploadingFile
                            ? "Uploading to GCP Storage..."
                            : "Drop Playbook PDF here to upload"}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          Supported formats: PDF, DOCX, ZIP (Max 50MB)
                        </p>
                      </div>
                    </div>

                    {formData.howToAccess && (
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-medium">
                          <FileCheck className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Primary File: {formData.howToAccess}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              howToAccess: "",
                            }))
                          }
                          className="text-rose-500 hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Additional Supporting Playbooks / Resources */}
                  <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        Additional Collaterals & Architecture Guides
                      </label>
                      <label className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold cursor-pointer border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors">
                        <span>+ Add Resource</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const result = await handleFileUpload(
                                file,
                                "resources"
                              );
                              if (result?.filename) {
                                setFormData((prev) => ({
                                  ...prev,
                                  resources: [
                                    ...prev.resources,
                                    { fileName: result.filename },
                                  ],
                                }));
                              }
                            }
                          }}
                        />
                      </label>
                    </div>

                    {formData.resources.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic">
                        No additional collaterals attached yet. (Optional)
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {formData.resources.map((res, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs"
                          >
                            <span className="font-mono text-neutral-700 dark:text-neutral-300 truncate max-w-[200px]">
                              {res.fileName}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  resources: prev.resources.filter(
                                    (_, idx) => idx !== i
                                  ),
                                }));
                              }}
                              className="text-rose-500 hover:text-rose-600 ml-2"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Support Details */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-neutral-200 dark:border-white/10 pb-4">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                      Step 4: Add Support Contacts & SLA
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Specify dedicated solutions engineers, SME escalation contacts,
                      and support availability for this lab environment.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Solution Engineers & Escalation Matrix
                    </label>
                    <textarea
                      rows={8}
                      placeholder={`Akhil Navle\nakhil.navle@ivalue.co.in\n\nPaluri Prasad\npaluri.prasad@ivalue.co.in\n\nCOE Escalation Desk:\ncoe-support@ivaluegroup.com`}
                      value={formData.supportContent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          supportContent: e.target.value,
                        })
                      }
                      className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-neutral-900 dark:text-white"
                    />
                    <p className="text-[11px] text-neutral-400">
                      Enter names, emails, contact numbers, or standard markdown.
                      This information appears under the &ldquo;Support&rdquo; tab on
                      the solution portal.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 5: How to Access (Steps & Credentials) */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-white/10 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                        Step 5: Add How to Access – Steps & Credentials
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Provide step-by-step onboarding walkthroughs with optional
                        screenshots and secure access credentials.
                      </p>
                    </div>

                    {/* Subtab toggle */}
                    <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-300/60 dark:border-neutral-700">
                      <button
                        type="button"
                        onClick={() => setAccessSubTab("steps")}
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                          accessSubTab === "steps"
                            ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        )}
                      >
                        Steps ({formData.accessSteps?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccessSubTab("credentials")}
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                          accessSubTab === "credentials"
                            ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        )}
                      >
                        Credentials ({formData.accessCredentials?.length || 0})
                      </button>
                    </div>
                  </div>

                  {/* Subtab 1: Steps */}
                  {accessSubTab === "steps" && (
                    <div className="space-y-4">
                      {formData.accessSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              Step #{idx + 1}
                            </span>
                            {formData.accessSteps.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    accessSteps: prev.accessSteps.filter(
                                      (_, sIdx) => sIdx !== idx
                                    ),
                                  }));
                                }}
                                className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Remove Step
                              </button>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                              Step Description
                            </label>
                            <textarea
                              rows={2}
                              value={step.stepDescription}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormData((prev) => {
                                  const updated = [...prev.accessSteps];
                                  updated[idx] = {
                                    ...updated[idx],
                                    stepDescription: val,
                                  };
                                  return { ...prev, accessSteps: updated };
                                });
                              }}
                              placeholder="e.g. Open the URL in the browser to log in to ivcoe..."
                              className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                            />
                          </div>

                          {/* Step Screenshot / Image */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                              Step Screenshot / Diagram (Optional)
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                placeholder="GCP image link or upload below..."
                                value={step.stepImage || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData((prev) => {
                                    const updated = [...prev.accessSteps];
                                    updated[idx] = {
                                      ...updated[idx],
                                      stepImage: val,
                                    };
                                    return { ...prev, accessSteps: updated };
                                  });
                                }}
                                className="flex-1 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
                              />

                              <label className="px-3 py-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-xs font-semibold cursor-pointer transition-colors shrink-0">
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const res = await handleFileUpload(
                                        file,
                                        "steps"
                                      );
                                      if (res?.publicUrl) {
                                        setFormData((prev) => {
                                          const updated = [
                                            ...prev.accessSteps,
                                          ];
                                          updated[idx] = {
                                            ...updated[idx],
                                            stepImage: res.publicUrl,
                                          };
                                          return {
                                            ...prev,
                                            accessSteps: updated,
                                          };
                                        });
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            accessSteps: [
                              ...prev.accessSteps,
                              {
                                stepNumber: prev.accessSteps.length + 1,
                                stepTitle: `Step ${
                                  prev.accessSteps.length + 1
                                }`,
                                stepDescription: "",
                                stepImage: "",
                              },
                            ],
                          }));
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Next Step
                      </button>
                    </div>
                  )}

                  {/* Subtab 2: Credentials */}
                  {accessSubTab === "credentials" && (
                    <div className="space-y-4">
                      {formData.accessCredentials.map((cred, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              Credential Profile #{idx + 1}
                            </span>
                            {formData.accessCredentials.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    accessCredentials:
                                      prev.accessCredentials.filter(
                                        (_, cIdx) => cIdx !== idx
                                      ),
                                  }));
                                }}
                                className="text-xs text-rose-500 hover:underline font-semibold"
                              >
                                Remove Profile
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                                Interface Type
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Web Console, SSH, VPN"
                                value={cred.type || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData((prev) => {
                                    const updated = [
                                      ...prev.accessCredentials,
                                    ];
                                    updated[idx] = {
                                      ...updated[idx],
                                      type: val,
                                    };
                                    return {
                                      ...prev,
                                      accessCredentials: updated,
                                    };
                                  });
                                }}
                                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                                Target URL / Endpoint
                              </label>
                              <input
                                type="text"
                                placeholder="https://cloud.oem.com/login"
                                value={cred.url || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData((prev) => {
                                    const updated = [
                                      ...prev.accessCredentials,
                                    ];
                                    updated[idx] = {
                                      ...updated[idx],
                                      url: val,
                                    };
                                    return {
                                      ...prev,
                                      accessCredentials: updated,
                                    };
                                  });
                                }}
                                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                                Username / Account
                              </label>
                              <input
                                type="text"
                                placeholder="admin@enterprise.lab"
                                value={cred.username || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData((prev) => {
                                    const updated = [
                                      ...prev.accessCredentials,
                                    ];
                                    updated[idx] = {
                                      ...updated[idx],
                                      username: val,
                                    };
                                    return {
                                      ...prev,
                                      accessCredentials: updated,
                                    };
                                  });
                                }}
                                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                                Default Password (Optional or dynamic)
                              </label>
                              <input
                                type="text"
                                placeholder="Auto-generated or static password"
                                value={cred.password || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData((prev) => {
                                    const updated = [
                                      ...prev.accessCredentials,
                                    ];
                                    updated[idx] = {
                                      ...updated[idx],
                                      password: val,
                                    };
                                    return {
                                      ...prev,
                                      accessCredentials: updated,
                                    };
                                  });
                                }}
                                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                                Description / Special Instructions
                              </label>
                              <input
                                type="text"
                                placeholder="Use Chrome browser with self-signed certificate approval..."
                                value={cred.description || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData((prev) => {
                                    const updated = [
                                      ...prev.accessCredentials,
                                    ];
                                    updated[idx] = {
                                      ...updated[idx],
                                      description: val,
                                    };
                                    return {
                                      ...prev,
                                      accessCredentials: updated,
                                    };
                                  });
                                }}
                                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            accessCredentials: [
                              ...prev.accessCredentials,
                              {
                                type: "Web Console",
                                username: "",
                                password: "",
                                url: "",
                                description: "",
                              },
                            ],
                          }));
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Credential Profile
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: Videos (YouTube & CDN) */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-neutral-200 dark:border-white/10 pb-4">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                      Step 6: Product & Demo Videos
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Embed YouTube solution demonstrations and high-performance
                      CDN walkthrough videos.
                    </p>
                  </div>

                  {/* YouTube Embeds */}
                  <div className="space-y-4">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      YouTube Videos (Single or Playlist)
                    </label>

                    {formData.ytvideos.map((yt, idx) => {
                      const ytId = extractYouTubeId(yt.ytCode);
                      return (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              YouTube Video #{idx + 1}
                            </span>
                            {formData.ytvideos.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    ytvideos: prev.ytvideos.filter(
                                      (_, yIdx) => yIdx !== idx
                                    ),
                                  }));
                                }}
                                className="text-xs text-rose-500 hover:underline font-semibold"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 space-y-1">
                              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                                YouTube URL or Video Code
                              </label>
                              <input
                                type="text"
                                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                value={yt.ytCode}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData((prev) => {
                                    const updated = [...prev.ytvideos];
                                    updated[idx] = {
                                      ...updated[idx],
                                      ytCode: val,
                                    };
                                    return { ...prev, ytvideos: updated };
                                  });
                                }}
                                className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                                Video Type
                              </label>
                              <select
                                value={yt.ytType || "single"}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData((prev) => {
                                    const updated = [...prev.ytvideos];
                                    updated[idx] = {
                                      ...updated[idx],
                                      ytType: val,
                                    };
                                    return { ...prev, ytvideos: updated };
                                  });
                                }}
                                className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs"
                              >
                                <option value="single">Single Video</option>
                                <option value="playlist">YouTube Playlist</option>
                              </select>
                            </div>
                          </div>

                          {/* Live YouTube Preview Frame if ID detected */}
                          {ytId && (
                            <div className="mt-3 rounded-xl overflow-hidden aspect-video max-w-md bg-black">
                              <iframe
                                src={`https://www.youtube.com/embed/${ytId}`}
                                title={`YouTube preview ${idx}`}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          ytvideos: [
                            ...prev.ytvideos,
                            { ytCode: "", ytType: "single" },
                          ],
                        }));
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Another YouTube Video
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 7: Review & Final Publishing Actions */}
              {currentStep === 7 && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  <div className="border-b border-neutral-200 dark:border-white/10 pb-4">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                      Step 7: Final Overview & Live Portal Simulation
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Review the end-user representation before deploying. Use the
                      action buttons below to publish live, save as draft, or
                      restrict to private.
                    </p>
                  </div>

                  {/* Categories / Tagging Section */}
                  <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-500" />
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        Categorization & Taxonomy Tags
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {availableCategories.length === 0 ? (
                        <span className="text-xs text-neutral-400 italic">
                          No preconfigured categories found in database.
                        </span>
                      ) : (
                        availableCategories.map((c) => {
                          const isChecked = formData.categories.includes(
                            c.category
                          );
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  categories: isChecked
                                    ? prev.categories.filter(
                                        (cat) => cat !== c.category
                                      )
                                    : [...prev.categories, c.category],
                                }));
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200",
                                isChecked
                                  ? "bg-amber-500 text-black border-amber-500 shadow-sm font-semibold"
                                  : "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-amber-400"
                              )}
                            >
                              {c.category}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Live Simulation Card of Official Portal */}
                  <div className="border border-neutral-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-neutral-900">
                    <div className="bg-neutral-100 dark:bg-neutral-800/80 px-6 py-3 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500" />
                        <span className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="ml-3 text-xs font-mono text-neutral-500">
                          https://coe.ivaluegroup.com/solutions/
                          {formData.head
                            ? encodeURIComponent(
                                formData.head.toLowerCase().replace(/\s+/g, "-")
                              )
                            : "preview"}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Live Simulation
                      </span>
                    </div>

                    {/* Simulation Body */}
                    <div className="p-6 md:p-8 space-y-6">
                      {/* Top Header Banner */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-neutral-200 dark:border-white/10">
                        <div className="flex items-center gap-5">
                          <div className="w-20 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-2 flex items-center justify-center shrink-0">
                            {formData.oemImage ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={resolveOemLogoUrl(formData.oemImage)}
                                alt={formData.oem}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <Building2 className="w-8 h-8 text-neutral-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                                {formData.oem || "OEM Partner"}
                              </span>
                              {formData.comingSoon === "Yes" && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">
                              {formData.head || "Solution Title"}
                            </h1>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
                              {formData.headDetails ||
                                "Solution executive description will be showcased here."}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Status:{" "}
                            {submittingStatus ||
                              formData.contentStatus ||
                              "draft"}
                          </span>
                        </div>
                      </div>

                      {/* Portal Tab Simulation */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold">
                          <span className="pb-2.5 border-b-2 border-amber-500 text-amber-600 dark:text-amber-400">
                            Overview
                          </span>
                          <span className="pb-2.5 text-neutral-400">
                            How to Access (
                            {formData.accessSteps?.length || 0} Steps)
                          </span>
                          <span className="pb-2.5 text-neutral-400">
                            Support
                          </span>
                          <span className="pb-2.5 text-neutral-400">
                            Videos ({formData.ytvideos?.length || 0})
                          </span>
                        </div>

                        {/* Content Overview Preview */}
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none text-xs text-neutral-700 dark:text-neutral-300"
                          dangerouslySetInnerHTML={{
                            __html:
                              formData.overView ||
                              "<p class='italic text-neutral-400'>No overview content added yet.</p>",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3 Distinct Publishing Buttons Requested by User */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-white/10 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                          Ready to Commit this Content?
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Choose the appropriate visibility state. You can
                          re-edit or change visibility at any time.
                        </p>
                      </div>

                      {/* 3 User-Requested Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* 1. Publish (Live) */}
                        <button
                          type="button"
                          disabled={submittingStatus !== null}
                          onClick={() => handleFinalPublish("published")}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all duration-200 disabled:opacity-50"
                        >
                          {submittingStatus === "published" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Globe className="w-4 h-4" />
                          )}
                          <span>Publish Live</span>
                        </button>

                        {/* 2. Publish Draft */}
                        <button
                          type="button"
                          disabled={submittingStatus !== null}
                          onClick={() => handleFinalPublish("draft")}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all duration-200 disabled:opacity-50"
                        >
                          {submittingStatus === "draft" ? (
                            <Loader2 className="w-4 h-4 animate-spin text-black" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          <span>Publish Draft</span>
                        </button>

                        {/* 3. Private */}
                        <button
                          type="button"
                          disabled={submittingStatus !== null}
                          onClick={() => handleFinalPublish("private")}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs border border-neutral-700 transition-all duration-200 disabled:opacity-50"
                        >
                          {submittingStatus === "private" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                          <span>Private</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Bottom Step Controller Bar */}
              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200",
                    currentStep === 1
                      ? "opacity-40 cursor-not-allowed border-neutral-200 dark:border-neutral-800 text-neutral-400"
                      : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="text-xs text-neutral-400">
                  Step <span className="font-bold text-neutral-700 dark:text-neutral-200">{currentStep}</span> of {WIZARD_STEPS.length}
                </div>

                {currentStep < WIZARD_STEPS.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold shadow-md transition-all duration-200"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleFinalPublish("published")}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all duration-200"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Publish Solution</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: CONTENT DIRECTORY / EXISTING CONTENT LIST       */}
        {/* ======================================================== */}
        {activeTab === "directory" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick Stat Counter Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div
                onClick={() => setStatusFilter("all")}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer",
                  statusFilter === "all"
                    ? "bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10 hover:border-neutral-300"
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  All Content
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  {stats.total}
                </p>
              </div>

              <div
                onClick={() => setStatusFilter("published")}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer",
                  statusFilter === "published"
                    ? "bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/20"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10 hover:border-neutral-300"
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Published
                </p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                  {stats.published}
                </p>
              </div>

              <div
                onClick={() => setStatusFilter("draft")}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer",
                  statusFilter === "draft"
                    ? "bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10 hover:border-neutral-300"
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Drafts
                </p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
                  {stats.draft}
                </p>
              </div>

              <div
                onClick={() => setStatusFilter("private")}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer",
                  statusFilter === "private"
                    ? "bg-neutral-500/10 border-neutral-500/40 ring-1 ring-neutral-500/20"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10 hover:border-neutral-300"
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Private
                </p>
                <p className="text-2xl font-bold text-neutral-700 dark:text-neutral-300 mt-1">
                  {stats.private}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Coming Soon
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  {stats.comingSoon}
                </p>
              </div>
            </div>

            {/* Filter & Action Toolbar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search content by title, OEM, ID, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                  <option value="private">Private</option>
                </select>

                {/* OEM Filter */}
                <select
                  value={oemFilter}
                  onChange={(e) => setOemFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  <option value="all">All OEMs</option>
                  {availableOems.map((o) => (
                    <option key={o.id} value={o.oemName}>
                      {o.oemName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                {/* Refresh */}
                <button
                  onClick={fetchContents}
                  disabled={loading}
                  className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
                  title="Refresh Data"
                >
                  <RefreshCw
                    className={cn("w-4 h-4", loading && "animate-spin")}
                  />
                </button>

                {/* Create New Content Button */}
                <button
                  onClick={() => {
                    resetStudioForm();
                    setActiveTab("studio");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Content</span>
                </button>
              </div>
            </div>

            {/* Content Table */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center text-neutral-400">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
                  <p className="text-xs">Loading solutions content library...</p>
                </div>
              ) : contents.length === 0 ? (
                <div className="p-16 text-center text-neutral-400 space-y-3">
                  <FileText className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-700" />
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    No solutions found matching filters
                  </p>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Try adjusting your search criteria or create a new content
                    package using the publishing studio.
                  </p>
                  <button
                    onClick={() => {
                      resetStudioForm();
                      setActiveTab("studio");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Content
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-4 w-10">
                          <input
                            type="checkbox"
                            checked={
                              contents.length > 0 &&
                              selectedIds.length === contents.length
                            }
                            onChange={handleSelectAll}
                            className="rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                          />
                        </th>
                        <th className="p-4 w-16">ID</th>
                        <th className="p-4">Solution & OEM</th>
                        <th className="p-4">Summary</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Coming Soon</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-white/5">
                      {contents.map((item) => {
                        const isSelected = selectedIds.includes(item.id);
                        return (
                          <tr
                            key={item.id}
                            className={cn(
                              "hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors",
                              isSelected && "bg-amber-500/5 dark:bg-amber-500/10"
                            )}
                          >
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectRow(item.id)}
                                className="rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                              />
                            </td>
                            <td className="p-4 font-mono font-semibold text-neutral-500">
                              #{item.id}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-1 flex items-center justify-center shrink-0">
                                  {item.oemImage ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                      src={resolveOemLogoUrl(item.oemImage)}
                                      alt={item.oem}
                                      className="max-h-full max-w-full object-contain"
                                    />
                                  ) : (
                                    <Building2 className="w-4 h-4 text-neutral-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-neutral-900 dark:text-white line-clamp-1">
                                    {item.head}
                                  </p>
                                  <p className="text-[11px] text-amber-600 dark:text-amber-400 uppercase font-semibold">
                                    {item.oem}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 max-w-xs">
                              <p className="text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                {item.headDetails || "—"}
                              </p>
                            </td>
                            <td className="p-4">
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                  item.contentStatus === "published"
                                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                    : item.contentStatus === "draft"
                                    ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                    : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"
                                )}
                              >
                                {item.contentStatus || "draft"}
                              </span>
                            </td>
                            <td className="p-4">
                              {item.comingSoon === "Yes" ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                  Yes
                                </span>
                              ) : (
                                <span className="text-neutral-400 text-[11px]">
                                  No
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => loadContentForEdit(item.id)}
                                  className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                                  title="Edit in Studio"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSingleDeleteId(item.id);
                                    setBatchDeleteModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg border border-rose-300/60 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors"
                                  title="Delete Content"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Footer with Pagination */}
              {contents.length > 0 && (
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                  <div>
                    Showing{" "}
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {(page - 1) * limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {Math.min(page * limit, pagination.total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {pagination.total}
                    </span>{" "}
                    solutions
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-30"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 font-semibold text-neutral-800 dark:text-neutral-200">
                      {page} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(pagination.totalPages, p + 1))
                      }
                      disabled={page >= pagination.totalPages}
                      className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage(pagination.totalPages)}
                      disabled={page >= pagination.totalPages}
                      className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-30"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Batch Multi-Delete Bar */}
            {selectedIds.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-neutral-900/95 dark:bg-neutral-800/95 border border-white/10 text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
                <span className="text-xs font-medium">
                  <span className="font-bold text-amber-400">
                    {selectedIds.length}
                  </span>{" "}
                  solution{selectedIds.length > 1 ? "s" : ""} selected
                </span>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-neutral-400 hover:text-white underline font-medium"
                >
                  Clear
                </button>
                <div className="h-4 w-[1px] bg-neutral-700" />
                <button
                  onClick={() => {
                    setSingleDeleteId(null);
                    setBatchDeleteModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {batchDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-500/10">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Confirm Deletion
              </h3>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-neutral-900 dark:text-white">
                {singleDeleteId
                  ? `content package #${singleDeleteId}`
                  : `${selectedIds.length} selected content package(s)`}
              </strong>
              ? All associated videos, playbooks, categories, and credentials
              will also be cleaned up. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setBatchDeleteModalOpen(false);
                  setSingleDeleteId(null);
                }}
                disabled={batchLoading}
                className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={batchLoading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {batchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
