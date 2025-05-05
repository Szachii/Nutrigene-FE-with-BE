import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const ReviewList = ({ productId, onReviewDeleted }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/reviews`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reviews')
      }

      // Sort reviews by date, newest first
      const sortedReviews = data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
      setReviews(sortedReviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error(error.message || 'Failed to fetch reviews')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete review')
      }

      toast.success("Review deleted successfully")
      if (onReviewDeleted) {
        onReviewDeleted()
      }
      fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error(error.message || 'Failed to delete review')
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-gray-500">
        No reviews yet. Be the first to review this product!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Customer Reviews</h3>
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
    </div>
  )
}

export default ReviewList 