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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-5">
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-8 text-center">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-4"
          style={{ width: '100px', height: 'auto' }}
        />
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200"
          >
            Sign Up
          </button>

          {errorMsg && (
            <p className="text-red-600 text-sm mt-1">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-green-600 text-sm mt-1">{successMsg}</p>
          )}
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-700 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
