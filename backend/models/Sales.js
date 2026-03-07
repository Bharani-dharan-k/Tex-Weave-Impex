import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: [true, 'Invoice ID is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      trim: true,
      uppercase: true
    },
    productName: {
      type: String,
      trim: true
    },
    quantitySold: {
      type: Number,
      required: [true, 'Quantity sold is required'],
      min: [0.01, 'Quantity must be greater than 0']
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative']
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    costPrice: {
      type: Number,
      min: [0, 'Cost price cannot be negative']
    },
    saleDate: {
      type: Date,
      required: [true, 'Sale date is required'],
      default: Date.now
    },
    customerName: {
      type: String,
      trim: true
    },
    region: {
      type: String,
      enum: ['North', 'South', 'East', 'West', 'Central'],
      default: 'Central'
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial'],
      default: 'Paid'
    },
    salesPerson: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for profit calculation
salesSchema.virtual('profit').get(function() {
  if (this.costPrice) {
    return ((this.unitPrice - this.costPrice) * this.quantitySold).toFixed(2);
  }
  return 0;
});

// Indexes for analytics queries
salesSchema.index({ productId: 1, saleDate: -1 });
salesSchema.index({ saleDate: -1 });
// Note: invoiceId already has unique: true, which creates an index automatically
salesSchema.index({ region: 1, saleDate: -1 });

const Sales = mongoose.model('Sales', salesSchema);

export default Sales;
