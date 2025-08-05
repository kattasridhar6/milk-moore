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
    <div className="sub-container">
      <h2 className="my-admin-title">Billing</h2>

      <button className="my-admin-button" onClick={() => setShowCard(!showCard)}>
        {showCard ? 'Close' : 'Add Bill Item'}
      </button>

      {showCard && (
        <div className="card-overlay">
          <div className="floating-stock-card" ref={cardRef}>
            <h3>Add Bill Item</h3>
            <form onSubmit={handleAddToBill}>
              <label>Customer Name:</label>
              <input
                className="float-card-input"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />

              <label>Bill Date:</label>
              <input
                className="float-card-input"
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                required
              />

              <label>Product:</label>
              <select
                className="float-card-input"
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

              <label>Quantity:</label>
              <input
                className="float-card-input"
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />

              <button type="submit" className="submit-button">Add to Bill</button>
            </form>
          </div>
        </div>
      )}

      {billItems.length > 0 && (
        <div className="stock-history-table">
          <h3 className="table-heading">Current Bill</h3>
          <p><strong>Customer:</strong> {customerName || '-'}</p>
          <p><strong>Date:</strong> {billDate}</p>

          <table className="styled-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>₹{item.unitPrice}</td>
                  <td>₹{item.subtotal}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleRemoveItem(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
          <button className="submit-button" onClick={generatePDF}>Generate PDF</button>
        </div>
      )}

      {billHistory.length > 0 && (
        <div className="stock-history-table">
          <h3 className="table-heading">Bill History</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {billHistory.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.customer_name}</td>
                  <td>{bill.bill_date}</td>
                  <td>₹{bill.total_amount.toFixed(2)}</td>
                  <td>
                    <button className="view-button" onClick={() => generatePDFfromHistory(bill)}>View</button>
                    <button className="delete-button" onClick={() => handleDeleteBill(bill.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Bills;
