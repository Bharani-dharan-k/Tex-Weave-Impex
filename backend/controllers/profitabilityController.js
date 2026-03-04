import Product from '../models/Product.js';
import Sales from '../models/Sales.js';
import Inventory from '../models/Inventory.js';

// Get profitability overview
export const getProfitabilityOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Calculate total profit from sales
    const profitData = await Sales.aggregate([
      {
        $match: {
          ...dateFilter,
          costPrice: { $exists: true, $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalCost: {
            $sum: { $multiply: ['$costPrice', '$quantitySold'] }
          },
          totalProfit: {
            $sum: {
              $multiply: [
                { $subtract: ['$unitPrice', '$costPrice'] },
                '$quantitySold'
              ]
            }
          }
        }
      }
    ]);

    const result = profitData[0] || {
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0
    };

    const profitMarginPercentage = result.totalRevenue > 0 
      ? ((result.totalProfit / result.totalRevenue) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      ...result,
      profitMarginPercentage: parseFloat(profitMarginPercentage)
    });

  } catch (error) {
    console.error('Error getting profitability overview:', error);
    res.status(500).json({ message: 'Error fetching profitability data', error: error.message });
  }
};

// Get product-wise profitability
export const getProductProfitability = async (req, res) => {
  try {
    const { startDate, endDate, sortBy = 'profit', limit = 50 } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const profitability = await Sales.aggregate([
      {
        $match: {
          ...dateFilter,
          costPrice: { $exists: true, $gt: 0 }
        }
      },
      {
        $group: {
          _id: '$productId',
          productName: { $first: '$productName' },
          totalRevenue: { $sum: '$totalAmount' },
          totalCost: {
            $sum: { $multiply: ['$costPrice', '$quantitySold'] }
          },
          totalProfit: {
            $sum: {
              $multiply: [
                { $subtract: ['$unitPrice', '$costPrice'] },
                '$quantitySold'
              ]
            }
          },
          quantitySold: { $sum: '$quantitySold' },
          transactionCount: { $sum: 1 }
        }
      },
      {
        $addFields: {
          profitMargin: {
            $cond: [
              { $gt: ['$totalRevenue', 0] },
              { $multiply: [{ $divide: ['$totalProfit', '$totalRevenue'] }, 100] },
              0
            ]
          },
          avgProfitPerUnit: {
            $cond: [
              { $gt: ['$quantitySold', 0] },
              { $divide: ['$totalProfit', '$quantitySold'] },
              0
            ]
          }
        }
      }
    ]);

    // Enrich with product details
    const enrichedData = await Promise.all(
      profitability.map(async (item) => {
        const product = await Product.findOne({ productId: item._id });
        return {
          ...item,
          category: product?.category,
          costPrice: product?.costPrice,
          sellingPrice: product?.sellingPrice
        };
      })
    );

    // Sort based on parameter
    const sortField = sortBy === 'margin' ? 'profitMargin' : 'totalProfit';
    enrichedData.sort((a, b) => b[sortField] - a[sortField]);

    res.status(200).json(enrichedData.slice(0, parseInt(limit)));

  } catch (error) {
    console.error('Error getting product profitability:', error);
    res.status(500).json({ message: 'Error fetching product profitability', error: error.message });
  }
};

// Get high-profit products
export const getHighProfitProducts = async (req, res) => {
  try {
    const { minMargin = 30, limit = 20 } = req.query;

    const products = await Product.find({
      isActive: true
    }).lean();

    const highProfitProducts = products
      .map(product => {
        const profitMargin = parseFloat(product.profitMargin);
        return {
          productId: product.productId,
          name: product.name,
          category: product.category,
          costPrice: product.costPrice,
          sellingPrice: product.sellingPrice,
          profitMargin,
          profitAmount: product.sellingPrice - product.costPrice
        };
      })
      .filter(p => p.profitMargin >= parseFloat(minMargin))
      .sort((a, b) => b.profitMargin - a.profitMargin)
      .slice(0, parseInt(limit));

    res.status(200).json(highProfitProducts);

  } catch (error) {
    console.error('Error getting high-profit products:', error);
    res.status(500).json({ message: 'Error fetching high-profit products', error: error.message });
  }
};

// Get low-profit products
export const getLowProfitProducts = async (req, res) => {
  try {
    const { maxMargin = 15, limit = 20 } = req.query;

    const products = await Product.find({
      isActive: true
    }).lean();

    const lowProfitProducts = products
      .map(product => {
        const profitMargin = parseFloat(product.profitMargin);
        return {
          productId: product.productId,
          name: product.name,
          category: product.category,
          costPrice: product.costPrice,
          sellingPrice: product.sellingPrice,
          profitMargin,
          profitAmount: product.sellingPrice - product.costPrice
        };
      })
      .filter(p => p.profitMargin <= parseFloat(maxMargin))
      .sort((a, b) => a.profitMargin - b.profitMargin)
      .slice(0, parseInt(limit));

    res.status(200).json(lowProfitProducts);

  } catch (error) {
    console.error('Error getting low-profit products:', error);
    res.status(500).json({ message: 'Error fetching low-profit products', error: error.message });
  }
};

// Get profitability by category
export const getProfitabilityByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const categoryProfitability = await Sales.aggregate([
      {
        $match: {
          ...dateFilter,
          costPrice: { $exists: true, $gt: 0 }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: 'productId',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: '$totalAmount' },
          totalCost: {
            $sum: { $multiply: ['$costPrice', '$quantitySold'] }
          },
          totalProfit: {
            $sum: {
              $multiply: [
                { $subtract: ['$unitPrice', '$costPrice'] },
                '$quantitySold'
              ]
            }
          },
          transactionCount: { $sum: 1 }
        }
      },
      {
        $addFields: {
          profitMargin: {
            $cond: [
              { $gt: ['$totalRevenue', 0] },
              { $multiply: [{ $divide: ['$totalProfit', '$totalRevenue'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { totalProfit: -1 } }
    ]);

    res.status(200).json(categoryProfitability);

  } catch (error) {
    console.error('Error getting category profitability:', error);
    res.status(500).json({ message: 'Error fetching category profitability', error: error.message });
  }
};

// Get profit trend over time
export const getProfitTrend = async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      // Default to last 12 months
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      dateFilter = { saleDate: { $gte: twelveMonthsAgo } };
    }

    let groupBy;
    if (period === 'weekly') {
      groupBy = {
        year: { $year: '$saleDate' },
        week: { $week: '$saleDate' }
      };
    } else if (period === 'yearly') {
      groupBy = {
        year: { $year: '$saleDate' }
      };
    } else {
      groupBy = {
        year: { $year: '$saleDate' },
        month: { $month: '$saleDate' }
      };
    }

    const profitTrend = await Sales.aggregate([
      {
        $match: {
          ...dateFilter,
          costPrice: { $exists: true, $gt: 0 }
        }
      },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: '$totalAmount' },
          totalCost: {
            $sum: { $multiply: ['$costPrice', '$quantitySold'] }
          },
          totalProfit: {
            $sum: {
              $multiply: [
                { $subtract: ['$unitPrice', '$costPrice'] },
                '$quantitySold'
              ]
            }
          }
        }
      },
      {
        $addFields: {
          profitMargin: {
            $cond: [
              { $gt: ['$totalRevenue', 0] },
              { $multiply: [{ $divide: ['$totalProfit', '$totalRevenue'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
    ]);

    res.status(200).json(profitTrend);

  } catch (error) {
    console.error('Error getting profit trend:', error);
    res.status(500).json({ message: 'Error fetching profit trend', error: error.message });
  }
};
