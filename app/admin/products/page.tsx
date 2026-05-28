import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default async function AdminProductsPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const products = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Products</h1>
      <Link href="/admin/products/new" className="bg-green-600 text-white px-4 py-2 rounded-md mb-4 inline-block">
        Add New Product
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product}>
            <div className="mt-4 flex space-x-2">
              <Link href={`/admin/products/${product.id}/edit`} className="bg-blue-500 text-white px-3 py-1 rounded-md">
                Edit
              </Link>
              {/* Delete functionality will be added here */}
            </div>
          </ProductCard>
        ))}
      </div>
    </div>
  );
}
