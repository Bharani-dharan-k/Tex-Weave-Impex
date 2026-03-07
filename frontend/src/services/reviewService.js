import axios from '../utils/axiosConfig';

export const reviewService = {
  // Submit a new review
  submitReview: async (reviewData) => {
    const response = await axios.post('/api/reviews', reviewData);
    return response.data;
  },

  // Get reviews for a product
  getProductReviews: async (productId, params = {}) => {
    const response = await axios.get(`/api/reviews/product/${productId}`, { params });
    return response.data;
  },

  // Get user's reviews
  getMyReviews: async () => {
    const response = await axios.get('/api/reviews/my-reviews');
    return response.data;
  },

  // Get products eligible for review
  getEligibleProducts: async () => {
    const response = await axios.get('/api/reviews/eligible-products');
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    const response = await axios.put(`/api/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await axios.delete(`/api/reviews/${reviewId}`);
    return response.data;
  },

  // Mark review as helpful
  markHelpful: async (reviewId, helpful) => {
    const response = await axios.put(`/api/reviews/${reviewId}/helpful`, { helpful });
    return response.data;
  }
};
