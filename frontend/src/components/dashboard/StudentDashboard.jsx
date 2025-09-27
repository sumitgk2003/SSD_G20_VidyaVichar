import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ClassCard from './ClassCard';
import Button from '../common/Button';
import Modal from '../common/Modal';
import JoinClassModal from './JoinClassModal';
import { clearError } from '../../app/features/classSlice';
import './Dashboard.css';

const StudentDashboard = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { classes, status, error } = useSelector((state) => state.classes);

  const handleOpenJoinModal = () => {
    dispatch(clearError());
    setIsJoinModalOpen(true);
  };

  const handleCloseJoinModal = () => {
    setIsJoinModalOpen(false);
  };

  const handleClassClick = (classId) => {
    navigate(`/classroom/${classId}`);
  };

  if (status === 'loading') {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your classes...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-controls">
        <div className="controls-header">
          <h2>Your Classes</h2>
          <p>Join classes and participate in interactive Q&A sessions</p>
        </div>
        <Button 
          onClick={handleOpenJoinModal} 
          variant="success"
          size="large"
          className="join-btn"
        >
          + Join New Class
        </Button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="classes-section">
        {classes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h3>No classes yet</h3>
            <p>Join a class using an access code to start asking questions and engaging with your instructors.</p>
            <Button 
              onClick={handleOpenJoinModal} 
              variant="success"
              size="large"
            >
              Join Your First Class
            </Button>
          </div>
        ) : (
          <div className="classes-grid">
            {classes.map((classData) => (
              <ClassCard 
                key={classData.id}
                classData={classData}
                onClick={() => handleClassClick(classData.id)}
                showAccessCode={false}
              />
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isJoinModalOpen} 
        onClose={handleCloseJoinModal}
        title="Join Class"
      >
        <JoinClassModal onClose={handleCloseJoinModal} />
      </Modal>
    </div>
  );
};

export default StudentDashboard;