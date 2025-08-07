import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`fixed top-12 left-0 h-[calc(100vh-48px)] w-[220px] bg-[#2c2f48] pt-4 z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <ul className="list-none m-0 p-0 space-y-1">
        <li>
          <Link
            className="block w-[90%] px-3 py-2 text-sm text-gray-300 font-medium rounded hover:bg-[#3b3e5a] hover:text-white transition"
            to="/dashboard"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            className="block w-[90%] px-3 py-2 text-sm text-gray-300 font-medium rounded hover:bg-[#3b3e5a] hover:text-white transition"
            to="/Stock"
          >
            Stock
          </Link>
        </li>
        <li>
          <Link
            className="block w-[90%] px-3 py-2 text-sm text-gray-300 font-medium rounded hover:bg-[#3b3e5a] hover:text-white transition"
            to="/Products"
          >
            Products
          </Link>
        </li>
        <li>
          <Link
            className="block w-[90%] px-3 py-2 text-sm text-gray-300 font-medium rounded hover:bg-[#3b3e5a] hover:text-white transition"
            to="/partners"
          >
            My Partners
          </Link>
        </li>
        <li>
          <Link
            className="block w-[90%] px-3 py-2 text-sm text-gray-300 font-medium rounded hover:bg-[#3b3e5a] hover:text-white transition"
            to="/orders"
          >
            Orders
          </Link>
        </li>
        <li>
          <Link
            className="block w-[90%] px-3 py-2 text-sm text-gray-300 font-medium rounded hover:bg-[#3b3e5a] hover:text-white transition"
            to="/bills"
          >
            Bills & Invoices
          </Link>
        </li>
        <li>
          <Link
            className="block w-[90%] px-3 py-2 text-sm text-gray-300 font-medium rounded hover:bg-[#3b3e5a] hover:text-white transition"
            to="/calendar"
          >
            Delivery Calendar
          </Link>
        </li>
        <li>
          <Link
            className="block w-[90%] px-3 py-2 text-sm text-gray-300 font-medium rounded hover:bg-[#3b3e5a] hover:text-white transition"
            to="/wallet"
          >
            Wallet
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
