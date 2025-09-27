import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  onClick, 
  hover = true,
  padding = 'medium',
  ...props 
}) => {
  const paddingClasses = {
    none: 'card-padding-none',
    small: 'card-padding-small',
    medium: 'card-padding-medium',
    large: 'card-padding-large',
  };

  const classes = [
    'card',
    hover ? 'card-hover' : '',
    paddingClasses[padding] || paddingClasses.medium,
    onClick ? 'card-clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;