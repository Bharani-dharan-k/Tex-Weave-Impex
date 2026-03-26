import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: String,
    productId: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unit: String,
    pricePerUnit: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shippingCharges: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod', 'bank_transfer'],
    default: 'razorpay'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    companyName: String
  },
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Generate unique order ID in format: #ORD-YYYYMMDD001-<customer_name>
orderSchema.pre('save', async function() {
  if (!this.orderId) {
    // Get customer name
    const User = mongoose.model('User');
    const user = await User.findById(this.user).select('name');
    const customerName = user?.name || 'CUSTOMER';
    
    // Format date as YYYYMMDD
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePart = `${yyyy}${mm}${dd}`;
    
    // Get count of orders created on same day for same customer
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    const dailyCount = await this.constructor.countDocuments({
      user: this.user,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    const sequenceNum = String(dailyCount + 1).padStart(3, '0');
    this.orderId = `#ORD-${datePart}${sequenceNum}-${customerName.toUpperCase()}`;
  }
});

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
// Note: orderId already has unique: true, which creates an index automatically
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
