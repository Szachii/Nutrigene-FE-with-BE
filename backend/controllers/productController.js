// controllers/productController.js
const Product = require('../models/Product');
const Category = require('../models/Category');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, shortDescription, stockCount } = req.body;

    // Validate required fields
    if (!name || !price || !category || !shortDescription || stockCount === undefined) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['name', 'price', 'category', 'shortDescription', 'stockCount']
      });
    }

    // Check if category exists
    const categoryExists = await Category.findOne({ name: category });
    if (!categoryExists) {
      return res.status(400).json({ message: `Category '${category}' does not exist` });
    }

    // Remove any id field from the request body
    const { id, _id, ...productData } = req.body;

    const product = await Product.create({
      ...productData,
      name,
      price,
      stockCount: stockCount || 0,
      image: req.body.image || '/placeholder.svg',
      shortDescription,
      description: req.body.description || '',
      category,
      demand: req.body.demand || 'medium',
      featured: req.body.featured || false,
      isNewProduct: req.body.isNew || false,
      isLimited: req.body.isLimited || false,
      ingredients: req.body.ingredients || [],
      discount: req.body.discount || 0,
      season: req.body.season || 'none',
      rating: req.body.rating || 4.5,
      reviews: req.body.reviews || 0
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(400).json({
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { category } = req.body;

    // Check if category exists
    if (category) {
      const categoryExists = await Category.findOne({ name: category });
      if (!categoryExists) {
        return res.status(400).json({ message: `Category '${category}' does not exist` });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        stockCount: req.body.stockCount,
        image: req.body.image || '/placeholder.svg',
        shortDescription: req.body.shortDescription,
        description: req.body.description || '',
        category: req.body.category,
        demand: req.body.demand || 'medium',
        featured: req.body.featured || false,
        isNewProduct: req.body.isNew || false,
        isLimited: req.body.isLimited || false,
        ingredients: req.body.ingredients || [],
        discount: req.body.discount || 0,
        season: req.body.season || 'none',
        rating: req.body.rating || 4.5,
        reviews: req.body.reviews || 0,
      },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get seasonal products
exports.getSeasonalProducts = async (req, res) => {
  try {
    const products = await Product.find({ season: { $ne: 'none' } });
    res.json(products);
  } catch (error) {
    console.error('Error fetching seasonal products:', error);
    res.status(500).json({ message: error.message });
  }
};