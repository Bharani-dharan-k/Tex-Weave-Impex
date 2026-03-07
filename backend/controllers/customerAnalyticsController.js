import Order from '../models/Order.js';
import ProductView from '../models/ProductView.js';
import Review from '../models/Review.js';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// @desc    Get customer dashboard summary
// @route   GET /api/customer/analytics/summary
// @access  Private (Customer)
export const getCustomerSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total orders
    const totalOrders = await Order.countDocuments({ user: userId });

    // Total spending
    const spendingResult = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), paymentStatus: 'completed' } },
      { $group: { _id: null, totalSpent: { $sum: '$totalAmount' } } }
    ]);

    const totalSpent = spendingResult[0]?.totalSpent || 0;

    // Last order
    const lastOrder = await Order.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .select('createdAt orderStatus totalAmount');

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Total items purchased
    const itemsResult = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), paymentStatus: 'completed' } },
      { $unwind: '$items' },
      { $group: { _id: null, totalItems: { $sum: '$items.quantity' } } }
    ]);

    const totalItems = itemsResult[0]?.totalItems || 0;

    // Reviews written
    const totalReviews = await Review.countDocuments({ userId: userId });

    // Wishlist count
    const wishlist = await Wishlist.findOne({ user: userId });
    const wishlistCount = wishlist?.products.length || 0;

    res.json({
      success: true,
      summary: {
        totalOrders,
        totalSpent,
        lastOrder,
        avgOrderValue,
        totalItems,
        totalReviews,
        wishlistCount
      }
    });
  } catch (error) {
    console.error('Get customer summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer summary',
      error: error.message
    });
  }
};

// @desc    Get spending over time
// @route   GET /api/customer/analytics/spending-over-time
// @access  Private (Customer)
export const getSpendingOverTime = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = 'monthly' } = req.query; // monthly, weekly, yearly

    let groupBy;
    if (period === 'yearly') {
      groupBy = { year: { $year: '$createdAt' } };
    } else if (period === 'weekly') {
      groupBy = { 
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      };
    } else {
      groupBy = { 
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
    }

    const spending = await Order.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(userId), 
          paymentStatus: 'completed' 
        } 
      },
      {
        $group: {
          _id: groupBy,
          totalSpending: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
    ]);

    res.json({
      success: true,
      period,
      data: spending
    });
  } catch (error) {
    console.error('Get spending over time error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching spending data',
      error: error.message
    });
  }
};

// @desc    Get most purchased category
// @route   GET /api/customer/analytics/top-categories
// @access  Private (Customer)
export const getTopCategories = async (req, res) => {
  try {
    const userId = req.user._id;

    const categories = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), paymentStatus: 'completed' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          orderCount: { $sum: 1 },
          totalQuantity: { $sum: '$items.quantity' },
          totalSpent: { $sum: { $multiply: ['$items.quantity', '$items.pricePerUnit'] } }
        }
      },
      { $sort: { orderCount: -1 } }
    ]);

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get top categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category data',
      error: error.message
    });
  }
};

// @desc    Get most purchased products
// @route   GET /api/customer/analytics/top-products
// @access  Private (Customer)
export const getTopProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    const products = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), paymentStatus: 'completed' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          orderCount: { $sum: 1 },
          totalQuantity: { $sum: '$items.quantity' },
          totalSpent: { $sum: { $multiply: ['$items.quantity', '$items.pricePerUnit'] } }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product data',
      error: error.message
    });
  }
};

// @desc    Get order status distribution
// @route   GET /api/customer/analytics/order-status
// @access  Private (Customer)
export const getOrderStatusDistribution = async (req, res) => {
  try {
    const userId = req.user._id;

    const statusDistribution = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      distribution: statusDistribution
    });
  } catch (error) {
    console.error('Get order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order status data',
      error: error.message
    });
  }
};

// @desc    Get purchase patterns
// @route   GET /api/customer/analytics/purchase-pattern
// @access  Private (Customer)
export const getPurchasePattern = async (req, res) => {
  try {
    const userId = req.user._id;

    // Average order value
    const avgOrderValue = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), paymentStatus: 'completed' } },
      { $group: { _id: null, avgValue: { $avg: '$totalAmount' } } }
    ]);

    // Average items per order
    const avgItemsPerOrder = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), paymentStatus: 'completed' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$_id',
          itemCount: { $sum: '$items.quantity' }
        }
      },
      {
        $group: {
          _id: null,
          avgItems: { $avg: '$itemCount' }
        }
      }
    ]);

    // Order frequency (days between orders)
    const orders = await Order.find({ 
      userId, 
      paymentStatus: 'completed' 
    })
      .sort({ createdAt: 1 })
      .select('createdAt');

    let avgDaysBetweenOrders = 0;
    if (orders.length > 1) {
      let totalDays = 0;
      for (let i = 1; i < orders.length; i++) {
        const days = (orders[i].createdAt - orders[i - 1].createdAt) / (1000 * 60 * 60 * 24);
        totalDays += days;
      }
      avgDaysBetweenOrders = totalDays / (orders.length - 1);
    }

    res.json({
      success: true,
      pattern: {
        avgOrderValue: avgOrderValue[0]?.avgValue || 0,
        avgItemsPerOrder: avgItemsPerOrder[0]?.avgItems || 0,
        avgDaysBetweenOrders: Math.round(avgDaysBetweenOrders),
        totalOrders: orders.length
      }
    });
  } catch (error) {
    console.error('Get purchase pattern error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase pattern',
      error: error.message
    });
  }
};

// @desc    Get browsing history
// @route   GET /api/customer/analytics/browsing-history
// @access  Private (Customer)
export const getBrowsingHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 20 } = req.query;

    const views = await ProductView.find({ user: userId })
      .populate('productId', 'name productId imageUrl category')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: views.length,
      views
    });
  } catch (error) {
    console.error('Get browsing history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching browsing history',
      error: error.message
    });
  }
};

// @desc    Get product recommendations
// @route   GET /api/customer/analytics/recommendations
// @access  Private (Customer)
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's purchased categories
    const purchasedCategories = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), paymentStatus: 'completed' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    const categories = purchasedCategories.map(c => c._id);

    // Get products the user hasn't purchased (collect ObjectIds)
    const purchasedProductIds = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$items' },
      { $group: { _id: null, products: { $addToSet: '$items.product' } } }
    ]);

    const excludeIds = purchasedProductIds[0]?.products || [];

    // Find recommended products
    const query = { isActive: true };
    if (excludeIds.length > 0) query._id = { $nin: excludeIds };
    if (categories.length > 0) query.category = { $in: categories };

    const recommendations = await Product.find(query)
      .limit(10)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
};

