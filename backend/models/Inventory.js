import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    productName: {
      type: String,
      trim: true
    },
    quantityInStock: {
      type: Number,
      required: [true, 'Quantity in stock is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0
    },
    warehouseLocation: {
      type: String,
      trim: true,
      default: 'Main Warehouse'
    },
    lastRestockDate: {
      type: Date
    },
    lastSaleDate: {
      type: Date
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    reorderLevel: {
      type: Number,
      min: [0, 'Reorder level cannot be negative'],
      default: 10
    },
    maxStockLevel: {
      type: Number,
      min: [0, 'Max stock level cannot be negative']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.quantityInStock === 0) return 'Out of Stock';
  if (this.quantityInStock <= this.reorderLevel) return 'Low Stock';
  if (this.maxStockLevel && this.quantityInStock >= this.maxStockLevel * 0.9) return 'Overstock';
  return 'Normal';
});

// Virtual field for days since last sale
inventorySchema.virtual('daysSinceLastSale').get(function() {
  if (!this.lastSaleDate) return null;
  const diffTime = Math.abs(new Date() - this.lastSaleDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Indexes for faster queries
// Note: productId already has unique: true, which creates an index automatically
inventorySchema.index({ quantityInStock: 1 });
inventorySchema.index({ lastSaleDate: -1 });

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
