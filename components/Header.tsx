import Link from "next/link";
import { ShoppingCart, Package, User } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { getCart } from "@/lib/cart";

export default async function Header() {
  const cart = await getCart();

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          E-commerce
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="flex items-center space-x-1">
            <ShoppingCart size={20} />
            <span>Cart ({cart?.size || 0})</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-1">
            <Package size={20} />
            <span>Admin</span>
          </Link>
          <Link href="/orders" className="flex items-center space-x-1">
            <Package size={20} />
            <span>Orders</span>
          </Link>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
