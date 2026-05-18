import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  uploadExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';

export const expenseRouter = Router();

expenseRouter.get('/health', (req, res) => {
  res.json({ success: true, message: 'Expense routes mounted' });
});

// Create from receipt image
expenseRouter.post(
  '/upload',
  upload.single('image'),
  asyncHandler(uploadExpense)
);

// Read (list + filters)
expenseRouter.get('/', asyncHandler(getExpenses));

// Read one
expenseRouter.get('/:id', asyncHandler(getExpense));

// Update
expenseRouter.put('/:id', asyncHandler(updateExpense));

// Delete
expenseRouter.delete('/:id', asyncHandler(deleteExpense));
