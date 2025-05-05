"use client"

import { useState, useEffect } from "react"
import {
    BarChart,
    LineChart,
    PieChart,
    Calendar,
    ArrowUp,
    ArrowDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    TrendingUp,
  } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/utils/currencyFormatter"
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts'

const AnalyticsPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("week")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const calculateStats = (timeframe) => {
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

    const totalRevenue = filteredOrders.reduce((total, order) => total + (order.totalPrice || 0), 0);
    const totalOrders = filteredOrders.length;
    const uniqueCustomers = new Set(filteredOrders.map(order => order.customerName)).size;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      uniqueCustomers,
      averageOrderValue
    };
  };

  const getOrderStatusDistribution = () => {
    const statusCount = {
      delivered: 0,
      processing: 0,
      cancelled: 0,
      pending: 0
    };

    orders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });

    return statusCount;
  };

  // Add this function to process revenue trend data
  const processRevenueTrendData = (orders, timeframe) => {
    const now = new Date();
    let days;
    let dateFormat;

    switch (timeframe) {
      case 'today':
        days = 24; // Hours for today
        dateFormat = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true });
        break;
      case 'week':
        days = 7;
        dateFormat = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
        break;
      case 'month':
        days = 30;
        dateFormat = (date) => date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        break;
      default:
        days = 7;
        dateFormat = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    const data = Array.from({ length: days }, (_, i) => {
      const date = new Date(now);
      if (timeframe === 'today') {
        date.setHours(now.getHours() - i);
      } else {
        date.setDate(now.getDate() - i);
      }
      return date;
    }).reverse();

    return data.map(date => {
      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        if (timeframe === 'today') {
          return orderDate.getHours() === date.getHours() && 
                 orderDate.toDateString() === date.toDateString();
        }
        return orderDate.toDateString() === date.toDateString();
      });

      const revenue = filteredOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const orderCount = filteredOrders.length;

      return {
        date: dateFormat(date),
        revenue,
        orders: orderCount
      };
    });
  };

  // Add this function to process sales by day of week data
  const processSalesByDayData = (orders) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Initialize data structure for each day
    const dayData = daysOfWeek.map(day => ({
      day,
      revenue: 0,
      orders: 0
    }));

    // Process orders
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const dayIndex = orderDate.getDay();
      const dayName = daysOfWeek[dayIndex];
      
      const dayEntry = dayData.find(d => d.day === dayName);
      if (dayEntry) {
        dayEntry.revenue += order.totalPrice || 0;
        dayEntry.orders += 1;
      }
    });

    // Calculate average order value for each day
    return dayData.map(day => ({
      ...day,
      averageOrderValue: day.orders > 0 ? day.revenue / day.orders : 0
    }));
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  const stats = calculateStats(timeframe);
  const statusDistribution = getOrderStatusDistribution();

  // Mock top products data
  const topProducts = [
    { name: "Baby Cookies", sales: 1245, percentage: 28 },
    { name: "Lactation Cookies", sales: 876, percentage: 20 },
    
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your store's performance</p>
        </div>
        <Tabs value={timeframe} onValueChange={setTimeframe} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {timeframe === 'today' ? 'Today' : timeframe === 'week' ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {timeframe === 'today' ? 'Today' : timeframe === 'week' ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {timeframe === 'today' ? 'Today' : timeframe === 'week' ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(stats.averageOrderValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {timeframe === 'today' ? 'Today' : timeframe === 'week' ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusDistribution).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      status === 'delivered' ? 'bg-green-500' :
                      status === 'processing' ? 'bg-amber-500' :
                      status === 'cancelled' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`} />
                    <span className="text-sm capitalize">{status}</span>
                  </div>
                  <span className="text-sm font-medium">{count} orders</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Revenue and order trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={processRevenueTrendData(orders, timeframe)}
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
                      name === 'revenue' 
                        ? `LKR ${value.toLocaleString()}` 
                        : `${value} orders`,
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ]}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Orders"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* More Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Products with the highest sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-[180px] truncate font-medium">{product.name}</div>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${product.percentage}%` }} />
                    </div>
                  </div>
                  <div className="ml-4 w-[60px] text-right text-sm">{product.sales}</div>
                  <div className="ml-2 w-[50px] text-right text-sm text-muted-foreground">
                    {product.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales by Day of Week</CardTitle>
            <CardDescription>Revenue and order distribution across weekdays</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={processSalesByDayData(orders)}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
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
                      name === 'revenue' 
                        ? `LKR ${value.toLocaleString()}` 
                        : name === 'averageOrderValue'
                          ? `LKR ${value.toLocaleString()}`
                          : `${value} orders`,
                      name === 'revenue' 
                        ? 'Revenue' 
                        : name === 'averageOrderValue'
                          ? 'Average Order Value'
                          : 'Orders'
                    ]}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    fill="#2563eb"
                    name="Revenue"
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
            <div className="mt-4 grid grid-cols-3 gap-4">
              {processSalesByDayData(orders).map((day) => (
                <div key={day.day} className="rounded-lg border p-3">
                  <h4 className="text-sm font-medium">{day.day}</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Revenue: {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(day.revenue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Orders: {day.orders}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Avg. Order: {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(day.averageOrderValue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsPage
  
  