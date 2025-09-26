import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../common/InputField.jsx';
import Button from '../common/Button.jsx';

// Assume you have an action 'createClass' defined in classesSlice
import { createClass } from '../../app/features/classesSlice.js'; 

const CreateClassModal = ({ onClose }) => {
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  // Get status from Redux for the create class operation
  const { status } = useSelector((state) => state.classes);
  
  // Disable the form/button while the operation is in progress
  const isLoading = status === 'loading'; 

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!className.trim()) {
      setError('Class Name is required.');
      return;
    }
    if (!subject.trim()) {
      setError('Subject is required.');
      return;
    }

    const newClassData = {
      className: className.trim(),
      subject: subject.trim(),
    };

    // Dispatch the Redux thunk to call the API
    dispatch(createClass(newClassData))
      .unwrap() // Used with createAsyncThunk to handle promise rejection
      .then(() => {
        // Success: Clear form and close the modal
        setClassName('');
        setSubject('');
        onClose();
      })
      .catch((err) => {
        setError(err.message || 'Failed to create class. Please try again.');
      });
  };

  return (
    <div className="create-class-modal">
      <h2>Create New Class</h2>
      <p>Fill in the details for your new Q&A classroom.</p>
      
      <form onSubmit={handleSubmit}>
        <InputField
          label="Class Name"
          type="text"
          placeholder="e.g., Software System Development"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
        />
        
        <InputField
          label="Subject / Topic"
          type="text"
          placeholder="e.g., System Design Principles"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        
        {error && <p className="form-error-message">{error}</p>}
        
        <div className="modal-actions">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Class'}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassModal;