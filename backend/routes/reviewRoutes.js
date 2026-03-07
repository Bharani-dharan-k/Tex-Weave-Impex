import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  submitReview,
  getProductReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getEligibleProducts
} from '../controllers/reviewController.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes (Customer)
router.post('/', protect, authorize('user', 'customer'), submitReview);
router.get('/my-reviews', protect, authorize('user', 'customer'), getMyReviews);
router.get('/eligible-products', protect, authorize('user', 'customer'), getEligibleProducts);
router.put('/:id', protect, authorize('user', 'customer'), updateReview);
router.delete('/:id', protect, authorize('user', 'customer'), deleteReview);
router.put('/:id/helpful', protect, markReviewHelpful);

export default router;
