import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL"),
  price: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0.01, "Price must be at least 0.01")
  ),
});

export async function createProduct(formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const validatedFields = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    price: formData.get("price"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, description, imageUrl, price } = validatedFields.data;

  await prisma.product.create({
    data: {
      name,
      description,
      imageUrl,
      price,
      userId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function updateProduct(productId: string, formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const validatedFields = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    price: formData.get("price"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, description, imageUrl, price } = validatedFields.data;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      imageUrl,
      price,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(productId: string) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}
