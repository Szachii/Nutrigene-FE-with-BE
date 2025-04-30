"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Truck, MapPin, CreditCard, User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getMockOrderById } from "@/data/mockData"

const OrderDetailPage = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orderStatus, setOrderStatus] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getMockOrderById(id)
        setOrder(data)
        setOrderStatus(data.status)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching order:", error)
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const handleStatusChange = (status) => {
    setOrderStatus(status)
    // In a real app, this would call an API to update the order status
    console.log(`Updating order ${id} status to ${status}`)
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "shipped":
        return <Badge className="bg-blue-500">Shipped</Badge>
      case "processing":
        return <Badge className="bg-amber-500">Processing</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <p className="mt-2 text-muted-foreground">The order you're looking for doesn't exist.</p>
        <Button asChild className="mt-4">
          <Link to="/admin/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  // Format date
  const orderDate = new Date(order.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Calculate order summary
  const subtotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = order.shipping.cost
  const tax = subtotal * 0.08 // 8% tax
  const total = order.total

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
        </div>
        <div className="flex items-center gap-4">
          <Select value={orderStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button>Print Invoice</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl">Order {order.id}</CardTitle>
            {getStatusBadge(orderStatus)}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col justify-between gap-2 sm:flex-row">
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{orderDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{order.payment.method}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium">{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(total)}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="h-full w-full rounded-md object-cover"
                            />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(item.price)}</TableCell>
                      <TableCell className="text-right">{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{order.customer.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.customer.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{order.shipping.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Shipping Method</p>
                  <p className="font-medium">{order.shipping.method}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{order.payment.method}</p>
                </div>
              </div>
              {order.payment.method === "Credit Card" && (
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">Card</p>
                    <p className="font-medium">•••• •••• •••• {order.payment.last4}</p>
                  </div>
                </div>
              )}
              {order.payment.method === "PayPal" && (
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">PayPal Account</p>
                    <p className="font-medium">{order.payment.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage

