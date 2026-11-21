
"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  totalUsers: number;
  customers: number;
  vendors: number;
  admins: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  approvedMenuItems: number;
  totalTransactions: number;
  totalRevenue: number;
}

const getAuthToken = async (): Promise<string> => {
  const response = await fetch(
    "http://localhost:5000/api/auth/get-session",
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const token = response.headers.get("set-auth-jwt");

  if (!response.ok || !token) {
    throw new Error("Please sign in again");
  }

  return token;
};

export default function Page() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getAuthToken();

      const response = await fetch(
        "http://localhost:5000/api/admin/stats",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch dashboard statistics"
        );
      }

      setStats(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl rounded-xl bg-red-100 p-5 text-red-700">
          {error || "Unable to load dashboard statistics"}
          <button
            onClick={fetchStats}
            className="ml-3 rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      color: "text-blue-600",
    },
    {
      title: "Customers",
      value: stats.customers,
      color: "text-green-600",
    },
    {
      title: "Vendors",
      value: stats.vendors,
      color: "text-purple-600",
    },
    {
      title: "Admins",
      value: stats.admins,
      color: "text-orange-600",
    },
    {
      title: "Total Menu Items",
      value: stats.totalMenuItems,
      color: "text-blue-600",
    },
    {
      title: "Pending Items",
      value: stats.pendingMenuItems,
      color: "text-yellow-600",
    },
    {
      title: "Approved Items",
      value: stats.approvedMenuItems,
      color: "text-green-600",
    },
    {
      title: "Transactions",
      value: stats.totalTransactions,
      color: "text-purple-600",
    },
  ];

  const maxMenuValue = Math.max(
    stats.totalMenuItems,
    stats.pendingMenuItems,
    stats.approvedMenuItems,
    1
  );

  const maxUserValue = Math.max(
    stats.customers,
    stats.vendors,
    stats.admins,
    1
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Overview of your PizzaHub platform.
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
          >
            Refresh Statistics
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>
              <h2
                className={`mt-3 text-3xl font-bold ${card.color}`}
              >
                {card.value.toLocaleString()}
              </h2>
            </div>
          ))}
        </div>

        {/* Revenue */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Revenue
          </p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            ${stats.totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Completed Premium subscription transactions
          </p>
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* User Role Chart */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Users Overview
            </h2>

            {[
              {
                label: "Customers",
                value: stats.customers,
                color: "bg-green-500",
              },
              {
                label: "Vendors",
                value: stats.vendors,
                color: "bg-purple-500",
              },
              {
                label: "Admins",
                value: stats.admins,
                color: "bg-orange-500",
              },
            ].map((item) => (
              <div key={item.label} className="mb-5">
                <div className="mb-2 flex justify-between">
                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className="font-bold text-gray-900">
                    {item.value}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${(item.value / maxUserValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Menu Items Chart */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Menu Items Overview
            </h2>

            {[
              {
                label: "Total Items",
                value: stats.totalMenuItems,
                color: "bg-blue-500",
              },
              {
                label: "Pending Items",
                value: stats.pendingMenuItems,
                color: "bg-yellow-500",
              },
              {
                label: "Approved Items",
                value: stats.approvedMenuItems,
                color: "bg-green-500",
              },
            ].map((item) => (
              <div key={item.label} className="mb-5">
                <div className="mb-2 flex justify-between">
                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className="font-bold text-gray-900">
                    {item.value}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${(item.value / maxMenuValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
