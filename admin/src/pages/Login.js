import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../img/logo.jpg';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      // Use JWT token endpoint
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;

      // Save JWT tokens to localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('isAuthenticated', 'true');

      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.data?.detail) {
        setErrorMsg(error.response.data.detail); // e.g., "No active account found..."
      } else {
        setErrorMsg('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img
          src={logo}
          className="Logo"
          alt="Logo"
          style={{ width: '100px', height: 'auto' }}
        />
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {errorMsg && <p className="error">{errorMsg}</p>}
        </form>
        <p className="signup-redirect">
          Don’t have an account? <Link to="/signup">Signup here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
