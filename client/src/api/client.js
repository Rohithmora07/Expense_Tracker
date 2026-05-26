// Option A - if NEXT_PUBLIC_API_URL ends without /api
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses`)

// Option B - cleaner (recommended)
const API_BASE = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, ''); // remove trailing slash
const res = await fetch(`${API_BASE}/api/expenses`);

/**
 * Shared fetch wrapper for the Express API.
 */
export async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || `Request failed (${response.status})`);
  }

  return body;
}
