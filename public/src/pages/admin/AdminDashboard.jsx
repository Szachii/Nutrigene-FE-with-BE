"use client"

import { useState, useEffect } from "react"
import { BarChart, DollarSign, Package, ShoppingCart, TrendingUp, TrendingDown, Users, ArrowRight, User, Shield, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMockOrders, getMockProducts } from "@/data/mockData"
import { formatCurrency } from "@/utils/currencyFormatter"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("today")
  const [userName, setUserName] = useState("")
  const [expiringProducts, setExpiringProducts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch user profile
        const profileResponse = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserName(profileData.name || "User");
        }

        // Fetch all products to check expiry dates
        const productsResponse = await fetch('http://localhost:5000/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }

        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Check for products expiring within 7 days
        const currentDate = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

        const expiringProducts = productsData.filter(product => {
          const expiryDate = new Date(product.expiryDate);
          const daysUntilExpiry = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
        });

        console.log('Products expiring within 7 days:', expiringProducts);
        setExpiringProducts(expiringProducts);

        // Fetch real orders from backend
        const ordersResponse = await fetch('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }

        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add debug logging for expiringProducts state
  useEffect(() => {
    console.log('Current expiringProducts state:', expiringProducts);
  }, [expiringProducts]);

  // Calculate total orders
  const totalOrders = orders.length;
  // Calculate total products
  const totalProducts = products.length;

  // Calculate real revenue from orders
  const calculateRevenue = (timeframe) => {
    const now = new Date();
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      switch (timeframe) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });
    return filteredOrders.reduce((total, order) => total + (order.totalPrice || 0), 0);
  };

  // Update stats with real data
  const stats = {
    today: {
      revenue: calculateRevenue('today'),
      orders: orders.filter(order => new Date(order.createdAt).toDateString() === new Date().toDateString()).length,
      customers: new Set(orders.map(order => order.user)).size,
      products: totalProducts,
      revenueChange: 12.5, // This would need to be calculated based on previous period
      ordersChange: 8.3,
      customersChange: 5.2,
    },
    week: {
      revenue: calculateRevenue('week'),
      orders: orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const weekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
        return orderDate >= weekAgo;
      }).length,
      customers: new Set(orders.map(order => order.user)).size,
      products: totalProducts,
      revenueChange: 15.2,
      ordersChange: 10.5,
      customersChange: 7.8,
    },
    month: {
      revenue: calculateRevenue('month'),
      orders: orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const monthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
        return orderDate >= monthAgo;
      }).length,
      customers: new Set(orders.map(order => order.user)).size,
      products: totalProducts,
      revenueChange: 22.7,
      ordersChange: 18.4,
      customersChange: 12.3,
    },
  };

  const currentStats = stats[timeframe];

  // Get recent orders (most recent 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const TopProducts = () => {
    const [recentProducts, setRecentProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchRecentProducts = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found');
          }

          const response = await fetch('http://localhost:5000/api/products', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }

          const data = await response.json();
          // Sort products by createdAt date in descending order and take the first 5
          const sortedProducts = data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
          setRecentProducts(sortedProducts);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching recent products:", error);
          setLoading(false);
        }
      };

      fetchRecentProducts();
    }, []);

    if (loading) {
      return (
        <div className="flex h-[200px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      );
    }

    return (
      <Card>
        <CardHeader>
          
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProducts.map((product, index) => (
              <div key={product._id} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-md bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(product.price)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Added {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.countInStock} in stock
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Add this function to process sales data for the chart
  const processSalesData = (orders) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const salesData = last7Days.map(date => {
      const dayOrders = orders.filter(order => 
        new Date(order.createdAt).toISOString().split('T')[0] === date
      );
      
      const totalSales = dayOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const orderCount = dayOrders.length;

      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        sales: totalSales,
        orders: orderCount
      };
    });

    return salesData;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {expiringProducts && expiringProducts.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning: Products Expiring Soon</AlertTitle>
          <AlertDescription>
            The following products will expire within a week:
            <ul className="mt-2 list-disc pl-4">
              {expiringProducts.map((product) => {
                const expiryDate = new Date(product.expiryDate);
                const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <li key={product._id || product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{product.name}</span>
                      
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Expires in {daysUntilExpiry} days ({expiryDate.toLocaleDateString()})
                    </span>
                  </li>
                );
              })}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store's performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{userName}</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/admins">
              <Shield className="mr-2 h-4 w-4" />
              Manage Admins
            </Link>
          </Button>
          <Tabs value={timeframe} onValueChange={setTimeframe} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            
          </CardHeader>
          <CardContent>
          <div className="text-2xl font-bold">
  {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(currentStats.revenue)}
</div>

            <div className="flex items-center text-xs text-muted-foreground">
              {currentStats.revenueChange > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{currentStats.revenueChange}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{Math.abs(currentStats.revenueChange)}%</span>
                </>
              )}
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="text-xs text-muted-foreground">
              <span>all time</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.customers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {currentStats.customersChange > 0 ? (
                <>
                  
                </>
              ) : (
                <>
                  
                </>
              )}
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <div className="text-xs text-muted-foreground">
              <span>in stock</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest {recentOrders.length} orders from your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        Order #{order.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-lg font-semibold">
                      {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(order.totalPrice || 0)}
                    </p>
                    <div
                      className={`rounded-full px-2 py-1 text-xs ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                          : order.status === "processing"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/admin/orders">
                View All Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Top Products */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Most popular products by sales</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProducts />
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/admin/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Sales performance over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={processSalesData(orders)}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => `LKR ${value.toLocaleString()}`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tickFormatter={(value) => `${value} orders`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' 
                      ? `LKR ${value.toLocaleString()}` 
                      : `${value} orders`,
                    name === 'sales' ? 'Sales' : 'Orders'
                  ]}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="sales" 
                  fill="#2563eb" 
                  name="Sales"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  yAxisId="right"
                  dataKey="orders" 
                  fill="#16a34a" 
                  name="Orders"
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard

