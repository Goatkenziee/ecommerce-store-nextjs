import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCart, createCart } from "@/lib/cart";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: string) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let cart = await getCart();

  if (!cart) {
    cart = await createCart(userId);
  }

  const existingCartItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existingCartItem) {
    await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + 1 },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: 1,
      },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/product/[id]");
}
