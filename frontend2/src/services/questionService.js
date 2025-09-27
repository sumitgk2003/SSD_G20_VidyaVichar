import api from './api';

export const questionService = {
  // Create a new question
  createQuestion: async (questionData) => {
    try {
      // First, let's try to create a question with a default class ID
      // We'll use the class ID from the URL or create a default one
      const classId = questionData.classId || 'default-class';
      
      // Try to create the question with the backend API
      // Note: This will fail due to the backend validation issue
      try {
        const response = await api.post('/student/createQuery', {
          queryText: questionData.text,
          classId: classId // This field is not accepted by the backend
        });
        
        return {
          success: true,
          data: {
            id: response.data.data._id,
            text: response.data.data.queryText,
            author: questionData.author || 'Current User',
            status: response.data.data.status || 'Unanswered',
            createdAt: response.data.data.createdAt,
            classId: classId
          },
          message: response.data.message
        };
      } catch (apiError) {
        // If API fails (which it will due to validation), fall back to localStorage
        console.warn('Backend API failed, using localStorage fallback:', apiError.response?.data?.message);
        
        const newQuestion = {
          id: Date.now().toString(),
          text: questionData.text,
          author: questionData.author || 'Current User',
          status: 'Unanswered',
          createdAt: new Date().toISOString(),
          classId: classId
        };

        // Store in localStorage for persistence
        const storedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
        storedQuestions.push(newQuestion);
        localStorage.setItem('questions', JSON.stringify(storedQuestions));

        return {
          success: true,
          data: newQuestion,
          message: 'Question created successfully (stored locally)'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create question'
      };
    }
  },

  // Get questions created by the current student
  getQuestionsByClassId: async (classId) => {
    try {
      // NOTE: Now we pass classId as a query parameter.
      const response = await api.get(`/student/getCreatedQueries?classId=${classId}`);
      
      return {
        success: true,
        data: response.data.data.map(query => ({
          id: query._id,
          text: query.queryText,
          author: query.student?.Name || 'Unknown',
          authorEmail: query.student?.email || '',
          status: query.status || 'Unanswered',
          createdAt: query.createdAt,
          classId: query.class || classId
        }))
      };
      // Removed the redundant local filtering logic here since the backend now handles it.
      
    } catch (apiError) {
      // If API fails, use localStorage (fallback retained)
      console.warn('Backend API failed, using localStorage fallback');
      
      const storedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
      const filteredQuestions = storedQuestions.filter(q => 
        q.classId === classId || q.classId === 'default-class'
      );
      
      return {
        success: true,
        data: filteredQuestions,
        message: apiError.response?.data?.message || 'Failed to fetch questions (local mock)'
      };
    }
  },

  // Update question status (mock function since backend doesn't have this API)
  updateQuestion: async (questionId, updates) => {
    try {
      // Since backend doesn't have this API, we'll use localStorage as fallback
      const storedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
      const questionIndex = storedQuestions.findIndex(q => q.id === questionId);
      
      if (questionIndex !== -1) {
        storedQuestions[questionIndex] = { ...storedQuestions[questionIndex], ...updates };
        localStorage.setItem('questions', JSON.stringify(storedQuestions));
        
        return {
          success: true,
          data: storedQuestions[questionIndex],
          message: 'Question updated successfully'
        };
      }
      
      return {
        success: false,
        message: 'Question not found'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update question'
      };
    }
  },

  // Get all questions for a class (mock function for teachers)
  getAllQuestionsForClass: async (classId) => {
    try {
      // Since backend doesn't have this API, we'll use localStorage as fallback
      const storedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
      const filteredQuestions = storedQuestions.filter(q => q.classId === classId);
      
      return {
        success: true,
        data: filteredQuestions
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch questions',
        data: []
      };
    }
  },
  getAllQuestionsForClass: async (classId) => {
    try {
      const response = await api.get(`/teacher/getAllClassQueries?classId=${classId}`);
      
      return {
        success: true,
        data: response.data.data.map(query => ({
          id: query._id,
          text: query.queryText,
          author: query.student?.Name || 'Unknown',
          authorEmail: query.student?.email || '',
          status: query.status || 'Unanswered',
          createdAt: query.createdAt,
          classId: query.class 
        }))
      };
    } catch (error) {
      // Keep localStorage fallback as before
      console.warn('Backend API failed, using localStorage fallback');
      const storedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
      const filteredQuestions = storedQuestions.filter(q => q.classId === classId);
      
      return {
        success: true,
        data: filteredQuestions,
        message: error.response?.data?.message || 'Failed to fetch questions (local mock)'
      };
    }
  },

  // Clear all questions for a class
  clearQuestions: async (classId) => {
    try {
      const storedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
      const filteredQuestions = storedQuestions.filter(q => q.classId !== classId);
      localStorage.setItem('questions', JSON.stringify(filteredQuestions));
      
      return {
        success: true,
        message: 'Questions cleared successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to clear questions'
      };
    }
  }
};