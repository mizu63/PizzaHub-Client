
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
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center text-red-500">{message}</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-gray-500">
          Manage your personal account information.
        </p>
      </div>

      <form
        onSubmit={handleUpdate}
        className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-2 block font-medium">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={80}
            className="w-full rounded-lg border p-3 text-gray-900 outline-none focus:border-orange-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Email Address</label>
          <input
            value={profile.email}
            readOnly
            className="w-full rounded-lg border bg-gray-100 p-3 text-gray-600"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Profile Image URL
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full rounded-lg border p-3 text-gray-900 outline-none focus:border-orange-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {profile.role === "vendor" && (
          <div>
            <label className="mb-2 block font-medium">
              Business Name
            </label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              maxLength={100}
              className="w-full rounded-lg border p-3 text-gray-900 outline-none focus:border-orange-500"
              placeholder="Enter your restaurant name"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block font-medium">Account Role</label>
          <input
            value={profile.role}
            readOnly
            className="w-full rounded-lg border bg-gray-100 p-3 text-gray-600 capitalize"
          />
        </div>

        {message && (
          <p className="text-sm font-medium text-blue-600">{message}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
