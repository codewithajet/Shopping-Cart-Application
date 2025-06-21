import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

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
  theme: 'light' | 'dark';
  themeColors: typeof themeColors['light'];
}

// Dynamic color palettes for dark/light mode
export const themeColors = {
  light: {
    primary: '#6366f1',
    secondary: '#818cf8',
    background: '#f8fafc',
    backgroundCard: '#fff',
    text: '#232946',
    textLight: '#64748b',
    border: '#e5e7eb',
    accent: '#38bdf8',
    shadow: 'rgba(0,0,0,0.07)',
    danger: '#ef4444',
    success: '#22c55e',
  },
  dark: {
    primary: '#a78bfa',
    secondary: '#6366f1',
    background: '#18181b',
    backgroundCard: '#232946',
    text: '#f3f4f6',
    textLight: '#a1a1aa',
    border: '#334155',
    accent: '#38bdf8',
    shadow: 'rgba(167,139,250,0.10)',
    danger: '#f87171',
    success: '#4ade80',
  }
};

// React context for cart
const CartContext = createContext<CartContextProps | undefined>(undefined);

// Hook for using cart context
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

// Cart provider implementation, includes theme info for beautiful UI
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItemType[]>([]);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

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
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      changeQuantity,
      clearCart,
      theme,
      themeColors: themeColors[theme]
    }}>
      {children}
    </CartContext.Provider>
  );
};