import { Button, ButtonProps } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden flex flex-col">
      <Link href={`/product/${product.id}`}>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">{product.name}</h3>
        </Link>
        <p className="text-gray-600 mb-3 flex-grow">{product.description?.substring(0, 100)}...</p>
        <div className="mt-auto flex justify-between items-center">
          <p className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</p>
          <Link href={`/product/${product.id}`}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
