import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5
    },
    reviewText: {
      type: String,
      required: [true, 'Please provide a review'],
      trim: true,
      maxlength: 1000
    },
    reviewTitle: {
      type: String,
      trim: true,
      maxlength: 100
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: true
    },
    helpful: {
      type: Number,
      default: 0
    },
    notHelpful: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure one review per user per product per order
reviewSchema.index({ productId: 1, userId: 1, orderId: 1 }, { unique: true });

// Index for fetching product reviews efficiently
reviewSchema.index({ productId: 1, status: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
