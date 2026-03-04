import express from 'express';
import {
  getSlowMovingStock,
  getDeadStockRecommendations,
  getStockAgingAnalysis
} from '../controllers/slowStockController.js';

const router = express.Router();

// Slow stock analysis routes
router.get('/slow-moving', getSlowMovingStock);
router.get('/recommendations', getDeadStockRecommendations);
router.get('/aging-analysis', getStockAgingAnalysis);

export default router;
