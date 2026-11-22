
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: "pending" | "approved" | "rejected" | "inactive";
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
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getAuthToken();

      const response = await fetch(
        "http://localhost:5000/api/admin/menu",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch menu items"
        );
      }

      setItems(result.data || []);
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

  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      const token = await getAuthToken();

      const response = await fetch(
        `http://localhost:5000/api/admin/menu/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Status update failed"
        );
      }

      await fetchMenuItems();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Status update failed"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-orange-100 border-t-[#d93824]" />
          <p className="mt-5 text-sm font-semibold text-gray-600">
            Loading menu submissions...
          </p>
        </div>
      </main>
    );
  }

  const pendingCount = items.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = items.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = items.filter(
    (item) => item.status === "rejected"
  ).length;

  const stats = [
    {
      label: "Total Menu Items",
      value: items.length,
      icon: "🍕",
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Pending Review",
      value: pendingCount,
      icon: "⏳",
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Approved Items",
      value: approvedCount,
      icon: "✓",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Rejected Items",
      value: rejectedCount,
      icon: "✕",
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative mb-9 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#a92318] via-[#d93824] to-[#f07827] p-7 text-white shadow-xl shadow-orange-200/50 sm:p-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[30px] border-white/10" />
          <div className="absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
                🛡️ Admin Control Center
              </span>

              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Manage Menu Items
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                Review vendor submissions, approve delicious food
                items and maintain the quality of PizzaHub.
              </p>
            </div>

            <div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-6xl backdrop-blur-sm sm:flex">
              🍕
            </div>
          </div>
        </section>

        <section className="mb-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-black text-gray-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black ${stat.color}`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        {error && (
          <div className="mb-7 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
            <span className="text-lg">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d93824]">
              Vendor Submissions
            </p>
            <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
              All Menu Items
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Review and manage submitted food items.
            </p>
          </div>

          <span className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-sm">
            {items.length} Items Found
          </span>
        </section>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-orange-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-4xl">
              🍽️
            </div>

            <h2 className="mt-6 text-2xl font-black text-gray-900">
              No Menu Items Found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
              There are no vendor submissions to review right now.
              New menu items will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const statusStyle =
                item.status === "approved"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : item.status === "rejected"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : item.status === "pending"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-gray-100 text-gray-600 border-gray-200";

              return (
                <article
                  key={item._id}
                  className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/60"
                >
                  <div className="relative h-56 overflow-hidden bg-orange-50">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.itemName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl">
                        🍕
                      </div>
                    )}

                    <div className="absolute left-4 top-4">
                      <span
                        className={`rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-wider ${statusStyle}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#d93824]">
                          {item.category}
                        </p>

                        <h3 className="mt-2 break-words text-xl font-black text-gray-900 transition group-hover:text-[#d93824]">
                          {item.itemName}
                        </h3>
                      </div>

                      <span className="shrink-0 rounded-xl bg-orange-50 px-3 py-2 text-lg font-black text-[#d93824]">
                        ৳{item.price}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-3 min-h-[72px] text-sm leading-6 text-gray-500">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
                      <span>📍</span>
                      <span className="truncate">{item.location}</span>
                    </div>

                    {item.status === "pending" && (
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <button
                          onClick={() =>
                            updateStatus(item._id, "approved")
                          }
                          disabled={updatingId === item._id}
                          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === item._id ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          ) : (
                            "✓"
                          )}
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(item._id, "rejected")
                          }
                          disabled={updatingId === item._id}
                          className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}

                    {item.status !== "pending" && (
                      <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-center text-xs font-semibold text-gray-500">
                        This item has already been reviewed.
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="py-9 text-center">
          <p className="text-xs font-medium tracking-wide text-gray-400">
            PIZZAHUB ADMIN MANAGEMENT
          </p>
        </div>
      </div>
    </main>
  );
}
