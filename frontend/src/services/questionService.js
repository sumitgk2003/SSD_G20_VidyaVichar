// Question service wired to backend student endpoints (queries)

const API_BASE = import.meta.env.VITE_API_BASE || '';

const handleJson = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
};

// Map backend Query to frontend board item
const mapQueryToQuestion = (q) => ({
  id: q._id,
  text: q.queryText,
  author: { username: q?.student?.Name || 'Student' },
  timestamp: q.createdAt,
  status: 'open',
  isImportant: false,
});

// 1. Get Questions (we map to created queries of the logged-in student)
const getQuestions = async (_classId, _token) => {
  // Backend does not support classes/questions per class; reuse queries as questions
  const res = await fetch(`${API_BASE}/api/v1/student/getCreatedQueries`, {
    method: 'GET',
    credentials: 'include',
  });
  const json = await handleJson(res);
  const list = Array.isArray(json?.data) ? json.data : [];
  return {
    questions: list.map(mapQueryToQuestion),
    classDetails: { className: 'Q&A Board', subject: 'General' },
  };
};

// 2. Create Question (creates a Query)
const createQuestion = async ({ text }, _token) => {
  const body = { queryText: text };
  const res = await fetch(`${API_BASE}/api/v1/student/createQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await handleJson(res);
  return mapQueryToQuestion(json?.data);
};

// 3. Update Question (no backend support; keep client-only update for UX)
const updateQuestion = async (data) => {
  // Simulate immediate success; in real app this would call a backend endpoint
  return {
    id: data.questionId,
    text: data.text,
    author: data.author,
    timestamp: data.timestamp,
    status: data.newStatus || 'open',
    isImportant: data.isImportant ?? false,
  };
};

const questionService = { getQuestions, createQuestion, updateQuestion };

export default questionService;