import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './components/home';
import Navbar from './components/navbar';
import Login from './components/login';
import Products from './components/products';
import Cart from './components/cart';
import OrderHistory from './components/orderhistory';

import './App.css';

const getInitialAuth = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuth);
  const [cartCount, setCartCount] = useState(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.length;
  });

  const location = useLocation();
  const showNavbar = isAuthenticated && location.pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar cartCount={cartCount} setCartCount={setCartCount} />}
      <Routes>
        <Route
          path="/"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/" replace />}
        />
        <Route
          path="/products"
          element={isAuthenticated ? <Products setCartCount={setCartCount} /> : <Navigate to="/" replace />}
        />
        <Route path="/cart" element={<Cart setCartCount={setCartCount} />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
}

export default App;
