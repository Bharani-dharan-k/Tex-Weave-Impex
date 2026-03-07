import mongoose from 'mongoose';

const cartAbandonmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: Number,
        price: Number
      }
    ],
    totalValue: {
      type: Number,
      required: true
    },
    abandonedAt: {
      type: Date,
      default: Date.now
    },
    recovered: {
      type: Boolean,
      default: false
    },
    recoveredAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Index for analytics
cartAbandonmentSchema.index({ userId: 1, abandonedAt: -1 });
cartAbandonmentSchema.index({ recovered: 1, abandonedAt: -1 });

const CartAbandonment = mongoose.model('CartAbandonment', cartAbandonmentSchema);

export default CartAbandonment;
