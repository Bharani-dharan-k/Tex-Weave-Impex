import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getCustomerSummary,
  getSpendingOverTime,
  getTopCategories,
  getTopProducts,
  getOrderStatusDistribution,
  getPurchasePattern,
  getBrowsingHistory,
  getRecommendations
} from '../controllers/customerAnalyticsController.js';

const router = express.Router();

// All routes require customer authentication
router.use(protect);
router.use(authorize('user', 'customer'));

router.get('/summary', getCustomerSummary);
router.get('/spending-over-time', getSpendingOverTime);
router.get('/top-categories', getTopCategories);
router.get('/top-products', getTopProducts);
router.get('/order-status', getOrderStatusDistribution);
router.get('/purchase-pattern', getPurchasePattern);
router.get('/browsing-history', getBrowsingHistory);
router.get('/recommendations', getRecommendations);

export default router;
