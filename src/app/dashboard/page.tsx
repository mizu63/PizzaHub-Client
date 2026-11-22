
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
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
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-orange-100 border-t-[#d93824]" />
          <p className="mt-5 text-sm font-semibold tracking-wide text-gray-600">
            Preparing your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4">
        <div className="w-full max-w-md rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-xl shadow-orange-100/40">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
            🔒
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-gray-900">
            Sign In Required
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            {error || "Please sign in to continue."}
          </p>

          <Link
            href="/sign-in"
            className="mt-7 inline-flex rounded-xl bg-[#d93824] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-[#b92d1c]"
          >
            Go to Sign In →
          </Link>
        </div>
      </main>
    );
  }

  const roleInfo = {
    admin: {
      label: "ADMIN PANEL",
      title: "Admin Dashboard",
      description:
        "Manage your platform, monitor activities and keep everything running smoothly.",
      icon: "🛡️",
    },
    vendor: {
      label: "VENDOR PANEL",
      title: "Vendor Dashboard",
      description:
        "Manage your restaurant, menu items, customer orders and subscription.",
      icon: "🍽️",
    },
    customer: {
      label: "CUSTOMER PANEL",
      title: "Customer Dashboard",
      description:
        "Discover delicious pizzas and explore everything PizzaHub has to offer.",
      icon: "🍕",
    },
  };

  const currentRole =
    roleInfo[user.role as keyof typeof roleInfo] || roleInfo.customer;

  const cardClass =
    "group relative overflow-hidden rounded-3xl border border-orange-100/70 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/60";

  const iconClass =
    "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl transition duration-300 group-hover:scale-110 group-hover:bg-orange-100";

  const cards = {
    admin: [
      {
        href: "/dashboard/admin/users",
        icon: "👥",
        title: "Manage Users",
        description:
          "View, search, filter, and manage registered customers and vendors.",
        action: "Manage Users",
      },
      {
        href: "/dashboard/admin",
        icon: "🍕",
        title: "Manage Menu Items",
        description:
          "Review submitted menu items and approve or reject them.",
        action: "Manage Menu",
      },
      {
        href: "/dashboard/admin/transactions",
        icon: "💳",
        title: "Transactions",
        description:
          "View vendor subscription payments and transaction records.",
        action: "View Transactions",
      },
      {
        href: "/dashboard/profile",
        icon: "👤",
        title: "Profile Settings",
        description: "View and manage your admin profile.",
        action: "View Profile",
      },
    ],

    vendor: [
      {
        href: "/dashboard/add-menu",
        icon: "➕",
        title: "Add Menu Item",
        description:
          "Add new delicious pizzas and other food items to your restaurant.",
        action: "Add Item",
      },
      {
        href: "/dashboard/vendor/menu",
        icon: "🍕",
        title: "My Menu Items",
        description:
          "View and manage your submitted menu items.",
        action: "My Menu",
      },
      {
        href: "/dashboard/vendor/orders",
        icon: "📦",
        title: "Customer Orders",
        description:
          "View and manage incoming customer orders.",
        action: "View Orders",
      },
      {
        href: "/dashboard/vendor/subscription",
        icon: "⭐",
        title: "Subscription",
        description:
          "Explore plans and upgrade your restaurant to Premium.",
        action: "View Plans",
      },
      {
        href: "/dashboard/profile",
        icon: "👤",
        title: "Profile Settings",
        description:
          "Manage your personal and restaurant information.",
        action: "View Profile",
      },
    ],

    customer: [
      {
        href: "/dashboard/customer/orders",
        icon: "📦",
        title: "My Orders",
        description: "View and track your pizza orders.",
        action: "View Orders",
      },
      {
        href: "/menu",
        icon: "🍕",
        title: "Browse Menu",
        description:
          "Discover delicious pizzas and explore our food collection.",
        action: "Explore Menu",
      },
      {
        href: "/dashboard/profile",
        icon: "👤",
        title: "My Profile",
        description:
          "View and manage your account information.",
        action: "View Profile",
      },
    ],
  };

  const currentCards =
    cards[user.role as keyof typeof cards] || cards.customer;

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Welcome Header */}
        <section className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d93824]">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              PizzaHub Dashboard
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Welcome back,{" "}
              <span className="text-[#d93824]">
                {user.name}!
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              Your PizzaHub workspace is ready. Manage your account
              and explore your dashboard.
            </p>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-red-200 bg-white px-6 py-3.5 text-sm font-bold text-red-600 shadow-sm transition hover:border-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
          >
            <span>↗</span>
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </section>

        {/* Role Banner */}
        <section className="relative mb-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#b92d1c] via-[#d93824] to-[#f47732] p-7 text-white shadow-xl shadow-orange-200/50 sm:p-10 lg:p-12">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />
          <div className="absolute -bottom-28 right-40 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold tracking-[0.18em] text-orange-50">
                <span>{currentRole.icon}</span>
                {currentRole.label}
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                {currentRole.title}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                {currentRole.description}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white">
                  ✦ Personalized Workspace
                </span>
                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white">
                  ✓ Account Active
                </span>
              </div>
            </div>

            <div className="hidden h-40 w-40 shrink-0 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-8xl shadow-inner backdrop-blur-sm lg:flex">
              {currentRole.icon}
            </div>
          </div>
        </section>

        {/* Dashboard Section Heading */}
        <section className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d93824]">
            Quick Access
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Manage Your Workspace
            </h2>

            <p className="text-sm text-gray-500">
              Choose an option to get started
            </p>
          </div>
        </section>

        {/* Dashboard Cards */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {currentCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={cardClass}
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-50 opacity-0 transition duration-500 group-hover:scale-150 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className={iconClass}>
                  {card.icon}
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 transition group-hover:text-[#d93824]">
                  {card.title}
                </h3>

                <p className="mt-3 min-h-[72px] text-sm leading-7 text-gray-500">
                  {card.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="text-sm font-extrabold text-[#d93824]">
                    {card.action}
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-lg text-[#d93824] transition group-hover:translate-x-1 group-hover:bg-[#d93824] group-hover:text-white">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Account Information */}
        <section className="mt-10 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
          <div className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white px-6 py-6 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                👤
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Account Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your personal account details
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
            <div className="rounded-2xl bg-[#fffaf5] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Full Name
              </p>
              <p className="mt-2 break-words text-base font-bold text-gray-900">
                {user.name}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fffaf5] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Email Address
              </p>
              <p className="mt-2 break-all text-base font-bold text-gray-900">
                {user.email}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fffaf5] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Account Type
              </p>
              <p className="mt-2 text-base font-bold capitalize text-[#d93824]">
                {user.role}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 px-6 py-5 sm:px-8">
            <p className="text-sm text-gray-500">
              Want to update your personal details?
            </p>

            <Link
              href="/dashboard/profile"
              className="rounded-xl bg-[#d93824] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b92d1c]"
            >
              Edit Profile →
            </Link>
          </div>
        </section>

        {/* Footer Note */}
        <div className="py-8 text-center">
          <p className="text-xs font-medium tracking-wide text-gray-400">
            MADE WITH ❤️ BY PIZZAHUB
          </p>
        </div>
      </div>
    </main>
  );
}
