import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <ul className="sidebar-list">
        <li><Link className="sidebar-item" to="/dashboard">Dashboard mike</Link></li>
        <li><Link className="sidebar-item" to="/Stock">Stock</Link></li>
        <li><Link className="sidebar-item" to="/Products">Products</Link></li>
        <li><Link className="sidebar-item" to="/partners">My Partners</Link></li>
        <li><Link className="sidebar-item" to="/orders">Orders</Link></li>
        <li><Link className="sidebar-item" to="/bills">Bills & Invoices</Link></li>
        <li><Link className="sidebar-item" to="/calendar">Delivery Calendar</Link></li>
        <li><Link className="sidebar-item" to="/wallet">Wallet</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
