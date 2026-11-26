"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Lock,
  Edit3,
  Save,
  X,
  Copy,
  Check,
  Loader2,
  Clock,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserProfilePage() {
  const { data: session } = useSession();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Mode (Authorized for Admins only)
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    userType: "user",
    accessTillDate: "",
  });

  // Toast feedback
  const [feedback, setFeedback] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const handleCopyEmail = (email) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    showToast("success", "Email address copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Fetch Profile Data
  const loadProfile = async (showLoadingState = true) => {
    if (showLoadingState) setLoading(true);
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        setEditForm({
          name: data.profile.name || "",
          userType: data.profile.userType || "user",
          accessTillDate: data.profile.accessTillDate || "",
        });
        if (data.stats) setStats(data.stats);
      } else {
        setError(data.message || "Failed to load profile details.");
      }
    } catch {
      setError("Network error connecting to profile identity service.");
    } finally {
      if (showLoadingState) setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function initLoad() {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (active) {
          if (data.success && data.profile) {
            setProfile(data.profile);
            setEditForm({
              name: data.profile.name || "",
              userType: data.profile.userType || "user",
              accessTillDate: data.profile.accessTillDate || "",
            });
            if (data.stats) setStats(data.stats);
          } else {
            setError(data.message || "Failed to load profile details.");
          }
        }
      } catch {
        if (active) setError("Network error connecting to profile identity service.");
      } finally {
        if (active) setLoading(false);
      }
    }
    initLoad();
    return () => {
      active = false;
    };
  }, []);

  // Save changes (Admin privilege)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name?.trim()) {
      showToast("error", "Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          userType: editForm.userType,
          accessTillDate: editForm.accessTillDate,
          targetEmail: profile?.email,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("success", "Profile attributes updated successfully.");
        setIsEditing(false);
        loadProfile(false);
      } else {
        showToast("error", data.message || "Failed to update profile.");
      }
    } catch {
      showToast("error", "Network error saving profile changes.");
    } finally {
      setSaving(false);
    }
  };

  // Helper to calculate days remaining until accessTillDate
  const getDaysRemaining = (dateStr) => {
    if (!dateStr) return null;
    try {
      const target = new Date(dateStr);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      target.setHours(0, 0, 0, 0);
      const diffTime = target.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  const daysRemaining = profile?.accessTillDate
    ? getDaysRemaining(profile.accessTillDate)
    : null;

  const userInitial = (profile?.name || session?.user?.name || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={cn(
            "fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold backdrop-blur-md border animate-in slide-in-from-top-4 duration-300",
            feedback.type === "success"
              ? "bg-emerald-500/90 text-white border-emerald-600/30"
              : "bg-rose-500/90 text-white border-rose-600/30"
          )}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="ml-2 hover:opacity-75"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Account Management
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="text-[10px] font-mono text-neutral-400">
              Security Tier 1
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2.5">
            <User className="size-6 text-amber-500" />
            <span>User Account Profile</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Review your authenticated identity credentials, role-based account type, and access validation parameters.
          </p>
        </div>

        {/* Live Identity Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Session</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
            {profile?.provider === "microsoft" ? "Azure AD SSO" : "Google OAuth 2.0"}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center text-neutral-400">
          <Loader2 className="size-8 animate-spin text-amber-500 mb-3" />
          <p className="text-xs">Loading profile parameters...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 space-y-3">
          <AlertCircle className="size-10 mx-auto text-rose-500" />
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Unable to Load Profile
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            {error}
          </p>
          <button
            type="button"
            onClick={() => loadProfile(true)}
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {/* ======================================================== */}
          {/* SECTION 1: HERO IDENTITY CARD                            */}
          {/* ======================================================== */}
          <div className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0f0f11] p-6 lg:p-8 shadow-2xs relative overflow-hidden">
            {/* Ambient Background Watermark */}
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 pointer-events-none opacity-5 dark:opacity-10">
              <ShieldCheck className="size-64 text-amber-500" />
            </div>

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Profile Photo or Styled Monogram Avatar */}
                <div className="size-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden text-2xl font-black text-amber-600 dark:text-amber-400">
                  {profile.profileImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                  <span className="absolute bottom-1 right-1 size-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0f0f11]" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
                      {profile.name}
                    </h2>

                    {/* Role Pill */}
                    {profile.isAdmin ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <ShieldAlert className="size-3" />
                        <span>Administrator</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <ShieldCheck className="size-3" />
                        <span>Standard User</span>
                      </span>
                    )}

                    {/* UID */}
                    <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                      ID #{profile.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="font-mono">{profile.email}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(profile.email)}
                      className="p-1 hover:text-amber-500 transition-colors"
                      title="Copy Email"
                    >
                      {copiedEmail ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Admin Action Button / Read-only Notice */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {profile.isAdmin ? (
                  !isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                    >
                      <Edit3 className="size-3.5 text-amber-500" />
                      <span>Edit Attributes</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            name: profile.name,
                            userType: profile.userType,
                            accessTillDate: profile.accessTillDate,
                          });
                        }}
                        className="px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50"
                      >
                        {saving ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Save className="size-3.5" />
                        )}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 text-xs text-neutral-600 dark:text-neutral-400">
                    <Lock className="size-3.5 text-neutral-400" />
                    <span>Protected Account (Read-Only)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: THE 4 CORE DETAILS SPECIFIED BY USER          */}
          {/* (Name, Email, Account Type, Access Validate Fetch)       */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="size-4 text-amber-500" />
                  <span>Account Credentials & Entitlements</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Core identity fields synchronized directly from the enterprise database table.
                </p>
              </div>

              {!profile.isAdmin && (
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5">
                  <Lock className="size-3 text-neutral-400" />
                  <span>Non-Editable (Admin Managed)</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 1: Name */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f11] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <User className="size-3.5 text-amber-500" />
                    <span>Full Name</span>
                  </span>
                  {!isEditing ? (
                    <span className="text-[10px] font-mono text-neutral-400">
                      Primary Identity
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                      Editable (Admin)
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-white outline-none focus:border-amber-500"
                    placeholder="User full name"
                  />
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      {profile.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      Verified
                    </span>
                  </div>
                )}
                <p className="text-[11px] text-neutral-400">
                  {profile.isAdmin
                    ? "Display name recognized in sandbox audit logs."
                    : "Synchronized with your authenticated enterprise identity."}
                </p>
              </div>

              {/* Field 2: Email (Strictly non-editable) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f11] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <Mail className="size-3.5 text-amber-500" />
                    <span>Email Address</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="size-3" />
                    <span>Validated</span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white truncate">
                    {profile.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(profile.email)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-amber-500 transition-colors shrink-0"
                    title="Copy Email"
                  >
                    {copiedEmail ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Immutable primary account anchor used for VDI provisioning and OTP delivery.
                </p>
              </div>

              {/* Field 3: Account Type */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f11] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <ShieldAlert className="size-3.5 text-amber-500" />
                    <span>Account Type</span>
                  </span>
                  {!isEditing ? (
                    <span className="text-[10px] font-mono text-neutral-400">
                      RBAC Classification
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                      Editable (Admin)
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <select
                    value={editForm.userType}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        userType: e.target.value,
                      }))
                    }
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-white outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="user">user (Standard Solution Evaluator)</option>
                    <option value="admin">admin (Full Portal Administrator)</option>
                    <option value="employee">employee (iValue Solutions Engineer)</option>
                    <option value="partner">partner (OEM Technology Partner)</option>
                  </select>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold capitalize text-neutral-900 dark:text-white flex items-center gap-2">
                      <span className="size-2 rounded-full bg-amber-500" />
                      <span>{profile.userType || "Standard User"}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold uppercase">
                      Tier: {profile.userType}
                    </span>
                  </div>
                )}
                <p className="text-[11px] text-neutral-400">
                  Dictates platform capabilities: catalog reservation, approval matrix, and admin studios.
                </p>
              </div>

              {/* Field 4: Access Validate Fetch (accessTillDate) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f11] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-amber-500" />
                    <span>Access Validate (Expiration)</span>
                  </span>
                  {daysRemaining !== null && daysRemaining > 0 ? (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {daysRemaining} Days Left
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-rose-500 font-bold">
                      Expired
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <input
                    type="date"
                    value={editForm.accessTillDate}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        accessTillDate: e.target.value,
                      }))
                    }
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-white outline-none focus:border-amber-500 cursor-pointer"
                  />
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
                      {profile.accessTillDate || "Continuous Access"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="size-2.5" />
                      <span>Valid</span>
                    </span>
                  </div>
                )}
                <p className="text-[11px] text-neutral-400">
                  Fetched directly from database. Authorizes session authentication and sandbox reservations.
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 3: INNOVATION & UPGRADATIONS                     */}
          {/* Activity Metrics + Shortcuts + Security Governance       */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <span>Solution Engagement & Sandbox Activity</span>
            </h3>

            {/* Quick Stat Strips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0f0f11] shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                    Total Inquiries
                  </span>
                  <Layers className="size-4 text-neutral-400" />
                </div>
                <p className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1">
                  {stats.totalRequests}
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Requested lab solutions
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0f0f11] shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Approved VDI Labs
                  </span>
                  <CheckCircle2 className="size-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  {stats.approvedRequests}
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Active credentials provisioned
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0f0f11] shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Pending Reviews
                  </span>
                  <Clock className="size-4 text-amber-500" />
                </div>
                <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
                  {stats.pendingRequests}
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Under admin review
                </p>
              </div>
            </div>

            {/* Quick Action Navigation Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/dashboard/user/products"
                className="p-5 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent hover:border-amber-500/40 transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Layers className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      Browse OEM Solutions Catalog
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Explore technology architectures and submit sandbox reservations.
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>

              <Link
                href="/dashboard/user/track"
                className="p-5 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent hover:border-blue-500/40 transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Track My Product Requests
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Check real-time approval status, access dates, and VDI credentials.
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-neutral-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </div>

            {/* Enterprise Security & Identity Policy Card */}
            <div className="p-5 rounded-2xl bg-neutral-50/70 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-white/5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-bold">
                <Info className="size-4 text-amber-500 shrink-0" />
                <span>Enterprise Identity & Access Governance Policy</span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Your profile credentials (name, email, account role, and access validation expiry) are synchronized with the central iValue COE database. Standard accounts cannot alter access levels or validity windows directly. For entitlement upgrades, evaluation extension requests, or administrative privileges, please contact your designated administrator at{" "}
                <a
                  href="mailto:coe-support@ivaluegroup.com?subject=COE%20Account%20Entitlement%20Request"
                  className="text-amber-600 dark:text-amber-400 font-mono hover:underline inline-flex items-center gap-1"
                >
                  <span>coe-support@ivaluegroup.com</span>
                  <ExternalLink className="size-2.5" />
                </a>.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
