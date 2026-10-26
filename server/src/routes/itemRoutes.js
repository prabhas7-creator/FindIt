import express from 'express';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  resolveItem,
} from '../controllers/itemController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.route('/:id')
  .get(optionalAuth, getItemById)
  .patch(protect, updateItem)
  .delete(protect, deleteItem);

router.patch('/:id/resolve', protect, resolveItem);

export default router;
