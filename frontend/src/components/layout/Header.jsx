import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../common/Button';
import { logout } from '../../app/features/authSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout(role));
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="logo-link">
            <h1 className="app-logo">VidyaVichara</h1>
          </Link>
        </div>

        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-section">
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">
                  {role === 'instructor' ? '👨‍🏫' : '🎓'} {role}
                </span>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="small"
                className="logout-btn"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">
                <Button variant="outline" size="small">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="small">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;