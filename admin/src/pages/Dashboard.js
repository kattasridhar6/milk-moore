import React from 'react';
import LChart from '../components/LChart';
import Dchart from '../components/Dchart';
import DTable from '../components/DTable';

const Dashboard = () => {
  return (
    <div className="flex-1 mt-3">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome to the Dashboard</h2>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Milk Delivered</h3>
          <p className="text-gray-500">View and manage your orders</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Pending Bills</h3>
          <p className="text-gray-500">Track your active plans</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Total Customers</h3>
          <p className="text-gray-500">Billing history and invoices</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Active Subscriptions</h3>
          <p className="text-gray-500">Connected partners overview</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Monthly Revenue</h3>
          <p className="text-gray-500">Connected partners overview</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Delivery Partners</h3>
          <p className="text-gray-500">Connected partners overview</p>
        </div>
      </div>

      {/* Charts Section */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Milk Consumption</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-4 rounded-lg shadow">
          <LChart />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <Dchart />
        </div>
      </div>

      {/* Upcoming Deliveries Table */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Deliveries</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <DTable />
      </div>
    </div>
  );
};

export default Dashboard;
