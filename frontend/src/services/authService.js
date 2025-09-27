// VidyaVichara Authentication Service
// Handles student and instructor authentication with backend

const API_BASE = import.meta.env.VITE_API_BASE || '';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
};

const persistUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

// Register new user (student or instructor)
const register = async ({ role, email, password, name }) => {
  const isInstructor = role === 'instructor';
  const endpoint = isInstructor ? '/api/v1/teacher/register' : '/api/v1/student/register';
  
  const body = isInstructor
    ? { Name: name, email, password }
    : { Name: name, email, Roll_Number: email.split('@')[0], password };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const result = await handleResponse(response);
  return { user: result?.data, role: isInstructor ? 'instructor' : 'student' };
};

// Login user
const login = async ({ role, email, password }) => {
  const isInstructor = role === 'instructor';
  const endpoint = isInstructor ? '/api/v1/teacher/login' : '/api/v1/student/login';

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const result = await handleResponse(response);
  const payload = result?.data || {};
  
  const user = {
    id: payload?.user?._id,
    name: payload?.user?.Name,
    email: payload?.user?.email,
    role: payload?.userRole === 'teacher' ? 'instructor' : 'student',
    token: payload?.accessToken,
  };

  return persistUser(user);
};

// Logout user
const logout = async (role = 'student') => {
  try {
    const isInstructor = role === 'instructor';
    const endpoint = isInstructor ? '/api/v1/teacher/logout' : '/api/v1/student/logout';
    await fetch(`${API_BASE}${endpoint}`, { 
      method: 'POST', 
      credentials: 'include' 
    });
  } catch (error) {
    console.warn('Logout request failed:', error);
  } finally {
    localStorage.removeItem('user');
  }
};

// Get current user from localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};