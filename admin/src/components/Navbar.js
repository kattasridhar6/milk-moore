import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaBell, FaComment, FaBars } from 'react-icons/fa';
import logo from '../img/logo2.jpg';

const Navbar = ({ setIsAuthenticated, sidebarOpen, setSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-left">
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
               <img src={logo} className='Logo' alt="Description" 
                style={{ width: '45px', height: '42px' , borderRadius:'60px', marginRight:'10px'}}  />
        <Link to="/" className="logo">MILK MOORE </Link>
      </div>

      <div className="navbar-center">
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/messages" className="nav-link"><FaComment /></Link>
        <Link to="/notifications" className="nav-link"><FaBell /></Link>
        <Link to="/profile" className="nav-link"><FaUser /></Link>
      </div>

      <div className="navbar-right">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="search-input"
          />
          <button className="search-btn"><FaSearch /></button>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
