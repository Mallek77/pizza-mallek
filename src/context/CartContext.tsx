'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  product: any;
  variant: any;
  options: Record<string, Record<string, number>>;
  quantity: number;
  unitPrice: number;
  orderType?: string;
  timeSlot?: string;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setCart: (cart: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  updateQuantity: (index: number, qty: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCartState] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const setCart = (newCart: CartItem[]) => setCartState(newCart);

  const addToCart = (item: CartItem) => {
    setCartState(prev => [...prev, item]);
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, qty: number) => {
    setCartState(prev => prev.map((item, i) => i === index ? { ...item, quantity: qty } : item));
  };

  const removeItem = (index: number) => {
    setCartState(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCartState([]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, isCartOpen, setCart, addToCart, updateQuantity, removeItem, clearCart, openCart, closeCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}