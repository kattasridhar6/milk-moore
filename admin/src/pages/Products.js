import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kilograms');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef(null);

  const API_URL = 'http://localhost:8000/api/products/';

  useEffect(() => {
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

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const closeCard = () => {
    setShowCard(false);
    setEditingProduct(null);
    setProductName('');
    setPrice('');
    setUnit('kilograms');
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    if (!productName || !price) return;

    const payload = {
      name: productName,
      price: parseFloat(price),
      unit,
    };

    try {
      if (editingProduct) {
        const res = await axios.put(`${API_URL}${editingProduct.id}/`, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? res.data : p))
        );
      } else {
        const res = await axios.post(API_URL, payload);
        setProducts([...products, res.data]);
      }
      closeCard();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setPrice(product.price.toString());
    setUnit(product.unit);
    setShowCard(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const formatUnit = (unit) => {
    if (unit === 'kilograms') return 'Kilogram';
    if (unit === 'liters') return 'Liter';
    return unit;
  };

  return (
    <div className="sub-container">
      <h2 className="my-admin-title">Products</h2>
      <button
        onClick={() => {
          setShowCard(!showCard);
          setEditingProduct(null);
          setProductName('');
          setPrice('');
          setUnit('kilograms');
        }}
        className="my-admin-button"
      >
        {showCard ? 'Close' : 'Add Product'}
      </button>

      {showCard && (
        <div className="card-overlay">
          <div className="floating-stock-card" ref={cardRef}>
            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>

            <form onSubmit={handleAddOrUpdateProduct}>
              <label>Product Name:</label>
              <input
                className="float-card-input"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Toned Milk"
                required
              />

              <label>Price (₹):</label>
              <input
                className="float-card-input"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price Per Kilogram/Liter"
                required
              />

              <label>Unit:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="kilograms"
                    checked={unit === 'kilograms'}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                  Kilogram (Kgs)
                </label>
                <label style={{ marginLeft: '1rem' }}>
                  <input
                    type="radio"
                    value="liters"
                    checked={unit === 'liters'}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                  Liter (Lts)
                </label>
              </div>

              <button type="submit">
                {editingProduct ? 'Update' : 'Add'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="stock-card-container">
        {products.map((product) => (
          <div className="stock-display-card" key={product.id}>
            <h4>{product.name}</h4>
            <p>
              <strong>Price:</strong> ₹{product.price} / Per {formatUnit(product.unit)}
            </p>
            <div className="Alter-card">
              <button className="edit-button" onClick={() => handleEdit(product)}>
                Edit
              </button>
              <button className="delete-button" onClick={() => handleDelete(product.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
