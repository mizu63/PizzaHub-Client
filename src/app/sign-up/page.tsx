
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/sign-up/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(
          result.message || result.error?.message || "Registration failed"
        );
      }

      router.push("/sign-in");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffaf4] px-4 py-12">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-red-200/30 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-2xl shadow-orange-900/10 md:grid-cols-2">
        <div className="relative hidden min-h-[720px] flex-col justify-between overflow-hidden bg-[#c93622] p-12 text-white md:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[45px] border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-400/30 blur-2xl" />

          <Link href="/" className="relative text-3xl font-black tracking-tight">
            🍕 PizzaHub<span className="text-orange-200">.</span>
          </Link>

          <div className="relative">
            <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold">
              Join the PizzaHub family
            </span>

            <h1 className="mt-7 text-5xl font-black leading-tight">
              Great pizza.
              <span className="block text-orange-200">
                Great moments.
              </span>
              One account.
            </h1>

            <p className="mt-6 max-w-sm leading-7 text-orange-100">
              Discover your favorite flavors, explore local restaurants,
              and enjoy delicious food with PizzaHub.
            </p>
          </div>

          <p className="relative text-sm text-orange-100">
            © 2026 PizzaHub. Made for pizza lovers.
          </p>
        </div>

        <div className="flex items-center justify-center p-7 sm:p-10">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight text-[#d93824] md:hidden"
            >
              🍕 PizzaHub.
            </Link>

            <div className="mb-7 mt-7 md:mt-0">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d93824]">
                Get started
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-900">
                Create Account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Create your account and discover something delicious.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d93824] focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d93824] focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Account Type
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-[#d93824] focus:bg-white focus:ring-4 focus:ring-orange-100"
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                </select>
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
                {loading ? "Creating Account..." : "Create My Account →"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-bold text-[#d93824] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
