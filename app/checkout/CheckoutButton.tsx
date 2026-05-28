'use client';

import { Button } from '@/components/ui/button';
import { createCheckoutSession } from './actions';
import { loadStripe } from '@stripe/stripe-js';
import { useTransition } from 'react';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleCheckout = async () => {
    startTransition(async () => {
      try {
        const session = await createCheckoutSession();
        if (session) {
          const stripe = await stripePromise;
          if (stripe) {
            await stripe.redirectToCheckout({ sessionId: session.id });
          }
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast.error('Failed to create checkout session.');
      }
    });
  };

  return (
    <Button onClick={handleCheckout} disabled={isPending}>
      Checkout
    </Button>
  );
}
