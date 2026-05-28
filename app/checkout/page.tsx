import { CheckCircle } from "lucide-react";
import Link from "next/link";

interface CheckoutSuccessPageProps {
  searchParams: { session_id: string };
}

export default function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const sessionId = searchParams.session_id;

  // In a real application, you would verify the session_id with Stripe
  // and fetch order details to display to the user.

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold mb-3">Order Placed Successfully!</h1>
      <p className="text-lg text-gray-700 mb-8">
        Thank you for your purchase. Your order has been confirmed.
      </p>
      <div className="flex space-x-4">
        <Link href="/orders" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg">
          View Your Orders
        </Link>
        <Link href="/" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-lg">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
