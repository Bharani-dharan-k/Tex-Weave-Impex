import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Cotton', 'Polyester', 'Silk', 'Wool', 'Linen', 'Blended', 'Other'],
      default: 'Other'
    },
    costPrice: {
      type: Number,
      required: [true, 'Cost price is required'],
      min: [0, 'Cost price cannot be negative']
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative']
    },
    reorderLevel: {
      type: Number,
      required: [true, 'Reorder level is required'],
      min: [0, 'Reorder level cannot be negative'],
      default: 10
    },
    description: {
      type: String,
      trim: true
    },
    unit: {
      type: String,
      enum: ['meters', 'kg', 'pieces', 'rolls'],
      default: 'meters'
    },
    image: {
      url: {
        type: String,
        default: ''
      },
      publicId: {
        type: String,
        default: ''
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    source: {
      type: String,
      enum: ['manual', 'csv_upload'],
      set: (value) => (value === 'google_sheets' ? 'csv_upload' : value),
      default: 'manual'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for profit margin percentage
productSchema.virtual('profitMargin').get(function() {
  if (this.costPrice === 0) return 0;
  return ((this.sellingPrice - this.costPrice) / this.costPrice * 100).toFixed(2);
});

// Virtual field for profit amount
productSchema.virtual('profitAmount').get(function() {
  return (this.sellingPrice - this.costPrice).toFixed(2);
});

// Index for faster queries
productSchema.index({ category: 1, isActive: 1 });
// Note: productId already has unique: true, which creates an index automatically

const Product = mongoose.model('Product', productSchema);

export default Product;
