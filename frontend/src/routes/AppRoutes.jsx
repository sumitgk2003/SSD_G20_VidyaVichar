import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layout Components
import Header from '../components/layout/Header.jsx'; 

// Import Page Components
import HomePage from '../pages/HomePage.jsx'; 
import DashboardPage from '../pages/DashboardPage.jsx';
import ClassroomPage from '../pages/ClassroomPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

// Import Routing Utilities
import ProtectedRoute from './ProtectedRoute.jsx';

const AppRoutes = () => {
  return (
    <>
      <Header /> {/* Render Header on every page */}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Protected Routes (Require Authentication) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/classroom/:classId" element={<ProtectedRoute><ClassroomPage /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;