import express from 'express';
import {
  createRazorpayOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer routes
router.post('/create-razorpay-order', protect, authorize('customer'), createRazorpayOrder);
router.post('/verify-payment', protect, authorize('customer'), verifyPayment);
router.get('/my-orders', protect, authorize('customer'), getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, authorize('customer'), cancelOrder);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

export default router;
