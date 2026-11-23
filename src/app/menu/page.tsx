
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
}

interface MenuResponse {
  success: boolean;
  total: number;
  data: MenuItem[];
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")}/api/menu`;

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Fetch all items once for Category and Location dropdown options
  useEffect(() => {
    const controller = new AbortController();

    const fetchAllItems = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(API_URL, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load menu options.");
        }

        const result: MenuResponse = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Unable to load menu options.");
        }

        setAllItems(result.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Menu Options Error:", err);
      }
    };

    fetchAllItems();

    return () => {
      controller.abort();
    };
  }, []);

  // Fetch menu items from Backend with Query Parameters
  useEffect(() => {
    const controller = new AbortController();

    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error("API URL is not configured.");
        }

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category !== "All") {
          params.set("category", category);
        }

        if (location !== "All") {
          params.set("location", location);
        }

        if (sort !== "default") {
          params.set("sort", sort);
        }

        const queryString = params.toString();

        const requestURL = queryString
          ? `${API_URL}?${queryString}`
          : API_URL;

        const response = await fetch(requestURL, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load menu items. Status: ${response.status}`
          );
        }

        const result: MenuResponse = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Unable to fetch menu items.");
        }

        setItems(result.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // Small delay prevents unnecessary requests while typing
    const timeoutId = setTimeout(() => {
      fetchMenu();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [search, category, location, sort, retryCount]);

  // Category Options
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        allItems
          .map((item) => item.category)
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));

    return ["All", ...uniqueCategories];
  }, [allItems]);

  // Location Options
  const locations = useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(
        allItems
          .map((item) => item.location)
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));

    return ["All", ...uniqueLocations];
  }, [allItems]);

  // Clear All Filters
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setLocation("All");
    setSort("default");
  };

  // Retry API Request
  const handleRetry = () => {
    setRetryCount((previous) => previous + 1);
  };

  return (
    <main className="min-h-screen bg-[#fffaf4] text-[#29211d]">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#b92d1c] px-5 py-20 text-white md:py-28">
        <div className="absolute -right-20 -top-32 -z-10 h-96 w-96 rounded-full border-[50px] border-white/10" />

        <div className="absolute -bottom-40 -left-20 -z-10 h-96 w-96 rounded-full bg-orange-400/30 blur-3xl" />

        <div className="mx-auto max-w-7xl text-center">
          <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-100">
            Freshly Baked • Always Delicious
          </span>

          <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            Discover Your
            <span className="block text-orange-200">
              Perfect Pizza
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-orange-100 md:text-lg">
            Explore delicious pizzas made with fresh ingredients,
            discover amazing flavors, and find your next favorite meal.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <span className="rounded-full bg-white/10 px-5 py-2.5">
              🍕 Fresh Ingredients
            </span>

            <span className="rounded-full bg-white/10 px-5 py-2.5">
              ❤️ Made With Love
            </span>

            <span className="rounded-full bg-white/10 px-5 py-2.5">
              🚀 Fast Delivery
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d93824]">
              Our Delicious Collection
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
              Explore Our Menu
            </h2>

            <p className="mt-3 text-gray-500">
              Find the perfect flavor for every craving.
            </p>
          </div>

          <span className="rounded-full bg-orange-100 px-5 py-2 text-sm font-bold text-[#c93622]">
            {loading ? "Loading..." : `${items.length} Items Available`}
          </span>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 rounded-3xl border border-orange-100 bg-white p-5 shadow-lg shadow-orange-900/5 sm:p-7">
          <div className="mb-6">
            <h3 className="text-lg font-extrabold text-gray-900">
              Find Your Favorite
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Search by name, category, description or location.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {/* Advanced Search */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Search Menu
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, category, location..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#d93824] focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-800 outline-none transition focus:border-[#d93824] focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Location
              </label>

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-800 outline-none transition focus:border-[#d93824] focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Sorting */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Sort By Price
              </label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-800 outline-none transition focus:border-[#d93824] focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                <option value="default">Default</option>
                <option value="price-asc">
                  Price: Low to High
                </option>
                <option value="price-desc">
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-extrabold text-[#d93824]">
                {items.length}
              </span>{" "}
              menu items
            </p>

            <button
              onClick={clearFilters}
              className="rounded-xl border border-orange-200 px-5 py-2.5 text-sm font-bold text-[#d93824] transition hover:bg-[#d93824] hover:text-white"
            >
              ↻ Clear Filters
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-orange-100 bg-white"
              >
                <div className="h-56 animate-pulse bg-orange-100" />

                <div className="space-y-4 p-6">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />

                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />

                  <div className="h-12 animate-pulse rounded-xl bg-orange-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-100 bg-white px-6 py-16 text-center shadow-lg shadow-red-900/5">
            <div className="text-5xl">⚠️</div>

            <h2 className="mt-5 text-2xl font-black text-gray-900">
              Something Went Wrong
            </h2>

            <p className="mt-3 font-semibold text-red-600">
              {error}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Please check your internet connection or try again later.
            </p>

            <button
              onClick={handleRetry}
              className="mt-6 rounded-xl bg-[#d93824] px-7 py-3 font-bold text-white transition hover:bg-[#b92d1c]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Menu Cards */}
        {!loading && !error && items.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item._id}
                className="group overflow-hidden rounded-3xl border border-orange-100/80 bg-white shadow-md shadow-orange-900/5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-900/10"
              >
                <div className="relative h-60 overflow-hidden bg-orange-50">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.itemName}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">
                      🍕
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#d93824] px-4 py-2 text-xs font-bold text-white shadow-lg">
                    {item.category}
                  </span>

                  <span className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-sm font-black text-[#d93824] shadow-lg">
                    ৳{item.price}
                  </span>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-black text-gray-900 transition group-hover:text-[#d93824]">
                    {item.itemName}
                  </h2>

                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <span>📍</span>

                    <span className="font-medium">
                      {item.location}
                    </span>
                  </div>

                  <Link
                    href={`/menu/${item._id}`}
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#d93824] py-3.5 font-bold text-white shadow-md shadow-red-200/50 transition hover:bg-[#b92d1c]"
                  >
                    View Details
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && items.length === 0 && (
          <div className="rounded-3xl border border-orange-100 bg-white px-5 py-20 text-center shadow-lg shadow-orange-900/5">
            <div className="text-6xl">🍕</div>

            <h2 className="mt-6 text-3xl font-black text-gray-900">
              No Menu Items Found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              We couldn&apos;t find any pizzas matching your search.
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-7 rounded-xl bg-[#d93824] px-7 py-3.5 font-bold text-white transition hover:bg-[#b92d1c]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
