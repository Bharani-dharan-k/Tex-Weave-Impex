import express from 'express';
import {
  getProfitabilityOverview,
  getProductProfitability,
  getHighProfitProducts,
  getLowProfitProducts,
  getProfitabilityByCategory,
  getProfitTrend
} from '../controllers/profitabilityController.js';

const router = express.Router();

// Profitability analysis routes
router.get('/overview', getProfitabilityOverview);
router.get('/product-wise', getProductProfitability);
router.get('/high-profit', getHighProfitProducts);
router.get('/low-profit', getLowProfitProducts);
router.get('/by-category', getProfitabilityByCategory);
router.get('/trend', getProfitTrend);

export default router;
