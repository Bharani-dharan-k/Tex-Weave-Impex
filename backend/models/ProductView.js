import mongoose from 'mongoose';

const productViewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Allow anonymous views
    },
    sessionId: {
      type: String,
      required: false
    },
    viewDuration: {
      type: Number, // seconds
      default: 0
    },
    source: {
      type: String,
      enum: ['search', 'category', 'recommendation', 'direct', 'wishlist'],
      default: 'direct'
    },
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop'],
      default: 'desktop'
    }
  },
  {
    timestamps: true
  }
);

// Index for analytics queries
productViewSchema.index({ productId: 1, createdAt: -1 });
productViewSchema.index({ userId: 1, createdAt: -1 });

const ProductView = mongoose.model('ProductView', productViewSchema);

export default ProductView;
