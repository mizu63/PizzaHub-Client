
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: "customer" | "vendor" | "admin";
  isBlocked?: boolean;
  businessName?: string;
  subscriptionPlan?: string;
  createdAt?: string;
}

export default function AdminManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [updatingId, setUpdatingId] = useState("");

  const getAuthToken = async () => {
    const response = await fetch(
      "http://localhost:5000/api/auth/get-session",
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Please sign in again");
    }

    const token = response.headers.get("set-auth-jwt");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    return token;
  };

  // Fetch all users for statistics
  const fetchAllUsers = async () => {
    const token = await getAuthToken();

    const response = await fetch(
      "http://localhost:5000/api/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch all users");
    }

    setAllUsers(result.data || []);
  };

  // Fetch filtered users for table
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getAuthToken();

      const params = new URLSearchParams();

      if (role !== "all") {
        params.set("role", role);
      }

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(
        `http://localhost:5000/api/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch users");
      }

      setUsers(result.data || []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update user block status
  const updateBlockStatus = async (
    id: string,
    isBlocked: boolean
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      const token = await getAuthToken();

      const response = await fetch(
        `http://localhost:5000/api/users/${id}/block`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isBlocked }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user");
      }

      await Promise.all([fetchUsers(), fetchAllUsers()]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Update failed"
      );
    } finally {
      setUpdatingId("");
    }
  };

  // Initial statistics fetch
  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        await fetchAllUsers();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load statistics"
        );
      }
    };

    loadAllUsers();
  }, []);

  // Search and role filter
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [role, search]);

  // Statistics use all users, not filtered users
  const totalUsers = allUsers.length;

  const totalCustomers = allUsers.filter(
    (user) => user.role === "customer"
  ).length;

  const totalVendors = allUsers.filter(
    (user) => user.role === "vendor"
  ).length;

  const totalAdmins = allUsers.filter(
    (user) => user.role === "admin"
  ).length;

  const statistics = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: "👥",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Customers",
      value: totalCustomers,
      icon: "🛍️",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Vendors",
      value: totalVendors,
      icon: "🍽️",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Admins",
      value: totalAdmins,
      icon: "🛡️",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <main className="min-h-screen space-y-8 bg-[#fffaf5] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#a92318] via-[#d93824] to-[#f07827] p-7 text-white shadow-xl shadow-orange-200/40 sm:p-10">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />
          <div className="absolute -bottom-24 right-40 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
                🛡️ User Administration
              </span>

              <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
                Manage Users
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                View, search and manage customer, vendor and admin
                accounts across your PizzaHub platform.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold">
                  ✦ User Management
                </span>
                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold">
                  ✓ Account Control
                </span>
              </div>
            </div>

            <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-6xl backdrop-blur-sm lg:flex">
              👥
            </div>
          </div>
        </section>

        {/* Statistics Heading */}
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d93824]">
            Platform Analytics
          </p>

          <h2 className="mt-2 text-2xl font-black text-gray-900">
            User Statistics
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Overview of all registered accounts.
          </p>
        </section>

        {/* Statistics Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-500">
                  {item.title}
                </p>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${item.bg}`}
                >
                  {item.icon}
                </div>
              </div>

              <h3 className={`mt-5 text-3xl font-black ${item.color}`}>
                {item.value.toLocaleString()}
              </h3>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-orange-400 to-[#d93824]" />
              </div>
            </div>
          ))}
        </section>

        {/* Search and Filter */}
        <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d93824]">
              Find Accounts
            </p>

            <h2 className="mt-2 text-xl font-black text-gray-900">
              Search & Filter Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Search by name or email and filter accounts by role.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_240px]">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">
                🔎
              </span>

              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#fffaf5] py-3.5 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#d93824] focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#fffaf5] px-4 py-3.5 text-sm font-semibold text-gray-700 outline-none transition focus:border-[#d93824] focus:ring-4 focus:ring-orange-100"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="vendor">Vendors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <p>{error}</p>
            <button
              onClick={fetchUsers}
              className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Users Table */}
        <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-100 p-6 sm:p-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d93824]">
                Account Directory
              </p>

              <h2 className="mt-2 text-xl font-black text-gray-900 sm:text-2xl">
                All Users
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Manage registered PizzaHub accounts.
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 px-4 py-3">
              <p className="text-xs font-semibold text-gray-500">
                Displayed Users
              </p>
              <p className="mt-1 text-xl font-black text-[#d93824]">
                {users.length}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-10">
              <div className="h-11 w-11 animate-spin rounded-full border-4 border-orange-100 border-t-[#d93824]" />
              <p className="mt-5 text-sm font-semibold text-gray-500">
                Loading user accounts...
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="px-6 py-16 text-center sm:py-20">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-4xl">
                👥
              </div>

              <h3 className="mt-6 text-xl font-black text-gray-800">
                No Users Found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-500">
                No accounts match your current search or selected role.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#fff7f0] text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-5 font-bold">User</th>
                    <th className="px-6 py-5 font-bold">Role</th>
                    <th className="px-6 py-5 font-bold">Plan</th>
                    <th className="px-6 py-5 font-bold">Status</th>
                    <th className="px-6 py-5 font-bold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-orange-50">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition-colors hover:bg-orange-50/50"
                    >
                      {/* User */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt=""
                              width={44}
                              height={44}
                              className="h-11 w-11 shrink-0 rounded-xl border border-orange-100 object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-lg font-black text-[#d93824]">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}

                          <div>
                            <p className="font-bold text-gray-900">
                              {user.name || "Unknown User"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                            user.role === "admin"
                              ? "bg-orange-50 text-orange-700"
                              : user.role === "vendor"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {user.role || "customer"}
                        </span>
                      </td>

                      {/* Plan */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                            user.subscriptionPlan?.toLowerCase() === "premium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.subscriptionPlan || "Free"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                            user.isBlocked
                              ? "bg-red-50 text-red-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5">
                        {user.role === "admin" ? (
                          <span className="inline-flex rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-500">
                            Admin Account
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              updateBlockStatus(
                                user._id,
                                !user.isBlocked
                              )
                            }
                            disabled={updatingId === user._id}
                            className={`min-w-24 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${
                              user.isBlocked
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {updatingId === user._id
                              ? "Updating..."
                              : user.isBlocked
                                ? "Unblock"
                                : "Block"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Footer Note */}
        <div className="rounded-2xl border border-orange-100 bg-white px-5 py-4">
          <p className="flex items-start gap-3 text-xs leading-6 text-gray-500 sm:text-sm">
            <span className="text-lg">🔒</span>
            <span>
              User account management is restricted to authorized
              administrators.
            </span>
          </p>
        </div>

        <div className="pb-5 text-center">
          <p className="text-xs font-medium tracking-wider text-gray-400">
            PIZZAHUB ADMIN USER MANAGEMENT
          </p>
        </div>
      </div>
    </main>
  );
}
