// VidyaVichara Question Service
// Handles Q&A sticky notes with backend integration

const API_BASE = import.meta.env.VITE_API_BASE || '';
const QUESTIONS_KEY = 'vidyavichara_questions';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
};

// Map backend Query to frontend question format
const mapQueryToQuestion = (query) => ({
  id: query._id,
  text: query.queryText,
  author: {
    name: query?.student?.Name || 'Student',
    email: query?.student?.email || '',
  },
  timestamp: query.createdAt,
  status: 'open',
  isImportant: false,
  classId: 'default', // Since backend doesn't have class-specific queries
});

// Get questions for a class (maps to student's created queries)
const getQuestions = async (classId) => {
  try {
    const response = await fetch(`${API_BASE}/api/v1/student/getCreatedQueries`, {
      method: 'GET',
      credentials: 'include',
    });
    
    const result = await handleResponse(response);
    const queries = Array.isArray(result?.data) ? result.data : [];
    
    return {
      questions: queries.map(mapQueryToQuestion),
      classDetails: { 
        className: 'Q&A Board', 
        subject: 'General',
        id: classId 
      },
    };
  } catch (error) {
    // Fallback to local storage if backend fails
    const localQuestions = getLocalQuestions(classId);
    return {
      questions: localQuestions,
      classDetails: { 
        className: 'Q&A Board', 
        subject: 'General',
        id: classId 
      },
    };
  }
};

// Create new question (maps to student query creation)
const createQuestion = async (questionData) => {
  try {
    const response = await fetch(`${API_BASE}/api/v1/student/createQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ queryText: questionData.text }),
    });
    
    const result = await handleResponse(response);
    return mapQueryToQuestion(result?.data);
  } catch (error) {
    // Fallback to local storage
    return createLocalQuestion(questionData);
  }
};

// Update question status (local only for now)
const updateQuestion = async (updateData) => {
  const { classId, questionId, status, isImportant } = updateData;
  const questions = getLocalQuestions(classId);
  const questionIndex = questions.findIndex(q => q.id === questionId);
  
  if (questionIndex === -1) {
    throw new Error('Question not found');
  }
  
  const updatedQuestion = {
    ...questions[questionIndex],
    status: status || questions[questionIndex].status,
    isImportant: isImportant !== undefined ? isImportant : questions[questionIndex].isImportant,
  };
  
  questions[questionIndex] = updatedQuestion;
  saveLocalQuestions(classId, questions);
  
  return updatedQuestion;
};

// Local storage helpers for fallback
const getLocalQuestions = (classId) => {
  const data = localStorage.getItem(QUESTIONS_KEY);
  const allQuestions = data ? JSON.parse(data) : {};
  return allQuestions[classId] || [];
};

const saveLocalQuestions = (classId, questions) => {
  const data = localStorage.getItem(QUESTIONS_KEY);
  const allQuestions = data ? JSON.parse(data) : {};
  allQuestions[classId] = questions;
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(allQuestions));
};

const createLocalQuestion = (questionData) => {
  const { classId, text } = questionData;
  const questions = getLocalQuestions(classId);
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  
  const newQuestion = {
    id: Date.now().toString(),
    text: text.trim(),
    author: {
      name: currentUser.name || 'Anonymous',
      email: currentUser.email || '',
    },
    timestamp: new Date().toISOString(),
    status: 'open',
    isImportant: false,
    classId,
  };
  
  questions.unshift(newQuestion);
  saveLocalQuestions(classId, questions);
  
  return newQuestion;
};

export default {
  getQuestions,
  createQuestion,
  updateQuestion,
};