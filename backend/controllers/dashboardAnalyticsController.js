import Sales from '../models/Sales.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// ─── Helper ──────────────────────────────────────────────────────────────────

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DAY_MS = 24 * 60 * 60 * 1000;

const clampToDayStart = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const clampToDayEnd = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const parseDateRange = (query = {}) => {
  const today = new Date();
  const endDateDefault = clampToDayEnd(today);
  const startDateDefault = clampToDayStart(new Date(today.getTime() - (89 * DAY_MS)));

  const rawStart = query.startDate ? new Date(query.startDate) : startDateDefault;
  const rawEnd = query.endDate ? new Date(query.endDate) : endDateDefault;

  const validStart = Number.isNaN(rawStart.getTime()) ? startDateDefault : rawStart;
  const validEnd = Number.isNaN(rawEnd.getTime()) ? endDateDefault : rawEnd;

  let startDate = clampToDayStart(validStart);
  let endDate = clampToDayEnd(validEnd);

  if (startDate > endDate) {
    const temp = startDate;
    startDate = clampToDayStart(endDate);
    endDate = clampToDayEnd(temp);
  }

  const maxWindowMs = 730 * DAY_MS;
  if ((endDate - startDate) > maxWindowMs) {
    startDate = clampToDayStart(new Date(endDate.getTime() - maxWindowMs));
  }

  return { startDate, endDate };
};

const parseGranularity = (query = {}) => {
  const allowed = new Set(['day', 'week', 'month', 'year']);
  const granularity = String(query.granularity || 'month').toLowerCase();
  return allowed.has(granularity) ? granularity : 'month';
};

const buildSalesMatch = (dateRange) => ({
  saleDate: {
    $gte: dateRange.startDate,
    $lte: dateRange.endDate
  }
});

const buildOrderMatch = (dateRange) => ({
  createdAt: {
    $gte: dateRange.startDate,
    $lte: dateRange.endDate
  }
});

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

const syncCompletedOrdersToSales = async (dateRange) => {
  const completedOrders = await Order.find({
    paymentStatus: 'completed',
    createdAt: {
      $gte: dateRange.startDate,
      $lte: dateRange.endDate
    }
  }).lean();

  if (!completedOrders.length) {
    return;
  }

  await Promise.all(completedOrders.flatMap(order => {
    if (!Array.isArray(order.items) || order.items.length === 0) {
      return [];
    }

    const customerName = order.customerInfo?.name || order.customerInfo?.companyName || 'Customer';
    const region = resolveRegionFromAddress(order.shippingAddress);
    const saleDate = order.createdAt || new Date();

    return order.items.map((item, index) => {
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
    });
  }));
};

// ─── GET /api/analytics/dashboard ────────────────────────────────────────────

/**
 * Returns all dashboard analytics in a single response so the frontend
 * can render every KPI card and chart with one API call.
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    const dateRange = parseDateRange(req.query);
    const granularity = parseGranularity(req.query);
    const selectedCategory = (req.query.drillCategory || '').trim();
    const selectedProductId = (req.query.drillProductId || '').trim().toUpperCase();
    const salesMatch = buildSalesMatch(dateRange);
    const orderMatch = buildOrderMatch(dateRange);

    // Ensure paid orders are represented in Sales analytics data.
    await syncCompletedOrdersToSales(dateRange);

    // Parallel execution for independent aggregations
    const [
      kpiData,
      salesTrend,
      dailyOrderActivity,
      salesByCategory,
      revenueByCategory,
      topSellingProducts,
      leastSellingProducts,
      customerGrowth,
      topCustomers,
      orderStatusDistribution,
      cancellationData,
      inventoryStockLevels,
      lowStockProducts,
      fastMovingProducts,
      slowMovingProducts,
      priceRangePerformance,
      customerPurchasePattern,
      revenueByWeekday,
      cumulativeRevenueTrend,
      categoryProductBreakdown,
      productDrillTrend,
      productDrillSummary
    ] = await Promise.all([
      // 1–3, 12: KPI Cards (Total Orders, Revenue, Customers, Avg Order Value)
      getKPIs(salesMatch),
      // 3: Monthly Sales Trend
      getSalesTrend(salesMatch, granularity),
      // 4: Daily Order Activity (last 30 days)
      getDailyOrderActivity(salesMatch),
      // 5: Sales by Product Category
      getSalesByCategory(salesMatch),
      // 6: Revenue by Product Category
      getRevenueByCategory(salesMatch),
      // 7: Top Selling Products
      getTopSellingProducts(salesMatch),
      // 8: Least Selling Products
      getLeastSellingProducts(salesMatch),
      // 9: Customer Growth Analysis
      getCustomerGrowth(salesMatch),
      // 10: Top Customers
      getTopCustomers(salesMatch),
      // 11: Order Status Distribution
      getOrderStatusDistribution(orderMatch),
      // 13: Order Cancellation Rate
      getCancellationRate(orderMatch),
      // 14: Inventory Stock Levels
      getInventoryStockLevels(),
      // 15: Low Stock Detection
      getLowStockProducts(),
      // 16: Fast Moving Products
      getFastMovingProducts(salesMatch),
      // 17: Slow Moving Products
      getSlowMovingProducts(salesMatch),
      // 18: Price Range Performance
      getPriceRangePerformance(salesMatch),
      // 20: Customer Purchase Pattern (new vs returning)
      getCustomerPurchasePattern(salesMatch),
      // 21: Weekday Revenue Pattern
      getRevenueByWeekday(salesMatch),
      // 22: Cumulative Revenue Trend
      getCumulativeRevenueTrend(salesMatch),
      // Drill-down: category -> products
      selectedCategory ? getCategoryProductBreakdown(salesMatch, selectedCategory) : Promise.resolve([]),
      // Drill-down: product -> daily trend
      selectedProductId ? getProductDrillTrend(salesMatch, selectedProductId) : Promise.resolve([]),
      // Drill-down: product summary
      selectedProductId ? getProductDrillSummary(salesMatch, selectedProductId) : Promise.resolve(null)
    ]);

    // 19: Revenue Growth Rate (depends on sales trend)
    const revenueGrowthRate = calculateRevenueGrowthRate(salesTrend);

    res.status(200).json({
      dateRange: {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        granularity
      },
      kpiCards: kpiData,
      monthlySalesTrend: salesTrend,
      dailyOrderActivity,
      salesByCategory,
      revenueByCategory,
      topSellingProducts,
      leastSellingProducts,
      customerGrowth,
      topCustomers,
      orderStatusDistribution,
      cancellationData,
      inventoryStockLevels,
      lowStockProducts,
      fastMovingProducts,
      slowMovingProducts,
      priceRangePerformance,
      revenueGrowthRate,
      customerPurchasePattern,
      revenueByWeekday,
      cumulativeRevenueTrend,
      categoryProductBreakdown,
      productDrillTrend,
      productDrillSummary
    });

  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      message: 'Error fetching dashboard analytics',
      error: error.message
    });
  }
};

// ─── Individual Aggregation Functions ────────────────────────────────────────

/** 1, 2, 12: KPI Cards */
async function getKPIs(salesMatch) {
  const [salesStats, totalCustomers] = await Promise.all([
    Sales.aggregate([
      { $match: salesMatch },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]),
    Sales.distinct('customerName', salesMatch).then(names => names.filter(n => n && n.trim()).length)
  ]);

  const stats = salesStats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };

  return {
    totalOrders: stats.totalOrders,
    totalRevenue: Math.round(stats.totalRevenue * 100) / 100,
    totalCustomers,
    averageOrderValue: Math.round(stats.averageOrderValue * 100) / 100
  };
}

const getLabelProjection = (granularity) => {
  if (granularity === 'year') {
    return { $toString: '$_id.year' };
  }

  if (granularity === 'day') {
    return {
      $concat: [
        { $toString: '$_id.year' },
        '-',
        { $toString: { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] } },
        '-',
        { $toString: { $cond: [{ $lt: ['$_id.day', 10] }, { $concat: ['0', { $toString: '$_id.day' }] }, { $toString: '$_id.day' }] } }
      ]
    };
  }

  if (granularity === 'week') {
    return {
      $concat: [
        'W',
        { $toString: '$_id.week' },
        ' ',
        { $toString: '$_id.year' }
      ]
    };
  }

  return {
    $concat: [
      { $arrayElemAt: [monthNames, { $subtract: ['$_id.month', 1] }] },
      ' ',
      { $toString: '$_id.year' }
    ]
  };
};

const getSalesTrendGroupId = (granularity) => {
  if (granularity === 'year') {
    return { year: { $year: '$saleDate' } };
  }

  if (granularity === 'day') {
    return {
      year: { $year: '$saleDate' },
      month: { $month: '$saleDate' },
      day: { $dayOfMonth: '$saleDate' }
    };
  }

  if (granularity === 'week') {
    return {
      year: { $isoWeekYear: '$saleDate' },
      week: { $isoWeek: '$saleDate' }
    };
  }

  return {
    year: { $year: '$saleDate' },
    month: { $month: '$saleDate' }
  };
};

const getSalesTrendSort = (granularity) => {
  if (granularity === 'year') {
    return { '_id.year': 1 };
  }

  if (granularity === 'day') {
    return { '_id.year': 1, '_id.month': 1, '_id.day': 1 };
  }

  if (granularity === 'week') {
    return { '_id.year': 1, '_id.week': 1 };
  }

  return { '_id.year': 1, '_id.month': 1 };
};

/** 3: Sales Trend – dynamic granularity */
async function getSalesTrend(salesMatch, granularity = 'month') {
  const groupId = getSalesTrendGroupId(granularity);
  const sortConfig = getSalesTrendSort(granularity);
  const labelProjection = getLabelProjection(granularity);

  const trends = await Sales.aggregate([
    { $match: salesMatch },
    {
      $group: {
        _id: groupId,
        totalSales: { $sum: '$quantitySold' },
        totalRevenue: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: sortConfig },
    {
      $project: {
        _id: 1,
        label: labelProjection,
        totalSales: 1,
        totalRevenue: { $round: ['$totalRevenue', 2] },
        orderCount: 1
      }
    }
  ]);

  return trends.map(t => ({
    label: t.label,
    year: t._id.year,
    month: t._id.month,
    week: t._id.week,
    day: t._id.day,
    totalSales: t.totalSales,
    totalRevenue: t.totalRevenue,
    orderCount: t.orderCount
  }));
}

/** 4: Daily Order Activity – Area Chart */
async function getDailyOrderActivity(salesMatch) {
  const daily = await Sales.aggregate([
    { $match: salesMatch },
    {
      $group: {
        _id: {
          year: { $year: '$saleDate' },
          month: { $month: '$saleDate' },
          day: { $dayOfMonth: '$saleDate' }
        },
        orderCount: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  return daily.map(d => ({
    date: `${d._id.year}-${String(d._id.month).padStart(2, '0')}-${String(d._id.day).padStart(2, '0')}`,
    orderCount: d.orderCount,
    totalRevenue: Math.round(d.totalRevenue * 100) / 100
  }));
}

/** 5: Sales by Product Category – Bar Chart */
async function getSalesByCategory(salesMatch) {
  return Sales.aggregate([
    { $match: salesMatch },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: 'productId',
        as: 'product'
      }
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ['$product.category', 'Unknown'] },
        totalQuantity: { $sum: '$quantitySold' },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $project: { _id: 0, category: '$_id', totalQuantity: 1, orderCount: 1 } }
  ]);
}

/** 6: Revenue by Product Category – Doughnut Chart */
async function getRevenueByCategory(salesMatch) {
  return Sales.aggregate([
    { $match: salesMatch },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: 'productId',
        as: 'product'
      }
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ['$product.category', 'Unknown'] },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { totalRevenue: -1 } },
    {
      $project: {
        _id: 0,
        category: '$_id',
        totalRevenue: { $round: ['$totalRevenue', 2] }
      }
    }
  ]);
}

/** 7: Top 10 Selling Products – Horizontal Bar Chart */
async function getTopSellingProducts(salesMatch) {
  return Sales.aggregate([
    { $match: salesMatch },
    {
      $group: {
        _id: '$productId',
        productName: { $first: '$productName' },
        totalQuantity: { $sum: '$quantitySold' },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        productId: '$_id',
        productName: 1,
        totalQuantity: 1,
        totalRevenue: { $round: ['$totalRevenue', 2] }
      }
    }
  ]);
}

/** 8: Least 10 Selling Products – Bar Chart */
async function getLeastSellingProducts(salesMatch) {
  return Sales.aggregate([
    { $match: salesMatch },
    {
      $group: {
        _id: '$productId',
        productName: { $first: '$productName' },
        totalQuantity: { $sum: '$quantitySold' },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { totalQuantity: 1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        productId: '$_id',
        productName: 1,
        totalQuantity: 1,
        totalRevenue: { $round: ['$totalRevenue', 2] }
      }
    }
  ]);
}

/** 9: Customer Growth Analysis – Line Chart */
async function getCustomerGrowth(salesMatch) {
  const growth = await Sales.aggregate([
    { $match: { ...salesMatch, customerName: { $exists: true, $ne: '' } } },
    { $sort: { saleDate: 1 } },
    {
      $group: {
        _id: '$customerName',
        firstPurchase: { $first: '$saleDate' }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$firstPurchase' },
          month: { $month: '$firstPurchase' }
        },
        newCustomers: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return growth.map(g => ({
    label: `${monthNames[g._id.month - 1]} ${g._id.year}`,
    newCustomers: g.newCustomers
  }));
}

/** 10: Top 10 Customers – Bar Chart */
async function getTopCustomers(salesMatch) {
  return Sales.aggregate([
    { $match: { ...salesMatch, customerName: { $exists: true, $ne: '' } } },
    {
      $group: {
        _id: '$customerName',
        totalRevenue: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        customerName: '$_id',
        totalRevenue: { $round: ['$totalRevenue', 2] },
        orderCount: 1
      }
    }
  ]);
}

/** 11: Order Status Distribution – Pie Chart */
async function getOrderStatusDistribution(orderMatch) {
  return Order.aggregate([
    { $match: orderMatch },
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $project: { _id: 0, status: '$_id', count: 1 } }
  ]);
}

/** 13: Order Cancellation Rate – Gauge Chart */
async function getCancellationRate(orderMatch) {
  const [totalOrders, cancelledOrders] = await Promise.all([
    Order.countDocuments(orderMatch),
    Order.countDocuments({ ...orderMatch, orderStatus: 'cancelled' })
  ]);

  const rate = totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100) : 0;

  return {
    totalOrders,
    cancelledOrders,
    cancellationRate: Math.round(rate * 100) / 100
  };
}

/** 14: Inventory Stock Levels – Horizontal Bar Chart */
async function getInventoryStockLevels() {
  return Inventory.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: 'productId',
        as: 'product'
      }
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        productId: 1,
        productName: { $ifNull: ['$product.name', '$productName'] },
        quantityInStock: 1,
        reorderLevel: 1,
        maxStockLevel: 1,
        warehouseLocation: 1,
        stockStatus: {
          $cond: [
            { $eq: ['$quantityInStock', 0] },
            'Out of Stock',
            {
              $cond: [
                { $lte: ['$quantityInStock', '$reorderLevel'] },
                'Low Stock',
                'Normal'
              ]
            }
          ]
        }
      }
    },
    { $sort: { quantityInStock: 1 } }
  ]);
}

/** 15: Low Stock Detection – Table with alert */
async function getLowStockProducts() {
  return Inventory.aggregate([
    {
      $match: {
        $expr: { $lte: ['$quantityInStock', '$reorderLevel'] }
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
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        productId: 1,
        productName: { $ifNull: ['$product.name', '$productName'] },
        category: '$product.category',
        quantityInStock: 1,
        reorderLevel: 1,
        deficit: { $subtract: ['$reorderLevel', '$quantityInStock'] },
        alert: {
          $cond: [
            { $eq: ['$quantityInStock', 0] },
            'CRITICAL',
            'WARNING'
          ]
        }
      }
    },
    { $sort: { quantityInStock: 1 } }
  ]);
}

/** 16 & 17: Shared velocity aggregation used by both Fast and Slow moving */
async function getProductVelocity(salesMatch) {
  const results = await Sales.aggregate([
    { $match: salesMatch },
    {
      $group: {
        _id: '$productId',
        productName: { $first: '$productName' },
        totalQuantity: { $sum: '$quantitySold' },
        transactionCount: { $sum: 1 }
      }
    },
    { $sort: { totalQuantity: -1 } },
    {
      $project: {
        _id: 0,
        productId: '$_id',
        productName: 1,
        totalQuantity: 1,
        transactionCount: 1
      }
    }
  ]);

  return results;
}

/** 16: Fast Moving Products – top half by sales velocity */
async function getFastMovingProducts(salesMatch) {
  const all = await getProductVelocity(salesMatch);
  if (all.length < 2) return all; // not enough distinct products to split
  const mid = Math.ceil(all.length / 2);
  return all.slice(0, mid).slice(0, 10); // top half, max 10
}

/** 17: Slow Moving Products – bottom half by sales velocity */
async function getSlowMovingProducts(salesMatch) {
  const all = await getProductVelocity(salesMatch);
  if (all.length < 2) return []; // single product – avoid showing it as both fast & slow
  const mid = Math.ceil(all.length / 2);
  return all.slice(mid).slice(0, 10); // bottom half, max 10
}

/** 18: Price Range Performance – Histogram */
async function getPriceRangePerformance(salesMatch) {
  return Sales.aggregate([
    { $match: salesMatch },
    {
      $bucket: {
        groupBy: '$unitPrice',
        boundaries: [0, 100, 250, 500, 1000, 2500, 5000, 10000, Infinity],
        default: 'Other',
        output: {
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalQuantity: { $sum: '$quantitySold' }
        }
      }
    },
    {
      $project: {
        _id: 0,
        priceRange: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 0] }, then: '₹0–100' },
              { case: { $eq: ['$_id', 100] }, then: '₹100–250' },
              { case: { $eq: ['$_id', 250] }, then: '₹250–500' },
              { case: { $eq: ['$_id', 500] }, then: '₹500–1K' },
              { case: { $eq: ['$_id', 1000] }, then: '₹1K–2.5K' },
              { case: { $eq: ['$_id', 2500] }, then: '₹2.5K–5K' },
              { case: { $eq: ['$_id', 5000] }, then: '₹5K–10K' },
              { case: { $eq: ['$_id', 10000] }, then: '₹10K+' }
            ],
            default: 'Other'
          }
        },
        count: 1,
        totalRevenue: { $round: ['$totalRevenue', 2] },
        totalQuantity: 1
      }
    }
  ]);
}

/** 19: Revenue Growth Rate – derived from monthly trend */
function calculateRevenueGrowthRate(monthlyTrend) {
  if (monthlyTrend.length < 2) return [];

  return monthlyTrend.slice(1).map((current, i) => {
    const previous = monthlyTrend[i];
    const growthRate = previous.totalRevenue > 0
      ? ((current.totalRevenue - previous.totalRevenue) / previous.totalRevenue) * 100
      : 0;

    return {
      label: current.label,
      currentRevenue: current.totalRevenue,
      previousRevenue: previous.totalRevenue,
      growthRate: Math.round(growthRate * 100) / 100
    };
  });
}

/** 20: Customer Purchase Pattern – new vs returning – Pie Chart */
async function getCustomerPurchasePattern(salesMatch) {
  // Find each customer's FIRST purchase date
  const customerFirstPurchase = await Sales.aggregate([
    { $match: { ...salesMatch, customerName: { $exists: true, $ne: '' } } },
    { $sort: { saleDate: 1 } },
    {
      $group: {
        _id: '$customerName',
        firstPurchaseDate: { $first: '$saleDate' },
        totalPurchases: { $sum: 1 }
      }
    }
  ]);

  let newCustomers = 0;
  let returningCustomers = 0;

  customerFirstPurchase.forEach(c => {
    if (c.totalPurchases === 1) {
      newCustomers++;
    } else {
      returningCustomers++;
    }
  });

  return {
    newCustomers,
    returningCustomers,
    total: newCustomers + returningCustomers
  };
}

/** 21: Revenue by Weekday */
async function getRevenueByWeekday(salesMatch) {
  const weekdayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const rows = await Sales.aggregate([
    { $match: salesMatch },
    {
      $group: {
        _id: { $dayOfWeek: '$saleDate' },
        orderCount: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const byDay = new Map(rows.map(r => [r._id, r]));

  return weekdayMap.map((day, idx) => {
    const mongoIndex = idx + 1;
    const row = byDay.get(mongoIndex) || { orderCount: 0, totalRevenue: 0 };
    return {
      day,
      orderCount: row.orderCount,
      totalRevenue: Math.round(row.totalRevenue * 100) / 100
    };
  });
}

/** 22: Cumulative Revenue Trend */
async function getCumulativeRevenueTrend(salesMatch) {
  const rows = await Sales.aggregate([
    { $match: salesMatch },
    {
      $group: {
        _id: {
          year: { $year: '$saleDate' },
          month: { $month: '$saleDate' },
          day: { $dayOfMonth: '$saleDate' }
        },
        dailyRevenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  let cumulative = 0;
  return rows.map(r => {
    const daily = Math.round(r.dailyRevenue * 100) / 100;
    cumulative = Math.round((cumulative + daily) * 100) / 100;
    const label = `${r._id.year}-${String(r._id.month).padStart(2, '0')}-${String(r._id.day).padStart(2, '0')}`;
    return {
      label,
      dailyRevenue: daily,
      cumulativeRevenue: cumulative
    };
  });
}

/** Drill: Category -> Products */
async function getCategoryProductBreakdown(salesMatch, category) {
  return Sales.aggregate([
    { $match: salesMatch },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: 'productId',
        as: 'product'
      }
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    { $match: { 'product.category': category } },
    {
      $group: {
        _id: '$productId',
        productName: { $first: '$productName' },
        totalQuantity: { $sum: '$quantitySold' },
        totalRevenue: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { totalQuantity: -1 } },
    {
      $project: {
        _id: 0,
        category: { $literal: category },
        productId: '$_id',
        productName: 1,
        totalQuantity: 1,
        orderCount: 1,
        totalRevenue: { $round: ['$totalRevenue', 2] }
      }
    }
  ]);
}

/** Drill: Product -> Daily trend */
async function getProductDrillTrend(salesMatch, productId) {
  const rows = await Sales.aggregate([
    { $match: { ...salesMatch, productId } },
    {
      $group: {
        _id: {
          year: { $year: '$saleDate' },
          month: { $month: '$saleDate' },
          day: { $dayOfMonth: '$saleDate' }
        },
        totalQuantity: { $sum: '$quantitySold' },
        totalRevenue: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  return rows.map(r => ({
    label: `${r._id.year}-${String(r._id.month).padStart(2, '0')}-${String(r._id.day).padStart(2, '0')}`,
    totalQuantity: r.totalQuantity,
    orderCount: r.orderCount,
    totalRevenue: Math.round(r.totalRevenue * 100) / 100
  }));
}

/** Drill: Product summary */
async function getProductDrillSummary(salesMatch, productId) {
  const rows = await Sales.aggregate([
    { $match: { ...salesMatch, productId } },
    {
      $group: {
        _id: '$productId',
        productName: { $first: '$productName' },
        totalQuantity: { $sum: '$quantitySold' },
        totalRevenue: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 },
        avgUnitPrice: { $avg: '$unitPrice' }
      }
    },
    {
      $project: {
        _id: 0,
        productId: '$_id',
        productName: 1,
        totalQuantity: 1,
        orderCount: 1,
        totalRevenue: { $round: ['$totalRevenue', 2] },
        avgUnitPrice: { $round: ['$avgUnitPrice', 2] }
      }
    }
  ]);

  return rows[0] || null;
}
