import { prisma } from "@/lib/db";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import { formatPrice } from "@/lib/utils";

interface ProductDetailsPageProps {
  params: { id: string };
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={500}
          height={500}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>
      <div className="md:w-1/2 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-700 text-lg mb-6">{product.description}</p>
        <p className="text-2xl font-semibold text-blue-600 mb-6">{formatPrice(product.price)}</p>
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
}
