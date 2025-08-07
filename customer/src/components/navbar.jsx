import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo2 from '../img/logo2.jpg';

const Navbar = ({ cartCount, setCartCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <nav className="bg-amber-200 text-ash px-6 py-[8px] shadow-md font-bold text-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="flex items-center space-x-2 text-gray-700 hover:text-black">
          <img src={logo2} alt="Logo2" className="w-[45px] h-[42px] rounded-full" />
          <span>MILK MOORE</span>
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/home" className="text-gray-700 hover:text-black">Home</Link>
          <Link to="/products" className="text-gray-700 hover:text-black">Products</Link>
          <Link to="/cart" className="relative text-gray-700 hover:text-black">
            Cart 🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/order-history" className="text-gray-700 hover:text-black">Order History</Link>
          <Link to="/about" className="text-gray-700 hover:text-black">About Us</Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
