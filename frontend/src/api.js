// src/api.js

const BASE_URL = '';

export async function apiGet(endpoint) {
  const res = await fetch(`${BASE_URL}/${endpoint}`);
  if (!res.ok) throw new Error('API GET failed');
  return res.json();
}

export async function apiPost(endpoint, data) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('API POST failed');
  return res.json();
} 