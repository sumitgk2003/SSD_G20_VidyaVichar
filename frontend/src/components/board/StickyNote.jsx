import React from 'react';
import { useDispatch } from 'react-redux';
import { markAsAnswered, markAsImportant } from '../../app/features/boardSlice';
import './StickyNote.css';

const StickyNote = ({ question, index, isInstructor }) => {
  const dispatch = useDispatch();

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleMarkAnswered = () => {
    dispatch(markAsAnswered(question.id));
  };

  const handleToggleImportant = () => {
    dispatch(markAsImportant(question.id));
  };

  const getStickyColor = (index) => {
    const colors = [
      'sticky-yellow',
      'sticky-blue', 
      'sticky-pink',
      'sticky-green',
      'sticky-purple',
      'sticky-orange'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`sticky-note ${getStickyColor(index)} ${question.status === 'answered' ? 'answered' : ''} ${question.isImportant ? 'important' : ''}`}>
      <div className="sticky-header">
        <div className="question-meta">
          <span className="author-name">{question.author.name}</span>
          <span className="timestamp">
            {formatDate(question.timestamp)} at {formatTime(question.timestamp)}
          </span>
        </div>
        
        {isInstructor && (
          <div className="sticky-actions">
            <button
              className={`action-btn ${question.status === 'answered' ? 'answered' : ''}`}
              onClick={handleMarkAnswered}
              title={question.status === 'answered' ? 'Mark as unanswered' : 'Mark as answered'}
            >
              {question.status === 'answered' ? '✅' : '⭕'}
            </button>
            <button
              className={`action-btn ${question.isImportant ? 'important' : ''}`}
              onClick={handleToggleImportant}
              title={question.isImportant ? 'Remove from important' : 'Mark as important'}
            >
              {question.isImportant ? '⭐' : '☆'}
            </button>
          </div>
        )}
      </div>
      
      <div className="sticky-content">
        <p className="question-text">{question.text}</p>
      </div>
      
      <div className="sticky-footer">
        <div className="status-indicators">
          {question.status === 'answered' && (
            <span className="status-badge answered">Answered</span>
          )}
          {question.isImportant && (
            <span className="status-badge important">Important</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyNote;