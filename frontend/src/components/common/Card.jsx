import React from 'react';

// A simple, reusable container component
const Card = ({ children, className, onClick }) => {
  return (
    <div className={`card ${className || ''}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;