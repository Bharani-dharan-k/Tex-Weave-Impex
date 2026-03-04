import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  uploadProducts,
  uploadSales,
  uploadInventory
} from '../controllers/uploadController.js';

const router = express.Router();

// Upload routes - protected with authentication
router.post('/products', protect, upload.single('file'), uploadProducts);
router.post('/sales', protect, upload.single('file'), uploadSales);
router.post('/inventory', protect, upload.single('file'), uploadInventory);

export default router;
