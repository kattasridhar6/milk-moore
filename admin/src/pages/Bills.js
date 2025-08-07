import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Bills = () => {
  const [products, setProducts] = useState([]);
  const [stockData, setStockData] = useState({});
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [billHistory, setBillHistory] = useState(() => {
    const saved = localStorage.getItem('billHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const cardRef = useRef(null);
  const API_BASE = 'http://localhost:8000/api';

  useEffect(() => {
    fetch(`${API_BASE}/products/`)
      .then(res => res.json())
      .then(data => setProducts(data));

    fetch(`${API_BASE}/milk-inventory/`)
      .then(res => res.json())
      .then(data => {
        const stockMap = {};
        data.forEach(item => {
          const key = item.milk_type;
          stockMap[key] = (stockMap[key] || 0) + parseFloat(item.quantity);
        });
        setStockData(stockMap);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setShowCard(false);
      }
    };
    if (showCard) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCard]);

  const handleDeleteBill = (billId) => {
    const updatedHistory = billHistory.filter(b => b.id !== billId);
    setBillHistory(updatedHistory);
    localStorage.setItem('billHistory', JSON.stringify(updatedHistory));
  };

  const handleAddToBill = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product || !quantity || quantity <= 0) {
      alert("Please select product and valid quantity.");
      return;
    }

    const qty = parseFloat(quantity);
    const availableStock = stockData[product.name] || 0;

    const alreadyAddedQty = billItems
      .filter(item => item.name === product.name)
      .reduce((acc, item) => acc + item.quantity, 0);

    const totalRequestedQty = alreadyAddedQty + qty;

    if (totalRequestedQty > availableStock) {
      alert(`Not enough stock for ${product.name}. Available: ${availableStock - alreadyAddedQty} ${product.unit}`);
      return;
    }

    const unitPrice = parseFloat(product.price);
    const subtotal = unitPrice * qty;
    const existingIndex = billItems.findIndex(item => item.id === product.id);

    if (existingIndex !== -1) {
      const updatedItems = [...billItems];
      const existingItem = updatedItems[existingIndex];
      const newQty = existingItem.quantity + qty;
      const newSubtotal = unitPrice * newQty;

      updatedItems[existingIndex] = {
        ...existingItem,
        quantity: newQty,
        subtotal: newSubtotal.toFixed(2),
      };

      const prevSubtotal = parseFloat(existingItem.subtotal);
      const updatedTotal = totalAmount - prevSubtotal + newSubtotal;

      setBillItems(updatedItems);
      setTotalAmount(parseFloat(updatedTotal.toFixed(2)));
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        unit: product.unit,
        quantity: qty,
        unitPrice: unitPrice,
        subtotal: subtotal.toFixed(2),
      };

      setBillItems([...billItems, newItem]);
      setTotalAmount(prev => parseFloat((prev + subtotal).toFixed(2)));
    }

    setSelectedProductId('');
    setQuantity('');
  };

  const handleRemoveItem = (index) => {
    const removed = billItems[index];
    const newItems = billItems.filter((_, i) => i !== index);
    setBillItems(newItems);
    setTotalAmount(prev => parseFloat((prev - removed.subtotal).toFixed(2)));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Customer Bill', 14, 22);
    doc.setFontSize(12);
    doc.text(`Customer: ${customerName}`, 14, 30);
    doc.text(`Date: ${billDate}`, 14, 36);

    autoTable(doc, {
      head: [['Product', 'Qty', 'Unit', 'Price', 'Subtotal']],
      body: billItems.map(item => [
        item.name,
        item.quantity,
        item.unit,
        `INR ${item.unitPrice}`,
        `INR ${item.subtotal}`
      ]),
      startY: 45,
    });

    doc.text(`Total: INR ${totalAmount.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    const blob = doc.output('blob');
    window.open(URL.createObjectURL(blob));

    const newBill = {
      id: Date.now(),
      customer_name: customerName,
      bill_date: billDate,
      total_amount: totalAmount,
      items: billItems,
    };

    const updatedHistory = [newBill, ...billHistory];
    setBillHistory(updatedHistory);
    localStorage.setItem('billHistory', JSON.stringify(updatedHistory));

    setBillItems([]);
    setCustomerName('');
    setTotalAmount(0);
  };

  const generatePDFfromHistory = (bill) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Customer Bill', 14, 22);
    doc.setFontSize(12);
    doc.text(`Customer: ${bill.customer_name}`, 14, 30);
    doc.text(`Date: ${bill.bill_date}`, 14, 36);

    autoTable(doc, {
      head: [['Product', 'Qty', 'Unit', 'Price', 'Subtotal']],
      body: bill.items.map(item => [
        item.name,
        item.quantity,
        item.unit,
        `INR ${item.unitPrice}`,
        `INR ${item.subtotal}`
      ]),
      startY: 45,
    });

    doc.text(`Total: INR ${bill.total_amount.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    const blob = doc.output('blob');
    window.open(URL.createObjectURL(blob));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Billing</h2>

      <button
        className="mb-6 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => setShowCard(!showCard)}
      >
        {showCard ? 'Close' : 'Add Bill Item'}
      </button>

      {showCard && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div
            ref={cardRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Add Bill Item</h3>
            <form onSubmit={handleAddToBill} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Customer Name:</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Bill Date:</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="date"
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Product:</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  required
                >
                  <option value="">-- Select Product --</option>
                  {products
                    .filter((product) => (stockData[product.name] || 0) > 0)
                    .map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.unit}) - ₹{product.price} | Stock: {stockData[product.name] || 0}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Quantity:</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
              >
                Add to Bill
              </button>
            </form>
          </div>
        </div>
      )}

      {billItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Current Bill</h3>
          <p className="mb-1"><strong>Customer:</strong> {customerName || '-'}</p>
          <p className="mb-4"><strong>Date:</strong> {billDate}</p>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Qty</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Unit</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Subtotal</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {billItems.map((item, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.unit}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">₹{item.unitPrice}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">₹{item.subtotal}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        className="text-red-600 hover:text-red-800 font-semibold"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold mt-4 text-right">Total: ₹{totalAmount.toFixed(2)}</h3>
          <div className="mt-4 text-right">
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
              onClick={generatePDF}
            >
              Generate PDF
            </button>
          </div>
        </div>
      )}

      {billHistory.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Bill History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Customer</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {billHistory.map((bill) => (
                  <tr key={bill.id} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{bill.customer_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{bill.bill_date}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">₹{bill.total_amount.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={() => generatePDFfromHistory(bill)}
                      >
                        View
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 font-semibold"
                        onClick={() => handleDeleteBill(bill.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
