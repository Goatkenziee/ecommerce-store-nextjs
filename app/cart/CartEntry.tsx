'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@prisma/client';
import { updateCartItemQuantity, removeCartItem } from '@/lib/cart';

interface CartEntryProps {
  cartItem: CartItemType & { product: { imageUrl: string; name: string; price: number } };
}

export default function CartEntry({ cartItem }: CartEntryProps) {
  const [isPending, startTransition] = useTransition();

  const quantityOptions: JSX.Element[] = [];
  for (let i = 1; i <= 99; i++) {
    quantityOptions.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  return (
    <div className="flex items-center gap-4 border-b pb-4 mb-4">
      <Image
        src={cartItem.product.imageUrl}
        alt={cartItem.product.name}
        width={100}
        height={100}
        className="rounded-md object-cover"
      />
      <div className="flex-grow">
        <Link href={`/product/${cartItem.productId}`} className="font-bold text-lg">
          {cartItem.product.name}
        </Link>
        <div className="text-gray-600">{(cartItem.product.price / 100).toFixed(2)}</div>
        <div className="flex items-center gap-2 mt-2">
          Quantity:
          <select
            className="border rounded-md p-1"
            defaultValue={cartItem.quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.currentTarget.value);
              startTransition(async () => {
                await updateCartItemQuantity(cartItem.productId, newQuantity);
              });
            }}
          >
            {quantityOptions}
          </select>
          <button
            onClick={() => {
              startTransition(async () => {
                await removeCartItem(cartItem.productId);
              });
            }}
            className="text-red-500 hover:underline"
            disabled={isPending}
          >
            Remove
          </button>
        </div>
      </div>
      <div className="font-bold text-lg">
        {(cartItem.product.price * cartItem.quantity / 100).toFixed(2)}
      </div>
    </div>
  );
}
