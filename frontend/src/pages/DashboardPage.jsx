import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import InstructorDashboard from '../components/dashboard/InstructorDashboard.jsx';
import StudentDashboard from '../components/dashboard/StudentDashboard.jsx';

// Import action to fetch classes (if needed immediately upon dashboard load)
import { fetchClasses } from '../app/features/classesSlice.js';

const DashboardPage = () => {
  // 1. Get user role and loading status from Redux store
  const { user, isAuthenticated, role, status } = useSelector(
    (state) => state.auth
  );
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 2. Auth Check and Data Fetch on Mount
  useEffect(() => {
    // If not authenticated, redirect to home/login page
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Fetch the list of classes for the user's dashboard
    // This action would typically handle fetching either instructor's classes or student's joined classes
    // The classesSlice state will manage the loading and display of these lists.
    dispatch(fetchClasses());
  }, [isAuthenticated, navigate, dispatch]);

  // 3. Handle Loading State
  if (status === 'loading') {
    return (
      <div className="loading-container">
        <p>Loading Dashboard...</p>
        {/* You would replace this with a proper loading spinner/component */}
      </div>
    );
  }

  // 4. Conditional Rendering based on Role
  return (
    <>
      <Header />
      <main className="dashboard-page">
        <h1 className="dashboard-page-title">
          {role === 'instructor' ? `Instructor Dashboard` : `Student Dashboard`}
        </h1>

        {role === 'instructor' ? (
          <InstructorDashboard userId={user?.id} />
        ) : role === 'student' ? (
          <StudentDashboard userId={user?.id} />
        ) : (
          // Fallback or error state if role is missing/invalid
          <p>Error: User role not recognized. Please log in again.</p>
        )}
      </main>
    </>
  );
};

export default DashboardPage;