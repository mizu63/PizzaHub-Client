
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    location: "",
    price: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please sign in again.");
      }

   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          itemName: formData.itemName,
          category: formData.category,
          description: formData.description,
          location: formData.location,
          price: Number(formData.price),
          images: [formData.image],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add menu item");
      }

      setMessage(
        "Menu item submitted successfully! Waiting for admin approval."
      );

      setFormData({
        itemName: "",
        category: "",
        description: "",
        location: "",
        price: "",
        image: "",
      });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-orange-200 focus:border-[#d93824] focus:bg-white focus:ring-4 focus:ring-orange-100";

  const labelClass =
    "mb-2.5 block text-sm font-bold text-gray-800";

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Page Heading */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d93824]">
            <span>🍕</span>
            Vendor Workspace
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Add New Menu Item
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Bring something delicious to PizzaHub. Add your food
            details and share it with customers.
          </p>
        </div>

        {/* Banner */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#b92d1c] via-[#d93824] to-[#f47732] p-7 text-white shadow-xl shadow-orange-200/50 sm:p-9">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[30px] border-white/10" />
          <div className="absolute -bottom-20 right-36 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">
                Make it delicious
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Your Next Best Seller!
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-7 text-white/85">
                Create an attractive menu listing and let customers
                discover your delicious food.
              </p>
            </div>

            <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/15 text-6xl shadow-inner sm:flex">
              🍕
            </div>
          </div>
        </section>

        {/* Form Card */}
        <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-6 sm:px-9">
            <h2 className="text-xl font-extrabold text-gray-900">
              Menu Item Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details of your new menu item.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-9">

            {/* Item Name */}
            <div>
              <label className={labelClass}>
                Item Name
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="e.g. Chicken BBQ Pizza"
                required
                className={inputClass}
              />
            </div>

            {/* Category */}
            <div>
              <label className={labelClass}>
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Pizza"
                required
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your delicious menu item..."
                rows={5}
                required
                className={`${inputClass} resize-y`}
              />
              <p className="mt-2 text-xs text-gray-400">
                Tell customers what makes this item special.
              </p>
            </div>

            {/* Location and Price */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Price (৳)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="1"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className={labelClass}>
                Food Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/pizza.jpg"
                required
                className={inputClass}
              />
              <p className="mt-2 text-xs text-gray-400">
                Add a valid image URL to showcase your food.
              </p>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`rounded-xl border px-4 py-4 text-sm font-semibold leading-6 ${
                  message.startsWith("Menu item submitted successfully!")
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                <span className="mr-2">
                  {message.startsWith("Menu item submitted successfully!")
                    ? "✓"
                    : "⚠"}
                </span>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="border-t border-gray-100 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#d93824] px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-red-200/50 transition hover:-translate-y-0.5 hover:bg-[#b92d1c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Menu Item
                    <span>→</span>
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs leading-6 text-gray-400">
                Your menu item will be submitted for admin approval.
              </p>
            </div>
          </form>
        </section>

        <p className="mt-7 text-center text-xs font-medium tracking-wide text-gray-400">
          MADE WITH ❤️ BY PIZZAHUB
        </p>
      </div>
    </main>
  );
}
