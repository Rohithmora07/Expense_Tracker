import fs from 'node:fs';
import path from 'node:path';
import { Expense } from '../models/Expense.js';
import { AppError } from '../utils/AppError.js';
import { assertValidObjectId } from '../utils/validateExpense.js';
import { UPLOAD_DIR } from '../middleware/upload.js';

function removeImageFile(imageUrl) {
  if (!imageUrl?.startsWith('/uploads/')) return;

  const filename = path.basename(imageUrl);
  const filePath = path.join(UPLOAD_DIR, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Creates an expense document from AI extraction + uploaded image path.
 */
export async function createExpenseFromUpload(filename, extraction) {
  const imageUrl = `/uploads/${filename}`;

  const expense = await Expense.create({
    imageUrl,
    merchant: extraction.merchant,
    amount: extraction.amount,
    date: extraction.date,
    items: extraction.items,
    category: extraction.category,
    tax: extraction.tax,
    paymentMethod: extraction.paymentMethod,
    rawText: extraction.rawText,
    aiSummary: extraction.aiSummary,
  });

  return expense;
}

/**
 * List expenses with optional filters (newest first).
 */
export async function listExpenses(filter = {}) {
  return Expense.find(filter).sort({ createdAt: -1 }).lean();
}

/**
 * Get one expense by id.
 */
export async function getExpenseById(id) {
  assertValidObjectId(id);

  const expense = await Expense.findById(id);
  if (!expense) {
    throw new AppError('Expense not found', 404);
  }

  return expense;
}

/**
 * Update expense fields (does not replace receipt image).
 */
export async function updateExpenseById(id, payload) {
  assertValidObjectId(id);

  const expense = await Expense.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!expense) {
    throw new AppError('Expense not found', 404);
  }

  return expense;
}

/**
 * Delete expense and its uploaded image file.
 */
export async function deleteExpenseById(id) {
  assertValidObjectId(id);

  const expense = await Expense.findById(id);
  if (!expense) {
    throw new AppError('Expense not found', 404);
  }

  removeImageFile(expense.imageUrl);
  await expense.deleteOne();

  return expense;
}
