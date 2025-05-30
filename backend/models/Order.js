const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  items: {
    type: [orderItemSchema],
    required: [true, 'Order items are required'],
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Order must have at least one item'
    }
  },
  shippingAddress: {
    address: { 
      type: String, 
      required: [true, 'Address is required'],
      trim: true
    },
    district: { 
      type: String, 
      required: [true, 'District is required'],
      trim: true
    },
    postalCode: { 
      type: String, 
      required: [true, 'Postal code is required'],
      trim: true
    },
    country: { 
      type: String, 
      required: [true, 'Country is required'],
      default: 'Sri Lanka',
      trim: true
    }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
      message: 'Invalid payment method'
    }
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: {
    type: Number,
    required: [true, 'Items price is required'],
    min: [0, 'Items price cannot be negative'],
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: [true, 'Tax price is required'],
    min: [0, 'Tax price cannot be negative'],
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: [true, 'Shipping price is required'],
    min: [0, 'Shipping price cannot be negative'],
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative'],
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      message: 'Invalid order status'
    },
    default: 'pending'
  }
}, {
  timestamps: true
});

// Add validation to ensure total price matches items price + tax + shipping
orderSchema.pre('save', function(next) {
  const calculatedTotal = this.itemsPrice + this.taxPrice + this.shippingPrice;
  if (Math.abs(calculatedTotal - this.totalPrice) > 0.01) {
    next(new Error('Total price does not match the sum of items, tax, and shipping'));
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema); 