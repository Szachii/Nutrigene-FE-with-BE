"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ChevronRight, Package, Truck, Calendar, MapPin, CreditCard, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { getMockOrderById } from "@/data/mockData"

const OrderDetailPage = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getMockOrderById(id)
        setOrder(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching order:", error)
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

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
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-2xl font-bold">Order Not Found</h2>
        <p className="mb-8">The order you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/orders">Back to Orders</Link>
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
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/orders">
            Orders
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <span className="font-medium">{order.id}</span>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Order {order.id}</h1>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-muted-foreground">Placed on {orderDate}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Order Items */}
          <div className="rounded-lg border bg-background shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">Order Items</h2>
            </div>
            <div className="p-6">
              {order.items.map((item, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                      <img src="/placeholder.svg" alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        <Link to={`/product/${item.productId}`} className="hover:text-primary hover:underline">
                          {item.name}
                        </Link>
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>Qty: {item.quantity}</span>
                        <span>Price: {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(item.price)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  {index < order.items.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="mt-8 rounded-lg border bg-background shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">Order Status</h2>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-px bg-muted"></div>

                <div className="relative mb-8 pl-10">
                  <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Placed</h3>
                    <p className="text-sm text-muted-foreground">{orderDate}</p>
                    <p className="mt-1 text-sm">Your order has been received and is being processed.</p>
                  </div>
                </div>

                <div className="relative mb-8 pl-10">
                  <div
                    className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${
                      order.status === "Processing" || order.status === "Shipped" || order.status === "Delivered"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.status === "Processing" || order.status === "Shipped" || order.status === "Delivered"
                        ? orderDate
                        : "Pending"}
                    </p>
                    <p className="mt-1 text-sm">Your order is being prepared for shipping.</p>
                  </div>
                </div>

                <div className="relative mb-8 pl-10">
                  <div
                    className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${
                      order.status === "Shipped" || order.status === "Delivered"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Shipped</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.status === "Shipped" || order.status === "Delivered"
                        ? "Shipped on " + orderDate
                        : "Pending"}
                    </p>
                    <p className="mt-1 text-sm">
                      {order.status === "Shipped" || order.status === "Delivered"
                        ? "Your order is on its way to you."
                        : "Your order will be shipped soon."}
                    </p>
                  </div>
                </div>

                <div className="relative pl-10">
                  <div
                    className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${
                      order.status === "Delivered"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Delivered</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.status === "Delivered" ? "Delivered on " + orderDate : "Pending"}
                    </p>
                    <p className="mt-1 text-sm">
                      {order.status === "Delivered"
                        ? "Your order has been delivered successfully."
                        : "Your order will be delivered soon."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Order Summary */}
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="mt-6 rounded-lg border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Shipping Information</h2>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Shipping Address:</p>
              <p className="text-muted-foreground">{order.shipping.address}</p>

              <p className="font-medium">Shipping Method:</p>
              <p className="text-muted-foreground">{order.shipping.method}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mt-6 rounded-lg border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Payment Information</h2>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Payment Method:</p>
              <p className="text-muted-foreground">{order.payment.method}</p>

              {order.payment.method === "Credit Card" && (
                <>
                  <p className="font-medium">Card:</p>
                  <p className="text-muted-foreground">•••• •••• •••• {order.payment.last4}</p>
                </>
              )}

              {order.payment.method === "PayPal" && (
                <>
                  <p className="font-medium">PayPal Account:</p>
                  <p className="text-muted-foreground">{order.payment.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-2">
            <Button className="w-full">Track Order</Button>
            <Button variant="outline" className="w-full">
              Download Invoice
            </Button>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage

