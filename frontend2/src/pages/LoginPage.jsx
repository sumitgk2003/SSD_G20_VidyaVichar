import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Get role from location state if available
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login({ email: email.trim(), password }, role);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Welcome Back
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
            Login as:
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`btn ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`btn ${role === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              👨‍🏫 Teacher
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '20px' }}
            disabled={loading || !email.trim() || !password.trim()}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', color: '#666' }}>
          Don't have an account?{' '}
          <Link to="/signup" state={{ role }} style={{ color: '#667eea', textDecoration: 'none' }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
