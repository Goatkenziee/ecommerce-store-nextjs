import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { getCart } from "@/lib/cart";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

export async function createCheckoutSession() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const line_items = cart.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.name,
        images: [item.product.imageUrl],
      },
      unit_amount: Math.round(item.product.price * 100), // Price in cents
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    metadata: { userId: userId },
  });

  return { id: session.id };
}

export async function handleStripeWebhook(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature as string,
      process.env.WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;

    const userId = session.metadata?.userId;
    const totalAmount = session.amount_total ? session.amount_total / 100 : 0;

    if (!userId) {
      return new Response("No userId in metadata", { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      return new Response("Cart not found", { status: 404 });
    }

    await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: "completed",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return new Response("Order created and cart cleared", { status: 200 });
  }

  return new Response("Unhandled event type", { status: 200 });
}
