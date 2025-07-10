import React, { useState } from 'react';
import styles from './LoginPage.module.css';

const capIcon = '/stud-collab1.png'; // White cap icon
const illustration = '/right.jpg';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className={styles.container}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <div className={styles.logoSection}>
            <div className={styles.capCircle}>
              <img src={capIcon} alt="CollabNest Cap Icon" className={styles.capIcon} />
            </div>
            <div className={styles.brandText}>
              <div className={styles.brandName}>CollabNest</div>
              <div className={styles.brandTagline}>Where Students Build Together.</div>
            </div>
          </div>
          <div className={styles.loginSection}>
            <div className={styles.loginHeading}>Login</div>
            <div className={styles.loginSubtext}>Enter your account details</div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                  placeholder="Username"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.showPasswordBtn}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div className={styles.forgotRow}>
                <a href="#" className={styles.forgotLink}>Forgot Password?</a>
              </div>
              <button type="submit" className={styles.loginBtn}>Login</button>
            </form>
            <div className={styles.signupRow}>
              <span>Don't have an account?</span>
              <a href="#" className={styles.signupLink}>Sign Up</a>
            </div>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className={styles.right}>
        <img src={illustration} alt="Students collaborating" className={styles.illustrationBg} />
        <div className={styles.rightOverlay}>
          <h1 className={styles.welcomeHeading}>Welcome to CollabNest</h1>
          <p className={styles.welcomeSubheading}>Join your peers to post, explore, and grow—together.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 