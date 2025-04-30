// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get current user's cart
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) return res.json({ items: [] });
  res.json(cart);
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }
  const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity || 1;
  } else {
    cart.items.push({ product: productId, quantity: quantity || 1 });
  }
  cart.updatedAt = Date.now();
  await cart.save();
  res.json(cart);
};

// Update item quantity
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const item = cart.items.find(item => item.product.equals(productId));
  if (!item) return res.status(404).json({ message: 'Item not in cart' });
  item.quantity = quantity;
  cart.updatedAt = Date.now();
  await cart.save();
  res.json(cart);
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter(item => !item.product.equals(productId));
  cart.updatedAt = Date.now();
  await cart.save();
  res.json(cart);
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
