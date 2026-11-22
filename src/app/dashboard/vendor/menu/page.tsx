
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface MenuItem {
  _id: string;
  vendorId: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: "pending" | "approved" | "rejected" | "inactive";
  createdAt: string;
  updatedAt?: string;
}

interface MenuForm {
  itemName: string;
  category: string;
  description: string;
  price: string;
  location: string;
  images: string;
}

const initialForm: MenuForm = {
  itemName: "",
  category: "",
  description: "",
  price: "",
  location: "",
  images: "",
};

export default function VendorMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MenuForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getToken = async () => {
    const response = await fetch(
      `${API_URL}/api/auth/get-session`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    const token = response.headers.get("set-auth-jwt");

    if (!response.ok || !token) {
      throw new Error("Please sign in again to continue.");
    }

    return token;
  };

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/menu/vendor/my-items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch menu items."
        );
      }

      setItems(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filter === "all" || item.status === filter;

    return matchesSearch && matchesStatus;
  });

  const handleEdit = (item: MenuItem) => {
    setEditingId(item._id);

    setForm({
      itemName: item.itemName,
      category: item.category,
      description: item.description,
      price: String(item.price),
      location: item.location,
      images: item.images.join("\n"),
    });

    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = await getToken();

      const imageArray = form.images
        .split(/\n|,/)
        .map((image) => image.trim())
        .filter(Boolean);

      const response = await fetch(
        `${API_URL}/api/menu/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            itemName: form.itemName,
            category: form.category,
            description: form.description,
            price: Number(form.price),
            location: form.location,
            images: imageArray,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update menu item."
        );
      }

      setSuccess(
        "Menu item updated successfully and sent for approval."
      );

      setEditingId(null);
      setForm(initialForm);

      await fetchItems();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update menu item."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/menu/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete menu item."
        );
      }

      setSuccess("Menu item deleted successfully.");

      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
      }

      await fetchItems();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete menu item."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const statusStyle: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    inactive: "bg-gray-100 text-gray-700",
  };

  const stats = [
    {
      label: "Total Items",
      value: items.length,
      icon: "🍕",
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Approved",
      value: items.filter((item) => item.status === "approved").length,
      icon: "✓",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Pending",
      value: items.filter((item) => item.status === "pending").length,
      icon: "◷",
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Rejected",
      value: items.filter((item) => item.status === "rejected").length,
      icon: "!",
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#d93824] transition hover:text-[#b92d1c]"
            >
              ← Back to Dashboard
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d93824]">
              Vendor Workspace
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              My Menu Items
            </h1>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Manage your restaurant menu, update item details and
              monitor approval status.
            </p>
          </div>

          <Link
            href="/dashboard/add-menu"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d93824] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-[#b92d1c]"
          >
            <span className="text-lg">+</span>
            Add New Item
          </Link>
        </section>

        {/* Hero */}
        <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#b92d1c] via-[#d93824] to-[#f47732] p-7 text-white shadow-xl shadow-orange-200/50 sm:p-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />

          <div className="relative z-10 max-w-2xl">
            <span className="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-widest">
              🍕 Your Restaurant Collection
            </span>

            <h2 className="mt-6 text-3xl font-black sm:text-4xl">
              Manage Your Delicious Menu
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/85 sm:text-base">
              Keep your menu up to date. Review your item status and
              make changes whenever needed.
            </p>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500">
                    {stat.label}
                  </p>
                  <h3 className="mt-2 text-3xl font-black text-gray-900">
                    {stat.value}
                  </h3>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl font-black ${stat.color}`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* Edit Form */}
        {editingId && (
          <section className="mb-8 rounded-3xl border border-orange-200 bg-white p-6 shadow-lg sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#d93824]">
                  Update Your Item
                </p>
                <h2 className="mt-2 text-2xl font-black text-gray-900">
                  Edit Menu Item
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                  setError("");
                }}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Item Name
                  </label>
                  <input
                    required
                    value={form.itemName}
                    onChange={(e) =>
                      setForm({ ...form, itemName: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#d93824] focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Category
                  </label>
                  <input
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#d93824] focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Price (৳)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    step="any"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#d93824] focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Location
                  </label>
                  <input
                    required
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#d93824] focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#d93824] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Image URLs
                </label>
                <textarea
                  rows={3}
                  value={form.images}
                  onChange={(e) =>
                    setForm({ ...form, images: e.target.value })
                  }
                  placeholder="Enter image URLs, one per line"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#d93824] focus:ring-2 focus:ring-orange-100"
                />
                <p className="mt-2 text-xs text-gray-400">
                  Keep one image URL per line.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-[#d93824] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#b92d1c] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? "Updating..." : "Save Changes"}
              </button>

              <p className="text-xs leading-6 text-amber-700">
                Note: Updating an item sends it back for admin approval.
              </p>
            </form>
          </section>
        )}

        {/* Search and Filter */}
        <section className="mb-7 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by item name, category or location..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#d93824] focus:ring-2 focus:ring-orange-100"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-[#d93824]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </section>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-3xl border border-orange-100 bg-white">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-[#d93824]" />
              <p className="mt-4 text-sm font-semibold text-gray-500">
                Loading your menu items...
              </p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-orange-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-4xl">
              🍕
            </div>

            <h2 className="mt-6 text-2xl font-black text-gray-900">
              {items.length === 0
                ? "No Menu Items Yet"
                : "No Matching Items Found"}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
              {items.length === 0
                ? "Start building your restaurant menu by adding your first delicious item."
                : "Try changing your search or status filter."}
            </p>

            {items.length === 0 ? (
              <Link
                href="/dashboard/add-menu"
                className="mt-7 inline-flex rounded-xl bg-[#d93824] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#b92d1c]"
              >
                + Add Menu Item
              </Link>
            ) : (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-7 rounded-xl border border-orange-200 px-6 py-3 text-sm font-bold text-[#d93824] transition hover:bg-orange-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Menu Cards */
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={item._id}
                className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/60"
              >
                <div className="relative h-56 overflow-hidden bg-orange-50">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.itemName}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl">
                      🍕
                    </div>
                  )}

                  <span
                    className={`absolute right-4 top-4 rounded-full px-4 py-2 text-xs font-extrabold capitalize shadow-sm ${statusStyle[item.status] || statusStyle.pending}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#d93824]">
                        {item.category}
                      </p>

                      <h3 className="mt-2 text-xl font-black text-gray-900">
                        {item.itemName}
                      </h3>
                    </div>

                    <p className="shrink-0 text-lg font-black text-[#d93824]">
                      ৳{item.price}
                    </p>
                  </div>

                  <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <span>📍</span>
                    <span className="line-clamp-1">
                      {item.location}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-400">
                      Created:{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-xl border border-orange-200 px-4 py-3 text-sm font-bold text-[#d93824] transition hover:bg-orange-50"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id}
                        className="rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === item._id
                          ? "Deleting..."
                          : "🗑 Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Footer */}
        <div className="py-8 text-center">
          <p className="text-xs font-medium tracking-wide text-gray-400">
            MADE WITH ❤️ BY PIZZAHUB
          </p>
        </div>
      </div>
    </main>
  );
}
