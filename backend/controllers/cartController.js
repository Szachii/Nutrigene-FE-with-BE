// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Get current user's cart
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) return res.json({ items: [] });
  res.json(cart);
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stockCount < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
    if (itemIndex > -1) {
      // Check if adding more items would exceed stock
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (newQuantity > product.stockCount) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity: quantity });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    // Update product stock
    product.stockCount -= quantity;
    await product.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(updatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

// Update item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stockCount < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Find the cart and populate the product references
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => {
      return item.product._id.toString() === productId.toString();
    });

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Calculate stock adjustment
    const oldQuantity = cart.items[itemIndex].quantity;
    const stockAdjustment = oldQuantity - quantity;

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;
    cart.updatedAt = Date.now();
    
    // Save the cart
    await cart.save();

    // Update product stock
    product.stockCount += stockAdjustment;
    await product.save();

    // Return the updated cart with populated products
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(updatedCart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ 
      message: 'Error updating cart item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item to get its quantity
    const item = cart.items.find(item => item.product._id.toString() === productId.toString());
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove the item
    cart.items = cart.items.filter(item => !item.product._id.equals(productId));
    cart.updatedAt = Date.now();
    await cart.save();

    // Update product stock
    const product = await Product.findById(productId);
    if (product) {
      product.stockCount += item.quantity;
      await product.save();
    }
    
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(updatedCart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = [];
  cart.updatedAt = Date.now();
  await cart.save();
  res.json(cart);
};
