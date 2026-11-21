
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">
        <div className="mb-5 text-5xl">🎉</div>

        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful!
        </h1>

        <p className="mt-4 text-gray-600">
          Your PizzaHub Premium subscription payment was successful.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Your subscription will be activated after Stripe confirms the payment.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-block rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
