import Sales from '../models/Sales.js';
import Product from '../models/Product.js';

// Simple Moving Average (SMA) forecast
export const getDemandForecast = async (req, res) => {
  try {
    const { productId, months = 3, forecastPeriod = 3 } = req.query;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const lookbackMonths = parseInt(months);
    const forecastMonths = parseInt(forecastPeriod);

    // Calculate date range for historical data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - lookbackMonths);

    // Get monthly sales data
    const monthlySales = await Sales.aggregate([
      {
        $match: {
          productId: productId.toUpperCase(),
          saleDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$saleDate' },
            month: { $month: '$saleDate' }
          },
          totalQuantity: { $sum: '$quantitySold' },
          totalRevenue: { $sum: '$totalAmount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    if (monthlySales.length === 0) {
      return res.status(404).json({ 
        message: 'No historical sales data found for this product' 
      });
    }

    // Calculate Simple Moving Average
    const quantities = monthlySales.map(m => m.totalQuantity);
    const avgDemand = quantities.reduce((sum, q) => sum + q, 0) / quantities.length;

    // Calculate trend (linear regression slope)
    let trend = 0;
    if (quantities.length >= 2) {
      const n = quantities.length;
      const xValues = Array.from({ length: n }, (_, i) => i + 1);
      const xMean = (n + 1) / 2;
      const yMean = avgDemand;
      
      const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (quantities[i] - yMean), 0);
      const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
      
      trend = denominator !== 0 ? numerator / denominator : 0;
    }

    // Generate forecast for next months
    const forecasts = [];
    for (let i = 1; i <= forecastMonths; i++) {
      const forecastDate = new Date();
      forecastDate.setMonth(forecastDate.getMonth() + i);
      
      // Simple forecast: average + trend * period
      const forecastedDemand = Math.max(0, Math.round(avgDemand + (trend * i)));
      
      forecasts.push({
        month: forecastDate.toISOString().substring(0, 7), // YYYY-MM format
        forecastedDemand,
        method: 'Simple Moving Average with Trend'
      });
    }

    // Get product details
    const product = await Product.findOne({ productId: productId.toUpperCase() });

    res.status(200).json({
      productId: productId.toUpperCase(),
      productName: product?.name,
      historicalAverage: Math.round(avgDemand),
      trend: trend.toFixed(2),
      trendDirection: trend > 0 ? 'Increasing' : trend < 0 ? 'Decreasing' : 'Stable',
      historicalData: monthlySales,
      forecasts
    });

  } catch (error) {
    console.error('Error generating demand forecast:', error);
    res.status(500).json({ message: 'Error generating forecast', error: error.message });
  }
};

// Get forecast for multiple products
export const getBulkDemandForecast = async (req, res) => {
  try {
    const { category, limit = 20, months = 3, forecastPeriod = 3 } = req.query;

    // Get products based on filter
    let productFilter = { isActive: true };
    if (category) {
      productFilter.category = category;
    }

    const products = await Product.find(productFilter)
      .limit(parseInt(limit))
      .select('productId name category');

    const lookbackMonths = parseInt(months);
    const forecastMonths = parseInt(forecastPeriod);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - lookbackMonths);

    const bulkForecasts = [];

    for (const product of products) {
      // Get monthly sales
      const monthlySales = await Sales.aggregate([
        {
          $match: {
            productId: product.productId,
            saleDate: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$saleDate' },
              month: { $month: '$saleDate' }
            },
            totalQuantity: { $sum: '$quantitySold' }
          }
        }
      ]);

      if (monthlySales.length > 0) {
        const quantities = monthlySales.map(m => m.totalQuantity);
        const avgDemand = quantities.reduce((sum, q) => sum + q, 0) / quantities.length;

        // Calculate trend
        let trend = 0;
        if (quantities.length >= 2) {
          const n = quantities.length;
          const xValues = Array.from({ length: n }, (_, i) => i + 1);
          const xMean = (n + 1) / 2;
          const yMean = avgDemand;
          
          const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (quantities[i] - yMean), 0);
          const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
          
          trend = denominator !== 0 ? numerator / denominator : 0;
        }

        // Next month forecast
        const nextMonthForecast = Math.max(0, Math.round(avgDemand + trend));

        bulkForecasts.push({
          productId: product.productId,
          productName: product.name,
          category: product.category,
          historicalAverage: Math.round(avgDemand),
          nextMonthForecast,
          trend: trend.toFixed(2),
          trendDirection: trend > 0 ? 'Increasing' : trend < 0 ? 'Decreasing' : 'Stable'
        });
      }
    }

    // Sort by forecast demand (highest first)
    bulkForecasts.sort((a, b) => b.nextMonthForecast - a.nextMonthForecast);

    res.status(200).json(bulkForecasts);

  } catch (error) {
    console.error('Error generating bulk forecast:', error);
    res.status(500).json({ message: 'Error generating bulk forecast', error: error.message });
  }
};

// Get seasonal patterns
export const getSeasonalPatterns = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Get sales data for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyData = await Sales.aggregate([
      {
        $match: {
          productId: productId.toUpperCase(),
          saleDate: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $month: '$saleDate' },
          totalQuantity: { $sum: '$quantitySold' },
          avgQuantity: { $avg: '$quantitySold' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const seasonalPattern = monthlyData.map(item => ({
      month: monthNames[item._id - 1],
      monthNumber: item._id,
      totalSales: item.totalQuantity,
      averagePerTransaction: Math.round(item.avgQuantity)
    }));

    // Identify peak and low months
    const sortedByTotal = [...monthlyData].sort((a, b) => b.totalQuantity - a.totalQuantity);
    const peakMonth = sortedByTotal[0];
    const lowMonth = sortedByTotal[sortedByTotal.length - 1];

    res.status(200).json({
      productId: productId.toUpperCase(),
      seasonalPattern,
      insights: {
        peakMonth: peakMonth ? monthNames[peakMonth._id - 1] : 'N/A',
        peakMonthSales: peakMonth?.totalQuantity || 0,
        lowMonth: lowMonth ? monthNames[lowMonth._id - 1] : 'N/A',
        lowMonthSales: lowMonth?.totalQuantity || 0
      }
    });

  } catch (error) {
    console.error('Error analyzing seasonal patterns:', error);
    res.status(500).json({ message: 'Error analyzing patterns', error: error.message });
  }
};
