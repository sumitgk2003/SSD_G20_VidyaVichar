// src/services/questionService.js

import { getAuthHeader } from './authService';

const API_BASE_URL = 'http://localhost:5000/api/questions'; // Replace with your actual backend URL

/**
 * Fetches all questions for a specific class.
 * @param {string} classId - The ID of the class.
 * @returns {Promise<Array<Object>>} List of questions.
 */
export async function getQuestionsByClass(classId) {
  const response = await fetch(`${API_BASE_URL}/class/${classId}`, {
    method: 'GET',
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch questions.');
  }

  return response.json();
}

/**
 * Posts a new question to a class.
 * @param {string} classId - The ID of the class.
 * @param {string} content - The content of the question.
 * @returns {Promise<Object>} The posted question object.
 */
export async function postQuestion(classId, content) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ classId, content }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to post question.');
  }

  return response.json();
}

/**
 * Posts an answer to an existing question (Instructor only).
 * @param {string} questionId - The ID of the question.
 * @param {string} answerContent - The content of the answer.
 * @returns {Promise<Object>} The updated question object with the answer.
 */
export async function postAnswer(questionId, answerContent) {
  const response = await fetch(`${API_BASE_URL}/${questionId}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ answer: answerContent }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to post answer.');
  }

  return response.json();
}