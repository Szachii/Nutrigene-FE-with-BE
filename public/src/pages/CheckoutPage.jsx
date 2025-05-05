// src/pages/CheckoutPage.jsx
"use client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Truck, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useCart } from "@/contexts/CartContext";

const CheckoutPage = () => {
  const { cart, clearCart, error: cartError } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    shippingMethod: "standard",
    paymentMethod: "credit",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Calculate cart totals
  const subtotal = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = formData.shippingMethod === "standard" ? 400 : 900;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "This field is required";
      }
    });
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (formData.paymentMethod === "credit") {
      if (!formData.cardNumber) {
        errors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        errors.cardNumber = "Please enter a valid 16-digit card number";
      }
      if (!formData.cardName) {
        errors.cardName = "Name on card is required";
      }
      if (!formData.cardExpiry) {
        errors.cardExpiry = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        errors.cardExpiry = "Please use MM/YY format";
      }
      if (!formData.cardCvc) {
        errors.cardCvc = "CVC is required";
      } else if (!/^\d{3,4}$/.test(formData.cardCvc)) {
        errors.cardCvc = "Please enter a valid CVC";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setOrderProcessing(true);
    setApiError(null);

    try {
      // Ensure customer name is properly formatted
      const formattedCustomerName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      
      if (!formattedCustomerName) {
        throw new Error('Customer name is required');
      }

      const orderData = {
        customerName: formattedCustomerName,
        items: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod === "credit" ? "credit_card" : "paypal",
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
        status: 'pending'
      };

      // Log the form data and order data for debugging
      console.log('Form data:', formData);
      console.log('Order data being sent:', orderData);

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create order");
      }

      clearCart();
      navigate("/order-confirmation", {
        state: {
          orderId: responseData._id,
          orderDate: new Date().toISOString(),
          orderTotal: total,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
          paymentMethod: formData.paymentMethod === "credit" ? "Credit Card" : "PayPal",
          customerName: formattedCustomerName
        },
      });
    } catch (err) {
      console.error("Order submission error:", err);
      setApiError(err.message || "Could not process order. Please try again.");
      setOrderProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p>You need to add items to your cart before proceeding to checkout.</p>
        <Link to="/products">
          <Button>Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/cart">Cart</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>Checkout</BreadcrumbItem>
      </Breadcrumb>

      <h2 className="my-6 text-2xl font-bold">Checkout</h2>
      {cartError && <p className="text-red-500 mb-4">{cartError}</p>}
      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}

      <form onSubmit={handleSubmit} className="checkout-form grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h3 className="mb-4 text-lg font-medium">Shipping Information</h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={formErrors.firstName ? "border-red-500" : ""}
                />
                {formErrors.firstName && <p className="text-red-500 text-sm">{formErrors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={formErrors.lastName ? "border-red-500" : ""}
                />
                {formErrors.lastName && <p className="text-red-500 text-sm">{formErrors.lastName}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={formErrors.phone ? "border-red-500" : ""}
              />
              {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={formErrors.address ? "border-red-500" : ""}
              />
              {formErrors.address && <p className="text-red-500 text-sm">{formErrors.address}</p>}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={formErrors.city ? "border-red-500" : ""}
                />
                {formErrors.city && <p className="text-red-500 text-sm">{formErrors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={formErrors.state ? "border-red-500" : ""}
                />
                {formErrors.state && <p className="text-red-500 text-sm">{formErrors.state}</p>}
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={formErrors.zipCode ? "border-red-500" : ""}
                />
                {formErrors.zipCode && <p className="text-red-500 text-sm">{formErrors.zipCode}</p>}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <h3 className="mb-4 text-lg font-medium">Shipping Method</h3>
          <RadioGroup
            name="shippingMethod"
            value={formData.shippingMethod}
            onValueChange={(value) => setFormData({ ...formData, shippingMethod: value })}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard">Standard Shipping (₹400)</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="express" id="express" />
              <Label htmlFor="express">Express Shipping (₹900)</Label>
            </div>
          </RadioGroup>

          <Separator className="my-6" />

          <h3 className="mb-4 text-lg font-medium">Payment Information</h3>
          <Tabs defaultValue="credit" onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
            <TabsList>
              <TabsTrigger value="credit">Credit Card</TabsTrigger>
              <TabsTrigger value="paypal">PayPal</TabsTrigger>
            </TabsList>
            <TabsContent value="credit">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className={formErrors.cardNumber ? "border-red-500" : ""}
                  />
                  {formErrors.cardNumber && <p className="text-red-500 text-sm">{formErrors.cardNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className={formErrors.cardName ? "border-red-500" : ""}
                  />
                  {formErrors.cardName && <p className="text-red-500 text-sm">{formErrors.cardName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className={formErrors.cardExpiry ? "border-red-500" : ""}
                    />
                    {formErrors.cardExpiry && <p className="text-red-500 text-sm">{formErrors.cardExpiry}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input
                      id="cardCvc"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={formErrors.cardCvc ? "border-red-500" : ""}
                    />
                    {formErrors.cardCvc && <p className="text-red-500 text-sm">{formErrors.cardCvc}</p>}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="paypal">
              <p>You will be redirected to PayPal to complete your payment.</p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <h3 className="mb-4 text-lg font-medium">Order Summary</h3>
          <div className="rounded-lg border p-4">
            {cart.items.map((item) => (
              <div key={item.product._id} className="flex justify-between mb-2">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={orderProcessing}>
            {orderProcessing ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;