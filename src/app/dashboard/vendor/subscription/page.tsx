
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://localhost:5000";

interface SubscriptionUser {
  role: string;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string | null;
}

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<SubscriptionUser | null>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const sessionResponse = await fetch(
          `${API_URL}/api/auth/get-session`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const token = sessionResponse.headers.get("set-auth-jwt");

        if (!sessionResponse.ok || !token) {
          throw new Error("Please sign in again.");
        }

        const response = await fetch(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load subscription.");
        }

        setUser(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setChecking(false);
      }
    };

    checkSubscription();
  }, []);

  const expiryDate = user?.subscriptionExpiresAt
    ? new Date(user.subscriptionExpiresAt)
    : null;

  const isPremium =
    user?.subscriptionPlan?.toLowerCase() === "premium" &&
    expiryDate !== null &&
    !Number.isNaN(expiryDate.getTime()) &&
    expiryDate.getTime() > Date.now();

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      setError("");

      const sessionResponse = await fetch(
        `${API_URL}/api/auth/get-session`,
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

      const response = await fetch(
        `${API_URL}/api/subscriptions/create-checkout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

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
        err instanceof Error ? err.message : "Something went wrong."
      );
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5]">
        <p className="font-semibold text-gray-600">
          Checking subscription...
        </p>
      </main>
    );
  }

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
            {isPremium ? "Your Premium Plan" : "Choose Your Plan"}
          </h1>

          <p className="mt-4 text-gray-600">
            Grow your restaurant business with PizzaHub Premium.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-md rounded-2xl border-2 border-orange-500 bg-white p-8 shadow-xl">
          <div className="text-center">
            <span className="rounded-full bg-orange-100 px-4 py-1 text-sm font-bold text-orange-600">
              {isPremium ? "PREMIUM ACTIVE" : "PREMIUM PLAN"}
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

          {isPremium && expiryDate && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 text-center">
              <p className="font-bold text-green-700">
                Your Premium Subscription is Active!
              </p>

              <p className="mt-2 text-sm text-green-700">
                Valid until:{" "}
                {expiryDate.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {!isPremium && (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 py-4 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Redirecting to Stripe..." : "Upgrade to Premium"}
            </button>
          )}

          <p className="mt-4 text-center text-xs text-gray-400">
            Secure subscription checkout powered by Stripe.
          </p>
        </div>
      </div>
    </main>
  );
}
