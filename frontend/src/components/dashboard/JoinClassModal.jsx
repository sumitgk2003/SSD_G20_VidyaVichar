import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { joinClass, clearError } from '../../app/features/classSlice';
import './Modal.css';

const JoinClassModal = ({ onClose }) => {
  const [accessCode, setAccessCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [joinedClass, setJoinedClass] = useState(null);
  
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.classes);
  
  const isLoading = status === 'loading';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!accessCode.trim()) {
      return;
    }

    // REQUIRED CHANGE: The action payload should use the raw, trimmed accessCode
    dispatch(joinClass(accessCode.trim()))
      .unwrap()
      .then((classData) => {
        setJoinedClass(classData);
        setShowSuccess(true);
        setAccessCode('');
      })
      .catch(() => {
        // Error is handled by Redux
      });
  };

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  if (showSuccess && joinedClass) {
    return (
      <div className="modal-success">
        <div className="success-icon">🎉</div>
        <h3>Successfully Joined Class!</h3>
        <div className="success-details">
          <p><strong>Class:</strong> {joinedClass.title}</p>
          <p><strong>Subject:</strong> {joinedClass.subject}</p>
          <p><strong>Instructor:</strong> {joinedClass.instructorName}</p>
        </div>
        <div className="modal-actions">
          <Button 
            onClick={handleClose} 
            variant="primary"
            size="large"
          >
            Go to Class
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="join-class-modal">
      <div className="modal-description">
        <p>Enter the access code provided by your instructor to join their class.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="modal-form">
        <InputField
          label="Access Code"
          type="text"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)} 
          placeholder="e.g., ABC123"
          required
          disabled={isLoading}
          maxLength={6}
        />
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="modal-actions">
          <Button 
            type="submit" 
            variant="success" 
            size="large"
            disabled={isLoading || !accessCode.trim()}
            className="submit-btn"
          >
            {isLoading ? 'Joining...' : 'Join Class'}
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

export default JoinClassModal;