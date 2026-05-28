import { prisma } from "@/lib/db";

export async function createProduct(data: FormData) {
  const name = data.get("name") as string;
  const description = data.get("description") as string;
  const price = parseFloat(data.get("price") as string);
  const imageUrl = data.get("imageUrl") as string;
  const stock = parseInt(data.get("stock") as string);

  if (!name || !description || !price || !imageUrl || !stock) {
    throw new Error("All fields are required");
  }

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      imageUrl,
      stock,
    },
  });

  redirect("/admin/products");
}
