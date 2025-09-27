import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials, role) => {
    setLoading(true);
    try {
      const result = role === 'student' 
        ? await authService.loginStudent(credentials)
        : await authService.loginTeacher(credentials);
      
      if (result.success) {
        setUser(result.data);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, role) => {
    setLoading(true);
    try {
      const result = role === 'student' 
        ? await authService.registerStudent(userData)
        : await authService.registerTeacher(userData);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (user?.role === 'student') {
        await authService.logoutStudent();
      } else if (user?.role === 'teacher') {
        await authService.logoutTeacher();
      }
      setUser(null);
      return { success: true };
    } catch (error) {
      setUser(null);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
