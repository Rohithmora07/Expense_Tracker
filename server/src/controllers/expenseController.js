import { AppError } from '../utils/AppError.js';
import {
  buildExpenseFilter,
  buildUpdatePayload,
} from '../utils/validateExpense.js';
import { extractExpenseFromImage } from '../services/mistralService.js';
import {
  createExpenseFromUpload,
  listExpenses,
  getExpenseById,
  updateExpenseById,
  deleteExpenseById,
} from '../services/expenseService.js';

/**
 * POST /api/expenses/upload
 */
export async function uploadExpense(req, res) {
  if (!req.file) {
    throw new AppError('Image file is required (field name: image)', 400);
  }

  const extraction = await extractExpenseFromImage(
    req.file.path,
    req.file.mimetype
  );

  const expense = await createExpenseFromUpload(
    req.file.filename,
    extraction
  );

  res.status(201).json({
    success: true,
    message: 'Expense created from receipt image',
    data: expense,
  });
}

/**
 * GET /api/expenses
 * Query: category, merchant, date, dateFrom, dateTo, amount, minAmount, maxAmount
 */
export async function getExpenses(req, res) {
  const filter = buildExpenseFilter(req.query);
  const expenses = await listExpenses(filter);

  res.json({
    success: true,
    count: expenses.length,
    data: expenses,
  });
}

/**
 * GET /api/expenses/:id
 */
export async function getExpense(req, res) {
  const expense = await getExpenseById(req.params.id);

  res.json({
    success: true,
    data: expense,
  });
}

/**
 * PUT /api/expenses/:id
 */
export async function updateExpense(req, res) {
  const payload = buildUpdatePayload(req.body);
  const expense = await updateExpenseById(req.params.id, payload);

  res.json({
    success: true,
    message: 'Expense updated',
    data: expense,
  });
}

/**
 * DELETE /api/expenses/:id
 */
export async function deleteExpense(req, res) {
  const expense = await deleteExpenseById(req.params.id);

  res.json({
    success: true,
    message: 'Expense deleted',
    data: { id: expense._id },
  });
}
