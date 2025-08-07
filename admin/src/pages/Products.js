import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kilograms');
  const [imageFile, setImageFile] = useState(null);
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
    setImageFile(null);
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    if (!productName || !price) return;

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', price);
    formData.append('unit', unit);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingProduct) {
        const res = await axios.put(`${API_URL}${editingProduct.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? res.data : p))
        );
      } else {
        const res = await axios.post(API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
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
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Products</h2>

      <button
        onClick={() => {
          setShowCard(!showCard);
          setEditingProduct(null);
          setProductName('');
          setPrice('');
          setUnit('kilograms');
          setImageFile(null);
        }}
        className="mb-6 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded transition"
      >
        {showCard ? 'Close' : 'Add Product'}
      </button>

      {showCard && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4"
            ref={cardRef}
          >
            <h3 className="text-xl font-semibold mb-2">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>

            <form onSubmit={handleAddOrUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full mt-1 border rounded px-3 py-2"
                  placeholder="e.g., Toned Milk"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full mt-1 border rounded px-3 py-2"
                  placeholder="Price Per Kilogram/Liter"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      value="kilograms"
                      checked={unit === 'kilograms'}
                      onChange={(e) => setUnit(e.target.value)}
                      className="accent-blue-600"
                    />
                    Kilogram (Kgs)
                  </label>
                  <label className="flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      value="liters"
                      checked={unit === 'liters'}
                      onChange={(e) => setUnit(e.target.value)}
                      className="accent-blue-600"
                    />
                    Liter (Lts)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
              >
                {editingProduct ? 'Update' : 'Add'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded shadow p-4">
            {product.image && (
              <img
                src={`http://localhost:8000${product.image}`}
                alt={product.name}
                className="w-full h-32 object-contain rounded mb-2"
              />
            )}
            <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
            <p className="text-gray-600 mt-1">
              <strong>Price:</strong> ₹{product.price} / Per {formatUnit(product.unit)}
            </p>
            <div className="flex gap-3 mt-4">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(product.id)}
              >
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
