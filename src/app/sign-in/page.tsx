
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-in/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(
          result.message || result.error?.message || "Sign in failed"
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffaf4] px-4 py-16">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-red-200/30 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-2xl shadow-orange-900/10 md:grid-cols-2">
        <div className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-[#c93622] p-12 text-white md:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[45px] border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-400/30 blur-2xl" />

          <Link href="/" className="relative text-3xl font-black tracking-tight">
            🍕 PizzaHub<span className="text-orange-200">.</span>
          </Link>

          <div className="relative">
            <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold">
              Freshly baked, always delicious
            </span>
            <h1 className="mt-7 text-5xl font-black leading-tight">
              Your favorite pizza is just a click away.
            </h1>
            <p className="mt-6 max-w-sm leading-7 text-orange-100">
              Discover delicious pizzas, explore local restaurants, and enjoy
              fresh food delivered to your doorstep.
            </p>
          </div>

          <p className="relative text-sm text-orange-100">
            © 2026 PizzaHub. Made for pizza lovers.
          </p>
        </div>

        <div className="flex items-center justify-center p-7 sm:p-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight text-[#d93824] md:hidden"
            >
              🍕 PizzaHub.
            </Link>

            <div className="mb-9 mt-8 md:mt-0">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d93824]">
                Welcome back
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-900">
                Sign in
              </h2>
              <p className="mt-3 text-gray-500">
                Enter your details to access your PizzaHub account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d93824] focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d93824] focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#d93824] py-4 font-bold text-white shadow-lg shadow-red-200/60 transition hover:-translate-y-0.5 hover:bg-[#b92d1c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In to PizzaHub →"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-bold text-[#d93824] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
