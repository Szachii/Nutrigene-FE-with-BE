// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(protect, admin, getOrders)
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

router.route('/:id/deliver')
  .put(protect, admin, updateOrderToDelivered);

module.exports = router; 