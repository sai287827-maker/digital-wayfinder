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

/**
 * Mocks a login API call.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string}>}
 */
export const loginMockApi = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Hardcoded valid user for testing purposes
      if (email === "test@example.com" && password === "password123") {
        // Mock JWT token (typically a JWT from backend)
        const mockToken = "mock_jwt_token_12345abcdef";
        resolve({ token: mockToken });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};
