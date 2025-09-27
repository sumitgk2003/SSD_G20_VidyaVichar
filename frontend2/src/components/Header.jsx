import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="logo">
            VidyaVichara
          </Link>
          
          <nav className="nav-links">
            {isAuthenticated ? (
              <div className="user-info">
                <span>Welcome, {user?.name}</span>
                <span className="role-badge">
                  {user?.role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'}
                </span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
