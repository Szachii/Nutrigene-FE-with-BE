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
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center">
                <LineChart className="h-16 w-16 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Revenue trend visualization would go here</p>
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
              <CardDescription>Order distribution across weekdays</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <div className="flex h-full items-center justify-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Day of week chart would go here</p>
              </div>
            </CardContent>
          </Card>
        </div>
  
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Calendar</CardTitle>
            <CardDescription>Daily sales overview for the selected period</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <div className="flex h-full items-center justify-center">
              <Calendar className="h-16 w-16 text-muted-foreground" />
              <p className="ml-4 text-muted-foreground">Calendar visualization would go here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  export default AnalyticsPage
  
  