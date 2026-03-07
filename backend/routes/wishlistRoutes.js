import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlist,
  moveToCart
} from '../controllers/wishlistController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);
router.use(authorize('user', 'customer'));

router.get('/', getWishlist);
router.post('/add/:productId', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.delete('/clear', clearWishlist);
router.get('/check/:productId', checkWishlist);
router.post('/move-to-cart/:productId', moveToCart);

export default router;
