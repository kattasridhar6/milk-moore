import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
      setOrders(Array.isArray(savedOrders) ? savedOrders : []);
    } catch (error) {
      console.error('Error loading orders from localStorage:', error);
      setOrders([]);
    }
  }, []);

  const handleGeneratePDF = (order, index) => {
  const doc = new jsPDF();
  const address = order?.address || {};
  const items = Array.isArray(order?.items) ? order.items : [];

  doc.setFontSize(16);
  doc.text(`Order #${index + 1}`, 14, 20);

  doc.setFontSize(12);
  doc.text(`Name: ${address.name || 'N/A'}`, 14, 30);
  doc.text(`Phone: ${address.phone || 'N/A'}`, 14, 37);
  doc.text(`Address: ${address.street || 'N/A'}, ${address.city || 'N/A'}, ${address.pincode || 'N/A'}`, 14, 44);
  doc.text(`Ordered On: ${order?.date || 'Unknown'}`, 14, 51);

  autoTable(doc, {
    startY: 60,
    head: [['Product', 'Price', 'Quantity', 'Unit']],
    body: items.map(item => [
      item?.name || 'Unknown',
      `INR ${item?.price || 0}`,
      item?.quantity || 0,
      item?.unit || '',
    ]),
  });

  doc.text(`Total: INR ${order?.total || 0}`, 14, doc.lastAutoTable.finalY + 10);

  // Create blob and open in new tab
  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, '_blank');
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {orders.map((order, index) => {
            const address = order?.address || {};
            const items = Array.isArray(order?.items) ? order.items : [];

            return (
              <div key={index} className="border p-3 rounded shadow bg-white w-full text-sm">
                <h3 className="text-md font-semibold mb-1">Order #{index + 1}</h3>
                <p><strong>Name:</strong> {address.name || 'N/A'}</p>
                <p><strong>Address:</strong> {address.street || 'N/A'}, {address.city || 'N/A'}, {address.pincode || 'N/A'}</p>
                <p><strong>Phone:</strong> {address.phone || 'N/A'}</p>

                <p className="mt-2 font-semibold">Items:</p>
                <ul className="list-disc ml-5">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item?.name || 'Unknown'} - ₹{item?.price || 0} × {item?.quantity || 0} ({item?.unit || ''})
                    </li>
                  ))}
                </ul>

                <p className="mt-2"><strong>Total:</strong> ₹{order?.total || 0}</p>
                <p><strong>Ordered On:</strong> {order?.date || 'Unknown'}</p>

                <button
                  onClick={() => handleGeneratePDF(order, index)}
                  className="mt-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Generate PDF
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
