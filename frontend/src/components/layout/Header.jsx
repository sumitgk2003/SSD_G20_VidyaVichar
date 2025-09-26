import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../common/Button.jsx';

// Assume you have a logout action in your authSlice
import { logout } from '../../app/features/authSlice.js';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-content-left">
        {/* App Logo/Name links to the default authenticated route or home */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="app-logo">
          <h1>VidyaVichara</h1>
        </Link>
      </div>

      
    </header>
  );
};

export default Header;