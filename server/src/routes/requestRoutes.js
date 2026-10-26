import express from 'express';
import {
  createRequest,
  getRequests,
  updateRequestStatus,
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All contact request routes require authentication

router.route('/')
  .post(createRequest)
  .get(getRequests);

router.patch('/:id', updateRequestStatus);

export default router;
