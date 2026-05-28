import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {
        orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-2">Order ID: {order.id}</h2>
                <p className="text-gray-600 mb-4">Status: {order.status}</p>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span>
                        {item.quantity} x {item.product.name} ({formatPrice(item.price)})
                      </span>
                      <span>{formatPrice(item.quantity * item.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
