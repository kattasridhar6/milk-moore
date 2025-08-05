import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Stock = () => {
  const [showCard, setShowCard] = useState(false);
  const [milkType, setMilkType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [procuredFrom, setProcuredFrom] = useState('');
  const [procurementDate, setProcurementDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [stockList, setStockList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    fetchStock();
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        closeCard();
      }
    };
    if (showCard) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCard]);

  const fetchStock = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/milk-inventory/');
      setStockList(response.data);
    } catch (error) {
      console.error("Error fetching stock:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/');
      setProductOptions(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const closeCard = () => {
    setShowCard(false);
    setEditMode(false);
    setEditItem(null);
    setMilkType('');
    setQuantity('');
    setProcuredFrom('');
    setProcurementDate(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
  };

  const handleAddStock = async () => {
    if (!milkType || !quantity || !procuredFrom || !procurementDate) {
      alert("Please fill all fields.");
      return;
    }

    const payload = {
      milk_type: milkType,
      quantity: parseFloat(quantity),
      procured_from: procuredFrom,
      procurement_date: procurementDate,
    };

    try {
      if (editMode && editItem) {
        await axios.put(`http://localhost:8000/api/milk-inventory/${editItem.id}/`, payload);
      } else {
        await axios.post('http://localhost:8000/api/milk-inventory/add/', payload);
      }

      closeCard();
      fetchStock();
    } catch (error) {
      console.error("Error adding/updating stock:", error);
    }
  };

  const handleEdit = (item) => {
    setMilkType(item.milk_type);
    setQuantity(item.quantity);
    setProcuredFrom(item.procured_from || '');
    setProcurementDate(item.procurement_date || '');
    setEditItem(item);
    setEditMode(true);
    setShowCard(true);
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/milk-inventory/${itemId}/`);
      fetchStock();
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  const groupedStock = stockList.reduce((acc, item) => {
    if (!acc[item.milk_type]) {
      acc[item.milk_type] = 0;
    }
    acc[item.milk_type] += item.quantity;
    return acc;
  }, {});

  return (
    <div className="sub-container">
      <h2 className="my-admin-title">Stock</h2>
      <button
        onClick={() => {
          setShowCard(!showCard);
          setEditMode(false);
          setEditItem(null);
          setMilkType('');
          setQuantity('');
          setProcuredFrom('');
          setProcurementDate(() => {
            const today = new Date();
            return today.toISOString().split('T')[0];
          });
        }}
        className="my-admin-button"
      >
        {showCard ? 'Close' : 'Add Stock'}
      </button>

      {showCard && (
        <div className="card-overlay">
          <div className="floating-stock-card" ref={cardRef}>
            <h3>{editMode ? 'Edit Milk Stock' : 'Add Milk Stock'}</h3>

            <label>Milk Type:</label>
            <select
              value={milkType}
              onChange={(e) => setMilkType(e.target.value)}
              disabled={editMode}
            >
              <option value="">-- Select Milk Type --</option>
              {productOptions.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>

            <label>Quantity (Litres | Kilograms):</label>
            <input
              className="float-card-input"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 10"
            />

            <label>Procured From:</label>
            <input className="float-card-input"
              type="text"
              value={procuredFrom}
              onChange={(e) => setProcuredFrom(e.target.value)}
              placeholder="Supplier name"
            />

            <label>Date of Procurement:</label>
            <input className="float-card-input"
              type="date"
              value={procurementDate}
              onChange={(e) => setProcurementDate(e.target.value)}
            />

            <button onClick={handleAddStock} className="submit-button">
              {editMode ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {Object.keys(groupedStock).length > 0 && (
        <div className="stock-card-container">
          {Object.entries(groupedStock).map(([milkType, totalQuantity]) => (
            <div className="stock-display-card" key={milkType}>
              <h4>{milkType}</h4>
              <p><strong>Total Quantity:</strong> {totalQuantity} Litres | Kilograms</p>
            </div>
          ))}
        </div>
      )}

      {stockList.length > 0 && (
        <div className="stock-history-table">
          <h3 className="table-heading">Stock Procurement History</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Milk Type</th>
                <th>Quantity</th>
                <th>Procured From</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockList.map(item => (
                <tr key={item.id}>
                  <td>{item.milk_type}</td>
                  <td>{item.quantity}</td>
                  <td>{item.procured_from || '-'}</td>
                  <td>{item.procurement_date || '-'}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(item.id)}>Delete</button>
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

export default Stock;
