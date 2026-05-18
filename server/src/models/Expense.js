import mongoose from 'mongoose';

/**
 * Line item parsed from a receipt (optional detail per row).
 */
const expenseItemSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: null },
    lineTotal: { type: Number, default: null },
  },
  { _id: false }
);

/**
 * Expense document: structured fields + AI/OCR context.
 * Timestamps add createdAt and updatedAt automatically.
 */
const expenseSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, default: '' },
    merchant: { type: String, default: '' },
    amount: { type: Number, default: null },
    date: { type: Date, default: null },
    items: { type: [expenseItemSchema], default: [] },
    category: { type: String, default: '' },
    tax: { type: Number, default: null },
    paymentMethod: { type: String, default: '' },
    rawText: { type: String, default: '' },
    aiSummary: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Expense = mongoose.model('Expense', expenseSchema);
