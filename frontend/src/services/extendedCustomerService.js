import axios from '../utils/axiosConfig';

export const addressService = {
  // Get saved addresses
  getSavedAddresses: async () => {
    const response = await axios.get('/api/customer/addresses');
    return response.data;
  },

  // Add new address
  addAddress: async (addressData) => {
    const response = await axios.post('/api/customer/addresses', addressData);
    return response.data;
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    const response = await axios.put(`/api/customer/addresses/${addressId}`, addressData);
    return response.data;
  },

  // Delete address
  deleteAddress: async (addressId) => {
    const response = await axios.delete(`/api/customer/addresses/${addressId}`);
    return response.data;
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    const response = await axios.put(`/api/customer/addresses/${addressId}/set-default`);
    return response.data;
  }
};

export const orderService = {
  // Reorder a previous order
  reorderOrder: async (orderId) => {
    const response = await axios.post(`/api/orders/${orderId}/reorder`);
    return response.data;
  },

  // Get order invoice
  getOrderInvoice: async (orderId) => {
    const response = await axios.get(`/api/orders/${orderId}/invoice`);
    return response.data;
  },

  // Compare products
  compareProducts: async (productIds) => {
    const response = await axios.post('/api/orders/compare-products', { productIds });
    return response.data;
  }
};

export const productViewService = {
  // Track product view
  trackView: async (viewData) => {
    const response = await axios.post('/api/product-views/track', viewData);
    return response.data;
  }
};
