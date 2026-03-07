import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// @desc    Submit a product review
// @route   POST /api/reviews
// @access  Private (Customer)
export const submitReview = async (req, res) => {
  try {
    const { productId, orderId, rating, reviewText, reviewTitle } = req.body;

    // Check if user has purchased this product
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      'items.product': productId,
      paymentStatus: 'completed'
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: 'You can only review products you have purchased'
      });
    }

    // Check if user already reviewed this product for this order
    const existingReview = await Review.findOne({
      productId,
      userId: req.user._id,
      orderId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = await Review.create({
      productId,
      userId: req.user._id,
      orderId,
      rating,
      reviewText,
      reviewTitle,
      isVerifiedPurchase: true
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting review',
      error: error.message
    });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'recent' } = req.query;

    let sortOption = { createdAt: -1 }; // Most recent
    if (sort === 'highest') sortOption = { rating: -1, createdAt: -1 };
    if (sort === 'lowest') sortOption = { rating: 1, createdAt: -1 };
    if (sort === 'helpful') sortOption = { helpful: -1, createdAt: -1 };

    const reviews = await Review.find({ 
      productId, 
      status: 'approved' 
    })
      .populate('userId', 'name profilePicture')
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalReviews = await Review.countDocuments({ 
      productId, 
      status: 'approved' 
    });

    // Calculate rating summary
    const ratingSummary = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId), status: 'approved' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId), status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews
      },
      averageRating: avgRating[0]?.averageRating || 0,
      totalReviews: avgRating[0]?.totalReviews || 0,
      ratingSummary
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private (Customer)
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('productId', 'name productId imageUrl')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Customer)
export const updateReview = async (req, res) => {
  try {
    const { rating, reviewText, reviewTitle } = req.body;

    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;
    review.reviewTitle = reviewTitle || review.reviewTitle;

    await review.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Customer)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
export const markReviewHelpful = async (req, res) => {
  try {
    const { helpful } = req.body; // true or false

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (helpful) {
      review.helpful += 1;
    } else {
      review.notHelpful += 1;
    }

    await review.save();

    res.json({
      success: true,
      message: 'Feedback recorded',
      review
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording feedback',
      error: error.message
    });
  }
};

// @desc    Get products eligible for review
// @route   GET /api/reviews/eligible-products
// @access  Private (Customer)
export const getEligibleProducts = async (req, res) => {
  try {
    // Get all paid orders for the user
    const orders = await Order.find({
      user: req.user._id,
      paymentStatus: 'completed',
      orderStatus: 'delivered'
    }).populate('items.product');

    // Get all products the user has already reviewed
    const reviewedProducts = await Review.find({
      userId: req.user._id
    }).distinct('productId');

    // Extract unique products from orders
    const eligibleProducts = [];
    const seenProducts = new Set();

    orders.forEach(order => {
      order.items.forEach(item => {
        if (!item.product) return;
        const productId = item.product._id.toString();
        const alreadyReviewed = reviewedProducts.map(id => id.toString()).includes(productId);
        if (!seenProducts.has(productId) && !alreadyReviewed) {
          eligibleProducts.push({
            productId: item.product._id,
            productName: item.product.name || item.productName,
            orderId: order._id,
            orderDate: order.createdAt
          });
          seenProducts.add(productId);
        }
      });
    });

    res.json({
      success: true,
      count: eligibleProducts.length,
      products: eligibleProducts
    });
  } catch (error) {
    console.error('Get eligible products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching eligible products',
      error: error.message
    });
  }
};
