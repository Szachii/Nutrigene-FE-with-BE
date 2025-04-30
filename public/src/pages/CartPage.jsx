// src/pages/CartPage.jsx
"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, error } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  // Calculate cart totals with null checks
  const subtotal = cart.reduce((total, item) => {
    if (!item?.product?.price || !item?.quantity) return total;
    return total + (item.product.price * item.quantity);
  }, 0);
  const shipping = subtotal > 0 ? 400 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax - discount;

  const handleQuantityChange = async (productId, action) => {
    const item = cart.find((item) => item?.product?._id === productId);
    if (!item) return;
    
    let newQuantity = item.quantity;
    if (action === "increase") {
      newQuantity += 1;
    } else if (action === "decrease" && item.quantity > 1) {
      newQuantity -= 1;
    }
    
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleApplyPromoCode = (e) => {
    e.preventDefault();
    setPromoError("Promo codes not supported yet.");
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-empty flex flex-col items-center justify-center h-[60vh]">
        <ShoppingBag size={48} />
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/shop">
          <Button>Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page container mx-auto px-4 py-8">
      <h2>Your Cart</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Separator />
      {cart.map((item) => {
        if (!item?.product) return null;
        return (
          <div key={`${item.product._id}-${item.quantity}`} className="cart-item flex items-center gap-4 py-4">
            <img 
              src={item.product.image || '/placeholder-image.jpg'} 
              alt={item.product.name || 'Product'} 
              width={80} 
              className="rounded" 
            />
            <div className="flex-1">
              <h3>{item.product.name || 'Unnamed Product'}</h3>
              <p>{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(item.product.price)} × {item.quantity || 0}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={() => handleQuantityChange(item.product._id, "decrease")}
                  disabled={item.quantity <= 1}
                >
                  <Minus />
                </Button>
                <span>{item.quantity || 0}</span>
                <Button size="sm" onClick={() => handleQuantityChange(item.product._id, "increase")}>
                  <Plus />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveItem(item.product._id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      <Separator />
      <form onSubmit={handleApplyPromoCode} className="flex gap-2 my-4">
        <Input
          placeholder="Promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <Button type="submit">Apply</Button>
      </form>
      {promoError && <p className="text-red-500 mb-4">{promoError}</p>}
      <div className="cart-summary">
        <p>Subtotal: {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(subtotal)}</p>
        <p>Shipping: {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(shipping)}</p>
        <p>Tax: {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(tax)}</p>
        {discount > 0 && <p>Discount: -{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(discount)}</p>}
        <p className="font-bold">Total: {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(total)}</p>
      </div>
      <div className="mt-8">
        <Button onClick={clearCart} variant="outline" className="mr-4">
          Clear Cart
        </Button>
        <Link to="/checkout">
          <Button>Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  );
};

export default CartPage;