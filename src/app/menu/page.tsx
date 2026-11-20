
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
    <main className="min-h-screen bg-[#fffaf5]">
      {/* Hero Section */}
      <section className="bg-[#171717] px-4 py-20 text-center text-white">
        <p className="mb-3 font-semibold uppercase tracking-[4px] text-orange-400">
          Fresh & Delicious
        </p>

        <h1 className="text-4xl font-extrabold md:text-6xl">
          Explore Our Menu
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-gray-300">
          Discover your favorite pizzas, made with fresh
          ingredients and delivered with love.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        {/* Search and Filters */}
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Search Menu
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pizza..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-orange-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Location
              </label>

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-orange-500"
              >
                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Sort By Price
              </label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-orange-500"
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

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-bold text-orange-600">
                {filteredItems.length}
              </span>{" "}
              menu items
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setLocation("All");
                setSort("default");
              }}
              className="rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
            <p className="mt-4 font-medium text-gray-600">
              Loading delicious menu...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-600">
              {error}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Make sure your backend server is running on port 5000.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Menu Cards */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 bg-gray-100">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.itemName}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-4 py-1 text-xs font-bold text-white">
                    {item.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-bold text-gray-900">
                      {item.itemName}
                    </h2>

                    <p className="whitespace-nowrap text-lg font-extrabold text-orange-600">
                      ৳{item.price}
                    </p>
                  </div>

                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>

                  <p className="mt-3 text-sm text-gray-500">
                    <span className="font-semibold">Location:</span>{" "}
                    {item.location}
                  </p>

                  <Link
                    href={`/menu/${item._id}`}
                    className="mt-5 block rounded-lg bg-[#f97316] py-3 text-center font-bold text-white transition hover:bg-[#ea580c]"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="rounded-2xl bg-white px-5 py-20 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800">
              No Menu Items Found
            </h2>

            <p className="mt-3 text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setLocation("All");
                setSort("default");
              }}
              className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
