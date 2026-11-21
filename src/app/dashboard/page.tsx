
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface User {
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();

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
          err instanceof Error ? err.message : "Failed to load dashboard"
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
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading Dashboard...
        </p>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Sign In Required
        </h1>

        <p className="mt-3 text-gray-600">
          {error || "Please sign in to continue."}
        </p>

        <Link
          href="/sign-in"
          className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white"
        >
          Go to Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-green-600">
              PizzaHub Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
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

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              My Orders
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              View and track your pizza orders.
            </p>

            <Link
              href="/dashboard/orders"
              className="mt-5 inline-block font-semibold text-green-600"
            >
              View Orders →
            </Link>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Browse Menu
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Discover delicious pizzas.
            </p>

            <Link
              href="/menu"
              className="mt-5 inline-block font-semibold text-green-600"
            >
              Explore Menu →
            </Link>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              My Profile
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              View your account information.
            </p>

            <Link
              href="/dashboard/profile"
              className="mt-5 inline-block font-semibold text-green-600"
            >
              View Profile →
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Account Information
          </h2>

          <div className="mt-5 space-y-3 text-gray-600">
            <p>
              <strong>Name:</strong> {user.name}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <p>
              <strong>Account Type:</strong> {user.role}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
