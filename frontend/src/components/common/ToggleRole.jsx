import React from 'react';
import './ToggleRole.css';

const ToggleRole = ({ role, setRole, disabled = false }) => {
  return (
    <div className="toggle-role">
      <div className="toggle-container">
        <label className={`toggle-option ${role === 'student' ? 'active' : ''} ${disabled ? 'disabled' : ''}`}>
          <input
            type="radio"
            name="role"
            value="student"
            checked={role === 'student'}
            onChange={() => !disabled && setRole('student')}
            disabled={disabled}
          />
          <span className="toggle-label">
            <span className="toggle-icon">🎓</span>
            Student
          </span>
        </label>
        
        <label className={`toggle-option ${role === 'instructor' ? 'active' : ''} ${disabled ? 'disabled' : ''}`}>
          <input
            type="radio"
            name="role"
            value="instructor"
            checked={role === 'instructor'}
            onChange={() => !disabled && setRole('instructor')}
            disabled={disabled}
          />
          <span className="toggle-label">
            <span className="toggle-icon">👨‍🏫</span>
            Instructor
          </span>
        </label>
      </div>
    </div>
  );
};

export default ToggleRole;