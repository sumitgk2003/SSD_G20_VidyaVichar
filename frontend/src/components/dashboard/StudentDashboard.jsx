import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ClassCard from './ClassCard.jsx';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import JoinClassModal from './JoinClassModal.jsx';

const StudentDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();

  const { classes, status, error } = useSelector((state) => state.classes);
  
  const joinedClasses = classes; 

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleClassSelect = (classId) => {
    navigate(`/classroom/${classId}`);
  };

  if (status === 'loading') {
    return <div className="dashboard-message">Loading your joined classes...</div>;
  }

  if (status === 'failed') {
    return <div className="dashboard-message error">Error loading classes: {error}</div>;
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-controls">
        <Button onClick={handleOpenModal} variant="success">
          Join New Class
        </Button>
      </div>

      <div className="class-list-container">
        <h3 className="list-title">Your Enrolled Classes</h3>
        
        {joinedClasses.length === 0 ? (
          <p className="dashboard-message no-classes">
            You haven't joined any classes yet. Click "Join New Class" above!
          </p>
        ) : (
          <div className="class-cards-grid">
            {joinedClasses.map((classData) => (
              <ClassCard 
                key={classData.id}
                classData={classData}
                onClick={() => handleClassSelect(classData.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <JoinClassModal onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default StudentDashboard;