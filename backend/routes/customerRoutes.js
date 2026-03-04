import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getCustomerProfile,
  updateCustomerProfile,
  copyBillingToShipping
} from '../controllers/customerController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/customer/profile
router.get('/profile', getCustomerProfile);

// @route   PUT /api/customer/profile
router.put('/profile', updateCustomerProfile);

// @route   POST /api/customer/profile/copy-address
router.post('/profile/copy-address', copyBillingToShipping);

export default router;
