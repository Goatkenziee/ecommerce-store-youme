import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <Link href="/orders">
          <p className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            View Your Orders
          </p>
        </Link>
        <Link href="/">
          <p className="mt-4 text-indigo-600 hover:underline">
            Continue Shopping
          </p>
        </Link>
      </div>
    </div>
  );
}
