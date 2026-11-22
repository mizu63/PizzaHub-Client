
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
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-orange-100 border-t-[#d93824]" />
          <p className="mt-5 text-sm font-semibold text-gray-600">
            Preparing admin dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error || !stats) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4">
        <div className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-100/40">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
            ⚠️
          </div>

          <h2 className="mt-5 text-2xl font-black text-gray-900">
            Unable to Load Dashboard
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            {error || "Unable to load dashboard statistics"}
          </p>

          <button
            onClick={fetchStats}
            className="mt-7 rounded-xl bg-[#d93824] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-[#b92d1c]"
          >
            Try Again →
          </button>
        </div>
      </main>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: "🛍️",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Vendors",
      value: stats.vendors,
      icon: "🍽️",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Admins",
      value: stats.admins,
      icon: "🛡️",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Total Menu Items",
      value: stats.totalMenuItems,
      icon: "🍕",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pending Items",
      value: stats.pendingMenuItems,
      icon: "⏳",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Approved Items",
      value: stats.approvedMenuItems,
      icon: "✓",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Transactions",
      value: stats.totalTransactions,
      icon: "💳",
      color: "text-purple-600",
      bg: "bg-purple-50",
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
    <main className="min-h-screen bg-[#fffaf5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative mb-9 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#a92318] via-[#d93824] to-[#f07827] p-7 text-white shadow-xl shadow-orange-200/50 sm:p-10 lg:p-12">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />
          <div className="absolute -bottom-28 right-40 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
                🛡️ Admin Control Center
              </span>

              <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Admin Dashboard
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                Monitor your PizzaHub platform, track performance and
                manage your restaurant marketplace from one place.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold">
                  ✦ Platform Overview
                </span>
                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold">
                  ✓ Admin Access
                </span>
              </div>
            </div>

            <div className="hidden h-36 w-36 shrink-0 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-7xl shadow-inner backdrop-blur-sm lg:flex">
              📊
            </div>
          </div>
        </section>

        <section className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d93824]">
              Platform Analytics
            </p>
            <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
              Statistics Overview
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              A quick look at your platform performance.
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="inline-flex items-center gap-2 rounded-xl bg-[#d93824] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-200/50 transition hover:-translate-y-0.5 hover:bg-[#b92d1c]"
          >
            <span>↻</span>
            Refresh Statistics
          </button>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-500">
                  {card.title}
                </p>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${card.bg}`}
                >
                  {card.icon}
                </div>
              </div>

              <h3 className={`mt-5 text-3xl font-black ${card.color}`}>
                {card.value.toLocaleString()}
              </h3>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-orange-400 to-[#d93824]" />
              </div>
            </div>
          ))}
        </section>

        <section className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#a92318] to-[#ed642b] p-7 text-white shadow-lg shadow-orange-200/40 sm:p-9">
          <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">
                Revenue Performance
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Total Revenue
              </h2>

              <p className="mt-2 text-sm text-white/80">
                Completed Premium subscription transactions
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-100">
                Total Earnings
              </p>

              <p className="mt-2 text-3xl font-black sm:text-4xl">
                $
                {stats.totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d93824]">
            Visual Analytics
          </p>
          <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
            Platform Insights
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Explore user distribution and menu item activity.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  Users Overview
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Distribution by account type
                </p>
              </div>

              <span className="rounded-xl bg-orange-50 p-3 text-2xl">
                👥
              </span>
            </div>

            {[
              {
                label: "Customers",
                value: stats.customers,
                color: "bg-green-500",
                text: "text-green-600",
              },
              {
                label: "Vendors",
                value: stats.vendors,
                color: "bg-purple-500",
                text: "text-purple-600",
              },
              {
                label: "Admins",
                value: stats.admins,
                color: "bg-orange-500",
                text: "text-orange-600",
              },
            ].map((item) => (
              <div key={item.label} className="mb-7 last:mb-0">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">
                    {item.label}
                  </span>
                  <span className={`text-sm font-black ${item.text}`}>
                    {item.value.toLocaleString()}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                    style={{
                      width: `${(item.value / maxUserValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  Menu Items Overview
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Menu submission and approval status
                </p>
              </div>

              <span className="rounded-xl bg-orange-50 p-3 text-2xl">
                🍕
              </span>
            </div>

            {[
              {
                label: "Total Items",
                value: stats.totalMenuItems,
                color: "bg-blue-500",
                text: "text-blue-600",
              },
              {
                label: "Pending Items",
                value: stats.pendingMenuItems,
                color: "bg-amber-500",
                text: "text-amber-600",
              },
              {
                label: "Approved Items",
                value: stats.approvedMenuItems,
                color: "bg-green-500",
                text: "text-green-600",
              },
            ].map((item) => (
              <div key={item.label} className="mb-7 last:mb-0">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">
                    {item.label}
                  </span>
                  <span className={`text-sm font-black ${item.text}`}>
                    {item.value.toLocaleString()}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                    style={{
                      width: `${(item.value / maxMenuValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="py-9 text-center">
          <p className="text-xs font-medium tracking-wide text-gray-400">
            PIZZAHUB ADMIN ANALYTICS
          </p>
        </div>
      </div>
    </main>
  );
}
