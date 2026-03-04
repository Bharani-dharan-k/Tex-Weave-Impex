import express from 'express';
import {
  getDemandForecast,
  getBulkDemandForecast,
  getSeasonalPatterns
} from '../controllers/forecastController.js';

const router = express.Router();

// Demand forecasting routes
router.get('/product', getDemandForecast);
router.get('/bulk', getBulkDemandForecast);
router.get('/seasonal', getSeasonalPatterns);

export default router;
