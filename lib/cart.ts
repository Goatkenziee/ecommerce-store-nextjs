import { auth } from "@clerk/nextjs";
import { prisma } from "./db";
import { Cart, CartItem } from "@prisma/client";

export type CartWithProducts = Cart & {
  items: (CartItem & { product: { imageUrl: string; name: string; price: number } })[];
};

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
  shipping: number;
  total: number;
};

export async function getCart(): Promise<ShoppingCart | null> {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart) {
    return null;
  }

  const size = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  // For simplicity, let's assume a fixed shipping cost or free shipping
  const shipping = subtotal > 100 ? 0 : 5;
  const total = subtotal + shipping;

  return { ...cart, size, subtotal, shipping, total };
}

export async function createCart(userId: string): Promise<Cart> {
  return prisma.cart.create({
    data: {
      userId,
    },
  });
}

export async function getOrCreateCart(): Promise<ShoppingCart> {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  let cart = await getCart();

  if (!cart) {
    cart = await createCart(userId);
    return { ...cart, items: [], size: 0, subtotal: 0, shipping: 0, total: 0 };
  }

  return cart;
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const cart = await getCart();

  if (!cart) {
    throw new Error("Cart not found");
  }

  if (quantity === 0) {
    await prisma.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
  } else {
    await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity },
    });
  }
}

export async function removeCartItem(productId: string) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const cart = await getCart();

  if (!cart) {
    throw new Error("Cart not found");
  }

  await prisma.cartItem.delete({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });
}
