"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/CartContext"

const FeaturedProductCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const { addToCart } = useCart()

  // Handle autoplay functionality
  useEffect(() => {
    let interval
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [autoplay, products.length])

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false)
  const handleMouseLeave = () => setAutoplay(true)

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
  }

  // Handle add to cart
  const handleAddToCart = (product) => {
    addToCart(product)
  }

  if (!products || products.length === 0) {
    return null
  }

  const currentProduct = products[currentIndex]

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-background shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-[500px] w-full">
        {/* Product Image */}
        <div className="absolute inset-0 h-full w-full">
          <img
            src={currentProduct.image || "Logo.jpg"}
            alt={currentProduct.name}
            className="h-full w-full object-cover transition-all duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        {/* Product Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mb-2 flex items-center gap-2"> 
            {currentProduct.demand === "high" && <Badge className="bg-green-500 text-white">High</Badge>}
          </div>
          <h2 className="mb-2 text-3xl font-bold">{currentProduct.name}</h2>
          <p className="mb-4 text-lg opacity-90">{currentProduct.shortDescription}</p>
          <div className="flex items-center gap-4">
          <span className="text-2xl font-bold">
  {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(currentProduct.price)}
</span>

            <div className="flex gap-3">
              <Button
                onClick={() => handleAddToCart(currentProduct)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add to Cart
              </Button>
              <Button asChild variant="secondary">
                <Link to={`/product/${currentProduct.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-8 rounded-full transition-all ${index === currentIndex ? "bg-primary" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default FeaturedProductCarousel

