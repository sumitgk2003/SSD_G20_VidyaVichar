import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="modal-header">
          {title && <h3 className="modal-title">{title}</h3>}
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    // Mount the modal outside the main app flow, typically to a root element like 'modal-root'
    // You should ensure your public/index.html has a <div> with id="modal-root" or just use document.body
    document.getElementById('modal-root') || document.body
  );
};

export default Modal;