// VidyaVichara Class Management Service
// Handles class creation, joining, and management

const CLASSES_KEY = 'vidyavichara_classes';
const ENROLLMENTS_KEY = 'vidyavichara_enrollments';

// Generate unique access code
const generateAccessCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Local storage helpers
const getClasses = () => {
  const data = localStorage.getItem(CLASSES_KEY);
  return data ? JSON.parse(data) : [];
};

const saveClasses = (classes) => {
  localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
};

const getEnrollments = () => {
  const data = localStorage.getItem(ENROLLMENTS_KEY);
  return data ? JSON.parse(data) : {};
};

const saveEnrollments = (enrollments) => {
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
};

// Create new class (instructor only)
const createClass = async (classData, instructorId) => {
  const classes = getClasses();
  const accessCode = generateAccessCode();
  
  const newClass = {
    id: Date.now().toString(),
    title: classData.title,
    subject: classData.subject,
    instructorId,
    instructorName: classData.instructorName,
    accessCode,
    createdAt: new Date().toISOString(),
    studentCount: 0,
  };

  classes.push(newClass);
  saveClasses(classes);
  
  return newClass;
};

// Join class with access code (student only)
const joinClass = async (accessCode, studentId) => {
  const classes = getClasses();
  const enrollments = getEnrollments();
  
  const targetClass = classes.find(c => c.accessCode === accessCode);
  if (!targetClass) {
    throw new Error('Invalid access code');
  }

  // Check if already enrolled
  if (enrollments[studentId]?.includes(targetClass.id)) {
    throw new Error('You are already enrolled in this class');
  }

  // Add enrollment
  if (!enrollments[studentId]) {
    enrollments[studentId] = [];
  }
  enrollments[studentId].push(targetClass.id);
  saveEnrollments(enrollments);

  // Update student count
  targetClass.studentCount++;
  saveClasses(classes);

  return targetClass;
};

// Get classes for instructor
const getInstructorClasses = async (instructorId) => {
  const classes = getClasses();
  return classes.filter(c => c.instructorId === instructorId);
};

// Get enrolled classes for student
const getStudentClasses = async (studentId) => {
  const classes = getClasses();
  const enrollments = getEnrollments();
  const enrolledClassIds = enrollments[studentId] || [];
  
  return classes.filter(c => enrolledClassIds.includes(c.id));
};

// Get class by ID
const getClassById = async (classId) => {
  const classes = getClasses();
  return classes.find(c => c.id === classId);
};

export default {
  createClass,
  joinClass,
  getInstructorClasses,
  getStudentClasses,
  getClassById,
};