"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  UserPlus,
  Search,
  Download,
  RefreshCw,
  Trash2,
  Edit3,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Database,
  Globe,
  Loader2,
  ArrowUpRight,
  UserCheck,
  Shield,
  Mail,
  User as UserIcon,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const currentAdminEmail = session?.user?.email?.toLowerCase();

  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    regularUsers: 0,
    googleCount: 0,
    msCount: 0,
  });

  // Modals & Feedback
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState([]);
  const [batchDeleteModalOpen, setBatchDeleteModalOpen] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "user",
    provider: "google",
    accessTillDate: "",
    profileImage: "",
  });

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users?limit=all");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
        if (data.stats) setStats(data.stats);
      } else {
        showToast("error", data.message || "Failed to load users from database.");
      }
    } catch {
      showToast("error", "Network error: Failed to connect to /api/admin/users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/users?limit=all");
        const data = await res.json();
        if (active && data.success && Array.isArray(data.users)) {
          setUsers(data.users);
          if (data.stats) setStats(data.stats);
        }
      } catch {
        // error handled on user action
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Filtered & Paginated Users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          String(u.id).includes(q) ||
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => (u.userType || "").toLowerCase() === roleFilter);
    }

    if (providerFilter !== "all") {
      result = result.filter((u) => (u.provider || "").toLowerCase() === providerFilter);
    }

    return result;
  }, [users, searchQuery, roleFilter, providerFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / limit));
  const safePage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safePage - 1) * limit;
    return filteredUsers.slice(start, start + limit);
  }, [filteredUsers, safePage, limit]);

  // Selectable users on current page (excluding current active admin to prevent self-deletion)
  const selectablePaginatedUsers = useMemo(() => {
    return paginatedUsers.filter(
      (u) => !currentAdminEmail || (u.email || "").toLowerCase() !== currentAdminEmail
    );
  }, [paginatedUsers, currentAdminEmail]);

  const isAllSelected =
    selectablePaginatedUsers.length > 0 &&
    selectablePaginatedUsers.every((u) => selectedIds.includes(u.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = selectablePaginatedUsers.map((u) => u.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = selectablePaginatedUsers.map((u) => u.id);
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

  const handleBatchDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    setBatchLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message || `Successfully deleted ${selectedIds.length} user(s).`);
        setSelectedIds([]);
        setBatchDeleteModalOpen(false);
        fetchUsers();
      } else {
        showToast("error", data.message || "Failed to delete selected users.");
      }
    } catch {
      showToast("error", "Network error during batch deletion.");
    } finally {
      setBatchLoading(false);
    }
  };

  // Handle Role Toggle
  const handleRoleToggle = async (user) => {
    const newRole = user.userType === "admin" ? "user" : "admin";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, userType: newRole }),
      });
      const data = await res.json();

      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, userType: newRole } : u))
        );
        showToast("success", `User "${user.name}" role updated to ${newRole.toUpperCase()}.`);
        fetchUsers();
      } else {
        showToast("error", data.message || "Failed to toggle role.");
      }
    } catch {
      showToast("error", "Network error updating role.");
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const defaultDate = nextYear.toISOString().split("T")[0];

    setFormData({
      name: "",
      email: "",
      userType: "user",
      provider: "google",
      accessTillDate: defaultDate,
      profileImage: "",
    });
    setIsAddModalOpen(true);
  };

  // Handle Add User Submit
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast("error", "Name and email are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        showToast("success", data.message || "User created successfully!");
        setIsAddModalOpen(false);
        fetchUsers();
      } else {
        showToast("error", data.message || "Failed to create user.");
      }
    } catch {
      showToast("error", "Network error creating user.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      userType: user.userType || "user",
      provider: user.provider || "google",
      accessTillDate: user.accessTillDate || "",
      profileImage: user.profileImage || "",
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit User Submit
  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedUser.id,
          ...formData,
        }),
      });
      const data = await res.json();

      if (data.success) {
        showToast("success", data.message || "User updated successfully!");
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        showToast("error", data.message || "Failed to update user.");
      }
    } catch {
      showToast("error", "Network error updating user.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    if (currentAdminEmail && selectedUser.email.toLowerCase() === currentAdminEmail) {
      showToast("error", "Action blocked: You cannot delete your own active administrator account.");
      setIsDeleteModalOpen(false);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        showToast("success", data.message || "User deleted permanently.");
        setIsDeleteModalOpen(false);
        fetchUsers();
      } else {
        showToast("error", data.message || "Failed to delete user.");
      }
    } catch {
      showToast("error", "Network error deleting user.");
    } finally {
      setSubmitting(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!filteredUsers.length) {
      showToast("error", "No users to export.");
      return;
    }

    const headers = ["ID", "Name", "Email", "UserType", "Provider", "AccessTillDate", "ProfileImage"];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${(u.name || "").replace(/"/g, '""')}"`,
      `"${(u.email || "").replace(/"/g, '""')}"`,
      u.userType,
      u.provider,
      `"${u.accessTillDate || ""}"`,
      `"${u.profileImage || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ivaluecoe_userlist_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("success", "Exported users list to CSV.");
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
                Directory
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-mono border border-neutral-200 dark:border-white/10 text-neutral-500">
                <Database className="size-2.5" />
                ivaluecoe.userlist
              </span>
            </div>

            <h1 className="text-2xl font-medium tracking-tight text-neutral-900 dark:text-white font-sans">
              User <span className="font-montserrat font-medium tracking-tight capitalize text-yellow-800 dark:text-orange-100">directory &amp; roles</span>
            </h1>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              Inspect all registered identities, switch role privileges between user and admin, and assign laboratory access periods.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* ChaiUI Secondary Asymmetric Button */}
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
              onClick={fetchUsers}
              disabled={loading}
              className="rounded-none rounded-tl-lg rounded-br-lg border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={cn("size-3", loading && "animate-spin text-neutral-400")} />
              <span>Refresh</span>
            </button>

            {/* ChaiUI Primary Solid Button */}
            <button
              type="button"
              onClick={openAddModal}
              className="rounded-none rounded-tr-lg rounded-bl-lg bg-neutral-900 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 transition-colors cursor-pointer"
            >
              <UserPlus className="size-3.5" />
              <span>Add user</span>
              <ArrowUpRight className="size-3" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total</span>
            <Users className="size-3.5 text-neutral-400" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.total}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Records in userlist</p>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Admins</span>
            <Shield className="size-3.5 text-neutral-400" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.admins}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Privileged accounts</p>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Standard</span>
            <UserCheck className="size-3.5 text-neutral-400" />
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white font-montserrat">
            {stats.regularUsers}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">userType: &apos;user&apos;</p>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Providers</span>
            <Globe className="size-3.5 text-neutral-400" />
          </div>
          <div className="flex items-center gap-2 pt-0.5 font-montserrat text-xs">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{stats.googleCount} Google</span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{stats.msCount} MS</span>
          </div>
          <p className="text-[10px] text-neutral-500 mt-0.5">Bifurcated logins</p>
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
              placeholder="Filter by name, email, or ID..."
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

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-white/5 rounded-md px-2 py-1 border border-neutral-200 dark:border-white/10">
              <span className="text-[10px] font-mono uppercase text-neutral-500">Role</span>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
              >
                <option value="all" className="dark:bg-neutral-900">All</option>
                <option value="admin" className="dark:bg-neutral-900">Admins</option>
                <option value="user" className="dark:bg-neutral-900">Users</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-white/5 rounded-md px-2 py-1 border border-neutral-200 dark:border-white/10">
              <span className="text-[10px] font-mono uppercase text-neutral-500">SSO</span>
              <select
                value={providerFilter}
                onChange={(e) => {
                  setProviderFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
              >
                <option value="all" className="dark:bg-neutral-900">All</option>
                <option value="google" className="dark:bg-neutral-900">Google</option>
                <option value="microsoft" className="dark:bg-neutral-900">Microsoft</option>
                <option value="credentials" className="dark:bg-neutral-900">Credentials</option>
              </select>
            </div>

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
                <option value={5} className="dark:bg-neutral-900">5</option>
                <option value={10} className="dark:bg-neutral-900">10</option>
                <option value={25} className="dark:bg-neutral-900">25</option>
                <option value={50} className="dark:bg-neutral-900">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Userlist Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-white/[0.02] text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    disabled={selectablePaginatedUsers.length === 0}
                    className="size-3.5 rounded border-neutral-300 dark:border-white/20 text-neutral-900 focus:ring-0 cursor-pointer accent-neutral-900 dark:accent-white disabled:opacity-40"
                    title="Select all on this page"
                  />
                </th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">userType</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Access Till</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 dark:divide-white/5 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <Loader2 className="size-5 animate-spin text-neutral-400 mx-auto mb-1.5" />
                    <span className="text-xs">Loading records...</span>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <p className="font-medium text-neutral-800 dark:text-neutral-200 text-xs">No users found</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Try clearing your filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isAdmin = (user.userType || "").toLowerCase() === "admin";
                  const isCurrentAdmin = currentAdminEmail && user.email.toLowerCase() === currentAdminEmail;
                  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

                  return (
                    <tr
                      key={user.id}
                      className={cn(
                        "hover:bg-neutral-500/[0.03] dark:hover:bg-white/[0.02] transition-colors",
                        selectedIds.includes(user.id) && "bg-neutral-100/60 dark:bg-white/[0.04]"
                      )}
                    >
                      {/* Selection Checkbox */}
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(user.id)}
                          disabled={isCurrentAdmin}
                          onChange={() => toggleSelectOne(user.id)}
                          className="size-3.5 rounded border-neutral-300 dark:border-white/20 text-neutral-900 focus:ring-0 cursor-pointer accent-neutral-900 dark:accent-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title={isCurrentAdmin ? "Cannot select own account" : `Select User #${user.id}`}
                        />
                      </td>

                      {/* ID */}
                      <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                        #{user.id}
                      </td>

                      {/* User Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-neutral-800 dark:bg-neutral-700 flex items-center justify-center text-white font-medium text-[11px] border border-white/10 shrink-0 overflow-hidden">
                            {user.profileImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={user.profileImage}
                                alt={user.name}
                                className="size-full object-cover"
                              />
                            ) : (
                              <span>{initial}</span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-neutral-900 dark:text-white truncate flex items-center gap-1.5">
                              {user.name || "Unnamed"}
                              {isCurrentAdmin && (
                                <span className="text-[9px] font-mono px-1 rounded bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-neutral-500 truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleRoleToggle(user)}
                          title={`Click to switch role to ${isAdmin ? "user" : "admin"}`}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer border",
                            isAdmin
                              ? "border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/5 hover:bg-red-500/15"
                              : "border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5"
                          )}
                        >
                          <span className={cn("size-1.5 rounded-full", isAdmin ? "bg-red-500" : "bg-neutral-400")} />
                          <span>{user.userType}</span>
                        </button>
                      </td>

                      {/* Provider */}
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                          {user.provider || "credentials"}
                        </span>
                      </td>

                      {/* Access Till Date */}
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-[11px]">
                          <Calendar className="size-3 text-neutral-400 shrink-0" />
                          <span>{user.accessTillDate || "Unlimited"}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            title="Edit details"
                            className="p-1.5 rounded border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
                          >
                            <Edit3 className="size-3" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(user)}
                            disabled={isCurrentAdmin}
                            title={isCurrentAdmin ? "Cannot delete yourself" : "Delete User"}
                            className={cn(
                              "p-1.5 rounded border transition cursor-pointer",
                              isCurrentAdmin
                                ? "opacity-30 cursor-not-allowed border-neutral-200 dark:border-white/10 text-neutral-400"
                                : "border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-red-600 dark:hover:text-red-400"
                            )}
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

        {/* Pagination Footer */}
        <div className="p-3 border-t border-neutral-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div>
            Showing <span className="font-mono text-neutral-900 dark:text-white">{filteredUsers.length === 0 ? 0 : (safePage - 1) * limit + 1}</span> to{" "}
            <span className="font-mono text-neutral-900 dark:text-white">{Math.min(safePage * limit, filteredUsers.length)}</span> of{" "}
            <span className="font-mono text-neutral-900 dark:text-white">{filteredUsers.length}</span>
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

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#121212] p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-white/10">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                Add new user
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Role (userType)
                  </label>
                  <select
                    value={formData.userType}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#161616] px-2.5 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Provider
                  </label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#161616] px-2.5 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="google">Google</option>
                    <option value="microsoft">Microsoft</option>
                    <option value="credentials">Credentials</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Access till date
                </label>
                <input
                  type="date"
                  value={formData.accessTillDate}
                  onChange={(e) => setFormData({ ...formData, accessTillDate: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Profile image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.profileImage}
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
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
                  className="rounded-none rounded-tr-lg rounded-bl-lg bg-neutral-900 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="size-3 animate-spin" />}
                  <span>Save record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#121212] p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-white/10">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
                Edit user #{selectedUser?.id}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Role (userType)
                  </label>
                  <select
                    value={formData.userType}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#161616] px-2.5 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Provider
                  </label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#161616] px-2.5 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="google">Google</option>
                    <option value="microsoft">Microsoft</option>
                    <option value="credentials">Credentials</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Access till date
                </label>
                <input
                  type="date"
                  value={formData.accessTillDate}
                  onChange={(e) => setFormData({ ...formData, accessTillDate: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none"
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
                  className="rounded-none rounded-tr-lg rounded-bl-lg bg-neutral-900 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="size-3 animate-spin" />}
                  <span>Save changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (ChaiUI Destructive Rule) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#121212] p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-montserrat">
              Delete user #{selectedUser?.id}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
              This will permanently remove <span className="font-semibold text-neutral-900 dark:text-white">{selectedUser?.name}</span> ({selectedUser?.email}) from the MySQL database. This action cannot be undone.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
              >
                Keep user
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={submitting}
                className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {submitting ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

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
            {/* Multi Delete Only (as requested) */}
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
                  Delete {selectedIds.length} Selected Users?
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Permanently removing {selectedIds.length} account(s) from MySQL database
                </p>
              </div>
            </div>

            <div className="text-xs text-rose-700 dark:text-rose-300 bg-rose-500/5 p-3 rounded-lg border border-rose-500/20 space-y-1">
              <p className="font-semibold">
                ⚠️ Warning: This action cannot be undone.
              </p>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                These {selectedIds.length} records will be permanently erased from <code className="font-mono text-[10px]">ivaluecoe.userlist</code>.
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
