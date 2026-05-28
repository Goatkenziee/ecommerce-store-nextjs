import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProductForm from "./ProductForm";
import { createProduct } from "./actions";

export default function NewProductPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm onSubmit={createProduct} />
    </div>
  );
}
