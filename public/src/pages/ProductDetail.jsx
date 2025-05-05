import ReviewForm from "@/components/ReviewForm"
import ReviewList from "@/components/ReviewList"

const handleReviewAdded = () => {
  // Refresh product data to update rating
  fetchProduct()
}

const handleReviewDeleted = () => {
  // Refresh product data to update rating
  fetchProduct()
}

return (
  <div className="mt-8 space-y-8">
    <ReviewForm 
      productId={product.id} 
      onReviewAdded={handleReviewAdded}
    />
    <ReviewList 
      productId={product.id} 
      onReviewDeleted={handleReviewDeleted}
    />
  </div>
) 