import { auth } from "@clerk/nextjs";
import { Cart, CartItem, Product } from "@prisma/client";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export type CartWithProducts = Cart & {
  items: (CartItem & { product: Product })[];
};

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
  cartTotalItems: number;
  cartTotalPrice: number;
};

async function createCart(): Promise<CartWithProducts> {
  const { userId } = auth();

  if (userId) {
    return await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  } else {
    const newCart = await prisma.cart.create({
      data: {},
      include: { items: { include: { product: true } } },
    });
    // Set cookie for anonymous cart
    cookies().set("localCartId", newCart.id);
    return newCart;
  }
}

async function getLocalCartId(): Promise<string | undefined> {
  const localCartId = cookies().get("localCartId")?.value;
  return localCartId;
}

async function getCartFromDB(userId: string): Promise<CartWithProducts | null> {
  return await prisma.cart.findFirst({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
}

async function getCartFromLocal(localCartId: string): Promise<CartWithProducts | null> {
  return await prisma.cart.findUnique({
    where: { id: localCartId },
    include: { items: { include: { product: true } } },
  });
}

export async function getCart(): Promise<ShoppingCart | null> {
  const { userId } = auth();

  let cart: CartWithProducts | null = null;

  if (userId) {
    cart = await getCartFromDB(userId);
  } else {
    const localCartId = await getLocalCartId();
    if (localCartId) {
      cart = await getCartFromLocal(localCartId);
    } else {
      cart = await createCart(); // Create new local cart if none exists
    }
  }

  if (!cart) return null;

  const size = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  return {
    ...cart,
    size,
    subtotal,
    cartTotalItems: size,
    cartTotalPrice: subtotal,
  };
}

export async function mergeAnonymousCartIntoUserCart(userId: string) {
  const localCartId = cookies().get("localCartId")?.value;

  if (!localCartId) return;

  const localCart = await prisma.cart.findUnique({
    where: { id: localCartId },
    include: { items: true },
  });

  if (!localCart) return;

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  await prisma.$transaction(async (tx) => {
    if (userCart) {
      // Merge items
      for (const localItem of localCart.items) {
        const existingItem = userCart.items.find(
          (item) => item.productId === localItem.productId
        );

        if (existingItem) {
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + localItem.quantity },
          });
        } else {
          await tx.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: localItem.productId,
              quantity: localItem.quantity,
            },
          });
        }
      }
      await tx.cart.delete({ where: { id: localCartId } });
    } else {
      // Assign anonymous cart to user
      await tx.cart.update({
        where: { id: localCartId },
        data: { userId },
      });
    }
    cookies().set("localCartId", ""); // Clear local cart cookie
  });
}

// These functions are for server actions. Client-side will use a hook.
export async function addItem(productId: string) {
  const { userId } = auth();
  let cart = await getCart();

  if (!cart) {
    cart = await createCart();
  }

  // Check if the product is already in the cart
  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    // Increment quantity if product is already in cart
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + 1 },
    });
  } else {
    // Add new product to cart
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: 1,
      },
    });
  }
}

export async function updateItem(productId: string, quantity: number) {
  let cart = await getCart();

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Find the item to update
  const existingItem = cart.items.find((item) => item.productId === productId);

  if (!existingItem) {
    throw new Error("Item not found in cart");
  }

  if (quantity === 0) {
    await prisma.cartItem.delete({
      where: { id: existingItem.id },
    });
  } else {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity },
    });
  }
}

export async function deleteItem(productId: string) {
  let cart = await getCart();

  if (!cart) {
    throw new Error("Cart not found");
  }

  const existingItem = cart.items.find((item) => item.productId === productId);

  if (!existingItem) {
    throw new Error("Item not found in cart");
  }

  await prisma.cartItem.delete({
    where: { id: existingItem.id },
  });
}
