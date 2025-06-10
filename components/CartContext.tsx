import React, { createContext, useContext, useState, ReactNode } from 'react';

// Cart item type (matches your Product shape + quantity)
export interface CartItemType {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  quantity: number;
}

// Cart context shape
interface CartContextProps {
  items: CartItemType[];
  addToCart: (item: Omit<CartItemType, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  changeQuantity: (id: number, amount: number) => void;
  clearCart: () => void;
}

// React context for cart
const CartContext = createContext<CartContextProps | undefined>(undefined);

// Hook for using cart context
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

// Cart provider implementation
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItemType[]>([]);

  const addToCart = (item: Omit<CartItemType, 'quantity'>, quantity: number = 1) => {
    setItems(prev =>
      prev.some(i => i.id === item.id)
        ? prev.map(i =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...prev, { ...item, quantity }]
    );
  };

  const removeFromCart = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const changeQuantity = (id: number, amount: number) => {
    setItems(prev =>
      prev
        .map(i =>
          i.id === id
            ? { ...i, quantity: Math.max(1, i.quantity + amount) }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, changeQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};