"use client"

import { useState, useEffect } from "react"
import {
  Search, Package, Calendar, User, MapPin,
  CreditCard, CheckCircle, Clock, XCircle, FileText, Download
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { toast } from "react-hot-toast"
import { jsPDF } from "jspdf"
import autoTable from 'jspdf-autotable'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found')

        const response = await fetch('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) throw new Error('Failed to fetch orders')

        const data = await response.json()
        const ordersWithPaidStatus = data.map(order => ({
          ...order,
          isPaid: true
        }))
        setOrders(ordersWithPaidStatus)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(order =>
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "processing":
        return <Badge className="bg-amber-500">Processing</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "pending":
        return <Badge className="bg-blue-500">Pending</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const getPaymentStatusIcon = (isPaid) => {
    return isPaid
      ? <CheckCircle className="h-4 w-4 text-green-500" />
      : <XCircle className="h-4 w-4 text-red-500" />
  }

  const generatePDF = async () => {
    setGeneratingPdf(true)
    const toastId = toast.loading('Generating PDF report...')

    try {
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(20)
      doc.setTextColor(40, 40, 40)
      doc.text('Orders Report', 20, 30)
      
      // Add generation date
      doc.setFontSize(10)
      doc.setTextColor(120, 120, 120)
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, 20, 40)
      
      // Add summary statistics
      const totalOrders = filteredOrders.length
      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0)
      const deliveredOrders = filteredOrders.filter(order => order.status === 'delivered').length
      const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length
      const paidOrders = filteredOrders.filter(order => order.isPaid).length
      
      doc.setFontSize(12)
      doc.setTextColor(40, 40, 40)
      doc.text('Summary:', 20, 55)
      doc.setFontSize(10)
      doc.text(`Total Orders: ${totalOrders}`, 20, 65)
      doc.text(`Total Revenue: ${new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR"
      }).format(totalRevenue)}`, 20, 75)
      doc.text(`Delivered Orders: ${deliveredOrders}`, 20, 85)
      doc.text(`Pending Orders: ${pendingOrders}`, 20, 95)
      doc.text(`Paid Orders: ${paidOrders}`, 20, 105)
      
      // Prepare table data
      const tableColumns = [
        'Order ID',
        'Customer',
        'Items',
        'Total (LKR)',
        'Status',
        'Payment',
        'Date'
      ]
      
      const tableRows = filteredOrders.map(order => [
        `#${order._id.substring(0, 8)}`,
        order.customerName || 'N/A',
        `${order.items.length} items`,
        new Intl.NumberFormat("en-LK", {
          style: "currency",
          currency: "LKR"
        }).format(order.totalPrice),
        order.status.charAt(0).toUpperCase() + order.status.slice(1),
        order.isPaid ? 'Paid' : 'Unpaid',
        new Date(order.createdAt).toLocaleDateString()
      ])
      
      // Add table
      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 120,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [71, 85, 105],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Order ID
          1: { cellWidth: 35 }, // Customer
          2: { cellWidth: 20 }, // Items
          3: { cellWidth: 30 }, // Total
          4: { cellWidth: 25 }, // Status
          5: { cellWidth: 20 }, // Payment
          6: { cellWidth: 25 }  // Date
        }
      })
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(120, 120, 120)
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        )
      }
      
      // Save the PDF
      const fileName = `orders-report-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
      
      toast.success('PDF report generated successfully', { id: toastId })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF report', { id: toastId })
    } finally {
      setGeneratingPdf(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return toast.error('Please login to update order status')

      const currentOrder = orders.find(order => order._id === orderId)
      if (currentOrder.status === newStatus) {
        toast.error('Order is already in this status')
        return
      }

      toast.loading('Updating order status...')
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to update order status')

      setIsStatusDialogOpen(false)
      toast.dismiss()
      toast.success(`Order status updated to ${newStatus}`)

      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.dismiss()
      toast.error(error.message || 'Failed to update order status')
    }
  }

  const handlePaymentStatusToggle = async (orderId, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return toast.error('Please login to update payment status')

      const newStatus = !currentStatus
      toast.loading('Updating payment status...')

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPaid: newStatus })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update payment status')
      }

      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, isPaid: newStatus } : order
      ))

      toast.dismiss()
      toast.success(`Payment status updated to ${newStatus ? 'Paid' : 'Unpaid'}`)
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.dismiss()
      toast.error(error.message || 'Failed to update payment status')
    }
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track all orders</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={generatePDF}
            disabled={generatingPdf || filteredOrders.length === 0}
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: generatingPdf || filteredOrders.length === 0 ? 'not-allowed' : 'pointer',
              opacity: generatingPdf || filteredOrders.length === 0 ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minHeight: '40px',
              minWidth: '120px'
            }}
          >
            {generatingPdf ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export PDF
              </>
            )}
          </button>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by customer name or order ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order List</span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredOrders.length} orders
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">#{order._id.substring(0, 8)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{order.customerName}</span>
                        </div>
                        {order.shippingAddress && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {order.shippingAddress.city}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order.items.length} items</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {new Intl.NumberFormat("en-LK", {
                          style: "currency",
                          currency: "LKR"
                        }).format(order.totalPrice)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={isStatusDialogOpen && selectedOrder?._id === order._id}
                        onOpenChange={(open) => {
                          setIsStatusDialogOpen(open)
                          if (!open) setSelectedOrder(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedOrder(order)
                              setIsStatusDialogOpen(true)
                            }}
                            className="w-[130px] justify-start"
                          >
                            {getStatusBadge(order.status)}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Order Status</DialogTitle>
                            <DialogDescription>
                              Select the new status for order #{order._id.substring(0, 8)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-2">
                              {["pending", "processing", "delivered", "cancelled"].map(status => (
                                <Button
                                  key={status}
                                  variant={order.status === status ? 'default' : 'outline'}
                                  onClick={() => handleStatusChange(order._id, status)}
                                  disabled={order.status === status}
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePaymentStatusToggle(order._id, order.isPaid)}
                      >
                        {getPaymentStatusIcon(order.isPaid)}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default OrdersPage