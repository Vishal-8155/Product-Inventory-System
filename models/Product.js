const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text' });
productSchema.index({ categories: 1 });
productSchema.index({ user: 1 });
productSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);

