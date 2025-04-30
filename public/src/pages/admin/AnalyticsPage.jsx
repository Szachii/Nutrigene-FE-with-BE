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
  } from "lucide-react"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  import { formatCurrency } from "@/utils/currencyFormatter"
  
  const AnalyticsPage = () => {
    // Mock analytics data
    const analyticsData = {
      today: {
        revenue: 1250.75,
        orders: 24,
        customers: 18,
        revenueChange: 12.5,
        ordersChange: 8.3,
        customersChange: 5.2,
      },
      week: {
        revenue: 8750.5,
        orders: 167,
        customers: 89,
        revenueChange: 15.2,
        ordersChange: 10.5,
        customersChange: 7.8,
      },
      month: {
        revenue: 32450.25,
        orders: 643,
        customers: 312,
        revenueChange: 22.7,
        ordersChange: 18.4,
        customersChange: 12.3,
      },
      year: {
        revenue: 387450.75,
        orders: 7865,
        customers: 3254,
        revenueChange: 32.5,
        ordersChange: 28.7,
        customersChange: 24.1,
      },
    }
  
    // Mock top products data
    const topProducts = [
      { name: "Baby Cookies", sales: 1245, percentage: 28 },
      { name: "Lactation Cookies", sales: 876, percentage: 20 },
      
    ]
  
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your store's performance metrics</p>
        </div>
  
        <Tabs defaultValue="month" className="space-y-6">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
  
          {Object.keys(analyticsData).map((period) => (
            <TabsContent key={period} value={period} className="space-y-6">
              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                  <div className="text-2xl font-bold">
  {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(analyticsData[period].revenue)}
</div>

                    <div className="flex items-center text-xs text-muted-foreground">
                      {analyticsData[period].revenueChange > 0 ? (
                        <>
                          <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                          <span className="text-green-500">{analyticsData[period].revenueChange}%</span>
                        </>
                      ) : (
                        <>
                          <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                          <span className="text-red-500">{Math.abs(analyticsData[period].revenueChange)}%</span>
                        </>
                      )}
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData[period].orders}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {analyticsData[period].ordersChange > 0 ? (
                        <>
                          <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                          <span className="text-green-500">{analyticsData[period].ordersChange}%</span>
                        </>
                      ) : (
                        <>
                          <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                          <span className="text-red-500">{Math.abs(analyticsData[period].ordersChange)}%</span>
                        </>
                      )}
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData[period].customers}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {analyticsData[period].customersChange > 0 ? (
                        <>
                          <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                          <span className="text-green-500">{analyticsData[period].customersChange}%</span>
                        </>
                      ) : (
                        <>
                          <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                          <span className="text-red-500">{Math.abs(analyticsData[period].customersChange)}%</span>
                        </>
                      )}
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                  <div className="text-2xl font-bold">
  {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(analyticsData[period].revenue / analyticsData[period].orders)}
</div>

                    <div className="text-xs text-muted-foreground">Per order average</div>
                  </CardContent>
                </Card>
              </div>
  
              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                    <CardDescription>Daily revenue for the selected period</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full items-center justify-center">
                      <LineChart className="h-16 w-16 text-muted-foreground" />
                      <p className="ml-4 text-muted-foreground">Revenue chart visualization would go here</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Orders by Category</CardTitle>
                    <CardDescription>Distribution of orders by product category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full items-center justify-center">
                      <PieChart className="h-16 w-16 text-muted-foreground" />
                      <p className="ml-4 text-muted-foreground">Category distribution chart would go here</p>
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    )
  }
  
  export default AnalyticsPage
  
  