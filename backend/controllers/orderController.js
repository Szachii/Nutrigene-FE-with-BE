// controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { 
      shippingAddress, 
      paymentMethod, 
      customerName,
      items,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    // Log the incoming request body for debugging
    console.log('Received order data:', {
      customerName,
      shippingAddress,
      paymentMethod,
      itemsCount: items?.length,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      userId: req.user._id
    });

    // Validate required fields
    if (!customerName || !shippingAddress || !paymentMethod || !items || items.length === 0) {
      console.log('Validation failed:', {
        customerName: !customerName,
        shippingAddress: !shippingAddress,
        paymentMethod: !paymentMethod,
        items: !items || items.length === 0
      });
      
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          customerName: !customerName,
          shippingAddress: !shippingAddress,
          paymentMethod: !paymentMethod,
          items: !items || items.length === 0
        }
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Verify stock availability and update stock counts
      for (const item of items) {
        const product = await Product.findById(item.product).session(session);
        if (!product) {
          await session.abortTransaction();
          return res.status(404).json({ message: `Product not found: ${item.product}` });
        }

        // Check if enough stock is available
        if (product.stockCount < item.quantity) {
          await session.abortTransaction();
          return res.status(400).json({ 
            message: `Not enough stock available for ${product.name}`,
            product: product.name,
            available: product.stockCount,
            requested: item.quantity
          });
        }

        // Update stock count
        product.stockCount -= item.quantity;
        await product.save({ session });
      }

      // Create order
      const order = new Order({
        user: req.user._id,
        customerName: customerName.trim(),
        items,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        status: 'pending'
      });

      // Save order
      const createdOrder = await order.save({ session });

      // Clear cart
      cart.items = [];
      await cart.save({ session });

      // Commit transaction
      await session.commitTransaction();

      res.status(201).json(createdOrder);
    } catch (error) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      console.error('Transaction error:', error);
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Create order error:', error);
    // Log the full error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        errors: error.errors
      });
    }
    res.status(500).json({ 
      message: 'Error creating order',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order to paid error:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order to delivered error:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Don't allow changing from pending to pending
    if (order.status === 'pending' && status === 'pending') {
      return res.status(400).json({ message: 'Order is already in pending status' });
    }

    order.status = status;
    
    // Update isDelivered flag if status is delivered
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
}; 