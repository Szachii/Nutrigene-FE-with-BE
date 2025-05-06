import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(product._id, 1);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const displayPrice = product.discount > 0 ? product.discountedPrice : product.price;

  return (
    <Card className="group relative overflow-hidden">
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      {product.discount > 0 && (
        <div className="absolute top-2 right-2 rounded-full bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
          {product.discount}% OFF
        </div>
      )}
      <CardContent className="p-4">
        <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-lg font-bold text-primary">
              {new Intl.NumberFormat("en-LK", {
                style: "currency",
                currency: "LKR",
              }).format(displayPrice)}
            </p>
            {product.discount > 0 && (
              <p className="text-sm text-muted-foreground line-through">
                {new Intl.NumberFormat("en-LK", {
                  style: "currency",
                  currency: "LKR",
                }).format(product.price)}
              </p>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={loading || product.stockCount === 0}
            size="sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : product.stockCount === 0 ? (
              "Out of Stock"
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Stock: {product.stockCount} units
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 