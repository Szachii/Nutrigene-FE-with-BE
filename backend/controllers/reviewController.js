// controllers/reviewController.js
const Review = require('../models/Review');
const Product = require('../models/Product');

// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });
      
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add a review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

    // Validate required fields
    if (!rating || !comment) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['rating', 'comment']
      });
    }

    // Check if product exists
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment
    });

    // Update product rating and review count
    const reviews = await Review.find({ product: productId });
    const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(product._id, {
      rating: averageRating,
      reviews: reviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(400).json({
      message: 'Error adding review',
      error: error.message
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const userId = req.user._id;

    // Find the review
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is authorized to delete this review
    if (review.user.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    // Update product rating and review count
    const product = await Product.findOne({ id });
    const reviews = await Review.find({ product: id });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
      const averageRating = totalRating / reviews.length;

      await Product.findByIdAndUpdate(product._id, {
        rating: averageRating,
        reviews: reviews.length
      });
    } else {
      // If no reviews left, reset to default values
      await Product.findByIdAndUpdate(product._id, {
        rating: 4.5,
        reviews: 0
      });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: error.message });
  }
};
