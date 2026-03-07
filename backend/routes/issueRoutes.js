import express from 'express';
import {
  submitIssue,
  getAllIssues,
  getIssueById,
  getUserIssues,
  updateIssueStatus,
  deleteIssue,
  getIssueStats
} from '../controllers/issueController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public/User routes
router.post('/submit', protect, submitIssue);
router.get('/my-issues', protect, getUserIssues);
router.get('/:id', protect, getIssueById);

// Admin only routes
router.get('/', protect, authorize('admin'), getAllIssues);
router.put('/:id/status', protect, authorize('admin'), updateIssueStatus);
router.delete('/:id', protect, authorize('admin'), deleteIssue);
router.get('/admin/stats', protect, authorize('admin'), getIssueStats);

export default router;
