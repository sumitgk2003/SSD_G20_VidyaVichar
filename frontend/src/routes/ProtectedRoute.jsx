import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Get the authentication status from the Redux store (authSlice)
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  // If the authentication status is still loading, you might render a loading screen
  // (Assuming 'loading' status is correctly handled in your authSlice)
  if (status === 'loading') {
    return <div className="loading-container">Authenticating...</div>;
  }

  // If the user is authenticated, render the children (the protected component)
  if (isAuthenticated) {
    return children;
  } 

  // If not authenticated, redirect them to the home/login page
  // The 'replace' property ensures the user can't hit the back button to get to the protected page.
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;