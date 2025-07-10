import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authAPI.forgotPassword(email);
      setMessage('Password reset link has been sent to your email address.');
      setEmail('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <Link to="/login" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#4A2343',
        textDecoration: 'none',
        marginBottom: '2rem'
      }}>
        <FaArrowLeft />
        Back to Login
      </Link>

      <h2 style={{
        color: '#4A2343',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        Forgot Password
      </h2>

      <p style={{
        color: '#666',
        textAlign: 'center',
        marginBottom: '2rem',
        lineHeight: '1.5'
      }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {message && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #c3e6cb'
        }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#4A2343',
            fontWeight: '500'
          }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <FaEnvelope style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666'
            }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email.trim()}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#4A2343',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: (loading || !email.trim()) ? 'not-allowed' : 'pointer',
            opacity: (loading || !email.trim()) ? 0.7 : 1,
            marginBottom: '1rem'
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div style={{
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #eee'
        }}>
          <span style={{ color: '#666' }}>Remember your password? </span>
          <Link to="/login" style={{
            color: '#4A2343',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword; 