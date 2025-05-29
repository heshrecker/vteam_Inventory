import React, { useState } from 'react';

const Login = ({ onLoginSuccess, onSwitchToRegister, onForgotPassword }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://192.168.127.15:1200/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      const user = await res.json();
      setLoading(false);
      onLoginSuccess(user);
    } catch (err) {
      setError('Network error, please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
          src="/Logo.png"
          alt="Logo"
          style={{
            display: 'block',
            margin: '0 auto 24px',
            maxWidth: 120,
            height: 'auto',
            borderRadius: 8,
          }}
        />

        <h2 style={styles.title}>Sign In</h2>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Username
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={styles.input}
              autoComplete="username"
              placeholder="Enter your username"
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </label>

          <div style={styles.showPasswordContainer}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              id="showPass"
              style={{ marginRight: 8 }}
            />
            <label htmlFor="showPass" style={styles.showPasswordLabel}>Show Password</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? '#a0d6a0' : '#4caf50',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.linksContainer}>
          <button onClick={onSwitchToRegister} style={styles.linkButton}>
            Register
          </button>
          <span style={styles.linkSeparator}>|</span>
          <button onClick={onForgotPassword} style={styles.linkButton}>
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    background:
      'linear-gradient(135deg, #71b7e6, #9b59b6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    padding: 50,
    width: '100%',
    maxWidth: 500,
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: 24,
    color: '#333',
    fontWeight: '700',
    fontSize: '1.8rem',
    textAlign: 'center',
  },
  error: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: 16,
    color: '#555',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  input: {
    marginTop: 8,
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    outline: 'none',
  },
  showPasswordContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 24,
  },
  showPasswordLabel: {
    color: '#555',
    fontSize: '0.9rem',
    userSelect: 'none',
  },
  button: {
    padding: '14px 0',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1rem',
    border: 'none',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
    transition: 'background-color 0.3s ease',
  },
  linksContainer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#4caf50',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0 8px',
    textDecoration: 'underline',
    fontSize: '1rem',
  },
  linkSeparator: {
    color: '#ccc',
  },
};

export default Login;
