export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Utilities',
  'Health',
  'Entertainment',
  'Travel',
  'Education',
  'Groceries',
  'Subscriptions',
  'Other',
];

export function formatCurrency(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount));
}

export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateInput(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function imageSrc(imageUrl) {
  if (!imageUrl) return '';
  return imageUrl.startsWith('http') ? imageUrl : imageUrl;
}
