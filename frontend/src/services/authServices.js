// src/services/authService.js

const API_BASE_URL = 'http://localhost:5000/api/auth'; // Replace with your actual backend URL

/**
 * Handles user login.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The user object or an error.
 */
export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  // Optional: Store token in localStorage
  localStorage.setItem('userToken', data.token);
  return data.user;
}

/**
 * Handles user registration (signup).
 * @param {Object} userData - User details including name, email, password, and role.
 * @returns {Promise<Object>} The newly created user object.
 */
export async function register(userData) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
}

/**
 * Clears the stored token (user logout).
 */
export function logout() {
  localStorage.removeItem('userToken');
}

/**
 * Helper to get the auth header for protected routes.
 */
export function getAuthHeader() {
  const token = localStorage.getItem('userToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}