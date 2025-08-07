import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = ({ setCartCount }) => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const ADMIN_MEDIA_BASE_URL = import.meta.env.VITE_ADMIN_MEDIA_BASE_URL;

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: parseFloat(value),
    }));
  };

  const addToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartItem = { ...product, quantity };
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(cart.length);

    setToast(`${product.name} (${quantity}) added to cart`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold mb-4">PRODUCTS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow bg-white">
            {product.image && (
              <img
                src={`${ADMIN_MEDIA_BASE_URL}${product.image}`}
                alt={product.name}
                className="w-full h-48 object-contain mb-3 rounded"
              />
            )}
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">Price: ₹{product.price}</p>
            <p className="text-gray-500">Unit: {product.unit}</p>
            <select
              value={quantities[product.id] || 1}
              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
              className="mt-2 mb-2 px-2 py-1 border rounded"
            >
              <option value={0.25}>0.250</option>
              <option value={0.5}>0.500</option>
              <option value={1}>1</option>
            </select>
            <button
              onClick={() => addToCart(product)}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default Products;
