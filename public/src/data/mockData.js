const API_URL = 'http://localhost:5000/api';

// Mock products data for testing
const mockProducts = [
  {
    _id: "1",
    name: "Chocolate Chip Cookie",
    price: 1200,
    image: "/Logo.jpg",
    shortDescription: "Classic chocolate chip cookie",
    description: "Delicious chocolate chip cookie made with premium ingredients",
    category: "Cookies",
    featured: true,
    season: "All",
    stockCount: 50
  },
  {
    _id: "2",
    name: "Oatmeal Raisin Cookie",
    price: 1000,
    image: "/Logo.jpg",
    shortDescription: "Healthy oatmeal raisin cookie",
    description: "Nutritious oatmeal raisin cookie perfect for a healthy snack",
    category: "Cookies",
    featured: true,
    season: "All",
    stockCount: 45
  }
];

// Mock orders data for testing
const mockOrders = [
  {
    _id: "ORD001",
    createdAt: "2024-03-15T10:30:00Z",
    customerName: "John Doe",
    email: "john@example.com",
    phone: "0771234567",
    items: [
      {
        product: {
          _id: "1",
          name: "Chocolate Chip Cookie",
          price: 1200,
          image: "/Logo.jpg"
        },
        quantity: 2
      }
    ],
    totalPrice: 2400,
    status: "Processing",
    shippingAddress: {
      address: "123 Main St",
      city: "Colombo",
      postalCode: "00100",
      country: "Sri Lanka"
    },
    paymentMethod: "Credit Card",
    isPaid: true
  }
];

export const getMockProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      console.warn('Using mock data due to API error');
      return mockProducts;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return mockProducts;
  }
};

export const getMockProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      console.warn('Using mock data due to API error');
      return mockProducts.find(product => product._id === id) || null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return mockProducts.find(product => product._id === id) || null;
  }
};

export const getRelatedProducts = async (id, category) => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    if (!response.ok) {
      console.warn('Using mock data due to API error');
      return mockProducts.filter(product => product.category === category && product._id !== id);
    }
    const products = await response.json();
    return products.filter(product => product._id !== id);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return mockProducts.filter(product => product.category === category && product._id !== id);
  }
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
      console.warn('Using mock data due to API error');
      return mockOrders;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
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
      console.warn('Using mock data due to API error');
      return mockOrders.find(order => order._id === id) || null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    return mockOrders.find(order => order._id === id) || null;
  }
};