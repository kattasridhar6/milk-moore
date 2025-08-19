import React, { useRef, useState, useMemo } from 'react';

// Sample orders data with full dates (YYYY-MM-DD)
const SAMPLE_ORDERS = [
  ['2024-07-20', 'Full cream', 'Madhapur', 2, 'Subscription', '5:30 AM — 7:00 AM', '128/-', 'Delivered'],
  ['2024-07-20', 'Full Toned', 'Madhapur', 1, '1-Time', '5:30 AM — 7:00 AM', '60/-', 'Delivered'],
  ['2024-07-21', 'Standard', 'Hi-tech city', 1, 'Subscription', '5:30 AM — 7:00 AM', '58/-', 'Delivered'],
  ['2024-07-22', 'Full Toned', 'Madhapur', 2, '1-Time', '5:30 AM — 7:00 AM', '118/-', 'Delivered'],
  ['2024-07-22', 'Full Toned', 'Madhapur', 2, 'Subscription', '5:30 AM — 7:00 AM', '128/-', 'Pending'],
  ['2024-07-23', 'Full cream', 'Hi-tech city', 1, 'Subscription', '6:00 AM — 8:00 AM', '64/-', 'Delivered'],
  ['2025-08-24', 'Standard', 'Gachibowli', 3, '1-Time', '5:30 AM — 7:00 AM', '174/-', 'Issues Raised'],
  ['2024-07-25', 'Full Toned', 'Kondapur', 1, 'Subscription', '6:30 AM — 8:30 AM', '64/-', 'Pending'],
  ['2024-07-20', 'Full cream', 'Madhapur', 2, 'Subscription', '5:30 AM — 7:00 AM', '128/-', 'Delivered'],
  ['2024-07-20', 'Full Toned', 'Madhapur', 1, '1-Time', '5:30 AM — 7:00 AM', '60/-', 'Delivered'],
  ['2025-08-21', 'Standard', 'Hi-tech city', 1, 'Subscription', '5:30 AM — 7:00 AM', '58/-', 'Delivered'],
  ['2024-07-22', 'Full Toned', 'Madhapur', 2, '1-Time', '5:30 AM — 7:00 AM', '118/-', 'Delivered'],
  ['2024-07-22', 'Full Toned', 'Madhapur', 2, 'Subscription', '5:30 AM — 7:00 AM', '128/-', 'Pending'],
  ['2025-07-23', 'Full cream', 'Hi-tech city', 1, 'Subscription', '6:00 AM — 8:00 AM', '64/-', 'Delivered'],
  ['2024-07-24', 'Standard', 'Gachibowli', 3, '1-Time', '5:30 AM — 7:00 AM', '174/-', 'Issues Raised'],
  ['2024-07-25', 'Full Toned', 'Kondapur', 1, 'Subscription', '6:30 AM — 8:30 AM', '64/-', 'Pending'],
];

// Format date for display
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const OrdersPage = () => {
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  const [activeTab, setActiveTab] = useState('Orders');
  const [showOrderTypeDropdown, setShowOrderTypeDropdown] = useState(false);

  // Filter logic
  const filteredOrders = useMemo(() => {
    return SAMPLE_ORDERS.filter(order => {
      // skip unused values with commas
      const [date, product, area, , type, , , status] = order;
      const orderDate = new Date(date);

      // Date range filter
      if (startDate && orderDate < new Date(startDate)) return false;
      if (endDate && orderDate > new Date(endDate)) return false;

      // Order type filter
      if (orderTypeFilter !== 'All' && type !== orderTypeFilter) return false;

      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        if (!(product.toLowerCase().includes(searchLower) ||
          area.toLowerCase().includes(searchLower))) return false;
      }

      // Sidebar filter
      if (selectedFilter === 'Pending' && status !== 'Pending') return false;
      if (selectedFilter === 'Delivered' && status !== 'Delivered') return false;
      if (selectedFilter === 'Issues Raised' && status !== 'Issues Raised') return false;
      if (selectedFilter === 'This Month') {
        const now = new Date();
        if (!(orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear())) {
          return false;
        }
      }

      return true;
    });
  }, [startDate, endDate, orderTypeFilter, searchQuery, selectedFilter]);


  // Handle CSV download
  const handleDownloadCSV = () => {
    const headers = ['Date', 'Product', 'Area', 'Qty', 'Type', 'Delivery Time', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle invoice PDF (mock functionality)
  const handleInvoicePDF = () => {
    alert('Invoice PDF generation would be implemented here. In a real app, this would generate and download a PDF invoice.');
  };

  // Handle smart assign
  const handleSmartAssign = () => {
    const pendingOrders = filteredOrders.filter(order => order[7] === 'Pending');
    if (pendingOrders.length === 0) {
      alert('No pending orders to assign.');
      return;
    }
    alert(`Smart assignment completed! ${pendingOrders.length} pending order(s) have been automatically assigned to delivery partners based on location optimization.`);
  };

  // Clear all filters
  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setOrderTypeFilter('All');
    setSearchQuery('');
    setSelectedFilter('All Orders');
    if (startDateRef.current) startDateRef.current.value = '';
    if (endDateRef.current) endDateRef.current.value = '';
  };

  return (
      <div className="flex-1 pt-4 bg-gray-100 text-gray-800 min-h-screen p-6">
        <div className="w-full flex flex-col md:flex-row gap-8">
          <main className="flex-1">
            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('Orders')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-sm font-semibold ${activeTab === 'Orders'
                    ? 'bg-white border border-blue-600 text-blue-600'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('Schedule')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${activeTab === 'Schedule'
                    ? 'bg-white border border-blue-600 text-blue-600'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
              >
                <i className="fas fa-truck"></i>
                Schedule Orders
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-center">
              {/* Start Date */}
              <div className="flex items-center gap-2">
                <label htmlFor="start-date" className="text-sm font-medium">
                  Start Date
                </label>
                <div className="relative inline-block">
                  <input
                    ref={startDateRef}
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    
                    onClick={() => startDateRef.current?.showPicker?.()}
                    className="border border-gray-300 rounded-md px-5 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  />
              
                </div>

              </div>

              {/* End Date */}
              <div className="flex items-center gap-2">
                <label htmlFor="end-date" className="text-sm font-medium">
                  End Date
                </label>
                <input
                  ref={endDateRef}
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onClick={() => endDateRef.current?.showPicker?.()}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Order Type Filter */}
              <div className="flex">
                <label className="font-medium mr-1 mt-2">Order Type  </label>
                <div
                  onClick={() => setShowOrderTypeDropdown(!showOrderTypeDropdown)}
                  className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <i className="fas fa-filter text-gray-500"></i>
                  <div className="text-sm">
                    <div className="text-gray-800 font-medium">{orderTypeFilter}</div>
                  </div>
                  <i className={`fas fa-chevron-down ml-auto text-gray-400 transition-transform ${showOrderTypeDropdown ? 'rotate-180' : ''}`}></i>
                </div>
                {showOrderTypeDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {['All', 'Subscription', '1-Time'].map(type => (
                      <div
                        key={type}
                        onClick={() => {
                          setOrderTypeFilter(type);
                          setShowOrderTypeDropdown(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md bg-white flex-1 min-w-[220px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <i className="fas fa-search text-gray-400 mr-2"></i>
                <input
                  type="search"
                  placeholder="Search by Product, Area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
                />
              </div>

              {/* Download Button */}
              <div
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-download text-blue-500"></i>
                <span className="text-sm font-medium text-gray-800">Download CSV</span>
              </div>

              {/* Invoice Button */}
              <div
                onClick={handleInvoicePDF}
                className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-file-invoice text-blue-500"></i>
                <span className="text-sm font-medium text-gray-800">Invoice PDF</span>
              </div>

              {/* Clear Filters Button */}
              {(startDate || endDate || orderTypeFilter !== 'All' || searchQuery || selectedFilter !== 'All Orders') && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  <i className="fas fa-times"></i>
                  Clear Filters
                </button>
              )}
            </div>

            {/* Results Summary */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredOrders.length} of {SAMPLE_ORDERS.length} orders
              {(startDate || endDate || orderTypeFilter !== 'All' || searchQuery || selectedFilter !== 'All Orders') &&
                ' (filtered)'
              }
            </div>

            {/* Orders Table */}
            <div className="bg-white shadow-md rounded-md overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    {['Date', 'Product', 'Area', 'Qty', 'Type', 'Delivery Time', 'Amount', 'Status', ''].map((title, i) => (
                      <th key={i} className="px-4 py-3 font-semibold text-gray-700">
                        {title || <i className="fas fa-eye" />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                        No orders found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-3 text-gray-700">
                            {j === 0 ? formatDate(cell) : // format date column
                              j === 7 ? ( // Status column
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${cell === 'Completed' ? 'bg-green-100 text-green-800' :
                                    cell === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                      cell === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                                        cell === 'Issues Raised' ? 'bg-red-100 text-red-800' :
                                          'bg-gray-100 text-gray-800'
                                  }`}>
                                  {cell}
                                </span>
                              ) : cell}
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => alert(`Viewing details for order: ${row[1]} on ${formatDate(row[0])}`)}
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            <i className="fas fa-eye" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="w-full md:w-72 flex flex-col gap-6">
            {/* Filter Options */}
            <div className="bg-white rounded-md p-4 shadow">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Filter by</h2>
              <ul className="divide-y divide-gray-200 text-sm font-medium text-gray-700">
                {['All Orders', 'This Month', 'Pending', 'Delivered', 'Issues Raised'].map((filter, index) => (
                  <li
                    key={index}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 rounded transition-colors ${selectedFilter === filter ? 'bg-blue-100 text-blue-700 font-semibold' : ''
                      }`}
                  >
                    {filter}
                    {filter !== 'All Orders' && (
                      <span className="float-right text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {filter === 'Pending' ? SAMPLE_ORDERS.filter(o => o[7] === 'Pending').length :
                          filter === 'Delivered' ? SAMPLE_ORDERS.filter(o => o[7] === 'Delivered').length :
                            filter === 'Issues Raised' ? SAMPLE_ORDERS.filter(o => o[7] === 'Issues Raised').length :
                              SAMPLE_ORDERS.length}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Smart Assign Panel */}
            <div className="bg-white rounded-md p-4 shadow">
              <button
                onClick={handleSmartAssign}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
              >
                <i className="fas fa-magic" />
                Smart Assign
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Assign filtered area orders to delivery partners based on their addresses.
                <br />
                <strong>Note:</strong> You can customize this logic!
              </p>
              <div className="mt-3 text-xs text-gray-500">
                Pending orders in current filter: {filteredOrders.filter(order => order[7] === 'Pending').length}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-md p-4 shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders:</span>
                  <span className="font-medium">{filteredOrders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">
                    {filteredOrders.filter(order => order[7] === 'Completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-medium text-yellow-600">
                    {filteredOrders.filter(order => order[7] === 'Pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-medium text-blue-600">
                    ₹{filteredOrders.reduce((sum, order) => sum + parseInt(order[6].replace('/-', '')), 0)}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      {/* Click outside handler for dropdown */}
      {showOrderTypeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowOrderTypeDropdown(false)}
        />
      )}
      </div>

  );
};

export default OrdersPage;