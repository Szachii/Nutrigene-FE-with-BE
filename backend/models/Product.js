const mongoose = require('mongoose');
const Category = require('./Category');

// Define the product schema
const productSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  id: {
    type: String,
    required: [true, 'Custom ID is required'],
    unique: true,
    trim: true,
    validate: {
      validator: async function (value) {
        const count = await mongoose.model('Product').countDocuments({ id: value, _id: { $ne: this._id } });
        return count === 0;
      },
      message: 'Custom ID must be unique'
    }
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  image: {
    type: String,
    trim: true,
    default: '/placeholder.svg',
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    validate: {
      validator: async function (value) {
        const category = await Category.findOne({ name: value });
        return !!category;
      },
      message: 'Category does not exist'
    }
  },
  demand: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isNewProduct: {
    type: Boolean,
    default: false,
  },
  isLimited: {
    type: Boolean,
    default: false,
  },
  ingredients: {
    type: [String],
    default: [],
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100'],
    default: 0,
  },
  season: {
    type: String,
    enum: ['current', 'upcoming', 'holiday', 'limited', 'none'],
    default: 'none',
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 4.5,
  },
  reviews: {
    type: Number,
    min: [0, 'Reviews cannot be negative'],
    default: 0,
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
  },
}, {
  timestamps: true,
  suppressReservedKeysWarning: true,
});

productSchema.pre('save', function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  next();
});

// Export the model as a singleton to prevent redefinition
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);