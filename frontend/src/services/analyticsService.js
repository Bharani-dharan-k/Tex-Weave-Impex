import axios, { API_BASE_URL } from '../utils/axiosConfig';

// Sales Analytics Services
export const getSalesOverview = async (startDate, endDate) => {
  const params = {};
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axios.get('/api/analytics/sales/overview', { params });
  return response.data;
};

export const getProductWiseSales = async (startDate, endDate, limit = 20) => {
  const params = { limit };
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axios.get('/api/analytics/sales/product-wise', { params });
  return response.data;
};

export const getSalesTrends = async (period = 'monthly', startDate, endDate) => {
  const params = { period };
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axios.get('/api/analytics/sales/trends', { params });
  return response.data;
};

export const getTopAndLeastProducts = async (startDate, endDate, limit = 10) => {
  const params = { limit };
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axios.get('/api/analytics/sales/top-least', { params });
  return response.data;
};

export const getSalesByCategory = async (startDate, endDate) => {
  const params = {};
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axios.get('/api/analytics/sales/by-category', { params });
  return response.data;
};

export const getSalesByRegion = async (startDate, endDate) => {
  const params = {};
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axios.get('/api/analytics/sales/by-region', { params });
  return response.data;
};

// Inventory Analytics Services
export const getInventoryOverview = async () => {
  const response = await axios.get('/api/analytics/inventory/overview');
  return response.data;
};

export const getCurrentStockLevels = async (filters = {}) => {
  const response = await axios.get('/api/analytics/inventory/stock-levels', { params: filters });
  return response.data;
};

export const getLowStockAlerts = async () => {
  const response = await axios.get('/api/analytics/inventory/low-stock-alerts');
  return response.data;
};

export const getInventoryValueByCategory = async () => {
  const response = await axios.get('/api/analytics/inventory/value-by-category');
  return response.data;
};

export const getInventoryTurnover = async (startDate, endDate) => {
  const params = {};
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axios.get('/api/analytics/inventory/turnover', { params });
  return response.data;
};

// Slow Stock Analysis Services
export const getSlowMovingStock = async (days = 90, type = 'all') => {
  const response = await axios.get('/api/analytics/slow-stock/slow-moving', {
    params: { days, type }
  });
  return response.data;
};

export const getDeadStockRecommendations = async (days = 90) => {
  const response = await axios.get('/api/analytics/slow-stock/recommendations', {
    params: { days }
  });
  return response.data;
};

export const getStockAgingAnalysis = async () => {
  const response = await axios.get('/api/analytics/slow-stock/aging-analysis');
  return response.data;
};

// Demand Forecasting Services
export const getDemandForecast = async (productId, months = 3, forecastPeriod = 3) => {
  const response = await axios.get('/api/analytics/forecast/product', {
    params: { productId, months, forecastPeriod }
  });
  return response.data;
};

export const getBulkDemandForecast = async (category, limit = 20, months = 3) => {
  const params = { limit, months };
  if (category) params.category = category;
  const response = await axios.get('/api/analytics/forecast/bulk', { params });
  return response.data;
};

export const getSeasonalPatterns = async (productId) => {
  const response = await axios.get('/api/analytics/forecast/seasonal', {
    params: { productId }
  });
  return response.data;
};

// Profitability Analysis Services
export const getProfitabilityOverview = async (startDate, endDate) => {
  const params = {};
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axios.get('/api/analytics/profitability/overview', { params });
  return response.data;
};

export const getProductProfitability = async (startDate, endDate, sortBy = 'profit', limit = 50) => {
  const params = { sortBy, limit };
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axios.get('/api/analytics/profitability/product-wise', { params });
  return response.data;
};

export const getHighProfitProducts = async (minMargin = 30, limit = 20) => {
  const response = await axios.get('/api/analytics/profitability/high-profit', {
    params: { minMargin, limit }
  });
  return response.data;
};

export const getLowProfitProducts = async (maxMargin = 15, limit = 20) => {
  const response = await axios.get('/api/analytics/profitability/low-profit', {
    params: { maxMargin, limit }
  });
  return response.data;
};

export const getProfitabilityByCategory = async (startDate, endDate) => {
  const params = {};
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axios.get('/api/analytics/profitability/by-category', { params });
  return response.data;
};

export const getProfitTrend = async (period = 'monthly', startDate, endDate) => {
  const params = { period };
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axios.get('/api/analytics/profitability/trend', { params });
  return response.data;
};

// File Upload Services
export const uploadProductsFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post('/api/upload/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
  });
  return response.data;
};

export const uploadSalesFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post('/api/upload/sales', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
  });
  return response.data;
};

export const uploadInventoryFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post('/api/upload/inventory', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
  });
  return response.data;
};

// Report Download Services
export const downloadSalesReport = (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate && endDate) {
    params.append('startDate', startDate);
    params.append('endDate', endDate);
  }
  window.open(`${API_BASE_URL}/api/reports/sales?${params.toString()}`, '_blank');
};

export const downloadInventoryReport = (status) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  window.open(`${API_BASE_URL}/api/reports/inventory?${params.toString()}`, '_blank');
};

export const downloadSlowStockReport = (days = 90) => {
  window.open(`${API_BASE_URL}/api/reports/slow-stock?days=${days}`, '_blank');
};

export const downloadProfitabilityReport = (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate && endDate) {
    params.append('startDate', startDate);
    params.append('endDate', endDate);
  }
  window.open(`${API_BASE_URL}/api/reports/profitability?${params.toString()}`, '_blank');
};

export const downloadComprehensiveReport = (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate && endDate) {
    params.append('startDate', startDate);
    params.append('endDate', endDate);
  }
  window.open(`${API_BASE_URL}/api/reports/comprehensive?${params.toString()}`, '_blank');
};
