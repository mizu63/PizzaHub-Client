
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
        "http://localhost:5000/api/auth/get-session",
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
        "http://localhost:5000/api/admin/transactions",
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Transactions
          </h1>
          <p className="mt-2 text-gray-500">
            View all vendor subscription payments and transactions.
          </p>
        </div>

        <button
          onClick={fetchTransactions}
          className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
          <button
            onClick={fetchTransactions}
            className="ml-3 font-semibold underline"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            {transactions.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Completed Transactions</p>
          <h2 className="mt-3 text-3xl font-bold text-green-600">
            {completedTransactions.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Cancelled Transactions</p>
          <h2 className="mt-3 text-3xl font-bold text-red-600">
            {cancelledTransactions.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="mt-3 text-3xl font-bold text-green-600">
            {totalRevenue.toFixed(2)}
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Sum of completed transactions
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-xl font-bold text-gray-900">
            All Transactions
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Subscription payment history
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              No Transactions Found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Vendor subscription transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4">Vendor</th>
                  <th className="px-5 py-4">Business</th>
                  <th className="px-5 py-4">Plan</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Transaction Date</th>
                  <th className="px-5 py-4">Transaction ID</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {transaction.vendor?.name || "Unknown Vendor"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {transaction.vendor?.email || "N/A"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {transaction.vendor?.businessName || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold capitalize text-purple-700">
                        {transaction.plan}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatAmount(
                        transaction.amount,
                        transaction.currency
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : transaction.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {transaction.stripeSessionId
                        ? `${transaction.stripeSessionId.slice(0, 18)}...`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500">
        Admin can view transaction records only. Payments cannot be edited or deleted here.
      </p>
    </div>
  );
}
