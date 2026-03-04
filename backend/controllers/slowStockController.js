import Sales from '../models/Sales.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';

// Identify slow-moving and dead stock
export const getSlowMovingStock = async (req, res) => {
  try {
    const { days = 90, type = 'all' } = req.query;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    // Get all inventory items
    const allInventory = await Inventory.find({
      quantityInStock: { $gt: 0 }
    }).lean();

    const slowMovingProducts = [];

    for (const item of allInventory) {
      // Find sales for this product in the specified period
      const recentSales = await Sales.find({
        productId: item.productId,
        saleDate: { $gte: cutoffDate }
      });

      const totalSold = recentSales.reduce((sum, sale) => sum + sale.quantitySold, 0);
      const salesCount = recentSales.length;

      // Get product details
      const product = await Product.findOne({ productId: item.productId });

      // Classify stock
      let classification = 'Normal';
      if (salesCount === 0) {
        classification = 'Dead Stock';
      } else if (totalSold < item.reorderLevel) {
        classification = 'Slow Moving';
      }

      // Filter based on type parameter
      if (type === 'all' || 
          (type === 'dead' && classification === 'Dead Stock') ||
          (type === 'slow' && classification === 'Slow Moving')) {
        
        const blockedValue = product ? item.quantityInStock * product.costPrice : 0;
        
        slowMovingProducts.push({
          productId: item.productId,
          productName: item.productName || product?.name,
          category: product?.category,
          quantityInStock: item.quantityInStock,
          totalSoldInPeriod: totalSold,
          salesTransactions: salesCount,
          classification,
          daysSinceLastSale: item.lastSaleDate 
            ? Math.floor((new Date() - new Date(item.lastSaleDate)) / (1000 * 60 * 60 * 24))
            : null,
          blockedValue,
          costPrice: product?.costPrice,
          sellingPrice: product?.sellingPrice
        });
      }
    }

    // Sort by blocked value (highest first)
    slowMovingProducts.sort((a, b) => b.blockedValue - a.blockedValue);

    // Calculate summary
    const summary = {
      totalSlowMovingProducts: slowMovingProducts.filter(p => p.classification === 'Slow Moving').length,
      totalDeadStockProducts: slowMovingProducts.filter(p => p.classification === 'Dead Stock').length,
      totalBlockedValue: slowMovingProducts.reduce((sum, p) => sum + p.blockedValue, 0),
      analyzedPeriodDays: parseInt(days)
    };

    res.status(200).json({
      summary,
      products: slowMovingProducts
    });

  } catch (error) {
    console.error('Error identifying slow-moving stock:', error);
    res.status(500).json({ message: 'Error analyzing slow-moving stock', error: error.message });
  }
};

// Get dead stock recommendations
export const getDeadStockRecommendations = async (req, res) => {
  try {
    const { days = 90 } = req.query;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    // Find products with no sales in the period
    const allInventory = await Inventory.find({
      quantityInStock: { $gt: 0 }
    }).lean();

    const recommendations = [];

    for (const item of allInventory) {
      const recentSales = await Sales.countDocuments({
        productId: item.productId,
        saleDate: { $gte: cutoffDate }
      });

      if (recentSales === 0) {
        const product = await Product.findOne({ productId: item.productId });
        const blockedValue = product ? item.quantityInStock * product.costPrice : 0;
        
        // Calculate potential loss if sold at discount
        const potentialDiscountPrice = product ? product.sellingPrice * 0.7 : 0; // 30% discount
        const discountedRevenue = potentialDiscountPrice * item.quantityInStock;
        const estimatedLoss = blockedValue - discountedRevenue;

        recommendations.push({
          productId: item.productId,
          productName: item.productName || product?.name,
          category: product?.category,
          quantityInStock: item.quantityInStock,
          blockedValue,
          recommendedAction: blockedValue > 10000 ? 'Clearance Sale' : 'Bundle Deal',
          suggestedDiscount: '30%',
          estimatedRecovery: discountedRevenue,
          estimatedLoss,
          daysSinceLastSale: item.lastSaleDate 
            ? Math.floor((new Date() - new Date(item.lastSaleDate)) / (1000 * 60 * 60 * 24))
            : 'Never sold'
        });
      }
    }

    recommendations.sort((a, b) => b.blockedValue - a.blockedValue);

    res.status(200).json(recommendations);

  } catch (error) {
    console.error('Error generating dead stock recommendations:', error);
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
};

// Get stock aging analysis
export const getStockAgingAnalysis = async (req, res) => {
  try {
    const inventory = await Inventory.find({
      quantityInStock: { $gt: 0 }
    }).lean();

    const agingBuckets = {
      '0-30 days': [],
      '31-60 days': [],
      '61-90 days': [],
      '90+ days': [],
      'No sales data': []
    };

    for (const item of inventory) {
      const product = await Product.findOne({ productId: item.productId });
      const value = product ? item.quantityInStock * product.costPrice : 0;

      if (!item.lastSaleDate) {
        agingBuckets['No sales data'].push({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantityInStock,
          value
        });
      } else {
        const daysSinceLastSale = Math.floor(
          (new Date() - new Date(item.lastSaleDate)) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastSale <= 30) {
          agingBuckets['0-30 days'].push({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantityInStock,
            value,
            daysSinceLastSale
          });
        } else if (daysSinceLastSale <= 60) {
          agingBuckets['31-60 days'].push({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantityInStock,
            value,
            daysSinceLastSale
          });
        } else if (daysSinceLastSale <= 90) {
          agingBuckets['61-90 days'].push({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantityInStock,
            value,
            daysSinceLastSale
          });
        } else {
          agingBuckets['90+ days'].push({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantityInStock,
            value,
            daysSinceLastSale
          });
        }
      }
    }

    // Calculate summary for each bucket
    const summary = {};
    Object.keys(agingBuckets).forEach(bucket => {
      summary[bucket] = {
        count: agingBuckets[bucket].length,
        totalValue: agingBuckets[bucket].reduce((sum, item) => sum + item.value, 0)
      };
    });

    res.status(200).json({
      summary,
      details: agingBuckets
    });

  } catch (error) {
    console.error('Error analyzing stock aging:', error);
    res.status(500).json({ message: 'Error analyzing stock aging', error: error.message });
  }
};
