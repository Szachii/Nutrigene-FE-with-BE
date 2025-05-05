"use client"

import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { CheckCircle, Truck, Calendar, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const OrderConfirmationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const orderDetails = location.state

  // If no order details, redirect to home
  useEffect(() => {
    if (!orderDetails) {
      navigate("/")
    }
  }, [orderDetails, navigate])

  if (!orderDetails) {
    return null
  }

  const { orderId, orderDate, orderTotal, shippingAddress, paymentMethod } = orderDetails
  const formattedDate = new Date(orderDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Estimated delivery date (5 business days from order)
  const deliveryDate = new Date(orderDate)
  deliveryDate.setDate(deliveryDate.getDate() + 5)
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-lg border bg-background p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We've received your payment and will begin processing your order right away.
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-muted/30 p-4">
          <h2 className="mb-2 text-lg font-semibold">Order Information</h2>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span>{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Total:</span>
              <span className="font-medium">
                {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(orderTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">Shipping Details</h2>
          <div className="rounded-lg border p-4">
            <div className="mb-4 grid gap-1">
              <span className="font-medium">Shipping Address:</span>
              <span className="text-muted-foreground">{shippingAddress}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center rounded-md bg-muted/30 p-3 text-center">
                <Package className="mb-2 h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Order Processing</span>
                <span className="text-sm font-medium">In Progress</span>
              </div>
              <div className="flex flex-col items-center rounded-md bg-muted/30 p-3 text-center">
                <Truck className="mb-2 h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Shipping Status</span>
                <span className="text-sm font-medium">Pending</span>
              </div>
              <div className="flex flex-col items-center rounded-md bg-muted/30 p-3 text-center">
                <Calendar className="mb-2 h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Estimated Delivery</span>
                <span className="text-sm font-medium">{formattedDeliveryDate}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="mb-6 text-center">
          <p className="mb-2 text-muted-foreground">
            We've sent a confirmation email to your email address with all the details of your order.
          </p>
          <p className="text-muted-foreground">
            If you have any questions about your order, please contact our customer support team.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/orders">View My Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage

