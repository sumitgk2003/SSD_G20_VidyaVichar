import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ClassCard from './ClassCard.jsx';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import CreateClassModal from './CreateClassModal.jsx';

const InstructorDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();

  const { classes, status, error } = useSelector((state) => state.classes);
  
  const instructorClasses = classes.filter(cls => cls.instructorRole === 'instructor');

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleClassSelect = (classId) => {
    navigate(`/classroom/${classId}`);
  };

  if (status === 'loading') {
    return <div className="dashboard-message">Loading classes...</div>;
  }

  if (status === 'failed') {
    return <div className="dashboard-message error">Error loading classes: {error}</div>;
  }

  return (
    <div className="instructor-dashboard">
      <div className="dashboard-controls">
        <Button onClick={handleOpenModal} variant="primary">
          + Create New Class
        </Button>
      </div>

      <div className="class-list-container">
        {instructorClasses.length === 0 ? (
          <p className="dashboard-message no-classes">
            You haven't created any classes yet. Click "Create New Class" to get started!
          </p>
        ) : (
          <div className="class-cards-grid">
            {instructorClasses.map((classData) => (
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
        <CreateClassModal onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default InstructorDashboard;