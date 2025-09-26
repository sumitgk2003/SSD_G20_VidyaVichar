import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../common/InputField.jsx';
import Button from '../common/Button.jsx';

// Assume the action to post a question is defined in boardSlice
import { postQuestion } from '../../app/features/boardSlice.js';

const QuestionForm = ({ classId }) => {
  const [questionText, setQuestionText] = useState('');
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  
  // Get loading status from the board slice to disable the button during submission
  const { status } = useSelector((state) => state.board);
  const isLoading = status === 'loading'; 

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedText = questionText.trim();
    setError(null);

    if (!trimmedText) {
      setError('Please enter your question before submitting.');
      return;
    }

    // 1. Prepare question data
    const questionData = {
      classId: classId,
      text: trimmedText,
    };

    // 2. Dispatch the async thunk
    dispatch(postQuestion(questionData))
      .unwrap() // Handle the promise from createAsyncThunk
      .then(() => {
        // Success: Clear the input field
        setQuestionText('');
      })
      .catch((err) => {
        // Failure: Show error from the backend/thunk
        setError(err.message || 'Failed to submit question. Try again.');
      });
  };

  return (
    <div className="question-form-container">
      <form onSubmit={handleSubmit} className="question-form">
        <InputField
          label="Post a Question"
          type="text"
          placeholder="What is the difference between horizontal and vertical scaling?"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required={true}
          error={error}
        />
        
        <div className="form-actions">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isLoading || !questionText.trim()}
          >
            {isLoading ? 'Posting...' : 'Post Question'}
          </Button>
        </div>
        
        {/* Display server-side/submission errors if any */}
        {error && <p className="form-error-message">{error}</p>}
      </form>
    </div>
  );
};

export default QuestionForm;