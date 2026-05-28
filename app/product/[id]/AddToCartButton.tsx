'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { addToCart } from './actions';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      await addToCart(productId);
      toast.success('Added to cart!');
    });
  };

  return (
    <Button onClick={handleAddToCart} disabled={isPending}>
      Add to Cart
    </Button>
  );
}
