import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { createClass, clearError } from '../../app/features/classSlice';
import './Modal.css';

const CreateClassModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdClass, setCreatedClass] = useState(null);
  
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.classes);
  
  const isLoading = status === 'loading';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !subject.trim()) {
      return;
    }

    dispatch(createClass({ title: title.trim(), subject: subject.trim() }))
      .unwrap()
      .then((newClass) => {
        setCreatedClass(newClass);
        setShowSuccess(true);
        setTitle('');
        setSubject('');
      })
      .catch(() => {
        // Error is handled by Redux
      });
  };

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  if (showSuccess && createdClass) {
    return (
      <div className="modal-success">
        <div className="success-icon">✅</div>
        <h3>Class Created Successfully!</h3>
        <div className="success-details">
          <p><strong>Class:</strong> {createdClass.title}</p>
          <p><strong>Subject:</strong> {createdClass.subject}</p>
          <div className="access-code-display">
            <p><strong>Access Code:</strong></p>
            <div className="access-code-box">
              {createdClass.accessCode}
            </div>
            <p className="access-code-note">
              Share this code with students so they can join your class
            </p>
          </div>
        </div>
        <div className="modal-actions">
          <Button 
            onClick={handleClose} 
            variant="primary"
            size="large"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-class-modal">
      <form onSubmit={handleSubmit} className="modal-form">
        <InputField
          label="Class Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Software System Development"
          required
          disabled={isLoading}
        />
        
        <InputField
          label="Subject/Topic"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., System Design Principles"
          required
          disabled={isLoading}
        />
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="modal-actions">
          <Button 
            type="submit" 
            variant="primary" 
            size="large"
            disabled={isLoading || !title.trim() || !subject.trim()}
            className="submit-btn"
          >
            {isLoading ? 'Creating...' : 'Create Class'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="large"
            onClick={handleClose}
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