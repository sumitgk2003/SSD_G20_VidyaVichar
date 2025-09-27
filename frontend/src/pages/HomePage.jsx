import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import ToggleRole from '../components/common/ToggleRole';
import './HomePage.css';

const HomePage = () => {
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login', { state: { role } });
  };

  const handleSignup = () => {
    navigate('/signup', { state: { role } });
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="brand-name">VidyaVichara</span>
          </h1>
          <p className="hero-subtitle">
            Interactive Q&A sticky board for real-time classroom engagement
          </p>
          <p className="hero-description">
            Students can post questions during lectures, and instructors can view, 
            organize, and manage them as colorful sticky notes. Perfect for 
            System Design principles, Software Development, and any interactive learning.
          </p>
        </div>
        
        <div className="hero-actions">
          <div className="role-selection">
            <h3>I am a:</h3>
            <ToggleRole role={role} setRole={setRole} />
          </div>
          
          <div className="action-buttons">
            <Button 
              onClick={handleLogin} 
              variant="primary" 
              size="large"
              className="action-btn"
            >
              Login
            </Button>
            <Button 
              onClick={handleSignup} 
              variant="outline" 
              size="large"
              className="action-btn"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Real-time Questions</h3>
            <p>Students post questions during lectures without interrupting the flow</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Colorful Sticky Notes</h3>
            <p>Questions appear as vibrant sticky notes for easy visual organization</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Filtering</h3>
            <p>Instructors can filter by status, importance, and more</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Persistent Storage</h3>
            <p>All questions saved in MongoDB for later review and analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;