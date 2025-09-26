import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import StickyNote from './StickyNote.jsx';
import FilterControls from './FilterControls.jsx';
import QuestionForm from './QuestionForm.jsx';

// Assume action to fetch questions is defined in boardSlice
import { fetchQuestions, updateQuestionStatus } from '../../app/features/boardSlice.js'; 

const QuestionBoard = () => {
  const dispatch = useDispatch();
  // Get the classId from the URL (e.g., /classroom/:classId)
  const { classId } = useParams(); 

  // Get state from the Redux store
  const { 
    questions, 
    status, 
    error, 
    filter, 
    currentClass 
  } = useSelector((state) => state.board);
  
  // Get user role from the auth state
  const { role } = useSelector((state) => state.auth);
  const isInstructor = role === 'instructor';

  // Fetch questions when the component mounts or classId changes
  useEffect(() => {
    if (classId) {
      dispatch(fetchQuestions(classId));
    }
  }, [dispatch, classId]);

  // Apply the current filter (logic for filtering is typically in the selector or here)
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

  // Handle instructor actions on a question (e.g., marking as answered)
  const handleToggleAnswered = (questionId, newStatus) => {
    if (isInstructor) {
      dispatch(updateQuestionStatus({ 
        classId, 
        questionId, 
        newStatus 
      }));
    }
  };

  if (status === 'loading') {
    return <div className="board-message">Loading Q&A board...</div>;
  }

  if (status === 'failed') {
    return <div className="board-message error">Error loading questions: {error}</div>;
  }
  
  return (
    <div className="question-board-container">
      <h2 className="class-title">{currentClass?.className || 'Q&A Board'}</h2>
      <p className="class-details">Topic: {currentClass?.subject || 'N/A'}</p>

      {/* Renders filtering controls for the Instructor only */}
      {isInstructor && <FilterControls />}
      
      {/* Student Question Submission Form */}
      {!isInstructor && <QuestionForm classId={classId} />}

      <div className="question-grid">
        {filteredQuestions.length === 0 ? (
          <p className="board-message no-questions">
            {isInstructor ? 
              "No questions match the current filter." : 
              "Be the first to ask a question!"}
          </p>
        ) : (
          // Map and render the StickyNote components
          filteredQuestions.map(question => (
            <StickyNote 
              key={question.id}
              question={question}
              isInstructor={isInstructor}
              onToggleAnswered={handleToggleAnswered}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionBoard;