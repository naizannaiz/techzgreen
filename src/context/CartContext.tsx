import React, { createContext, useContext, useState } from 'react';
import type { Product } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  redeemMap: Record<string, number>;
  setRedeemForItem: (productId: string, n: number) => void;
  totalPointsToRedeem: number;
  usePoints: boolean;
  setUsePoints: (b: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [redeemMap, setRedeemMap] = useState<Record<string, number>>({});
  const [usePoints, setUsePoints] = useState(false);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
    setRedeemMap((prev) => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const setRedeemForItem = (productId: string, n: number) => {
    setRedeemMap((prev) => ({ ...prev, [productId]: Math.max(0, Math.floor(n)) }));
  };

  const clearCart = () => {
    setItems([]);
    setRedeemMap({});
    setUsePoints(false);
  };

  const totalAmount = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalPointsToRedeem = usePoints
    ? items.reduce((sum, it) => sum + (redeemMap[it.product.id] || 0), 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        redeemMap,
        setRedeemForItem,
        totalPointsToRedeem,
        usePoints,
        setUsePoints,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
