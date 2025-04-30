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
  getProductsByCategory
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, admin, (req, res, next) => {
    console.log('Creating product, user:', req.user); // Debug log
    createProduct(req, res, next);
  });

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

module.exports = router;