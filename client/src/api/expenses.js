// client/src/api/expenses.js

import { apiRequest } from './client';   // ← Import from client.js we fixed earlier

// Fetch all expenses
export const fetchExpenses = async () => {
  return apiRequest('/api/expenses');
};

// Fetch single expense
export const fetchExpense = async (id) => {
  return apiRequest(`/api/expenses/${id}`);
};

// Create new expense
export const uploadExpense = async (data) => {
  return apiRequest('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update expense
export const updateExpense = async (id, data) => {
  return apiRequest(`/api/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete expense
export const deleteExpense = async (id) => {
  return apiRequest(`/api/expenses/${id}`, {
    method: 'DELETE',
  });
};
