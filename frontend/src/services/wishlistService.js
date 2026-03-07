import axios from '../utils/axiosConfig';

export const wishlistService = {
  // Get wishlist
  getWishlist: async () => {
    const response = await axios.get('/api/wishlist');
    return response.data;
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    const response = await axios.post(`/api/wishlist/add/${productId}`);
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    const response = await axios.delete(`/api/wishlist/remove/${productId}`);
    return response.data;
  },

  // Clear wishlist
  clearWishlist: async () => {
    const response = await axios.delete('/api/wishlist/clear');
    return response.data;
  },

  // Check if product is in wishlist
  checkWishlist: async (productId) => {
    const response = await axios.get(`/api/wishlist/check/${productId}`);
    return response.data;
  },

  // Move to cart
  moveToCart: async (productId) => {
    const response = await axios.post(`/api/wishlist/move-to-cart/${productId}`);
    return response.data;
  }
};
