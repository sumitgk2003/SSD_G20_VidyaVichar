import React from 'react';

// A reusable input component with label and error handling
const InputField = ({ label, type, value, onChange, placeholder, required, error }) => {
  const inputId = `input-${label.replace(/\s/g, '-')}`;
  
  return (
    <div className="input-group">
      <label htmlFor={inputId}>{label}{required && <span className="required-star">*</span>}</label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={error ? 'input-error' : ''}
      />
      {error && <p className="input-error-message">{error}</p>}
    </div>
  );
};

export default InputField;