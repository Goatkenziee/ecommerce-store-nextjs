"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { ShoppingCart } from "./cart"; // Assuming the type is exported from lib/cart
import { getCart, addItem, updateItem, deleteItem } from "./cart"; // Server actions

interface ShoppingCartContextType {
  cart: ShoppingCart | null;
  cartTotalItems: number;
  cartTotalPrice: number;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  deleteCartItem: (productId: string) => Promise<void>;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error("useShoppingCart must be used within a ShoppingCartProvider");
  }
  return context;
}

interface ShoppingCartProviderProps {
  children: ReactNode;
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cart, setCart] = useState<ShoppingCart | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    setLoading(true);
    const latestCart = await getCart();
    setCart(latestCart);
    setLoading(false);
  };

  const addToCart = async (productId: string) => {
    await addItem(productId);
    await refreshCart();
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    await updateItem(productId, quantity);
    await refreshCart();
  };

  const deleteCartItem = async (productId: string) => {
    await deleteItem(productId);
    await refreshCart();
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const cartTotalItems = cart?.size || 0;
  const cartTotalPrice = cart?.subtotal || 0;

  return (
    <ShoppingCartContext.Provider
      value={{
        cart,
        cartTotalItems,
        cartTotalPrice,
        refreshCart,
        addToCart,
        updateCartItem,
        deleteCartItem,
      }}
    >
      {loading ? <p>Loading cart...</p> : children}
    </ShoppingCartContext.Provider>
  );
}
