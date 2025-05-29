import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

const Register = ({ onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [hint1, setHint1] = useState('');
  const [hint2, setHint2] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Convert file to base64 string
  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const base64 = await toBase64(compressedFile);
        setImageFile(base64);
        setPreviewUrl(base64);
      } catch (err) {
        console.error('Image compression error:', err);
        alert('Failed to compress image. Try a smaller file.');
      }
    } else {
      setImageFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !username.trim() || !password || !retypePassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== retypePassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:1200/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          username,
          password,
          hint1,
          hint2,
          imageUrl: imageFile, // base64 string
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      setLoading(false);
      alert('Registration successful! You can now login.');
      onRegisterSuccess && onRegisterSuccess();
    } catch (err) {
      setError('Network error, please try again.');
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: '1rem',
    marginBottom: 16,
    boxSizing: 'border-box',
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name *"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Username *"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password *"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Retype Password *"
            value={retypePassword}
            onChange={e => setRetypePassword(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Password Reset Hint 1"
            value={hint1}
            onChange={e => setHint1(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Password Reset Hint 2"
            value={hint2}
            onChange={e => setHint2(e.target.value)}
            style={inputStyle}
          />

          <label style={{ marginBottom: 8, fontWeight: '600' }}>Upload Profile Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: 16 }}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 16 }}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? '#a0d6a0' : '#4caf50',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg, #71b7e6, #9b59b6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    padding: 40,
    width: '100%',
    maxWidth: 480,
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: 32,
    color: '#333',
    fontWeight: '700',
    fontSize: '2rem',
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
  button: {
    padding: '14px 0',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1.1rem',
    border: 'none',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
    transition: 'background-color 0.3s ease',
  },
};

export default Register;
