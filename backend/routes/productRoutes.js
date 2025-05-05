// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  getSeasonalProducts
} = require('../controllers/productController');

const {
  getProductReviews,
  addReview,
  deleteReview
} = require('../controllers/reviewController');

const { protect, admin } = require('../middleware/authMiddleware');

// Product routes
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/category/:category')
  .get(getProductsByCategory);

router.route('/featured')
  .get(getFeaturedProducts);

router.route('/seasonal')
  .get(getSeasonalProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Review routes
router.route('/:id/reviews')
  .get(getProductReviews)
  .post(protect, addReview);

router.route('/:id/reviews/:reviewId')
  .delete(protect, deleteReview);

module.exports = router;
