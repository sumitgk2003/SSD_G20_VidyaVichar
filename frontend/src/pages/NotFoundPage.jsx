import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/">
            <Button variant="primary" size="large">
              Go Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="large">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;