import React from 'react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';

const StickyNote = ({ question, isInstructor, onToggleAnswered }) => {
  const { 
    id, 
    text, 
    author, 
    timestamp, 
    status, 
    isImportant 
  } = question;

  // Determine appearance based on status
  const isAnswered = status === 'answered';
  const noteClass = `sticky-note ${isAnswered ? 'answered' : 'open'} ${isImportant ? 'important' : ''}`;

  // Helper function to format the timestamp (e.g., "5 minutes ago")
  const formatTime = (time) => {
    // In a real app, you would use a library like 'date-fns' or 'moment'
    if (!time) return 'Just now';
    const date = new Date(time);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  const handleToggle = () => {
    // Determine the new status
    const newStatus = isAnswered ? 'open' : 'answered';
    onToggleAnswered(id, newStatus);
  };

  // Instructor-only action to toggle importance (assuming another action would be dispatched)
  const handleToggleImportance = () => {
      // Logic for toggling isImportant would go here, calling a separate thunk/action
      console.log(`Toggling importance for question ${id}`);
  };

  return (
    <Card className={noteClass}>
      <div className="note-body">
        <p className="question-text">{text}</p>
      </div>

      <div className="note-footer">
        <div className="note-metadata">
          <p className="note-author">
            Author: 
            <strong>{author?.username || 'Anonymous'}</strong>
          </p>
          <p className="note-time">{formatTime(timestamp)}</p>
        </div>

        {isInstructor && (
          <div className="note-actions">
            <Button
              onClick={handleToggle}
              variant={isAnswered ? 'success' : 'warning'}
              size="small"
            >
              {isAnswered ? 'Mark Unanswered' : 'Mark Answered'}
            </Button>
            
            <Button
              onClick={handleToggleImportance}
              variant={isImportant ? 'danger' : 'secondary'}
              size="small"
            >
              {isImportant ? 'Unmark Important' : 'Mark Important'}
            </Button>
          </div>
        )}
        
        {!isInstructor && (
          <div className={`note-status note-status-${status}`}>
            {isAnswered ? 'Answered' : 'Open'}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StickyNote;