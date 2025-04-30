// src/contexts/OrderContext.jsx
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = '/api';
  const navigate = useNavigate();

  // Helper function to get auth token and headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      throw new Error("Please login to continue");
    }
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Create new order
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const data = await response.json();
      setOrder(data);
      return data;
    } catch (err) {
      console.error("Create order error:", err);
      setError(err.message || "Could not create order. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get order by ID
  const getOrderById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch order");
      }

      const data = await response.json();
      setOrder(data);
      return data;
    } catch (err) {
      console.error("Get order error:", err);
      setError(err.message || "Could not fetch order. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user's orders
  const getMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/orders/myorders`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
      return data;
    } catch (err) {
      console.error("Get my orders error:", err);
      setError(err.message || "Could not fetch orders. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update order to paid
  const updateOrderToPaid = async (id, paymentResult) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/orders/${id}/pay`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(paymentResult)
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order");
      }

      const data = await response.json();
      setOrder(data);
      return data;
    } catch (err) {
      console.error("Update order to paid error:", err);
      setError(err.message || "Could not update order. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{
      order,
      orders,
      error,
      loading,
      createOrder,
      getOrderById,
      getMyOrders,
      updateOrderToPaid
    }}>
      {children}
    </OrderContext.Provider>
  );
}; 