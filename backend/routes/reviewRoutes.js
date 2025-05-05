// routes/reviewRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // To access params from parent router
const { addReview, getProductReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Routes for /api/products/:productId/reviews
router.route('/')
  .get(getProductReviews)
  .post(protect, addReview);

router.route('/:reviewId')
  .delete(protect, deleteReview);

module.exports = router;
