import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StickyNote from './StickyNote';
import FilterControls from './FilterControls';
import QuestionForm from './QuestionForm';
import { fetchQuestions, clearError } from '../../app/features/boardSlice';
import './QuestionBoard.css';

const QuestionBoard = ({ classId }) => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const { 
    questions, 
    currentClass, 
    filter, 
    status, 
    error 
  } = useSelector((state) => state.board);

  const isInstructor = role === 'instructor';

  useEffect(() => {
    if (classId) {
      dispatch(fetchQuestions(classId));
    }
  }, [classId, dispatch]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Filter questions based on current filter
  const filteredQuestions = questions.filter(question => {
    switch (filter) {
      case 'unanswered':
        return question.status === 'open';
      case 'answered':
        return question.status === 'answered';
      case 'important':
        return question.isImportant;
      case 'all':
      default:
        return true;
    }
  });

  if (status === 'loading') {
    return (
      <div className="board-loading">
        <div className="loading-spinner"></div>
        <p>Loading Q&A board...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="board-error">
        <h3>Error loading questions</h3>
        <p>{error}</p>
        <button 
          onClick={() => dispatch(fetchQuestions(classId))}
          className="retry-btn"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="question-board">
      <div className="board-header">
        <div className="board-info">
          <h2>Interactive Q&A Board</h2>
          <p>Real-time questions and answers for {currentClass?.className || 'this class'}</p>
        </div>
        
        {isInstructor && (
          <div className="board-stats">
            <div className="stat">
              <span className="stat-number">{questions.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {questions.filter(q => q.status === 'open').length}
              </span>
              <span className="stat-label">Unanswered</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {questions.filter(q => q.isImportant).length}
              </span>
              <span className="stat-label">Important</span>
            </div>
          </div>
        )}
      </div>

      {/* Instructor Controls */}
      {isInstructor && (
        <FilterControls />
      )}

      {/* Student Question Form */}
      {!isInstructor && (
        <QuestionForm classId={classId} />
      )}

      {/* Questions Grid */}
      <div className="questions-container">
        {filteredQuestions.length === 0 ? (
          <div className="empty-board">
            <div className="empty-icon">
              {isInstructor ? '📋' : '❓'}
            </div>
            <h3>
              {isInstructor 
                ? 'No questions match the current filter' 
                : 'Be the first to ask a question!'
              }
            </h3>
            <p>
              {isInstructor 
                ? 'Try changing the filter or wait for students to post questions.' 
                : 'Click the "Ask Question" button above to get started.'
              }
            </p>
          </div>
        ) : (
          <div className="sticky-notes-grid">
            {filteredQuestions.map((question, index) => (
              <StickyNote 
                key={question.id}
                question={question}
                index={index}
                isInstructor={isInstructor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBoard;