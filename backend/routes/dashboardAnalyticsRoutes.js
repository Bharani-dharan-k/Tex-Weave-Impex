import express from 'express';
import { getDashboardAnalytics } from '../controllers/dashboardAnalyticsController.js';

const router = express.Router();

// GET /api/analytics/dashboard – Full dashboard data (KPIs + charts)
router.get('/', getDashboardAnalytics);

export default router;
