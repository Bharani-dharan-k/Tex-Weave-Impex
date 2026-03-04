import Sales from '../models/Sales.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import mongoose from 'mongoose';

// Get sales overview and KPIs
export const getSalesOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Calculate total sales, revenue, and profit
    const salesStats = await Sales.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$quantitySold' },
          totalRevenue: { $sum: '$totalAmount' },
          totalTransactions: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Calculate profit if cost price is available
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

    // Get inventory value
    const inventoryValue = await Inventory.aggregate([
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
          _id: null,
          totalValue: {
            $sum: {
              $multiply: ['$quantityInStock', '$product.costPrice']
            }
          }
        }
      }
    ]);

    // Get low stock count
    const lowStockCount = await Inventory.countDocuments({
      $expr: { $lte: ['$quantityInStock', '$reorderLevel'] }
    });

    res.status(200).json({
      sales: salesStats[0] || {
        totalSales: 0,
        totalRevenue: 0,
        totalTransactions: 0,
        averageOrderValue: 0
      },
      profit: profitData[0]?.totalProfit || 0,
      inventoryValue: inventoryValue[0]?.totalValue || 0,
      lowStockCount
    });

  } catch (error) {
    console.error('Error getting sales overview:', error);
    res.status(500).json({ message: 'Error fetching sales overview', error: error.message });
  }
};

// Get product-wise sales analysis
export const getProductWiseSales = async (req, res) => {
  try {
    const { startDate, endDate, limit = 20 } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const productSales = await Sales.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$productId',
          productName: { $first: '$productName' },
          totalQuantity: { $sum: '$quantitySold' },
          totalRevenue: { $sum: '$totalAmount' },
          totalTransactions: { $sum: 1 },
          averagePrice: { $avg: '$unitPrice' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Enrich with product details
    const enrichedData = await Promise.all(
      productSales.map(async (item) => {
        const product = await Product.findOne({ productId: item._id });
        return {
          ...item,
          category: product?.category,
          profitMargin: product?.profitMargin
        };
      })
    );

    res.status(200).json(enrichedData);

  } catch (error) {
    console.error('Error getting product-wise sales:', error);
    res.status(500).json({ message: 'Error fetching product sales', error: error.message });
  }
};

// Get sales trends (monthly, weekly, yearly)
export const getSalesTrends = async (req, res) => {
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
    switch (period) {
      case 'daily':
        groupBy = {
          year: { $year: '$saleDate' },
          month: { $month: '$saleDate' },
          day: { $dayOfMonth: '$saleDate' }
        };
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$saleDate' },
          week: { $week: '$saleDate' }
        };
        break;
      case 'yearly':
        groupBy = {
          year: { $year: '$saleDate' }
        };
        break;
      default: // monthly
        groupBy = {
          year: { $year: '$saleDate' },
          month: { $month: '$saleDate' }
        };
    }

    const trends = await Sales.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: '$quantitySold' },
          totalRevenue: { $sum: '$totalAmount' },
          totalTransactions: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1, '_id.day': 1 } }
    ]);

    res.status(200).json(trends);

  } catch (error) {
    console.error('Error getting sales trends:', error);
    res.status(500).json({ message: 'Error fetching sales trends', error: error.message });
  }
};

// Get top-selling and least-selling products
export const getTopAndLeastProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Get all products with sales
    const productSales = await Sales.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$productId',
          productName: { $first: '$productName' },
          totalQuantity: { $sum: '$quantitySold' },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    const topProducts = productSales.slice(0, parseInt(limit));
    const leastProducts = productSales.slice(-parseInt(limit)).reverse();

    res.status(200).json({
      topSelling: topProducts,
      leastSelling: leastProducts
    });

  } catch (error) {
    console.error('Error getting top/least products:', error);
    res.status(500).json({ message: 'Error fetching product rankings', error: error.message });
  }
};

// Get sales by category
export const getSalesByCategory = async (req, res) => {
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

    const categorySales = await Sales.aggregate([
      { $match: dateFilter },
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
          totalQuantity: { $sum: '$quantitySold' },
          totalRevenue: { $sum: '$totalAmount' },
          totalTransactions: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.status(200).json(categorySales);

  } catch (error) {
    console.error('Error getting sales by category:', error);
    res.status(500).json({ message: 'Error fetching category sales', error: error.message });
  }
};

// Get sales by region
export const getSalesByRegion = async (req, res) => {
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

    const regionSales = await Sales.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$region',
          totalQuantity: { $sum: '$quantitySold' },
          totalRevenue: { $sum: '$totalAmount' },
          totalTransactions: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.status(200).json(regionSales);

  } catch (error) {
    console.error('Error getting sales by region:', error);
    res.status(500).json({ message: 'Error fetching regional sales', error: error.message });
  }
};
