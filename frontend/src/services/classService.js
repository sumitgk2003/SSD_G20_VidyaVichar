// Class service: backend lacks class list/join endpoints for students,
// so we keep a lightweight local implementation to support UI flows.
// Instructor class creation exists on backend but is not wired here yet.

const CLASSES_KEY = 'vv_classes';

const persist = (classes) => {
  localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
};

const read = () => {
  const raw = localStorage.getItem(CLASSES_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

// 1. Get Classes (Used by both Instructors and Students)
const getClasses = async (_token) => {
  return read();
};

// 2. Create Class (Instructor only)
const createClass = async (classData, _token) => {
  const classes = read();
  const newClass = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    className: classData.className || 'Untitled Class',
    subject: classData.subject || 'General',
    accessCode: (Math.random().toString(36).slice(2, 8)).toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  classes.push(newClass);
  persist(classes);
  return newClass;
};

// 3. Join Class (Student only)
const joinClass = async (accessCode, _token) => {
  const classes = read();
  const found = classes.find((c) => c.accessCode === accessCode);
  if (!found) {
    throw new Error('Invalid access code');
  }
  return found;
};

const classService = {
  getClasses,
  createClass,
  joinClass,
};

export default classService;