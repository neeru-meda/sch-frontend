
import React, { useState } from 'react';
import styles from './LoginPanel.module.css';
import { authAPI } from '../../services/api';

const logo = '/stud-collab1.png'; // White PNG logo with transparent background
const illustration = '/right.jpg';

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  );
};

const LoginPanel = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Modal state
  const [modal, setModal] = useState(null); // 'forgot' | 'signup' | null
  // Forgot password state
  const [forgotValue, setForgotValue] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');
  // Signup state
  const [signup, setSignup] = useState({ username: '', email: '', password: '' });
  const [signupMsg, setSignupMsg] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!form.username || !form.password) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await authAPI.login(form);
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      // Fetch user profile
      const profileRes = await authAPI.getProfile();
      // Optionally, you can store user in Redux here if needed
      setSuccess(true);
      setError('');
      setTimeout(() => {
        window.location.href = '/';
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handlers
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotMsg('');
    setForgotError('');
    if (!forgotValue) {
      setForgotError('Please enter your email or username.');
      return;
    }
    setTimeout(() => {
      setForgotMsg('Reset link sent! Check your email.');
    }, 900);
  };

  // Signup Handlers
  const handleSignupChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
    setSignupError('');
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupMsg('');
    setSignupError('');
    if (!signup.username || !signup.email || !signup.password) {
      setSignupError('Please fill all fields.');
      return;
    }
    setSignupLoading(true);
    try {
      await authAPI.register({
        username: signup.username,
        email: signup.email,
        password: signup.password,
      });
      setSignupMsg('Account created! You can now log in.');
      setSignup({ username: '', email: '', password: '' });
    } catch (err) {
      setSignupError(err.response?.data?.detail || err.response?.data?.message || 'Registration failed');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={modal ? styles.leftPanel + ' ' + styles.modalOpen : styles.leftPanel}>
        <div className={styles.leftContent}>
          <img src={logo} alt="CollabNest Logo" className={styles.logo} />
          <div className={styles.title}>CollabNest</div>
          <div className={styles.tagline}>Where Students Build Together.</div>
          <div className={styles.loginSection}>
            <div className={styles.loginHeading}>Login</div>
            <div className={styles.loginSubtext}>Enter your account details</div>
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <div style={{ color: '#fff', background: '#c33', borderRadius: 6, padding: '8px 12px', marginBottom: 12, width: '100%', textAlign: 'center', fontSize: 14 }}>{error}</div>}
              {success && <div style={{ color: '#fff', background: '#4caf50', borderRadius: 6, padding: '8px 12px', marginBottom: 12, width: '100%', textAlign: 'center', fontSize: 14 }}>Login successful! Redirecting...</div>}
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                className={styles.input}
                autoComplete="username"
                required
                disabled={loading}
              />
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={styles.input}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div className={styles.forgotRow}>
                <button type="button" className={styles.forgotLink} onClick={() => setModal('forgot')} disabled={loading}>Forgot Password?</button>
              </div>
              <button type="submit" className={styles.loginBtn} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className={styles.signupRow}>
              <span>Don't have an account?</span>
              <button className={styles.signupLink} onClick={() => setModal('signup')} disabled={loading}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
      <div className={modal ? styles.rightPanel + ' ' + styles.modalOpen : styles.rightPanel}>
        <div className={styles.rightContent}>
          <h1 className={styles.welcomeHeading}>Welcome to <span className={styles.brandHighlight}>CollabNest</span></h1>
          <div className={styles.welcomeSubheading}>Join your peers to post, explore, and grow—together.</div>
          <img src={illustration} alt="Students collaborating" className={styles.illustration} />
        </div>
      </div>
      {/* Forgot Password Modal */}
      <Modal open={modal === 'forgot'} onClose={() => { setModal(null); setForgotValue(''); setForgotMsg(''); setForgotError(''); }}>
        <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Forgot Password</h2>
        <form onSubmit={handleForgotSubmit}>
          <input
            type="text"
            placeholder="Email or Username"
            value={forgotValue}
            onChange={e => { setForgotValue(e.target.value); setForgotError(''); setForgotMsg(''); }}
            className={styles.input}
            style={{ marginBottom: 12 }}
            autoFocus
          />
          {forgotError && <div style={{ color: '#fff', background: '#c33', borderRadius: 6, padding: '6px 10px', marginBottom: 10, fontSize: 14 }}>{forgotError}</div>}
          {forgotMsg && <div style={{ color: '#fff', background: '#4caf50', borderRadius: 6, padding: '6px 10px', marginBottom: 10, fontSize: 14 }}>{forgotMsg}</div>}
          <button type="submit" className={styles.loginBtn} style={{ marginBottom: 0 }}>Send Reset Link</button>
        </form>
      </Modal>
      {/* Sign Up Modal */}
      <Modal open={modal === 'signup'} onClose={() => { setModal(null); setSignup({ username: '', email: '', password: '' }); setSignupMsg(''); setSignupError(''); }}>
        <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Sign Up</h2>
        <form onSubmit={handleSignupSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={signup.username}
            onChange={handleSignupChange}
            className={styles.input}
            style={{ marginBottom: 10 }}
            autoFocus
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signup.email}
            onChange={handleSignupChange}
            className={styles.input}
            style={{ marginBottom: 10 }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signup.password}
            onChange={handleSignupChange}
            className={styles.input}
            style={{ marginBottom: 12 }}
          />
          {signupError && <div style={{ color: '#fff', background: '#c33', borderRadius: 6, padding: '6px 10px', marginBottom: 10, fontSize: 14 }}>{signupError}</div>}
          {signupMsg && <div style={{ color: '#fff', background: '#4caf50', borderRadius: 6, padding: '6px 10px', marginBottom: 10, fontSize: 14 }}>{signupMsg}</div>}
          <button type="submit" className={styles.loginBtn} style={{ marginBottom: 0 }} disabled={signupLoading}>{signupLoading ? 'Creating...' : 'Sign Up'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default LoginPanel; 