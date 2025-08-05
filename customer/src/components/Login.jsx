import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      alert('Login successful!');
      // redirect logic if needed
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">User Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="login-input"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="login-input"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Logoin</button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
