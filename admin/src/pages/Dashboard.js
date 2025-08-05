import React from 'react';
import LChart from '../components/LChart';
import Dchart from '../components/Dchart';
import DTable from '../components/DTable';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Welcome to the Dashboard</h2>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Milk Delivered</h3>
          <p>View and manage your orders</p>
        </div>
        <div className="card">
          <h3>Pending Bills</h3>
          <p>Track your active plans</p>
        </div>
        <div className="card">
          <h3>Total Customers</h3>
          <p>Billing history and invoices</p>
        </div>
        <div className="card">
          <h3>Active Subscriptions</h3>
          <p>Connected partners overview</p>
        </div>
        <div className="card">
          <h3>Monthly Revenue</h3>
          <p>Connected partners overview</p>
        </div>
        <div className="card">
          <h3>Delivery Partners</h3>
          <p>Connected partners overview</p>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Milk Consumption</h2>

      <div className="charts">
        <LChart />
        <Dchart />
      </div>
      <div>
        <h2 style={{ marginTop: '2rem' }}>UpComming Deliveries</h2>
      </div>
      <div >
        <DTable/>
      </div>
    </div>
  );
};

export default Dashboard;

