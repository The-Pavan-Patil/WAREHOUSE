import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  stock_quantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock quantity must be a whole number'
    }
  },
  low_stock_threshold: {
    type: Number,
    required: [true, 'Low stock threshold is required'],
    min: [0, 'Low stock threshold cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Low stock threshold must be a whole number'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


productSchema.virtual('isLowStock').get(function() {
  return this.stock_quantity <= this.low_stock_threshold;
});


productSchema.index({ name: 1 });
productSchema.index({ stock_quantity: 1 });

export default mongoose.model('Product', productSchema);
