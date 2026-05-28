import Link from "next/link";
import { auth } from "@clerk/nextjs";

import HeaderAuth from "./HeaderAuth";
import CartToggle from "./CartToggle";
import SearchBar from "./SearchBar";

export default async function Header() {
  const { userId } = auth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
          E-Shop
        </Link>
        <SearchBar />
      </div>
      <div className="flex items-center space-x-4">
        <nav className="space-x-4">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <Link href="/orders" className="hover:text-blue-600">Orders</Link>
          {userId && (
            <Link href="/admin/products" className="hover:text-blue-600">
              Admin
            </Link>
          )}
        </nav>
        <CartToggle />
        <HeaderAuth />
      </div>
    </header>
  );
}
