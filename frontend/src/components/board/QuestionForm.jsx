import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { createQuestion, clearError } from '../../app/features/boardSlice';
import './QuestionForm.css';

const QuestionForm = ({ classId }) => {
  const [questionText, setQuestionText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.board);
  
  const isLoading = status === 'loading';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!questionText.trim()) {
      return;
    }

    dispatch(createQuestion({ 
      classId, 
      text: questionText.trim() 
    }))
      .unwrap()
      .then(() => {
        setQuestionText('');
        setIsExpanded(false);
      })
      .catch(() => {
        // Error is handled by Redux
      });
  };

  const handleCancel = () => {
    setQuestionText('');
    setIsExpanded(false);
    dispatch(clearError());
  };

  return (
    <div className="question-form-container">
      <div className="form-header">
        <h3>Ask a Question</h3>
        <p>Post your question to the interactive Q&A board</p>
      </div>

      {!isExpanded ? (
        <button
          className="expand-button"
          onClick={() => setIsExpanded(true)}
          disabled={isLoading}
        >
          <span className="expand-icon">❓</span>
          <span>Ask a Question</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="question-form">
          <InputField
            label="Your Question"
            type="textarea"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="What would you like to ask? (e.g., What's the difference between horizontal and vertical scaling?)"
            required
            disabled={isLoading}
            rows={4}
          />
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isLoading || !questionText.trim()}
              className="submit-btn"
            >
              {isLoading ? 'Posting...' : 'Post Question'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="large"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuestionForm;