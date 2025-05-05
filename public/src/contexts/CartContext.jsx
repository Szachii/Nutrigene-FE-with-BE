// src/contexts/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  const API_URL = "http://localhost:5000/api";

  // Fetch cart when user changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [] });
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        setCart({ items: [] });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.message);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/cart/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cart item');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart item:', error);
      setError(error.message);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove item from cart');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(error.message);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clear cart');
      }

      setCart({ items: [] });
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(error.message);
      throw error;
    }
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.product.discount > 0
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};