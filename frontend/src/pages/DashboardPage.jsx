import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import InstructorDashboard from '../components/dashboard/InstructorDashboard.jsx';
import StudentDashboard from '../components/dashboard/StudentDashboard.jsx';

import { fetchClasses } from '../app/features/classesSlice.js';

const DashboardPage = () => {
  const { user, isAuthenticated, role, status } = useSelector(
    (state) => state.auth
  );
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    dispatch(fetchClasses());
  }, [isAuthenticated, navigate, dispatch]);

  if (status === 'loading') {
    return (
      <div className="loading-container">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

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
          <p>Error: User role not recognized. Please log in again.</p>
        )}
      </main>
    </>
  );
};

export default DashboardPage;