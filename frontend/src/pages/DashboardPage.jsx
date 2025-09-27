import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import InstructorDashboard from '../components/dashboard/InstructorDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import { fetchInstructorClasses, fetchStudentClasses } from '../app/features/classSlice';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, isAuthenticated, role, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Fetch classes based on user role
    if (role === 'instructor') {
      dispatch(fetchInstructorClasses());
    } else if (role === 'student') {
      dispatch(fetchStudentClasses());
    }
  }, [isAuthenticated, role, navigate, dispatch]);

  if (status === 'loading') {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            {role === 'instructor' ? 'Instructor Dashboard' : 'Student Dashboard'}
          </h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.name || 'User'}!
          </p>
        </div>

        {role === 'instructor' ? (
          <InstructorDashboard />
        ) : role === 'student' ? (
          <StudentDashboard />
        ) : (
          <div className="error-message">
            <h2>Error: User role not recognized</h2>
            <p>Please log in again to access your dashboard.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;