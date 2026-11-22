
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

interface Order {
  _id: string;
  itemId: string;
  vendorId: string;
  customerId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export default function CustomerOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  // Order form states
  const [menuId, setMenuId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMenuId(params.get("menuId") || "");
  }, []);

  // Set minimum delivery date after the component mounts
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const today = new Date();

      const formattedDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      setMinDate(formattedDate);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const getToken = async () => {
    const response = await fetch(`${API_URL}/api/auth/get-session`, {
      credentials: "include",
      cache: "no-store",
    });

    const token = response.headers.get("set-auth-jwt");

    if (!response.ok || !token) {
      throw new Error("Please sign in again.");
    }

    return token;
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const response = await fetch(`${API_URL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load orders.");
      }

      setOrders(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Customer: Place a new order
  const handlePlaceOrder = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!menuId) {
      setError("Please select a pizza from the menu first.");
      return;
    }

    if (!deliveryDate || !deliveryAddress.trim()) {
      setError("Please provide your delivery date and address.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");
      setSuccess("");

      const token = await getToken();

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: menuId,
          deliveryDate,
          deliveryAddress: deliveryAddress.trim(),
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to place order.");
      }

      setSuccess("Your order has been placed successfully!");

      setDeliveryDate("");
      setDeliveryAddress("");
      setMessage("");
      setMenuId("");

      router.replace("/dashboard/customer/orders");

      await fetchOrders();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(orderId);
      setError("");
      setSuccess("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to cancel order.");
      }

      setSuccess("Order cancelled successfully!");
      await fetchOrders();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel order."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (date: string) => {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Not available";

    return parsed.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const acceptedCount = orders.filter(
    (order) => order.status === "accepted"
  ).length;

  const cancelledCount = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 shadow-sm transition hover:border-orange-300 hover:text-[#d93824]"
        >
          ← Back to Dashboard
        </Link>

        <section className="relative mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#a92519] via-[#d93824] to-[#f07832] px-7 py-12 text-white shadow-xl shadow-red-200/40 sm:px-12 lg:py-16">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />
          <div className="absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-orange-300/10 blur-3xl" />

          <div className="relative max-w-2xl">
            <span className="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
              Customer Dashboard
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
              Keep track of your delicious orders, check delivery
              information and manage your pending requests.
            </p>

            <Link
              href="/menu"
              className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-bold text-[#c83221] shadow-lg transition hover:-translate-y-1 hover:bg-orange-50"
            >
              Explore Menu →
            </Link>
          </div>
        </section>

        {/* Order Form */}
        {menuId && (
          <section className="mt-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-9">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d93824]">
                Checkout
              </p>
              <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
                Complete Your Order
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Provide your delivery information to place your pizza order.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="mt-7 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  required
                  min={minDate}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full rounded-xl border border-orange-200 bg-[#fffaf5] px-4 py-3 text-gray-800 outline-none transition focus:border-[#d93824] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your full delivery address..."
                  className="w-full resize-y rounded-xl border border-orange-200 bg-[#fffaf5] px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#d93824] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Special Message (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any special delivery instructions?"
                  className="w-full resize-y rounded-xl border border-orange-200 bg-[#fffaf5] px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#d93824] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={placingOrder}
                  className="rounded-xl bg-[#d93824] px-7 py-3.5 font-bold text-white shadow-lg shadow-red-200/50 transition hover:bg-[#b92d1c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {placingOrder ? "Placing Order..." : "Place Order →"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuId("");
                    router.replace("/dashboard/customer/orders");
                  }}
                  className="rounded-xl border border-orange-200 bg-white px-7 py-3.5 font-bold text-gray-600 transition hover:bg-orange-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Success and Error Messages */}
        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Orders",
              value: orders.length,
              icon: "📦",
            },
            {
              label: "Pending Orders",
              value: pendingCount,
              icon: "⏳",
            },
            {
              label: "Accepted Orders",
              value: acceptedCount,
              icon: "✅",
            },
            {
              label: "Cancelled Orders",
              value: cancelledCount,
              icon: "↩️",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-500">
                  {stat.label}
                </p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="mt-4 text-3xl font-black text-gray-900">
                {loading ? "—" : stat.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d93824]">
                Order History
              </p>
              <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
                Your Recent Orders
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                View and manage all your placed orders.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              disabled={loading}
              className="rounded-xl border border-orange-200 bg-white px-5 py-3 text-sm font-bold text-[#d93824] transition hover:bg-orange-50 disabled:opacity-50"
            >
              ↻ Refresh Orders
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["all", "pending", "accepted", "rejected", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-full px-5 py-2.5 text-sm font-bold capitalize transition ${
                    filter === status
                      ? "bg-[#d93824] text-white shadow-md shadow-red-200"
                      : "border border-orange-100 bg-white text-gray-600 hover:border-orange-300 hover:text-[#d93824]"
                  }`}
                >
                  {status === "all" ? "All Orders" : status}
                </button>
              )
            )}
          </div>

          {loading ? (
            <div className="mt-8 grid gap-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-48 animate-pulse rounded-2xl border border-orange-100 bg-white"
                />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-orange-200 bg-white px-6 py-16 text-center">
              <div className="text-5xl">🍕</div>
              <h3 className="mt-5 text-2xl font-black text-gray-900">
                {orders.length === 0
                  ? "No Orders Yet"
                  : "No Orders Found"}
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                {orders.length === 0
                  ? "You haven't placed any orders yet. Explore our delicious menu and place your first order."
                  : "There are no orders in this status category."}
              </p>
              {orders.length === 0 && (
                <Link
                  href="/menu"
                  className="mt-7 inline-flex rounded-xl bg-[#d93824] px-7 py-3.5 font-bold text-white transition hover:bg-[#b92d1c]"
                >
                  Browse Menu →
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-8 grid gap-5">
              {filteredOrders.map((order) => (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-orange-100 bg-[#fffaf5] p-5 sm:flex-row sm:items-center sm:px-7">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Order ID
                      </p>
                      <p className="mt-1 break-all font-bold text-gray-800">
                        #{order._id}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-xs font-black capitalize ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Menu Item ID
                      </p>
                      <p className="mt-2 break-all text-sm font-bold text-gray-800">
                        {order.itemId}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Delivery Date
                      </p>
                      <p className="mt-2 text-sm font-bold text-gray-800">
                        {formatDate(order.deliveryDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Order Placed
                      </p>
                      <p className="mt-2 text-sm font-bold text-gray-800">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Delivery Address
                      </p>
                      <p className="mt-2 text-sm leading-7 text-gray-700">
                        {order.deliveryAddress}
                      </p>
                    </div>

                    {order.message && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Special Message
                        </p>
                        <p className="mt-2 text-sm leading-7 text-gray-700">
                          {order.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {order.status === "pending" && (
                    <div className="flex justify-end border-t border-orange-100 p-5 sm:px-7">
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={cancellingId === order._id}
                        className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancellingId === order._id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
