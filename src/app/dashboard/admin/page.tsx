
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: "pending" | "approved" | "rejected" | "inactive";
}

// Get JWT token from Better Auth response header
const getAuthToken = async (): Promise<string> => {
  const response = await fetch(
    "http://localhost:5000/api/auth/get-session",
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const token = response.headers.get("set-auth-jwt");

  if (!response.ok || !token) {
    throw new Error("Please sign in again");
  }

  return token;
};

export default function Page() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch all menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getAuthToken();

      const response = await fetch(
        "http://localhost:5000/api/admin/menu",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch menu items"
        );
      }

      setItems(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // Approve or reject menu item
  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      const token = await getAuthToken();

      const response = await fetch(
        `http://localhost:5000/api/admin/menu/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Status update failed"
        );
      }

      await fetchMenuItems();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Status update failed"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading menu items...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Manage Menu
        </h1>

        <p className="mb-6 text-gray-600">
          Review and manage vendor menu submissions.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-3">
          <div className="rounded-lg bg-white px-5 py-3 shadow">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>

          <div className="rounded-lg bg-white px-5 py-3 shadow">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {items.filter((item) => item.status === "pending").length}
            </p>
          </div>

          <div className="rounded-lg bg-white px-5 py-3 shadow">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-green-600">
              {items.filter((item) => item.status === "approved").length}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-700">
              No menu items found.
            </h2>
            <p className="mt-2 text-gray-500">
              Vendor submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-xl bg-white p-5 shadow"
              >
                {item.images?.[0] && (
                  <Image
                    src={item.images[0]}
                    alt={item.itemName}
                    className="mb-4 h-48 w-full rounded-lg object-cover"
                  />
                )}

                <h2 className="text-xl font-bold text-gray-900">
                  {item.itemName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {item.category} • {item.location}
                </p>

                <p className="my-3 text-gray-700">
                  {item.description}
                </p>

                <p className="font-semibold text-gray-900">
                  ৳{item.price}
                </p>

                <p className="my-3">
                  Status:{" "}
                  <span
                    className={`font-semibold uppercase ${
                      item.status === "approved"
                        ? "text-green-600"
                        : item.status === "rejected"
                          ? "text-red-600"
                          : item.status === "pending"
                            ? "text-yellow-600"
                            : "text-gray-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </p>

                {item.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        updateStatus(item._id, "approved")
                      }
                      disabled={updatingId === item._id}
                      className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {updatingId === item._id
                        ? "Updating..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(item._id, "rejected")
                      }
                      disabled={updatingId === item._id}
                      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {updatingId === item._id
                        ? "Updating..."
                        : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
