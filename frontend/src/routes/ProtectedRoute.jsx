import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Authenticating...</p>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute;