"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FeaturedProductCarousel from "@/components/FeaturedProductCarousel"
import SeasonalOffers from "@/components/SeasonalOffers"
import { getMockProducts } from "@/data/mockData" // Assuming you have this function

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [seasonalProducts, setSeasonalProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch products (using mock data for now)
    const fetchProducts = async () => {
      try {
        const allProducts = await getMockProducts()

        // Filter featured products
        const featured = allProducts.filter((product) => product.featured)

        // Filter seasonal products
        const seasonal = allProducts.filter((product) => product.season)

        setProducts(allProducts)
        setFeaturedProducts(featured)
        setSeasonalProducts(seasonal)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 rounded-xl bg-gradient-to-r from-amber-100 to-amber-200 p-8 dark:from-amber-900 dark:to-amber-800">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Delicious Cookies for Mom & Baby</h1>
            <p className="mb-6 text-lg">
              Wholesome,nourishing,and made with love-our cookies are crafted to support moms and delight little ones with every bite!.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/shop">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-xl md:h-[400px]">
            <img
              src="/Logo.jpg"
              alt="Assortment of delicious cookies"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">Featured Treats</h2>
        <FeaturedProductCarousel products={featuredProducts} />
      </section>

      

      {/* Benefits Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Why Choose Nutigene?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-background p-6 text-center shadow-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v1"></path>
                <path d="M12 21v1"></path>
                <path d="m4.6 4.6.7.7"></path>
                <path d="m18.7 18.7.7.7"></path>
                <path d="M2 12h1"></path>
                <path d="M21 12h1"></path>
                <path d="m4.6 19.4.7-.7"></path>
                <path d="m18.7 5.3.7-.7"></path>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Fresh Ingredients</h3>
            <p className="text-muted-foreground">
              We use only the freshest, highest quality ingredients in all our cookies.
            </p>
          </div>

          <div className="rounded-xl bg-background p-6 text-center shadow-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Handcrafted Daily</h3>
            <p className="text-muted-foreground">Each cookie is baked fresh daily with care and attention to detail.</p>
          </div>

          <div className="rounded-xl bg-background p-6 text-center shadow-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Made with Love</h3>
            <p className="text-muted-foreground">
              Our passion for baking shines through in every bite of our delicious and Healthy cookies.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="rounded-xl bg-muted p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-2 text-2xl font-bold">Join Our Cookie Club</h2>
          <p className="mb-6 text-muted-foreground">
            Subscribe to our newsletter for exclusive offers, new flavor announcements, and baking tips.
          </p>
          <form className="flex flex-col gap-4 sm:flex-row">
            <Input type="email" placeholder="Enter your email" className="flex-1" required />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default HomePage

