import express from 'express';
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  getTransactionById
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTransactions)
  .post(protect, upload.single('image'), createTransaction); 
  // ^ Middleware upload dipasang di sini

router.route('/:id')
  .get(protect, getTransactionById)
  .delete(protect, deleteTransaction);

export default router;