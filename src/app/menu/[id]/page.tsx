
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  _id: string;
  itemName: string;
  description: string;
  category: string;
  location: string;
  price: number;
  images: string[];
  status: string;
}

export default function MenuDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/menu/${params.id}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Menu item not found");
        }

        setItem(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load menu item"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMenuItem();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading menu details...
        </p>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Menu Item Not Found
        </h1>

        <p className="mt-3 text-gray-600">
          {error || "This menu item is not available."}
        </p>

        <Link
          href="/menu"
          className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Back to Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/menu"
          className="mb-8 inline-block font-medium text-green-600 hover:text-green-700"
        >
          ← Back to Menu
        </Link>

        <div className="grid gap-10 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
          <div className="relative min-h-[300px] overflow-hidden rounded-xl bg-gray-100">
            {item.images?.[0] ? (
              <Image
                src={item.images[0]}
                alt={item.itemName}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              {item.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl">
              {item.itemName}
            </h1>

            <p className="mt-5 leading-8 text-gray-600">
              {item.description}
            </p>

            <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  Location:
                </span>{" "}
                {item.location}
              </p>

              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  Status:
                </span>{" "}
                {item.status}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
              <p className="text-3xl font-bold text-green-600">
                ৳{item.price}
              </p>

              <button
                onClick={() => router.push("/sign-in")}
                className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
