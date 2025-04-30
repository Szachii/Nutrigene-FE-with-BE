const API_URL = 'http://localhost:5000/api';

// Mock orders data for testing
const mockOrders = [
  {
    id: "ORD001",
    date: "2024-03-15T10:30:00Z",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "0771234567"
    },
    items: [
      {
        name: "Chocolate Cake",
        price: 1200,
        quantity: 2,
        image: "/images/cake1.jpg"
      },
      {
        name: "Cupcake Set",
        price: 800,
        quantity: 1,
        image: "/images/cupcake1.jpg"
      }
    ],
    total: 3200,
    status: "Processing",
    shipping: {
      address: "123 Main St, Colombo",
      method: "Standard Delivery"
    },
    payment: {
      method: "Credit Card",
      last4: "4242"
    }
  },
  {
    id: "ORD002",
    date: "2024-03-14T15:45:00Z",
    customer: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "0777654321"
    },
    items: [
      {
        name: "Birthday Cake",
        price: 2500,
        quantity: 1,
        image: "/images/cake2.jpg"
      }
    ],
    total: 2500,
    status: "Delivered",
    shipping: {
      address: "456 Park Ave, Kandy",
      method: "Express Delivery"
    },
    payment: {
      method: "PayPal",
      email: "jane@example.com"
    }
  }
];

export const getMockProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const getMockProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

export const getRelatedProducts = async (id, category) => {
  const response = await fetch(`${API_URL}/products/category/${category}`);
  if (!response.ok) {
    throw new Error('Failed to fetch related products');
  }
  const products = await response.json();
  return products.filter(product => product._id !== id);
};

export const getMockOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // If API call fails, return mock data for testing
      console.warn('Using mock data due to API error');
      return mockOrders;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    // Return mock data if there's an error
    return mockOrders;
  }
};

export const getMockOrderById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // If API call fails, return mock data for testing
      console.warn('Using mock data due to API error');
      return mockOrders.find(order => order.id === id) || null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    // Return mock data if there's an error
    return mockOrders.find(order => order.id === id) || null;
  }
};