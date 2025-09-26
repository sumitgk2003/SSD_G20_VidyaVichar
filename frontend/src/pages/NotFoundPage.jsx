import React from 'react';
import { Link } from 'react-router-dom';
// Assuming Header is rendered via AppRoutes, but can be imported here if needed
// import Header from '../components/layout/Header.jsx'; 

const NotFoundPage = () => {
  return (
    // Note: We don't render <Header> here if it's already in AppRoutes.jsx
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found 😟</h2>
        <p>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="back-home-link">
          <button className="btn btn-primary">
            Go to Home Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;