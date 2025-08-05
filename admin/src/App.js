import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import './App.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Orders from './pages/Orders';
import Stock from './pages/Stock';
import Products from './pages/Products';
import Partners from './pages/Partners';
import Bills from './pages/Bills';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Wallet from './pages/Wallet';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const now = Date.now() / 1000;

        if (decoded.exp > now) {
          setIsAuthenticated(true);
        } else {
          // Token expired
          handleLogout();
        }
      } catch (err) {
        // Invalid token
        handleLogout();
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      {isAuthenticated ? (
        <>
          <Navbar
            setIsAuthenticated={setIsAuthenticated}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <Sidebar isOpen={sidebarOpen} />
          <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/Stock" element={<Stock />} />
              <Route path="/Products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/bills" element={<Bills />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/about" element={<About />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="*" element={<Navigate to="/dashboard" />} /> 
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
