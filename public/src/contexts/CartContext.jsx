// src/contexts/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);

  // Helper function to get auth token (assumes token is stored in localStorage)
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // Adjust based on your auth mechanism
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart", {
          credentials: "include",
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch cart");
        const data = await response.json();
        setCart(data.items || []);
        setError(null);
      } catch (err) {
        setError("Could not load cart. Please try again.");
        setCart([]);
      }
    };
    fetchCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
        body: JSON.stringify({ productId: product._id, quantity }), // Use _id for MongoDB
      });
      if (!response.ok) throw new Error("Failed to add item to cart");
      const data = await response.json();
      setCart(data.items || []);
      setError(null);
    } catch (err) {
      setError("Could not add item to cart. Please try again.");
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error("Failed to remove item from cart");
      const data = await response.json();
      setCart(data.items || []);
      setError(null);
    } catch (err) {
      setError("Could not remove item from cart. Please try again.");
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await fetch("/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) throw new Error("Failed to update cart quantity");
      const data = await response.json();
      setCart(data.items || []);
      setError(null);
    } catch (err) {
      setError("Could not update cart quantity. Please try again.");
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to clear cart");
      setCart([]);
      setError(null);
    } catch (err) {
      setError("Could not clear cart. Please try again.");
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, error }}>
      {children}
    </CartContext.Provider>
  );
};