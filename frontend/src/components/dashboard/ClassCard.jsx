import React from 'react';
// Assuming Card.jsx is a common component for styling containers
import Card from '../common/Card.jsx'; 

const ClassCard = ({ classData, onClick }) => {
  // Destructure relevant data from the class object
  const { id, className, subject, accessCode, instructorName, studentCount } = classData;

  // Determine the user's role based on what data is available or inferred.
  // We'll primarily focus on displaying the class info clearly.
  const isInstructorView = !!accessCode; // Simple heuristic: if accessCode is shown, it's for the instructor

  return (
    // Card component acts as the container and makes the entire area clickable
    <Card className="class-card" onClick={onClick}>
      <div className="card-header">
        <h3 className="class-name">{className}</h3>
        <p className="class-subject">{subject}</p>
      </div>

      <div className="card-details">
        {/* Detail visible to both students and instructors */}
        <p>
          <span className="detail-label">Instructor:</span> {instructorName || 'N/A'}
        </p>

        {isInstructorView ? (
          // Details for the Instructor Dashboard
          <>
            <p className="access-code">
              <span className="detail-label">Access Code:</span> 
              <strong className="code-value">{accessCode}</strong>
            </p>
            <p>
              <span className="detail-label">Students Enrolled:</span> {studentCount || 0}
            </p>
          </>
        ) : (
          // Details for the Student Dashboard (less info shown)
          <p>
            <span className="detail-label">Status:</span> Enrolled
          </p>
        )}
      </div>

      <div className="card-footer">
        <p className="click-prompt">Click to Open Q&A Board →</p>
      </div>
    </Card>
  );
};

export default ClassCard;