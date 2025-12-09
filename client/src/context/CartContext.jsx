// src/context/CartContext.jsx
import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const existing = cart.find(
      (c) => c.id === item.id && c.size === item.size
    );
    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id && c.size === item.size
            ? { ...c, quantity: c.quantity + (item.quantity || 1) }
            : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: item.quantity || 1 }]);
    }
  };

  const removeFromCart = (id, size) => {
    setCart(cart.filter((c) => !(c.id === id && c.size === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
    } else {
      setCart(
        cart.map((c) =>
          c.id === id && c.size === size ? { ...c, quantity } : c
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
