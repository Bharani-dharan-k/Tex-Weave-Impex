import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/imageUploadMiddleware.js';
import {
  getCustomerProfile,
  updateCustomerProfile,
  copyBillingToShipping,
  uploadProfilePicture,
  getSavedAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/customerController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Profile routes
// @route   GET /api/customer/profile
router.get('/profile', getCustomerProfile);

// @route   PUT /api/customer/profile
router.put('/profile', updateCustomerProfile);

// @route   POST /api/customer/profile/copy-address
router.post('/profile/copy-address', copyBillingToShipping);

// @route   POST /api/customer/profile/upload-picture
router.post('/profile/upload-picture', upload.single('profilePicture'), uploadProfilePicture);

// Saved addresses routes
// @route   GET /api/customer/addresses
router.get('/addresses', getSavedAddresses);

// @route   POST /api/customer/addresses
router.post('/addresses', addAddress);

// @route   PUT /api/customer/addresses/:addressId
router.put('/addresses/:addressId', updateAddress);

// @route   DELETE /api/customer/addresses/:addressId
router.delete('/addresses/:addressId', deleteAddress);

// @route   PUT /api/customer/addresses/:addressId/set-default
router.put('/addresses/:addressId/set-default', setDefaultAddress);

export default router;
