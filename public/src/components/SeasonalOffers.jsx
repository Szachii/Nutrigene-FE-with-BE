"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/CartContext"

const SeasonalOffers = ({ seasonalProducts }) => {
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState("current")

  // Group products by season
  const productsByCategory = seasonalProducts.reduce((acc, product) => {
    if (!acc[product.season]) {
      acc[product.season] = []
    }
    acc[product.season].push(product)
    return acc
  }, {})

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Seasonal Delights</h2>
        <Link to="/shop" className="text-primary hover:underline">
          View all
        </Link>
      </div>

      <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Season</TabsTrigger>
          <TabsTrigger value="upcoming">Coming Soon</TabsTrigger>
          <TabsTrigger value="holiday">Holiday Specials</TabsTrigger>
          <TabsTrigger value="limited">Limited Edition</TabsTrigger>
        </TabsList>

        {Object.keys(productsByCategory).map((season) => (
          <TabsContent key={season} value={season.toLowerCase()} className="mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {productsByCategory[season].map((product) => (
                <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-48 w-full object-cover"
                    />
                    {product.discount > 0 && (
                      <Badge className="absolute right-2 top-2 bg-red-500 text-white">{product.discount}% OFF</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 text-lg font-semibold">{product.name}</h3>
                    <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      {product.discount > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                      )}
                      <Badge
                        className={`${
                          product.demand === "high"
                            ? "bg-green-500"
                            : product.demand === "low"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                        } text-white`}
                      >
                        {product.demand === "high" ? "Popular" : product.demand === "low" ? "Try Me" : "Steady"}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 p-4 pt-0">
                    <Button className="flex-1" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link to={`/product/${product.id}`}>Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default SeasonalOffers

