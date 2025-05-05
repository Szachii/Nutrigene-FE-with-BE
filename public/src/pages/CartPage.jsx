// src/pages/CartPage.jsx
"use client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    loading, 
    error, 
    removeFromCart, 
    updateCartItem, 
    clearCart, 
    getCartTotal, 
    getCartItemsCount 
  } = useCart();
  
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);

  // Calculate cart totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 400 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax - discount;

  const handleQuantityChange = async (productId, action) => {
    const item = cart.items.find((item) => item?.product?._id === productId);
    if (!item) return;
    
    let newQuantity = item.quantity;
    if (action === "increase") {
      newQuantity += 1;
    } else if (action === "decrease" && item.quantity > 1) {
      newQuantity -= 1;
    }
    
    try {
      setUpdatingItem(productId);
      await updateCartItem(productId, newQuantity);
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.message || "Failed to update cart");
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setRemovingItem(productId);
      await removeFromCart(productId);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error(error.message || "Failed to remove item");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error(error.message || "Failed to clear cart");
    }
  };

  const handleApplyPromoCode = (e) => {
    e.preventDefault();
    setPromoError("Promo codes not supported yet.");
    toast.info("Promo codes coming soon!");
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your cart...</p>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-6">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">Looks like you haven't added any items to your cart yet.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link to="/shop">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button asChild>
            <Link to="/shop">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Button variant="outline" asChild>
          <Link to="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => {
              if (!item?.product) return null;
              return (
                <div key={item.product._id} className="flex gap-4 rounded-lg border p-4 transition-all hover:shadow-md">
                  <Link to={`/product/${item.product._id}`} className="flex-shrink-0">
                    <img 
                      src={item.product.image || '/placeholder-image.jpg'} 
                      alt={item.product.name || 'Product'} 
                      className="h-24 w-24 rounded-lg object-cover" 
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link to={`/product/${item.product._id}`} className="text-lg font-semibold hover:text-primary">
                        {item.product.name || 'Unnamed Product'}
                      </Link>
                      <p className="text-muted-foreground">
                        {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(item.product.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.product._id, "decrease")}
                          disabled={item.quantity <= 1 || updatingItem === item.product._id}
                        >
                          {updatingItem === item.product._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Minus className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.product._id, "increase")}
                          disabled={updatingItem === item.product._id}
                        >
                          {updatingItem === item.product._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={removingItem === item.product._id}
                          >
                            {removingItem === item.product._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this item from your cart?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveItem(item.product._id)}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            
            <form onSubmit={handleApplyPromoCode} className="mb-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button type="submit">Apply</Button>
              </div>
              {promoError && <p className="mt-2 text-sm text-destructive">{promoError}</p>}
            </form>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(discount)}</span>
                </div>
              )}
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(total)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Button className="w-full" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Clear Cart
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Cart</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove all items from your cart?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearCart}>
                      Clear Cart
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;