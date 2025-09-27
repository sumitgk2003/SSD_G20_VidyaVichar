import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { classService } from '../services/classService';
import ClassCard from '../components/ClassCard';
import CreateClassModal from '../components/CreateClassModal';
import JoinClassModal from '../components/JoinClassModal';

const DashboardPage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = user.role === 'teacher' 
        ? await classService.getTeacherClasses()
        : await classService.getActiveClasses();
      
      if (result.success) {
        setClasses(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (classData) => {
    const result = await classService.createClass(classData);
    
    if (result.success) {
      // Store in localStorage for teacher's dashboard
      const storedClasses = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
      storedClasses.push(result.data);
      localStorage.setItem('teacherClasses', JSON.stringify(storedClasses));
      
      setClasses([...classes, result.data]);
      setShowCreateModal(false);
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  };

  const handleJoinClass = async (accessCode) => {
    const result = await classService.joinClass(accessCode);
    
    if (result.success) {
      // Add to joined classes
      const joinedClasses = JSON.parse(localStorage.getItem('joinedClasses') || '[]');
      setClasses(joinedClasses);
      setShowJoinModal(false);
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '10px', color: '#333' }}>
          {user.role === 'teacher' ? 'Instructor Dashboard' : 'Student Dashboard'}
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Welcome back, {user.name}!
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          {user.role === 'teacher' ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              ➕ Create New Class
            </button>
          ) : (
            <button
              onClick={() => setShowJoinModal(true)}
              className="btn btn-primary"
            >
              🔗 Join Class
            </button>
          )}
        </div>

        <div>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>
            {user.role === 'teacher' ? 'Your Classes' : 'Available Classes'}
          </h2>
          
          {classes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No classes found.</p>
              {user.role === 'teacher' ? (
                <p>Create your first class to get started!</p>
              ) : (
                <p>Join a class using an access code!</p>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {classes.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  classData={classItem}
                  userRole={user.role}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateClassModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateClass}
        />
      )}

      {showJoinModal && (
        <JoinClassModal
          onClose={() => setShowJoinModal(false)}
          onSubmit={handleJoinClass}
        />
      )}
    </div>
  );
};

export default DashboardPage;
