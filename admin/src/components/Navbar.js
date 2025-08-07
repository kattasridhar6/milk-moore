import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaBell, FaComment, FaBars } from 'react-icons/fa';
import logo from '../img/logo2.jpg';

const Navbar = ({ setIsAuthenticated, sidebarOpen, setSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // ✅ Clear token and any other data
    setIsAuthenticated(false);
    navigate('/login');   // ✅ Navigate to login page without reload
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1f1f2e] text-white flex items-center justify-between px-6 py-1.5 h-15 shadow-md">
      {/* Left: Logo and Toggle */}
      <div className="flex items-center text-white font-bold text-lg">
        <button
          className="mr-3 text-xl text-white focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <img
          src={logo}
          alt="Logo"
          className="w-[45px] h-[42px] rounded-full mr-2"
        />
        <Link to="/" className="text-white text-xl font-bold">
          MILK MOORE
        </Link>
      </div>

      {/* Center: Nav Links */}
      <div className="hidden md:flex items-center gap-8 text-white font-semibold text-sm">
        <Link to="/about" className="hover:text-blue-400 transition">
          About
        </Link>
        <Link to="/messages" className="hover:text-blue-400 transition">
          <FaComment />
        </Link>
        <Link to="/notifications" className="hover:text-blue-400 transition">
          <FaBell />
        </Link>
        <Link to="/profile" className="hover:text-blue-400 transition">
          <FaUser />
        </Link>
      </div>

      {/* Right: Search + Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-white rounded-full px-3 h-[34px] shadow-md w-[268px] focus-within:shadow-outline transition-shadow">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="flex-1 text-gray-800 bg-transparent focus:outline-none text-sm placeholder-gray-400"
          />
          <button className="text-blue-500 hover:text-blue-600">
            <FaSearch />
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-semibold transition text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
