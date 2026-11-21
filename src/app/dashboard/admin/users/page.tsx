
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Users
          </h1>

          <p className="mt-2 text-gray-600">
            View, search, and manage all PizzaHub users.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Users</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {totalUsers}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Customers</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {totalCustomers}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Vendors</p>
            <h2 className="mt-2 text-3xl font-bold text-purple-600">
              {totalVendors}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Admins</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {totalAdmins}
            </h2>
          </div>

        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm md:flex-row">

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="vendor">Vendors</option>
            <option value="admin">Admins</option>
          </select>

        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            <table className="w-full min-w-[750px] text-left">

              <thead className="bg-gray-100 text-sm text-gray-600">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Plan</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {users.map((user) => (
                  <tr key={user._id}>

                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        {user.image ? (
                          <Image
                            src={user.image}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.name || "Unknown User"}
                          </p>

                          <p className="text-sm text-gray-500">
                            {user.email}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4 capitalize text-gray-700">
                      {user.role || "customer"}
                    </td>

                    {/* Plan */}
                    <td className="px-5 py-4 capitalize text-gray-700">
                      {user.subscriptionPlan || "Free"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      {user.role === "admin" ? (
                        <span className="text-sm text-gray-400">
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
                          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
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
          )}

        </div>
      </div>
    </div>
  );
}
