// src/contexts/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Helper function to get auth token (assumes token is stored in localStorage)
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
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
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ productId: product._id, quantity }),
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
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove item from cart");
      }

      const data = await response.json();
      setCart(data.items || []);
      setError(null);
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError(err.message || "Could not remove item from cart. Please try again.");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      // Validate productId before making the request
      if (!productId || typeof productId !== 'string') {
        throw new Error('Invalid product ID');
      }

      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update cart quantity");
      }

      const data = await response.json();
      setCart(data.items || []);
      setError(null);
    } catch (err) {
      console.error("Error updating cart quantity:", err);
      setError(err.message || "Could not update cart quantity. Please try again.");
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: getAuthHeaders(),
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
    <CartContext.Provider
      value={{
        cart,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};