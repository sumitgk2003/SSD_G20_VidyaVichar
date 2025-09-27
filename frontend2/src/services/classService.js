import api from './api';

export const classService = {
  // Create a new class (teacher only)
  createClass: async (classData) => {
    try {
      const response = await api.post('/teacher/createClass', {
        title: classData.title
      });
      
      return {
        success: true,
        data: {
          id: response.data.data._id,
          title: response.data.data.title || 'Untitled Class',
          accessCode: response.data.data.accessCode,
          teacher: response.data.data.teacher,
          status: response.data.data.status,
          createdAt: response.data.data.createdAt
        },
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create class'
      };
    }
  },

  // Get all active classes (for students to see and join)
  getActiveClasses: async () => {
    try {
      const response = await api.get('/student/getAllActiveClasses');
      
      return {
        success: true,
        data: response.data.data.map(cls => ({
          id: cls._id,
          title: cls.title || 'Untitled Class',
          accessCode: cls.accessCode,
          teacher: cls.teacher,
          status: cls.status,
          createdAt: cls.createdAt
        }))
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch classes',
        data: []
      };
    }
  },

  // Mock function for getting teacher's classes (backend doesn't have this API)
  getTeacherClasses: async () => {
    try {
      // Since backend doesn't have this API, we'll use localStorage as fallback
      const storedClasses = localStorage.getItem('teacherClasses');
      return {
        success: true,
        data: storedClasses ? JSON.parse(storedClasses) : []
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch teacher classes',
        data: []
      };
    }
  },

  // Mock function for students to join a class (backend doesn't have this API)
  joinClass: async (accessCode) => {
    try {
      // Since backend doesn't have this API, we'll use localStorage as fallback
      const joinedClasses = JSON.parse(localStorage.getItem('joinedClasses') || '[]');
      
      // For now, we'll just add to localStorage
      // In a real implementation, this would validate the access code with the backend
      const newClass = {
        id: Date.now().toString(),
        accessCode,
        joinedAt: new Date().toISOString()
      };
      
      joinedClasses.push(newClass);
      localStorage.setItem('joinedClasses', JSON.stringify(joinedClasses));
      
      return {
        success: true,
        data: newClass,
        message: 'Successfully joined class'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to join class'
      };
    }
  },

  // Get class by ID (mock function)
  getClassById: async (classId) => {
    try {
      return {
        success: true,
        data: {
          id: classId,
          title: 'Class',
          accessCode: 'ABC123',
          status: 'active'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch class details'
      };
    }
  }
};
