import React from 'react';
import Card from '../common/Card';
import './ClassCard.css';

const ClassCard = ({ classData, onClick, showAccessCode = false }) => {
  const { id, title, subject, accessCode, instructorName, studentCount, createdAt } = classData;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className="class-card" 
      onClick={onClick}
      hover={true}
      padding="medium"
    >
      <div className="class-header">
        <h3 className="class-title">{title}</h3>
        <p className="class-subject">{subject}</p>
      </div>

      <div className="class-details">
        <div className="detail-row">
          <span className="detail-label">Instructor:</span>
          <span className="detail-value">{instructorName || 'N/A'}</span>
        </div>
        
        {showAccessCode && (
          <div className="detail-row access-code-row">
            <span className="detail-label">Access Code:</span>
            <span className="access-code">{accessCode}</span>
          </div>
        )}
        
        {showAccessCode && (
          <div className="detail-row">
            <span className="detail-label">Students:</span>
            <span className="detail-value">{studentCount || 0}</span>
          </div>
        )}
        
        <div className="detail-row">
          <span className="detail-label">Created:</span>
          <span className="detail-value">{formatDate(createdAt)}</span>
        </div>
      </div>

      <div className="class-footer">
        <div className="click-hint">
          <span>Click to open Q&A board</span>
          <span className="arrow">→</span>
        </div>
      </div>
    </Card>
  );
};

export default ClassCard;