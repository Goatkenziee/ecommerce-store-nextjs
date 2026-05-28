"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useShoppingCart } from "@/lib/cart"; // Assuming a hook for cart state

export default function CartToggle() {
  const { cartTotalItems } = useShoppingCart();

  return (
    <Link href="/cart" className="flex items-center space-x-1 hover:text-blue-600">
      <ShoppingCart className="h-5 w-5" />
      <span className="text-sm font-medium">{cartTotalItems}</span>
    </Link>
  );
}
