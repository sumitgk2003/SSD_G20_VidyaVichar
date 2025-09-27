import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ClassCard from './ClassCard';
import Button from '../common/Button';
import Modal from '../common/Modal';
import CreateClassModal from './CreateClassModal';
import { clearError } from '../../app/features/classSlice';
import './Dashboard.css';

const InstructorDashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { classes, status, error } = useSelector((state) => state.classes);

  const handleOpenCreateModal = () => {
    dispatch(clearError());
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
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
    <div className="instructor-dashboard">
      <div className="dashboard-controls">
        <div className="controls-header">
          <h2>Your Classes</h2>
          <p>Create and manage your interactive Q&A classrooms</p>
        </div>
        <Button 
          onClick={handleOpenCreateModal} 
          variant="primary"
          size="large"
          className="create-btn"
        >
          + Create New Class
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
            <div className="empty-icon">📚</div>
            <h3>No classes yet</h3>
            <p>Create your first class to start engaging with students through interactive Q&A sessions.</p>
            <Button 
              onClick={handleOpenCreateModal} 
              variant="primary"
              size="large"
            >
              Create Your First Class
            </Button>
          </div>
        ) : (
          <div className="classes-grid">
            {classes.map((classData) => (
              <ClassCard 
                key={classData.id}
                classData={classData}
                onClick={() => handleClassClick(classData.id)}
                showAccessCode={true}
              />
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseCreateModal}
        title="Create New Class"
      >
        <CreateClassModal onClose={handleCloseCreateModal} />
      </Modal>
    </div>
  );
};

export default InstructorDashboard;