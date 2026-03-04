import express from 'express';
import {
  generateSalesReport,
  generateInventoryReport,
  generateSlowStockReport,
  generateProfitabilityReport,
  generateComprehensiveReport
} from '../controllers/reportController.js';

const router = express.Router();

// Report generation routes
router.get('/sales', generateSalesReport);
router.get('/inventory', generateInventoryReport);
router.get('/slow-stock', generateSlowStockReport);
router.get('/profitability', generateProfitabilityReport);
router.get('/comprehensive', generateComprehensiveReport);

export default router;
