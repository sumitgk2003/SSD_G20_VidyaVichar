import React from 'react';
import './InputField.css';

const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  className = '',
  ...props
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`input-field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default InputField;