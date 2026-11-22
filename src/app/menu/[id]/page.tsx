
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

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

function MenuDetailsContent() {
  const params = useParams();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

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

  const handleOrderNow = () => {
    if (isPending) return;

    if (!session?.user) {
      router.push("/sign-in");
      return;
    }

    router.push(`/dashboard/customer/orders?menuId=${item?._id}`);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf4] px-4">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-orange-200 border-t-[#d93824]" />
          <p className="mt-5 text-lg font-bold text-gray-700">
            Preparing your delicious experience...
          </p>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#fffaf4] px-4 text-center">
        <div className="rounded-3xl border border-orange-100 bg-white px-8 py-14 shadow-xl shadow-orange-900/5">
          <div className="text-6xl">🍕</div>
          <h1 className="mt-6 text-3xl font-black text-gray-900">
            Menu Item Not Found
          </h1>
          <p className="mt-3 text-gray-500">
            {error || "This menu item is not available."}
          </p>
          <Link
            href="/menu"
            className="mt-7 inline-flex rounded-xl bg-[#d93824] px-7 py-3.5 font-bold text-white transition hover:bg-[#b92d1c]"
          >
            ← Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf4] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/menu"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-bold text-[#d93824] shadow-sm transition hover:bg-orange-50"
        >
          <span>←</span> Back to Menu
        </Link>

        <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-xl shadow-orange-900/5">
          <div className="grid lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative min-h-[350px] overflow-hidden bg-orange-50 sm:min-h-[500px]">
              {item.images?.[0] ? (
                <Image
                  src={item.images[0]}
                  alt={item.itemName}
                  fill
                  unoptimized
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full min-h-[350px] items-center justify-center text-7xl">
                  🍕
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              <span className="absolute left-6 top-6 rounded-full border border-white/20 bg-[#d93824] px-5 py-2.5 text-sm font-bold text-white shadow-lg">
                {item.category}
              </span>
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d93824]">
                Freshly Made For You
              </p>

              <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {item.itemName}
              </h1>

              <div className="mt-6 h-1.5 w-20 rounded-full bg-[#d93824]" />

              <p className="mt-7 text-base leading-8 text-gray-600">
                {item.description}
              </p>

              <div className="mt-9 space-y-5 rounded-2xl bg-[#fffaf4] p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-gray-500">
                    📍 Location
                  </span>
                  <span className="text-right text-sm font-bold text-gray-900">
                    {item.location}
                  </span>
                </div>

                <div className="h-px bg-orange-100" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-gray-500">
                    ● Availability
                  </span>
                  <span className="rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold capitalize text-[#c93622]">
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="mt-9 flex flex-wrap items-center justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Price
                  </p>
                  <p className="mt-1 text-4xl font-black text-[#d93824]">
                    ৳{item.price}
                  </p>
                </div>

                <button
                  onClick={handleOrderNow}
                  disabled={isPending}
                  className="rounded-xl bg-[#d93824] px-8 py-4 font-bold text-white shadow-lg shadow-red-200/60 transition hover:-translate-y-1 hover:bg-[#b92d1c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Checking..." : "Order Now →"}
                </button>
              </div>

              <p className="mt-6 text-xs leading-6 text-gray-400">
                Enjoy delicious food prepared with care and fresh ingredients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function MenuDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#fffaf4]">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-orange-200 border-t-[#d93824]" />
            <p className="mt-5 font-semibold text-gray-600">
              Loading menu details...
            </p>
          </div>
        </main>
      }
    >
      <MenuDetailsContent />
    </Suspense>
  );
}
