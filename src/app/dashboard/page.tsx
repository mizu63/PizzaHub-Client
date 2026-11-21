
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface User {
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/get-session",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result?.user) {
          throw new Error("Please sign in to access your dashboard.");
        }

        setUser(result.user);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || "Sign out failed");
      }

      window.location.href = "/sign-in";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sign out failed"
      );
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="mt-4 font-semibold text-gray-600">
            Loading Dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Sign In Required
        </h1>

        <p className="mt-3 text-gray-600">
          {error || "Please sign in to continue."}
        </p>

        <Link
          href="/sign-in"
          className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Go to Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold uppercase tracking-widest text-orange-600">
              PizzaHub Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 md:text-4xl">
              Welcome, {user.name}!
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your PizzaHub account and explore delicious food.
            </p>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>

        {/* Admin Dashboard */}
        {user.role === "admin" && (
          <>
            <div className="mb-8 rounded-2xl bg-[#171717] p-8 text-white">
              <p className="font-semibold text-orange-400">
                ADMIN PANEL
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Admin Dashboard
              </h2>

              <p className="mt-3 text-gray-300">
                Manage users, menu items, and platform transactions.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              <Link
                href="/dashboard/admin/users"
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">👥</div>
                <h3 className="text-xl font-bold text-gray-900">
                  Manage Users
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  View, search, filter, and manage registered customers and vendors.
                </p>
                <p className="mt-5 font-bold text-orange-600">
                  Manage Users →
                </p>
              </Link>

              <Link
                href="/dashboard/admin"
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">🍕</div>
                <h3 className="text-xl font-bold text-gray-900">
                  Manage Menu Items
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Review submitted menu items and approve or reject them.
                </p>
                <p className="mt-5 font-bold text-orange-600">
                  Manage Menu →
                </p>
              </Link>

              <Link
                href="/dashboard/admin/transactions"
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">💳</div>
                <h3 className="text-xl font-bold text-gray-900">
                  Transactions
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  View vendor subscription payments and transaction records.
                </p>
                <p className="mt-5 font-bold text-orange-600">
                  View Transactions →
                </p>
              </Link>

              <Link
                href="/dashboard/profile"
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">👤</div>
                <h3 className="text-xl font-bold text-gray-900">
                  Profile Settings
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  View and manage your admin profile.
                </p>
                <p className="mt-5 font-bold text-orange-600">
                  View Profile →
                </p>
              </Link>
            </div>
          </>
        )}

        {/* Vendor Dashboard */}
        {user.role === "vendor" && (
          <>
            <div className="mb-8 rounded-2xl bg-[#171717] p-8 text-white">
              <p className="font-semibold text-orange-400">
                VENDOR PANEL
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Vendor Dashboard
              </h2>

              <p className="mt-3 text-gray-300">
                Manage your restaurant, menu items, customer orders, and subscription.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              <Link
                href="/dashboard/add-menu"
                className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">➕</div>
                <h3 className="text-xl font-bold text-gray-900">
                  Add Menu Item
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  Add new delicious pizzas and other food items.
                </p>
                <p className="mt-5 font-bold text-orange-600">
                  Add Item →
                </p>
              </Link>

              <Link
                href="/dashboard/vendor/menu"
                className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">🍕</div>
                <h3 className="text-xl font-bold text-gray-900">
                  My Menu Items
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  View and manage your submitted menu items.
                </p>
                <p className="mt-5 font-bold text-orange-600">
                  My Menu →
                </p>
              </Link>

              <Link
                href="/dashboard/vendor/orders"
                className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">📦</div>
                <h3 className="text-xl font-bold text-gray-900">
                  Customer Orders
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  View and manage incoming customer orders.
                </p>
                <p className="mt-5 font-bold text-orange-600">
                  View Orders →
                </p>
              </Link>

              <Link
                href="/dashboard/vendor/subscription"
                className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">⭐</div>
                <h3 className="text-xl font-bold text-gray-900">
                  Subscription
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  Upgrade your restaurant to Premium.
                </p>
                <p className="mt-5 font-bold text-orange-600">
                  View Plans →
                </p>
              </Link>

              <Link
                href="/dashboard/profile"
                className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">👤</div>
                <h3 className="text-xl font-bold text-gray-900">
                  Profile Settings
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  Manage your personal and restaurant information.
                </p>
                <p className="mt-5 font-bold text-orange-600">
                  View Profile →
                </p>
              </Link>
            </div>
          </>
        )}

        {/* Customer Dashboard */}
        {user.role === "customer" && (
          <>
            <div className="mb-8 rounded-2xl bg-[#171717] p-8 text-white">
              <p className="font-semibold text-orange-400">
                CUSTOMER PANEL
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Customer Dashboard
              </h2>

              <p className="mt-3 text-gray-300">
                Discover pizzas and manage your orders.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              <Link
                href="/dashboard/orders"
                className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">📦</div>
                <h3 className="text-xl font-bold text-gray-900">
                  My Orders
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  View and track your pizza orders.
                </p>
                <p className="mt-5 font-bold text-orange-600">
                  View Orders →
                </p>
              </Link>

              <Link
                href="/menu"
                className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">🍕</div>
                <h3 className="text-xl font-bold text-gray-900">
                  Browse Menu
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  Discover delicious pizzas.
                </p>
                <p className="mt-5 font-bold text-orange-600">
                  Explore Menu →
                </p>
              </Link>

              <Link
                href="/dashboard/profile"
                className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">👤</div>
                <h3 className="text-xl font-bold text-gray-900">
                  My Profile
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  View and manage your account information.
                </p>
                <p className="mt-5 font-bold text-orange-600">
                  View Profile →
                </p>
              </Link>
            </div>
          </>
        )}

        {/* Account Information */}
        <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Account Information
          </h2>

          <div className="mt-5 grid gap-4 text-gray-600 md:grid-cols-3">
            <p>
              <strong className="text-gray-900">Name:</strong>{" "}
              {user.name}
            </p>

            <p>
              <strong className="text-gray-900">Email:</strong>{" "}
              {user.email}
            </p>

            <p className="capitalize">
              <strong className="text-gray-900">Account Type:</strong>{" "}
              {user.role}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
