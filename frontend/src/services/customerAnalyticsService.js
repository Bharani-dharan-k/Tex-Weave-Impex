import axios from '../utils/axiosConfig';

export const customerAnalyticsService = {
  // Get customer summary
  getSummary: async () => {
    const response = await axios.get('/api/customer/analytics/summary');
    return response.data;
  },

  // Get spending over time
  getSpendingOverTime: async (period = 'monthly') => {
    const response = await axios.get('/api/customer/analytics/spending-over-time', {
      params: { period }
    });
    return response.data;
  },

  // Get top categories
  getTopCategories: async () => {
    const response = await axios.get('/api/customer/analytics/top-categories');
    return response.data;
  },

  // Get top products
  getTopProducts: async (limit = 10) => {
    const response = await axios.get('/api/customer/analytics/top-products', {
      params: { limit }
    });
    return response.data;
  },

  // Get order status distribution
  getOrderStatusDistribution: async () => {
    const response = await axios.get('/api/customer/analytics/order-status');
    return response.data;
  },

  // Get purchase pattern
  getPurchasePattern: async () => {
    const response = await axios.get('/api/customer/analytics/purchase-pattern');
    return response.data;
  },

  // Get browsing history
  getBrowsingHistory: async (limit = 20) => {
    const response = await axios.get('/api/customer/analytics/browsing-history', {
      params: { limit }
    });
    return response.data;
  },

  // Get recommendations
  getRecommendations: async () => {
    const response = await axios.get('/api/customer/analytics/recommendations');
    return response.data;
  }
};
