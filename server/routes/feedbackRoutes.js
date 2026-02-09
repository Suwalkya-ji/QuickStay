import express from 'express';
import { submitFeedback, getApprovedFeedback, getAllFeedback, approveFeedback, deleteFeedback } from '../controllers/feedbackController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/approved', getApprovedFeedback);

// Protected routes (user must be logged in)
router.post('/submit', protect, submitFeedback);

// Admin routes
router.get('/all', protect, isAdmin, getAllFeedback);
router.put('/approve/:feedbackId', protect, isAdmin, approveFeedback);
router.delete('/:feedbackId', protect, isAdmin, deleteFeedback);

export default router;
