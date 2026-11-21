
"use client";

import { useState } from "react";
import Link from "next/link";

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      setError("");

      // Get authenticated session and JWT
      const sessionResponse = await fetch(
        "http://localhost:5000/api/auth/get-session",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!sessionResponse.ok) {
        throw new Error("Please sign in again.");
      }

      const token = sessionResponse.headers.get("set-auth-jwt");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      // Create Stripe Checkout Session
      const response = await fetch(
        "http://localhost:5000/api/subscriptions/create-checkout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
console.log("Stripe Checkout Response:", result);
      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create checkout session."
        );
      }

   if (!result.data?.checkoutUrl) {
  throw new Error("Stripe checkout URL not found.");
}

window.location.href = result.data.checkoutUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="font-semibold text-orange-600 hover:text-orange-700"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 text-center">
          <p className="font-semibold uppercase tracking-widest text-orange-600">
            PizzaHub Subscription
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-gray-900">
            Choose Your Plan
          </h1>

          <p className="mt-4 text-gray-600">
            Grow your restaurant business with PizzaHub Premium.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-md rounded-2xl border-2 border-orange-500 bg-white p-8 shadow-xl">
          <div className="text-center">
            <span className="rounded-full bg-orange-100 px-4 py-1 text-sm font-bold text-orange-600">
              PREMIUM PLAN
            </span>

            <h2 className="mt-5 text-3xl font-extrabold text-gray-900">
              Premium
            </h2>

            <p className="mt-3 text-gray-500">
              Unlock more opportunities for your restaurant.
            </p>
          </div>

          <div className="my-8 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <span className="font-bold text-green-600">✓</span>
              Unlimited active menu items
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <span className="font-bold text-green-600">✓</span>
              Premium vendor status
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <span className="font-bold text-green-600">✓</span>
              Featured placement opportunities
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 py-4 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Redirecting to Stripe..."
              : "Upgrade to Premium"}
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            Secure subscription checkout powered by Stripe.
          </p>
        </div>
      </div>
    </main>
  );
}
