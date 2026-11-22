
"use client";

import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  vendorId: string;
  plan: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId: string;
  status: string;
  createdAt: string;
  vendor?: {
    name?: string;
    email?: string;
    businessName?: string;
  } | null;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const sessionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
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
       `${process.env.NEXT_PUBLIC_API_URL}/api/admin/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch transactions.");
      }

      setTransactions(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const completedTransactions = transactions.filter(
    (item) => item.status === "completed"
  );

  const cancelledTransactions = transactions.filter(
    (item) => item.status === "cancelled"
  );

  const totalRevenue = completedTransactions.reduce(
    (total, item) => total + item.amount,
    0
  );

  const formatAmount = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(amount);
    } catch {
      return `${amount} ${currency.toUpperCase()}`;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fffaf5]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-[#d93824]" />
          <p className="mt-4 text-sm font-semibold text-gray-500">
            Loading transaction records...
          </p>
        </div>
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Transactions",
      value: transactions.length.toLocaleString(),
      icon: "📋",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Completed",
      value: completedTransactions.length.toLocaleString(),
      icon: "✓",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Cancelled",
      value: cancelledTransactions.length.toLocaleString(),
      icon: "✕",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Total Revenue",
      value: totalRevenue.toFixed(2),
      icon: "💰",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <main className="min-h-screen space-y-8 bg-[#fffaf5] p-4 sm:p-6 lg:p-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#a92318] via-[#d93824] to-[#f07827] p-7 text-white shadow-xl shadow-orange-200/40 sm:p-10">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />
        <div className="absolute -bottom-24 right-40 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
              💳 Financial Management
            </span>

            <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
              Manage Transactions
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
              Monitor vendor subscription payments and review all
              transaction records across your PizzaHub platform.
            </p>
          </div>

          <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-6xl backdrop-blur-sm lg:flex">
            💰
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d93824]">
            Financial Overview
          </p>
          <h2 className="mt-2 text-2xl font-black text-gray-900">
            Transaction Statistics
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            A summary of your subscription payment activity.
          </p>
        </div>

        <button
          onClick={fetchTransactions}
          className="inline-flex items-center gap-2 rounded-xl bg-[#d93824] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-200/50 transition hover:-translate-y-0.5 hover:bg-[#b92d1c]"
        >
          <span>↻</span>
          Refresh Records
        </button>
      </section>

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p>{error}</p>
          <button
            onClick={fetchTransactions}
            className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-500">
                {card.title}
              </p>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${card.bg}`}
              >
                {card.icon}
              </div>
            </div>

            <h3 className={`mt-5 text-3xl font-black ${card.color}`}>
              {card.value}
              {card.title === "Total Revenue" && (
                <span className="ml-1 text-sm font-bold">USD</span>
              )}
            </h3>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-orange-400 to-[#d93824]" />
            </div>
          </div>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#a92318] to-[#ed642b] p-7 text-white shadow-lg shadow-orange-200/40 sm:p-9">
        <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">
              Premium Subscription Earnings
            </p>

            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Total Revenue
            </h2>

            <p className="mt-2 text-sm text-white/80">
              Sum of completed subscription transactions
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-100">
              Total Earnings
            </p>

            <p className="mt-2 text-3xl font-black sm:text-4xl">
              {totalRevenue.toFixed(2)}
            </p>
            <p className="mt-1 text-xs font-semibold text-white/75">
              Transaction amount total
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-100 p-6 sm:p-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d93824]">
              Payment History
            </p>

            <h2 className="mt-2 text-xl font-black text-gray-900 sm:text-2xl">
              All Transactions
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Vendor subscription payment records
            </p>
          </div>

          <div className="rounded-xl bg-orange-50 px-4 py-3">
            <p className="text-xs font-semibold text-gray-500">
              Total Records
            </p>
            <p className="mt-1 text-xl font-black text-[#d93824]">
              {transactions.length}
            </p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="px-6 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-4xl">
              💳
            </div>

            <h3 className="mt-6 text-xl font-black text-gray-800">
              No Transactions Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-500">
              Vendor subscription transactions will appear here when
              payment records become available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-[#fff7f0] text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-5 font-bold">Vendor</th>
                  <th className="px-6 py-5 font-bold">Business</th>
                  <th className="px-6 py-5 font-bold">Plan</th>
                  <th className="px-6 py-5 font-bold">Amount</th>
                  <th className="px-6 py-5 font-bold">Status</th>
                  <th className="px-6 py-5 font-bold">Transaction Date</th>
                  <th className="px-6 py-5 font-bold">Transaction ID</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-orange-50">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="transition-colors hover:bg-orange-50/50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 font-black text-[#d93824]">
                          {(transaction.vendor?.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-bold text-gray-900">
                            {transaction.vendor?.name || "Unknown Vendor"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {transaction.vendor?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 font-medium text-gray-700">
                      {transaction.vendor?.businessName || "N/A"}
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-bold capitalize text-purple-700">
                        {transaction.plan}
                      </span>
                    </td>

                    <td className="px-6 py-5 font-black text-gray-900">
                      {formatAmount(
                        transaction.amount,
                        transaction.currency
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                          transaction.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : transaction.status === "cancelled"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {transaction.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 font-medium text-gray-600">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className="rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs text-gray-500"
                        title={transaction.stripeSessionId || "N/A"}
                      >
                        {transaction.stripeSessionId
                          ? `${transaction.stripeSessionId.slice(0, 18)}...`
                          : "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="rounded-2xl border border-orange-100 bg-white px-5 py-4">
        <p className="flex items-start gap-3 text-xs leading-6 text-gray-500 sm:text-sm">
          <span className="text-lg">🔒</span>
          <span>
            Admin can view transaction records only. Payments cannot be
            edited or deleted here.
          </span>
        </p>
      </div>

      <div className="pb-5 text-center">
        <p className="text-xs font-medium tracking-wider text-gray-400">
          PIZZAHUB ADMIN FINANCIAL MANAGEMENT
        </p>
      </div>
    </main>
  );
}
