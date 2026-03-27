import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Sales from '../models/Sales.js';
import Inventory from '../models/Inventory.js';

const resolveRegionFromAddress = (address = {}) => {
  const state = String(address?.state || '').toLowerCase();
  if (!state) return 'Central';

  if (['delhi', 'haryana', 'punjab', 'uttar pradesh', 'uttarakhand', 'himachal pradesh', 'jammu and kashmir', 'ladakh', 'chandigarh', 'rajasthan'].includes(state)) {
    return 'North';
  }
  if (['tamil nadu', 'karnataka', 'kerala', 'andhra pradesh', 'telangana', 'puducherry'].includes(state)) {
    return 'South';
  }
  if (['west bengal', 'odisha', 'bihar', 'jharkhand', 'assam', 'sikkim', 'meghalaya', 'tripura', 'manipur', 'mizoram', 'nagaland', 'arunachal pradesh'].includes(state)) {
    return 'East';
  }
  if (['maharashtra', 'gujarat', 'goa', 'dadra and nagar haveli and daman and diu'].includes(state)) {
    return 'West';
  }

  return 'Central';
};

const syncOrderToSales = async (order) => {
  if (!order || order.paymentStatus !== 'completed' || !Array.isArray(order.items) || order.items.length === 0) {
    return;
  }

  const customerName = order.customerInfo?.name || order.customerInfo?.companyName || 'Customer';
  const region = resolveRegionFromAddress(order.shippingAddress);
  const saleDate = order.createdAt || new Date();

  await Promise.all(order.items.map((item, index) => {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.pricePerUnit || 0);
    const totalAmount = Number(item.totalPrice || (quantity * unitPrice));

    if (!item.productId || quantity <= 0 || totalAmount < 0) {
      return Promise.resolve();
    }

    const invoiceId = `${order.orderId}-${String(index + 1).padStart(2, '0')}`.toUpperCase();

    return Sales.findOneAndUpdate(
      { invoiceId },
      {
        invoiceId,
        productId: String(item.productId).trim().toUpperCase(),
        productName: item.productName || '',
        quantitySold: quantity,
        unitPrice,
        totalAmount,
        costPrice: 0,
        saleDate,
        customerName,
        region,
        paymentStatus: 'Paid',
        salesPerson: 'Online'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }));
};

// Initialize Razorpay
let razorpay;
try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Razorpay credentials not found in environment variables');
  } else {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('Razorpay initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Razorpay:', error);
}

// @desc    Create Razorpay order
// @route   POST /api/orders/create-razorpay-order
// @access  Private (Customer)
export const createRazorpayOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, notes } = req.body;

    if (!razorpay) {
      return res.status(500).json({ 
        message: 'Payment gateway not configured. Please contact support.' 
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in the order' });
    }

    // Validate and calculate total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      const itemTotal = product.sellingPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        productName: product.name,
        productId: product.productId,
        quantity: item.quantity,
        unit: product.unit,
        pricePerUnit: product.sellingPrice,
        totalPrice: itemTotal
      });
    }

    // Calculate tax and shipping
    const tax = subtotal * 0.18; // 18% GST
    const shippingCharges = subtotal > 10000 ? 0 : 200; // Free shipping above 10000
    const totalAmount = subtotal + tax + shippingCharges;

    // Get user details
    const user = await User.findById(req.user._id);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        userName: user.name
      }
    });

    // Create order in database
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      shippingCharges,
      totalAmount,
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      razorpayOrderId: razorpayOrder.id,
      orderStatus: 'pending',
      shippingAddress: shippingAddress || user.shippingAddress,
      billingAddress: billingAddress || user.billingAddress,
      customerInfo: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        companyName: user.companyName
      },
      notes
    });

    res.status(201).json({
      success: true,
      order: {
        orderId: order.orderId,
        _id: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalAmount,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-payment
// @access  Private (Customer)
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId
    } = req.body;

    // Verify signature
    const text = razorpayOrderId + '|' + razorpayPaymentId;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update order by Razorpay order id and optionally match either Mongo _id or business orderId.
    const orderQuery = { razorpayOrderId };

    if (orderId) {
      if (mongoose.Types.ObjectId.isValid(orderId)) {
        orderQuery.$or = [{ _id: orderId }, { orderId }];
      } else {
        orderQuery.orderId = orderId;
      }
    }

    const order = await Order.findOneAndUpdate(
      orderQuery,
      {
        paymentStatus: 'completed',
        razorpayPaymentId,
        razorpaySignature,
        orderStatus: 'confirmed'
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await syncOrderToSales(order);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};

// @desc    Get all orders for logged in user
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'productName productId category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (Customer)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'productName productId category image')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Customer)
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        message: `Cannot cancel order with status: ${order.orderStatus}`
      });
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason || 'Customer request';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
};

// Admin functions

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('user', 'name email phone companyName')
      .populate('items.product', 'productName productId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalOrders: count
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;

    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
};

// @desc    Reorder from previous order
// @route   POST /api/orders/:id/reorder
// @access  Private (Customer)
export const reorderOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow reorder for cancelled orders
    if (order.orderStatus !== 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Can only reorder cancelled orders'
      });
    }

    // Check product availability
    const availableItems = [];
    const unavailableItems = [];

    for (const item of order.items) {
      const product = await Product.findById(item.product._id);
      
      if (!product) {
        unavailableItems.push({
          productName: item.product.name,
          reason: 'Product no longer available'
        });
        continue;
      }

      if (!product.isActive) {
        unavailableItems.push({
          productName: item.product.name,
          reason: 'Product is inactive'
        });
        continue;
      }

      // Check inventory
      const inventory = await Inventory.findOne({ productId: product.productId });
      
      if (!inventory || inventory.quantityInStock < item.quantity) {
        unavailableItems.push({
          productName: item.product.name,
          reason: !inventory || inventory.quantityInStock === 0 
            ? 'Out of stock' 
            : `Insufficient stock (${inventory.quantityInStock} available, ${item.quantity} needed)`
        });
      } else {
        availableItems.push({
          productId: product._id,
          quantity: item.quantity,
          product: product
        });
      }
    }

    res.json({
      success: true,
      availableItems,
      unavailableItems,
      message: unavailableItems.length > 0 
        ? 'Some items are not available for reordering' 
        : 'All items available for reordering'
    });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing reorder',
      error: error.message
    });
  }
};

// @desc    Get order invoice data
// @route   GET /api/orders/:id/invoice
// @access  Private (Customer/Admin)
export const getOrderInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone companyName gstNumber')
      .populate('items.product', 'name productId unit');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this invoice
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this invoice'
      });
    }

    // Calculate invoice details
    const invoiceData = {
      orderId: order.orderId,
      orderDate: order.createdAt,
      customer: {
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
        company: order.user.companyName,
        gstNumber: order.user.gstNumber
      },
      billingAddress: order.billingAddress,
      shippingAddress: order.shippingAddress,
      items: order.items.map(item => ({
        productName: item.productName || item.product?.name,
        productId: item.productId || item.product?.productId,
        quantity: item.quantity,
        unit: item.unit || item.product?.unit,
        unitPrice: item.pricePerUnit,
        totalPrice: item.totalPrice
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shippingCharges,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      paymentMethod: 'Razorpay',
      orderStatus: order.orderStatus
    };

    res.json({
      success: true,
      invoice: invoiceData
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invoice',
      error: error.message
    });
  }
};

// @desc    Get product comparison data
// @route   POST /api/orders/compare-products
// @access  Public/Private
export const compareProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || productIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 products to compare'
      });
    }

    if (productIds.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 products can be compared at once'
      });
    }

    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true
    });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found'
      });
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Compare products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error comparing products',
      error: error.message
    });
  }
};
