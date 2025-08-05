// src/pages/Orders.js
import React, { useState } from 'react';

const Orders = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderType, setOrderType] = useState('Subscription');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="sub-container">
      {/* Tab buttons */}
      <div className="tabs">
        <button className="tab active-tab">☰ Orders</button>
        <button className="tab">🧑‍💼 Schedule Orders to Partners</button>
      </div>

      {/* Filters Row */}
      <div className="filters-row">
        {/* Date Pickers */}
        <div className="date-group">
          <label>Start date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div className="date-group">
          <label>End date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        {/* Order Type Dropdown */}
        <div className="dropdown-group">
          <label>Order Type</label>
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <option>Subscription</option>
            <option>One-time</option>
            <option>Preorder</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search by Product, Area,..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Export Buttons */}
        <button className="export-button">⬇ Download CSV</button>
        <button className="export-button">✈ Invoice PDF</button>
      </div>
    </div>
  );
};

export default Orders;
