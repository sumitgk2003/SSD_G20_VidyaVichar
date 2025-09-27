import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import ToggleRole from '../components/common/ToggleRole';
import { register, clearError } from '../app/features/authSlice';
import './AuthPage.css';

const SignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  const [role, setRole] = useState(location.state?.role || 'student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = status === 'loading';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      return;
    }

    dispatch(register({ role, name: name.trim(), email: email.trim(), password }))
      .unwrap()
      .then(() => {
        // Registration successful, redirect to login
        navigate('/login', { 
          state: { role },
          replace: true 
        });
      })
      .catch(() => {
        // Error is handled by Redux
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Join VidyaVichara</h1>
          <p>Create your account to start engaging in interactive learning</p>
        </div>

        <div className="auth-form-container">
          <ToggleRole role={role} setRole={setRole} disabled={isLoading} />
          
          <form onSubmit={handleSubmit} className="auth-form">
            <InputField
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
            
            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
            
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              disabled={isLoading}
            />
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isLoading || !name.trim() || !email.trim() || !password.trim()}
              className="auth-submit-btn"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" state={{ role }} className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;