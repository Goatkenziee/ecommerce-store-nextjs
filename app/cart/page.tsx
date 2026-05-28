import { getCart } from "@/lib/cart";
import CartEntry from "./CartEntry";
import { formatPrice } from "@/lib/utils";
import CheckoutButton from "@/app/checkout/CheckoutButton";

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {
        cart?.items.length === 0 || !cart ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartEntry key={item.id} cartItem={item} />
            ))}
            <div className="flex flex-col items-end border-t pt-4 mt-4">
              <p className="text-xl font-bold">Total: {formatPrice(cart.subtotal + cart.shipping)}</p>
              <CheckoutButton />
            </div>
          </div>
        )
      }
    </div>
  );
}
