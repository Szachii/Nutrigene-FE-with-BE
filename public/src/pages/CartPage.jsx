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

  // Calculate cart totals
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 400 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax - discount;

  const handleQuantityChange = (productId, action) => {
    const item = cart.find((item) => item.product._id === productId);
    if (!item) return;
    if (action === "increase") {
      updateQuantity(productId, item.quantity + 1);
    } else if (action === "decrease" && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleApplyPromoCode = (e) => {
    e.preventDefault();
    setPromoError("Promo codes not supported yet.");
  };

  if (cart.length === 0) {
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
      {cart.map((item) => (
        <div key={item.product._id} className="cart-item flex items-center gap-4 py-4">
          <img src={item.product.image} alt={item.product.name} width={80} className="rounded" />
          <div className="flex-1">
            <h3>{item.product.name}</h3>
            <p>₹{item.product.price.toFixed(2)} × {item.quantity}</p>
            <div className="flex items-center gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => handleQuantityChange(item.product._id, "decrease")}
                disabled={item.quantity <= 1}
              >
                <Minus />
              </Button>
              <span>{item.quantity}</span>
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
      ))}
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
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Shipping: ₹{shipping.toFixed(2)}</p>
        <p>Tax: ₹{tax.toFixed(2)}</p>
        <h3>Total: ₹{total.toFixed(2)}</h3>
      </div>
      <div className="flex gap-4 mt-4">
        <Button onClick={clearCart} variant="destructive">
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