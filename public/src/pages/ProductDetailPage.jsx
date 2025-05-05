"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Star, ChevronRight, Minus, Plus, Heart, Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import ProductDemandBadge from "@/components/ProductDemandBadge"
import { useCart } from "@/contexts/CartContext"
import { getMockProductById, getRelatedProducts } from "@/data/mockData"
import ReviewForm from "@/components/ReviewForm"
import ReviewList from "@/components/ReviewList"
import { useAuth } from "@/contexts/AuthContext"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviews, setReviews] = useState([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)

  // Mock multiple images for the product
  const productImages = [
    "/BabyCookie1.jpg?height=600&width=600",
    "/BabyCookie2.jpg?height=600&width=600&text=Image+2",
    "/BabyCookie2.jpg?height=600&width=600&text=Image+3",
    "/Lactation.jpg?height=600&width=600&text=Image+3",
  ]

  const fetchProduct = async () => {
    try {
      setLoading(true)
      // Fetch product details
      const response = await fetch(`http://localhost:5000/api/products/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      const data = await response.json()
      setProduct(data)

      // Reset quantity and active image when product changes
      setQuantity(1)
      setActiveImage(0)

      // Fetch related products
      try {
        const relatedResponse = await fetch(`http://localhost:5000/api/products?category=${encodeURIComponent(data.category)}&limit=4`)
        if (!relatedResponse.ok) {
          throw new Error('Failed to fetch related products')
        }
        const relatedData = await relatedResponse.json()
        // Filter out the current product from related products
        setRelatedProducts(relatedData.filter(p => p.id !== data.id))
      } catch (error) {
        console.error('Error fetching related products:', error)
        setRelatedProducts([])
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching product:", error)
      setLoading(false)
      setProduct(null)
    }
  }

  const fetchReviews = async () => {
    if (!product?._id) {
      console.log('Waiting for product data to load...');
      return;
    }

    try {
      setIsLoadingReviews(true);
      const response = await fetch(`http://localhost:5000/api/products/${product._id}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!product?._id) {
      toast.error("Product data not loaded");
      return;
    }

    if (!user) {
      toast.error("Please login to add a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please add a comment");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim()
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add review');
      }

      toast.success("Review added successfully");
      setRating(0);
      setComment("");
      await fetchReviews(); // Refresh reviews
      await fetchProduct(); // Refresh product to update rating
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error(error.message || 'Failed to add review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!product?._id) {
      toast.error("Product data not loaded");
      return;
    }

    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/products/${product._id}/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete review');
      }

      toast.success("Review deleted successfully");
      await fetchReviews(); // Refresh reviews
      await fetchProduct(); // Refresh product to update rating
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Failed to delete review');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchProduct();
      // Only fetch reviews after product data is loaded
      if (product?._id) {
        await fetchReviews();
      }
    };
    loadData();
  }, [id]);

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1)
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      // Add product with selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-2xl font-bold">Product Not Found</h2>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/shop">
            Shop
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to={`/shop?category=${product.category}`}>
            {product.category}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <span className="font-medium">{product.name}</span>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Product Images */}
        <div className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-5">
            {/* Thumbnails */}
            <div className="order-last flex gap-2 overflow-auto md:order-first md:flex-col">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square min-w-[80px] overflow-hidden rounded-md border ${
                    activeImage === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image || "BabyCookie1.jpg"}
                    alt={`${product.name} - View ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="md:col-span-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={productImages[activeImage] || "BabyCookie1.jpg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {product.discount > 0 && (
                  <div className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            {product.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
            {product.isLimited && <Badge className="bg-amber-500 text-white">Limited Edition</Badge>}
            <ProductDemandBadge demand={product.demand} />
          </div>

          <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>

          <div className="mb-4 flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <p className="mb-6 text-muted-foreground">{product.shortDescription}</p>

          <div className="mb-6">
            {product.discount > 0 ? (
              <div className="flex items-center gap-3">
                 <span className="text-3xl font-bold">
        {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(product.price * (1 - product.discount / 100))}
      </span>
      <span className="text-xl text-muted-foreground line-through">
        {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(product.price)}
      </span>
              </div>
            ) : (
              <span className="text-3xl font-bold">
              {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(product.price)}
            </span>
            )}
          </div>

          <Separator className="mb-6" />

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">Quantity</label>
            <div className="flex h-10 w-32 items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-full rounded-r-none"
                onClick={() => handleQuantityChange("decrease")}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex h-full flex-1 items-center justify-center border-y bg-background px-2 text-center">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-full rounded-l-none"
                onClick={() => handleQuantityChange("increase")}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 grid gap-2 sm:grid-cols-2">
            <Button size="lg" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="mr-2 h-4 w-4" />
              Add to Wishlist
            </Button>
          </div>

          {/* Share */}
          <div className="mb-6 flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Product Metadata */}
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Category:</span>{" "}
              <Link to={`/shop?category=${product.category}`} className="text-primary hover:underline">
                {product.category}
              </Link>
            </p>
            
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none dark:prose-invert">
              <p className="mb-4">{product.description}</p>
              <p>
                Our cookies are baked fresh daily using premium ingredients. Each cookie is carefully crafted to ensure
                the perfect balance of flavors and textures. Whether you're treating yourself ,Wife or Baby , our cookies are sure to delight.
              </p>
              <h3 className="mt-6 text-xl font-semibold">Storage Instructions</h3>
              <p>
                For optimal freshness, store in an airtight container at room temperature for up to 5 days. Cookies can
                also be frozen for up to 3 months.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="ingredients" className="mt-6">
            <div className="prose max-w-none dark:prose-invert">
              <h3 className="mb-4 text-xl font-semibold">Ingredients</h3>
              <ul className="list-inside list-disc space-y-2">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-8">
              {user ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Write your review..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[100px]"
                      disabled={isSubmitting}
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="rounded-lg border p-4 text-center">
                  <p className="mb-2">Please login to write a review</p>
                  <Button asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              )}

              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                {isLoadingReviews ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="rounded-lg border p-8 text-center text-gray-500">
                    No reviews yet. Be the first to review this product!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="rounded-lg border p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.name}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, index) => (
                                <Star
                                  key={index}
                                  className={`h-4 w-4 ${
                                    index < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {(user?._id === review.user || user?.isAdmin) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="group overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md"
              >
                <Link to={`/product/${relatedProduct.id}`} className="block overflow-hidden">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {relatedProduct.discount > 0 && (
                      <div className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                        {relatedProduct.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">{relatedProduct.name}</h3>
                      <ProductDemandBadge demand={relatedProduct.demand} />
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{relatedProduct.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      {relatedProduct.discount > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold">
                            {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(
                              relatedProduct.price * (1 - relatedProduct.discount / 100)
                            )}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(
                              relatedProduct.price
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold">
                          {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(
                            relatedProduct.price
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage

