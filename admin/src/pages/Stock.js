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
    <div className="flex-1 mt-2">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Stock</h2>

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
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        {showCard ? 'Close' : 'Add Stock'}
      </button>

      {showCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={cardRef}
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4"
          >
            <h3 className="text-xl font-semibold mb-2">{editMode ? 'Edit Milk Stock' : 'Add Milk Stock'}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">Milk Type</label>
              <select
                className="w-full mt-1 border rounded px-3 py-2"
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity (Litres | Kilograms)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2"
                placeholder="e.g., 10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Procured From</label>
              <input
                type="text"
                value={procuredFrom}
                onChange={(e) => setProcuredFrom(e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2"
                placeholder="Supplier name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Procurement</label>
              <input
                type="date"
                value={procurementDate}
                onChange={(e) => setProcurementDate(e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <button
              onClick={handleAddStock}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {editMode ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {/* Grouped Stock Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Object.entries(groupedStock).map(([milkType, totalQuantity]) => (
          <div key={milkType} className="bg-white rounded shadow p-4">
            <h4 className="text-lg font-semibold">{milkType}</h4>
            <p className="text-gray-600">
              <strong>Total Quantity:</strong> {totalQuantity} Litres | Kilograms
            </p>
          </div>
        ))}
      </div>

      {/* Stock History Table */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4 text-gray-700">Stock Procurement History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white shadow">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 border">Milk Type</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Procured From</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockList.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="px-4 py-2 border">{item.milk_type}</td>
                  <td className="px-4 py-2 border">{item.quantity}</td>
                  <td className="px-4 py-2 border">{item.procured_from || '-'}</td>
                  <td className="px-4 py-2 border">{item.procurement_date || '-'}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
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
    </div>
  );
};

export default Stock;
