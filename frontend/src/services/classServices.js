// src/services/classService.js

import { getAuthHeader } from './authService';

const API_BASE_URL = 'http://localhost:5000/api/classes'; // Replace with your actual backend URL

/**
 * Fetches all classes for the current user's role (student/instructor).
 * @returns {Promise<Array<Object>>} List of classes.
 */
export async function getAllClasses() {
  const response = await fetch(API_BASE_URL, {
    method: 'GET',
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch classes.');
  }

  return response.json();
}

/**
 * Creates a new class (Instructor only).
 * @param {Object} classData - Details of the new class.
 * @returns {Promise<Object>} The created class object.
 */
export async function createClass(classData) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(classData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create class.');
  }

  return response.json();
}

/**
 * Joins an existing class using an invite code (Student only).
 * @param {string} inviteCode - The unique code for the class.
 * @returns {Promise<Object>} Confirmation message.
 */
export async function joinClass(inviteCode) {
  const response = await fetch(`${API_BASE_URL}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ inviteCode }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to join class.');
  }

  return response.json();
}