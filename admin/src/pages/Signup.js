import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../img/logo.jpg';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await axios.post('http://localhost:8000/api/signup/', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        setSuccessMsg('Signup successful! You can now login.');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        const combinedErrors = Object.values(errorData).flat().join(', ');
        setErrorMsg(combinedErrors || 'Signup failed.');
      } else {
        setErrorMsg('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
               <img src={logo} className='Logo' alt="Description" 
                style={{ width: '100px', height: 'auto' }}  />
        <h2>Create Account</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>

          {errorMsg && <p className="error">{errorMsg}</p>}
          {successMsg && <p className="success">{successMsg}</p>}
        </form>

        <p className="login-redirect">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
