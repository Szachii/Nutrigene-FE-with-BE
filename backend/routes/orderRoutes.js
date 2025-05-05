// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  updateOrderStatus
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

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

module.exports = router; 