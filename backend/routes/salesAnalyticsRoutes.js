import express from 'express';
import {
  getSalesOverview,
  getProductWiseSales,
  getSalesTrends,
  getTopAndLeastProducts,
  getSalesByCategory,
  getSalesByRegion
} from '../controllers/salesAnalyticsController.js';

const router = express.Router();

// Sales analytics routes
router.get('/overview', getSalesOverview);
router.get('/product-wise', getProductWiseSales);
router.get('/trends', getSalesTrends);
router.get('/top-least', getTopAndLeastProducts);
router.get('/by-category', getSalesByCategory);
router.get('/by-region', getSalesByRegion);

export default router;
