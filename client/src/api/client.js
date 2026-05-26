// client/src/api/client.js

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || '';

export const apiRequest = async (endpoint, options = {}) => {
  if (!endpoint.startsWith('/')) {
    endpoint = '/' + endpoint;
  }

  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || `Request failed (${response.status})`);
  }

  return body;
};
