import { apiRequest } from './client.js';

export function uploadExpense(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  return apiRequest('/api/expenses/upload', {
    method: 'POST',
    body: formData,
  });
}

export function fetchExpenses(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value != null) {
      params.append(key, value);
    }
  });

  const query = params.toString();
  const url = query ? `/api/expenses?${query}` : '/api/expenses';

  return apiRequest(url);
}

export function fetchExpense(id) {
  return apiRequest(`/api/expenses/${id}`);
}

export function updateExpense(id, payload) {
  return apiRequest(`/api/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function deleteExpense(id) {
  return apiRequest(`/api/expenses/${id}`, { method: 'DELETE' });
}
