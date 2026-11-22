
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

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
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-[#d93824]" />
          <p className="mt-5 font-semibold text-gray-600">
            Checking your subscription...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 shadow-sm transition hover:border-orange-300 hover:text-[#d93824]"
        >
          <span>←</span> Back to Dashboard
        </Link>

        <section className="relative mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#a92318] via-[#d93824] to-[#f07827] px-6 py-12 text-center text-white shadow-xl shadow-orange-200/50 sm:px-12 sm:py-16">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-orange-300/20 blur-2xl" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
              <span>✦</span> PizzaHub Subscription
            </span>

            <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">
              {isPremium ? "Your Premium Plan" : "Grow With Premium"}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-orange-50 sm:text-base">
              Unlock powerful features and grow your restaurant business
              with PizzaHub Premium.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3 text-sm font-semibold">
              <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                ✦ More Opportunities
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                ✓ Premium Benefits
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl items-start gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#d93824]">
                {isPremium ? "Premium Active" : "Premium Plan"}
              </span>

              <span className="text-2xl">👑</span>
            </div>

            <h2 className="mt-7 text-3xl font-black text-gray-900">
              Premium
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Everything you need to manage and grow your restaurant on
              PizzaHub.
            </p>

            <div className="my-7 border-t border-dashed border-orange-200" />

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-lg font-bold text-green-600">
                  ✓
                </span>
                <div>
                  <p className="font-bold text-gray-800">
                    Unlimited Active Menu Items
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Add and manage unlimited active menu items.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-lg font-bold text-green-600">
                  ✓
                </span>
                <div>
                  <p className="font-bold text-gray-800">
                    Premium Vendor Status
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Show customers your premium vendor status.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-lg font-bold text-green-600">
                  ✓
                </span>
                <div>
                  <p className="font-bold text-gray-800">
                    Featured Placement Opportunities
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Get more opportunities to showcase your restaurant.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm sm:p-9">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d93824]">
                Your Subscription
              </p>

              <h2 className="mt-3 text-2xl font-black text-gray-900 sm:text-3xl">
                {isPremium ? "You're a Premium Vendor!" : "Ready to Upgrade?"}
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                {isPremium
                  ? "Your restaurant is enjoying the benefits of PizzaHub Premium."
                  : "Upgrade your vendor account and unlock all premium features."}
              </p>
            </div>

            {isPremium && expiryDate && (
              <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-xl text-green-700">
                    ✓
                  </span>
                  <div>
                    <p className="font-extrabold text-green-800">
                      Premium Subscription Active
                    </p>
                    <p className="mt-1 text-xs text-green-700">
                      Your premium benefits are available.
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-green-200 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
                    Valid Until
                  </p>
                  <p className="mt-2 text-xl font-black text-green-800">
                    {expiryDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}

            {!isPremium && (
              <div className="mt-8 rounded-2xl bg-orange-50 p-5">
                <p className="font-bold text-gray-800">
                  Upgrade your restaurant today
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Get access to unlimited active menu items, premium vendor
                  status and featured placement opportunities.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {!isPremium && (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#d93824] to-[#ed642b] px-6 py-4 font-extrabold text-white shadow-lg shadow-orange-200/60 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-200/70 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    Upgrade to Premium <span>→</span>
                  </>
                )}
              </button>
            )}

            <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
              <span>🔒</span>
              Secure subscription checkout powered by Stripe
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
