import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// Mock data generation utilities
const generateDateRange = (days) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(subDays(new Date(), i));
  }
  return dates;
};

// Sales Data - Daily sales for last 90 days
export const getSalesData = (days = 90) => {
  const dates = generateDateRange(days);
  return dates.map((date, index) => ({
    date: format(date, 'yyyy-MM-dd'),
    revenue: Math.floor(80000 + Math.random() * 120000 + index * 500),
    orders: Math.floor(20 + Math.random() * 40),
    customers: Math.floor(15 + Math.random() * 30),
    avgOrderValue: 0, // Calculated
  })).map(item => ({
    ...item,
    avgOrderValue: Math.floor(item.revenue / item.orders)
  }));
};

// Product Performance Data
export const getProductData = () => [
  { id: 1, name: 'Premium Cotton Fabric', category: 'Cotton Fabric', unitsSold: 2450, revenue: 980000, cost: 686000, price: 400, stockLevel: 1500 },
  { id: 2, name: 'Silk Blend Fabric', category: 'Silk Fabric', unitsSold: 890, revenue: 1246000, cost: 746400, price: 1400, stockLevel: 450 },
  { id: 3, name: 'Polyester Fabric Roll', category: 'Polyester Fabric', unitsSold: 3200, revenue: 800000, cost: 512000, price: 250, stockLevel: 2100 },
  { id: 4, name: 'Linen Fabric', category: 'Linen Fabric', unitsSold: 1100, revenue: 660000, cost: 429000, price: 600, stockLevel: 300 },
  { id: 5, name: 'Denim Fabric', category: 'Cotton Fabric', unitsSold: 1850, revenue: 925000, cost: 555000, price: 500, stockLevel: 800 },
  { id: 6, name: 'Wool Blend Fabric', category: 'Wool Fabric', unitsSold: 720, revenue: 936000, cost: 561600, price: 1300, stockLevel: 200 },
  { id: 7, name: 'Viscose Fabric', category: 'Synthetic Fabric', unitsSold: 2800, revenue: 840000, cost: 588000, price: 300, stockLevel: 1800 },
  { id: 8, name: 'Cotton Yarn (40s)', category: 'Yarn', unitsSold: 5400, revenue: 810000, cost: 486000, price: 150, stockLevel: 3200 },
  { id: 9, name: 'Embroidered Saree', category: 'Garments', unitsSold: 450, revenue: 1125000, cost: 562500, price: 2500, stockLevel: 150 },
  { id: 10, name: 'Cotton T-Shirt', category: 'Garments', unitsSold: 6200, revenue: 1240000, cost: 744000, price: 200, stockLevel: 4500 },
  { id: 11, name: 'Rayon Fabric', category: 'Rayon Fabric', unitsSold: 1950, revenue: 682500, cost: 448650, price: 350, stockLevel: 900 },
  { id: 12, name: 'Jersey Knit Fabric', category: 'Knit Fabric', unitsSold: 2350, revenue: 822500, cost: 518750, price: 350, stockLevel: 1200 },
].map(product => ({
  ...product,
  profit: product.revenue - product.cost,
  profitMargin: ((product.revenue - product.cost) / product.revenue * 100).toFixed(2)
}));

// Category Performance
export const getCategoryData = () => {
  const products = getProductData();
  const categories = {};
  
  products.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = { category: product.category, revenue: 0, units: 0 };
    }
    categories[product.category].revenue += product.revenue;
    categories[product.category].units += product.unitsSold;
  });
  
  return Object.values(categories).sort((a, b) => b.revenue - a.revenue);
};

// Regional Sales Data
export const getRegionalData = () => [
  { region: 'Domestic - North India', revenue: 4200000, orders: 380, percentage: 28 },
  { region: 'Domestic - South India', revenue: 3800000, orders: 340, percentage: 25 },
  { region: 'Domestic - West India', revenue: 2900000, orders: 280, percentage: 19 },
  { region: 'Domestic - East India', revenue: 1800000, orders: 180, percentage: 12 },
  { region: 'Export - Europe', revenue: 1200000, orders: 95, percentage: 8 },
  { region: 'Export - Middle East', revenue: 800000, orders: 70, percentage: 5 },
  { region: 'Export - USA', revenue: 500000, orders: 40, percentage: 3 },
];

// Top Customers
export const getTopCustomers = () => [
  { id: 1, name: 'Fashion Hub Pvt Ltd', location: 'Mumbai', orders: 145, revenue: 2850000, lastOrder: '2026-01-28' },
  { id: 2, name: 'Textile Traders Co', location: 'Delhi', orders: 132, revenue: 2640000, lastOrder: '2026-01-29' },
  { id: 3, name: 'Global Fabrics Inc', location: 'Bangalore', orders: 98, revenue: 2156000, lastOrder: '2026-01-27' },
  { id: 4, name: 'Royal Garments', location: 'Chennai', orders: 87, revenue: 1827000, lastOrder: '2026-01-26' },
  { id: 5, name: 'Premium Textiles', location: 'Ahmedabad', orders: 76, revenue: 1672000, lastOrder: '2026-01-25' },
  { id: 6, name: 'Silk Route Exports', location: 'Surat', orders: 65, revenue: 1495000, lastOrder: '2026-01-24' },
  { id: 7, name: 'Cotton King Industries', location: 'Coimbatore', orders: 58, revenue: 1276000, lastOrder: '2026-01-23' },
  { id: 8, name: 'Weave Masters', location: 'Ludhiana', orders: 52, revenue: 1144000, lastOrder: '2026-01-22' },
  { id: 9, name: 'Euro Fashion GmbH', location: 'Germany', orders: 34, revenue: 952000, lastOrder: '2026-01-20' },
  { id: 10, name: 'Desert Textiles LLC', location: 'Dubai', orders: 28, revenue: 784000, lastOrder: '2026-01-19' },
];

// Inventory/Stock Data
export const getInventoryData = () => {
  return getProductData().map(product => ({
    id: product.id,
    name: product.name,
    category: product.category,
    currentStock: product.stockLevel,
    reorderLevel: Math.floor(product.stockLevel * 0.3),
    maxCapacity: Math.floor(product.stockLevel * 1.8),
    stockStatus: product.stockLevel < Math.floor(product.stockLevel * 0.3) ? 'low' : 
                 product.stockLevel < Math.floor(product.stockLevel * 0.6) ? 'medium' : 'high',
    monthlyDepletion: Math.floor(product.unitsSold / 30),
    daysUntilStockout: Math.floor(product.stockLevel / (product.unitsSold / 30))
  }));
};

// KPI Summary (for dashboard cards)
export const getKPISummary = () => {
  const salesData = getSalesData(30);
  const previousMonthData = getSalesData(60).slice(0, 30);
  
  const currentRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const currentOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const currentCustomers = salesData.reduce((sum, item) => sum + item.customers, 0);
  
  const previousRevenue = previousMonthData.reduce((sum, item) => sum + item.revenue, 0);
  const previousOrders = previousMonthData.reduce((sum, item) => sum + item.orders, 0);
  const previousCustomers = previousMonthData.reduce((sum, item) => sum + item.customers, 0);
  
  const lowStockCount = getInventoryData().filter(item => item.stockStatus === 'low').length;
  
  return {
    totalRevenue: {
      value: currentRevenue,
      change: ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(2),
      currency: '₹'
    },
    totalOrders: {
      value: currentOrders,
      change: ((currentOrders - previousOrders) / previousOrders * 100).toFixed(2)
    },
    totalCustomers: {
      value: currentCustomers,
      change: ((currentCustomers - previousCustomers) / previousCustomers * 100).toFixed(2)
    },
    avgOrderValue: {
      value: Math.floor(currentRevenue / currentOrders),
      change: (((currentRevenue / currentOrders) - (previousRevenue / previousOrders)) / (previousRevenue / previousOrders) * 100).toFixed(2),
      currency: '₹'
    },
    lowStockProducts: {
      value: lowStockCount,
      change: 0
    }
  };
};

// Export utilities
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Currency formatter
export const formatCurrency = (value, currency = '₹') => {
  return `${currency}${value.toLocaleString('en-IN')}`;
};

// Number formatter
export const formatNumber = (value) => {
  return value.toLocaleString('en-IN');
};

// ============= MANUFACTURING & PROCESS ANALYTICS DATA =============

// Product Dimension Data - Linen Categories
export const getProductCategoryData = () => [
  { 
    category: 'Table Linen', 
    unitsProduced: 12500, 
    revenue: 3750000, 
    skuCount: 45,
    marketSegment: 'Home & Hospitality',
    avgPrice: 300,
    margin: 32
  },
  { 
    category: 'Kitchen Linen', 
    unitsProduced: 18200, 
    revenue: 3276000, 
    skuCount: 38,
    marketSegment: 'Home',
    avgPrice: 180,
    margin: 28
  },
  { 
    category: 'Bath Linen', 
    unitsProduced: 15800, 
    revenue: 4740000, 
    skuCount: 52,
    marketSegment: 'Home & Export',
    avgPrice: 300,
    margin: 35
  },
  { 
    category: 'Bed Linen', 
    unitsProduced: 22400, 
    revenue: 8960000, 
    skuCount: 68,
    marketSegment: 'Home & Hospitality',
    avgPrice: 400,
    margin: 38
  },
  { 
    category: 'Living Linen', 
    unitsProduced: 9600, 
    revenue: 3840000, 
    skuCount: 42,
    marketSegment: 'Home',
    avgPrice: 400,
    margin: 30
  }
];

// Process Flow Data - Manufacturing Pipeline
export const getProcessFlowData = () => [
  { 
    stage: 'Weaving', 
    inputUnits: 100000, 
    outputUnits: 98500, 
    loss: 1500,
    lossPercent: 1.5,
    defects: 450,
    avgTimeHours: 72,
    utilizationPercent: 87,
    bottleneck: false
  },
  { 
    stage: 'Dyeing', 
    inputUnits: 98500, 
    outputUnits: 95200, 
    loss: 3300,
    lossPercent: 3.35,
    defects: 1200,
    avgTimeHours: 48,
    utilizationPercent: 92,
    bottleneck: false
  },
  { 
    stage: 'Printing', 
    inputUnits: 95200, 
    outputUnits: 93800, 
    loss: 1400,
    lossPercent: 1.47,
    defects: 850,
    avgTimeHours: 36,
    utilizationPercent: 78,
    bottleneck: false
  },
  { 
    stage: 'Embroidery', 
    inputUnits: 93800, 
    outputUnits: 92500, 
    loss: 1300,
    lossPercent: 1.39,
    defects: 680,
    avgTimeHours: 96,
    utilizationPercent: 65,
    bottleneck: true
  },
  { 
    stage: 'Stitching', 
    inputUnits: 92500, 
    outputUnits: 90800, 
    loss: 1700,
    lossPercent: 1.84,
    defects: 980,
    avgTimeHours: 60,
    utilizationPercent: 82,
    bottleneck: false
  },
  { 
    stage: 'Checking', 
    inputUnits: 90800, 
    outputUnits: 88900, 
    loss: 1900,
    lossPercent: 2.09,
    defects: 1900,
    avgTimeHours: 24,
    utilizationPercent: 95,
    bottleneck: false
  },
  { 
    stage: 'Packing', 
    inputUnits: 88900, 
    outputUnits: 88600, 
    loss: 300,
    lossPercent: 0.34,
    defects: 120,
    avgTimeHours: 18,
    utilizationPercent: 88,
    bottleneck: false
  }
];

// Defect Analysis by Process Stage
export const getDefectAnalysis = () => [
  { stage: 'Weaving', colorMismatch: 120, stitchError: 0, printBlur: 0, dimensionError: 230, other: 100 },
  { stage: 'Dyeing', colorMismatch: 890, stitchError: 0, printBlur: 0, dimensionError: 150, other: 160 },
  { stage: 'Printing', colorMismatch: 320, stitchError: 0, printBlur: 420, dimensionError: 80, other: 30 },
  { stage: 'Embroidery', colorMismatch: 180, stitchError: 380, printBlur: 0, dimensionError: 90, other: 30 },
  { stage: 'Stitching', colorMismatch: 0, stitchError: 720, printBlur: 0, dimensionError: 180, other: 80 },
  { stage: 'Checking', colorMismatch: 450, stitchError: 620, printBlur: 380, dimensionError: 320, other: 130 },
  { stage: 'Packing', colorMismatch: 0, stitchError: 0, printBlur: 0, dimensionError: 80, other: 40 }
];

// Throughput Trend Data
export const getThroughputData = () => {
  const dates = generateDateRange(30);
  return dates.map((date) => ({
    date: format(date, 'yyyy-MM-dd'),
    ordersReceived: Math.floor(2800 + Math.random() * 600),
    ordersCompleted: Math.floor(2500 + Math.random() * 500),
    unitsProduced: Math.floor(85000 + Math.random() * 10000)
  }));
};

// Quality Metrics
export const getQualityMetrics = () => ({
  totalInspected: 88900,
  passed: 84200,
  failed: 4700,
  passRate: 94.71,
  failRate: 5.29,
  reworkable: 3200,
  scrapped: 1500
});

// Quality Trend Over Time
export const getQualityTrend = () => {
  const dates = generateDateRange(30);
  return dates.map((date) => ({
    date: format(date, 'yyyy-MM-dd'),
    passRate: 92 + Math.random() * 6,
    defectRate: 3 + Math.random() * 4,
    reworkRate: 2 + Math.random() * 3
  }));
};

// Packing & Dispatch Status
export const getPackingDispatchStatus = () => [
  { status: 'Ready to Ship', count: 1240, orders: 156, percentage: 35, color: '#10b981' },
  { status: 'Awaiting QC', count: 890, orders: 112, percentage: 25, color: '#f59e0b' },
  { status: 'Awaiting Packing', count: 680, orders: 85, percentage: 19, color: '#3b82f6' },
  { status: 'Dispatched', count: 750, orders: 94, percentage: 21, color: '#8b5cf6' }
];

// Dispatch Timeline Data
export const getDispatchTimeline = () => {
  const dates = generateDateRange(15);
  return dates.map((date) => ({
    date: format(date, 'yyyy-MM-dd'),
    scheduled: Math.floor(50 + Math.random() * 30),
    onTime: Math.floor(40 + Math.random() * 25),
    delayed: Math.floor(5 + Math.random() * 10)
  }));
};

// Process Time Breakdown
export const getProcessTimeBreakdown = () => {
  const processData = getProcessFlowData();
  const totalTime = processData.reduce((sum, stage) => sum + stage.avgTimeHours, 0);
  
  return processData.map(stage => ({
    stage: stage.stage,
    hours: stage.avgTimeHours,
    percentage: ((stage.avgTimeHours / totalTime) * 100).toFixed(1),
    isBottleneck: stage.bottleneck
  }));
};
