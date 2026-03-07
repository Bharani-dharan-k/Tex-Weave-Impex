import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  trackProductView,
  getProductViewAnalytics
} from '../controllers/productViewController.js';

const router = express.Router();

// Public route - anyone can track views
router.post('/track', trackProductView);

// Admin analytics
router.get('/analytics', protect, authorize('admin'), getProductViewAnalytics);

export default router;
