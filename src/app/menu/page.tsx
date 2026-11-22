
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

const API_URL = "http://localhost:5000/api/menu";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to load menu items");
        }

        const result: MenuResponse = await response.json();

        if (!result.success) {
          throw new Error("Unable to fetch menu items");
        }

        setItems(result.data);
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

    fetchMenu();
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(items.map((item) => item.category))
      ),
    ],
    [items]
  );

  const locations = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(items.map((item) => item.location))
      ),
    ],
    [items]
  );

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      result = result.filter((item) =>
        item.itemName
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      );
    }

    if (category !== "All") {
      result = result.filter(
        (item) => item.category === category
      );
    }

    if (location !== "All") {
      result = result.filter(
        (item) => item.location === location
      );
    }

    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [items, search, category, location, sort]);

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
            {filteredItems.length} Items Available
          </span>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 rounded-3xl border border-orange-100 bg-white p-5 shadow-lg shadow-orange-900/5 sm:p-7">
          <div className="mb-6">
            <h3 className="text-lg font-extrabold text-gray-900">
              Find Your Favorite
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Search and customize your menu selection.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
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
                  placeholder="Search pizza..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#d93824] focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>

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
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-extrabold text-[#d93824]">
                {filteredItems.length}
              </span>{" "}
              of {items.length} menu items
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setLocation("All");
                setSort("default");
              }}
              className="rounded-xl border border-orange-200 px-5 py-2.5 text-sm font-bold text-[#d93824] transition hover:bg-[#d93824] hover:text-white"
            >
              ↻ Clear Filters
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
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

        {/* Error */}
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
              Make sure your backend server is running on port 5000.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[#d93824] px-7 py-3 font-bold text-white transition hover:bg-[#b92d1c]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Menu Cards */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
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
                    <span className="font-medium">{item.location}</span>
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
        {!loading && !error && filteredItems.length === 0 && (
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
              onClick={() => {
                setSearch("");
                setCategory("All");
                setLocation("All");
                setSort("default");
              }}
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
