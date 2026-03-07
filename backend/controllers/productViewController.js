import ProductView from '../models/ProductView.js';

// @desc    Track product view
// @route   POST /api/product-views/track
// @access  Public/Private
export const trackProductView = async (req, res) => {
  try {
    const { productId, viewDuration, source, deviceType } = req.body;

    const viewData = {
      productId,
      viewDuration: viewDuration || 0,
      source: source || 'direct',
      deviceType: deviceType || 'desktop'
    };

    // Add userId if user is logged in
    if (req.user) {
      viewData.userId = req.user._id;
    }

    const view = await ProductView.create(viewData);

    res.json({
      success: true,
      message: 'View tracked',
      viewId: view._id
    });
  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking view',
      error: error.message
    });
  }
};

// @desc    Get product view analytics (Admin)
// @route   GET /api/product-views/analytics
// @access  Private (Admin)
export const getProductViewAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, limit = 20 } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Most viewed products
    const mostViewed = await ProductView.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$productId',
          viewCount: { $sum: 1 },
          avgDuration: { $avg: '$viewDuration' },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      { $sort: { viewCount: -1 } },
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

    // Add unique user count
    const result = mostViewed.map(item => ({
      ...item,
      uniqueUserCount: item.uniqueUsers.filter(u => u !== null).length
    }));

    res.json({
      success: true,
      count: result.length,
      analytics: result
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};
