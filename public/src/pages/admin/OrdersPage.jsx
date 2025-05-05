"use client"

import { useState, useEffect } from "react"
import { Search, Package, Calendar, User, MapPin, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)

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
        // Set all orders as paid by default
        const ordersWithPaidStatus = data.map(order => ({
          ...order,
          isPaid: true
        }));
        setOrders(ordersWithPaidStatus);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => 
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "processing":
        return <Badge className="bg-amber-500">Processing</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "pending":
        return <Badge className="bg-blue-500">Pending</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getPaymentStatusIcon = (isPaid) => {
    return isPaid ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to update order status');
        return;
      }

      // Don't allow changing to the same status
      const currentOrder = orders.find(order => order._id === orderId);
      if (currentOrder.status === newStatus) {
        toast.error('Order is already in this status');
        return;
      }

      // Show loading state
      toast.loading('Updating order status...');

      console.log('Updating order status:', { orderId, newStatus }); // Debug log

      // First update the status
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      console.log('Server response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status');
      }

      // Close dialog and show success message
      setIsStatusDialogOpen(false);
      toast.dismiss(); // Dismiss loading toast
      toast.success(`Order status updated to ${newStatus}`);

      // Update the order in the local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));

    } catch (error) {
      console.error('Error updating order status:', error);
      toast.dismiss(); // Dismiss loading toast
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const handlePaymentStatusToggle = async (orderId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to update payment status');
        return;
      }

      const newStatus = !currentStatus;
      toast.loading('Updating payment status...');

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPaid: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update payment status');
      }

      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, isPaid: newStatus } : order
      ));

      toast.dismiss();
      toast.success(`Payment status updated to ${newStatus ? 'Paid' : 'Unpaid'}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to update payment status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track all orders</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
          <CardTitle>Order List</CardTitle>
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
                      <div className="text-sm">
                        {order.items.length} items
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(order.totalPrice)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog open={isStatusDialogOpen && selectedOrder?._id === order._id} onOpenChange={(open) => {
                        setIsStatusDialogOpen(open);
                        if (!open) setSelectedOrder(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsStatusDialogOpen(true);
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
                              <Button
                                variant={order.status === 'pending' ? 'default' : 'outline'}
                                onClick={() => handleStatusChange(order._id, 'pending')}
                                disabled={order.status === 'pending'}
                              >
                                Pending
                              </Button>
                              <Button
                                variant={order.status === 'processing' ? 'default' : 'outline'}
                                onClick={() => handleStatusChange(order._id, 'processing')}
                                disabled={order.status === 'processing'}
                              >
                                Processing
                              </Button>
                              <Button
                                variant={order.status === 'delivered' ? 'default' : 'outline'}
                                onClick={() => handleStatusChange(order._id, 'delivered')}
                                disabled={order.status === 'delivered'}
                              >
                                Delivered
                              </Button>
                              <Button
                                variant={order.status === 'cancelled' ? 'default' : 'outline'}
                                onClick={() => handleStatusChange(order._id, 'cancelled')}
                                disabled={order.status === 'cancelled'}
                              >
                                Cancelled
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePaymentStatusToggle(order._id, order.isPaid)}
                          className="flex items-center gap-2"
                        >
                          {getPaymentStatusIcon(order.isPaid)}
                          <span className="text-sm">
                            {order.isPaid ? "Paid" : "Unpaid"}
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <p className="mt-2">No orders found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;

