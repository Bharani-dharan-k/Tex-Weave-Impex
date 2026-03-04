import express from 'express';
import {
  getInventoryOverview,
  getCurrentStockLevels,
  getLowStockAlerts,
  getInventoryValueByCategory,
  getInventoryTurnover,
  getStockMovementHistory
} from '../controllers/inventoryAnalyticsController.js';

const router = express.Router();

// Inventory analytics routes
router.get('/overview', getInventoryOverview);
router.get('/stock-levels', getCurrentStockLevels);
router.get('/low-stock-alerts', getLowStockAlerts);
router.get('/value-by-category', getInventoryValueByCategory);
router.get('/turnover', getInventoryTurnover);
router.get('/movement-history', getStockMovementHistory);

export default router;
