import api from './api';

export const authService = {
  // Student registration
  registerStudent: async (userData) => {
    try {
      const response = await api.post('/student/register', {
        Name: userData.name,
        email: userData.email,
        Roll_Number: userData.rollNumber,
        password: userData.password
      });
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Teacher registration
  registerTeacher: async (userData) => {
    try {
      const response = await api.post('/teacher/register', {
        Name: userData.name,
        email: userData.email,
        password: userData.password
      });
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Student login
  loginStudent: async (credentials) => {
    try {
      const response = await api.post('/student/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      const { data } = response.data;
      
      // Store auth data
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify({
        id: data.user._id,
        name: data.user.Name,
        email: data.user.email,
        role: data.userRole
      }));
      
      return {
        success: true,
        data: {
          id: data.user._id,
          name: data.user.Name,
          email: data.user.email,
          role: data.userRole,
          token: data.accessToken
        },
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Teacher login
  loginTeacher: async (credentials) => {
    try {
      const response = await api.post('/teacher/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      const { data } = response.data;
      
      // Store auth data
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify({
        id: data.user._id,
        name: data.user.Name,
        email: data.user.email,
        role: data.userRole
      }));
      
      return {
        success: true,
        data: {
          id: data.user._id,
          name: data.user.Name,
          email: data.user.email,
          role: data.userRole,
          token: data.accessToken
        },
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Student logout
  logoutStudent: async () => {
    try {
      await api.post('/student/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      return { success: true };
    }
  },

  // Teacher logout
  logoutTeacher: async () => {
    try {
      await api.post('/teacher/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
      return { success: true };
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};
