import express from 'express';
import { getStats, getUserItems } from '../controllers/dashboardController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', optionalAuth, getStats);
router.get('/items', protect, getUserItems);

export default router;
