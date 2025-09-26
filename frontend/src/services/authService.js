// Networked auth service that calls backend APIs and stores session user

const API_BASE = import.meta.env.VITE_API_BASE || '';

const handleJson = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
};

const persistUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

// 1. Register User
// role: 'student' | 'instructor' determines which endpoint to call
const register = async ({ role = 'student', email, password, username }) => {
  const isTeacher = role === 'instructor' || role === 'teacher';
  const endpoint = isTeacher ? '/api/v1/teacher/register' : '/api/v1/student/register';

  // Backend expects fields: for student -> { Name, email, Roll_Number?, password }
  // for teacher -> { Name, email, password }
  const body = isTeacher
    ? { Name: username || email.split('@')[0], email, password }
    : { Name: username || email.split('@')[0], email, Roll_Number: email.split('@')[0], password };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await handleJson(res);
  const created = json?.data;
  // No tokens on register; return minimal for UI then let login fetch tokens
  return { user: created, role: isTeacher ? 'instructor' : 'student' };
};

// 2. Login User
const login = async ({ role = 'student', email, password }) => {
  const isTeacher = role === 'instructor' || role === 'teacher';
  const endpoint = isTeacher ? '/api/v1/teacher/login' : '/api/v1/student/login';

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const json = await handleJson(res);
  // Backend ApiResponse { data: { userRole, user, accessToken, refreshToken }, ... }
  const payload = json?.data || {};
  const mapped = {
    id: payload?.user?._id,
    username: payload?.user?.Name || payload?.user?.email?.split('@')[0],
    email: payload?.user?.email,
    role: payload?.userRole === 'teacher' ? 'instructor' : 'student',
    token: payload?.accessToken,
  };
  return persistUser(mapped);
};

// 3. Logout User (hit backend to clear cookies, then clear local)
const logout = async (role = 'student') => {
  try {
    const isTeacher = role === 'instructor' || role === 'teacher';
    const endpoint = isTeacher ? '/api/v1/teacher/logout' : '/api/v1/student/logout';
    await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (_) {
    // ignore network errors during logout
  } finally {
    localStorage.removeItem('user');
  }
};

const authService = { register, login, logout };

export default authService;