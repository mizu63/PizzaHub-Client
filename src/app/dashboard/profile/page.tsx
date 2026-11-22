
"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

interface Profile {
  name: string;
  email: string;
  image?: string;
  role: string;
  businessName?: string;
  subscriptionPlan?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const sessionResponse = await fetch(
          `${API_URL}/api/auth/get-session`,
          { credentials: "include" }
        );

        const token = sessionResponse.headers.get("set-auth-jwt");

        if (!sessionResponse.ok || !token) {
          setMessage("Please sign in again.");
          return;
        }

        const response = await fetch(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load profile");
        }

        const data: Profile = result.data;

        setProfile(data);
        setName(data.name || "");
        setImage(data.image || "");
        setBusinessName(data.businessName || "");
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const sessionResponse = await fetch(
        `${API_URL}/api/auth/get-session`,
        { credentials: "include" }
      );

      const token = sessionResponse.headers.get("set-auth-jwt");

      if (!sessionResponse.ok || !token) {
        throw new Error("Please sign in again.");
      }

      const body: {
        name: string;
        image: string;
        businessName?: string;
      } = { name, image };

      if (profile?.role === "vendor") {
        body.businessName = businessName;
      }

      const response = await fetch(`${API_URL}/api/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Profile update failed");
      }

      setProfile((previous) =>
        previous
          ? { ...previous, name, image, businessName }
          : previous
      );

      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fffaf5] px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-[#d93824]" />
          <p className="mt-4 text-sm font-semibold text-gray-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fffaf5] px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg">
          <div className="text-4xl">⚠️</div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
            Profile Unavailable
          </h2>
          <p className="mt-3 text-sm text-red-500">
            {message || "Unable to load your profile."}
          </p>
        </div>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-gray-800 outline-none transition placeholder:font-normal placeholder:text-gray-400 hover:border-orange-200 focus:border-[#d93824] focus:bg-white focus:ring-4 focus:ring-orange-100";

  const labelClass =
    "mb-2.5 block text-sm font-bold text-gray-800";

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Page Heading */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d93824]">
            <span>👤</span>
            Account Settings
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Manage your personal information and keep your PizzaHub
            account up to date.
          </p>
        </div>

        {/* Profile Hero */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#b92d1c] via-[#d93824] to-[#f47732] p-7 text-white shadow-xl shadow-orange-200/50 sm:p-9">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[30px] border-white/10" />
          <div className="absolute -bottom-20 right-40 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-5 sm:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white/30 bg-white/20 text-4xl font-black shadow-lg">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                name.charAt(0).toUpperCase() || "U"
              )}
            </div>

            <div className="text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">
                Welcome to PizzaHub
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                {profile.name}
              </h2>

              <p className="mt-2 text-sm text-white/80">
                {profile.email}
              </p>

              <span className="mt-3 inline-flex rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-bold capitalize">
                {profile.role} Account
              </span>
            </div>
          </div>
        </section>

        {/* Profile Form */}
        <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-6 sm:px-9">
            <h2 className="text-xl font-extrabold text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your account details below.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6 p-6 sm:p-9">

            {/* Name */}
            <div>
              <label className={labelClass}>
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={80}
                className={inputClass}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>
                Email Address
              </label>
              <input
                value={profile.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3.5 text-sm font-medium text-gray-500"
              />
              <p className="mt-2 text-xs text-gray-400">
                Your registered email address cannot be changed here.
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label className={labelClass}>
                Profile Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className={inputClass}
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-2 text-xs text-gray-400">
                Enter a valid image URL for your profile picture.
              </p>
            </div>

            {/* Vendor Business Name */}
            {profile.role === "vendor" && (
              <div>
                <label className={labelClass}>
                  Business Name
                </label>
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  maxLength={100}
                  className={inputClass}
                  placeholder="Enter your restaurant name"
                />
              </div>
            )}

            {/* Account Role */}
            <div>
              <label className={labelClass}>
                Account Role
              </label>
              <input
                value={profile.role}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3.5 text-sm font-bold capitalize text-[#d93824]"
              />
            </div>

            {/* Message */}
            {message && (
              <div
                className={`rounded-xl border px-4 py-3.5 text-sm font-semibold ${
                  message === "Profile updated successfully!"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                <span className="mr-2">
                  {message === "Profile updated successfully!" ? "✓" : "⚠"}
                </span>
                {message}
              </div>
            )}

            {/* Submit */}
            <div className="border-t border-gray-100 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d93824] px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-red-200/50 transition hover:-translate-y-0.5 hover:bg-[#b92d1c] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-48"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Updating...
                  </>
                ) : (
                  <>Save Changes <span>→</span></>
                )}
              </button>
            </div>
          </form>
        </section>

        <p className="mt-7 text-center text-xs font-medium tracking-wide text-gray-400">
          YOUR PIZZAHUB ACCOUNT, YOUR WAY ❤️
        </p>
      </div>
    </main>
  );
}
