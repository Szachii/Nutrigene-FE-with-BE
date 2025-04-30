"use client"

import { useState, useEffect } from "react"
import { BarChart, DollarSign, Package, ShoppingCart, TrendingUp, TrendingDown, Users, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMockOrders, getMockProducts } from "@/data/mockData"
import { formatCurrency } from "@/utils/currencyFormatter"

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("today")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await getMockOrders()
        setOrders(ordersData)
        const productsData = await getMockProducts()
        setProducts(productsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate total orders
  const totalOrders = orders.length
  // Calculate total products
  const totalProducts = products.length

  // Mock statistics data
  const stats = {
    today: {
      revenue: 1250.75,
      orders: 24,
      customers: 18,
      products: 120,
      revenueChange: 12.5,
      ordersChange: 8.3,
      customersChange: 5.2,
    },
    week: {
      revenue: 8750.5,
      orders: 167,
      customers: 89,
      products: 120,
      revenueChange: 15.2,
      ordersChange: 10.5,
      customersChange: 7.8,
    },
    month: {
      revenue: 32450.25,
      orders: 643,
      customers: 312,
      products: 120,
      revenueChange: 22.7,
      ordersChange: 18.4,
      customersChange: 12.3,
    },
  }

  const currentStats = stats[timeframe]

  // Mock recent orders
  const recentOrders = orders.slice(0, 5)

  // Mock top products
  const topProducts = [
    { id: 1, name: "Classic Chocolate Chip", sales: 124, revenue: 370.76, stock: 45 },
    { id: 2, name: "Pumpkin Spice", sales: 98, revenue: 391.02, stock: 12 },
   
  ]

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store's performance</p>
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
            <CardDescription>Latest  {recentOrders.length} orders from your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                    <p className="text-sm font-medium">
  {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(order.total)}
</p>

                      <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                    </div>
                    <div
                      className={`rounded-full px-2 py-1 text-xs ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                          : order.status === "Processing"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400"
                      }`}
                    >
                      {order.status}
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
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-muted">
                      <img
                        src="BabyCookie1.jpg"
                        
                        alt={product.name}
                        className="h-full w-full rounded-md object-cover"
                      />
                     
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                  <p className="text-sm font-medium">
  {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(product.revenue)}
</p>


                    <p
                      className={`text-xs ${
                        product.stock < 20 ? "text-red-500" : product.stock < 50 ? "text-amber-500" : "text-green-500"
                      }`}
                    >
                      {product.stock} in stock
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
          <CardDescription>Sales performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <BarChart className="h-16 w-16 text-muted-foreground" />
            <p className="ml-4 text-muted-foreground">Chart visualization would go here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard

