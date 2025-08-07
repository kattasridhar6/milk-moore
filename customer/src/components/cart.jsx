import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    pincode: '',
    phone: '',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const formatQuantity = (qty) => {
    switch (qty) {
      case 0.25:
        return '250ML / G';
      case 0.5:
        return '500ML / G';
      case 1:
        return '1L / KG';
      default:
        return `${qty}`;
    }
  };

  const calculateTotalAmount = () => {
    return cartItems
      .reduce((acc, item) => {
        const quantity = parseFloat(item.quantity || 1);
        return acc + item.price * quantity;
      }, 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    setShowAddressForm(true);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = () => {
    const order = {
      id: Date.now(),
      items: cartItems,
      total: calculateTotalAmount(),
      address,
      date: new Date().toLocaleString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const updatedOrders = [...existingOrders, order];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Clear cart
    localStorage.removeItem('cart');
    setCartItems([]);
    setShowAddressForm(false);
    setShowOrderPopup(true);

    // Reset address form
    setAddress({
      name: '',
      street: '',
      city: '',
      pincode: '',
      phone: '',
    });

    // Hide popup after 2 seconds
    setTimeout(() => setShowOrderPopup(false), 2000);
  };

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold mb-4">🛒 Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            {cartItems.map((item, index) => {
              const quantity = parseFloat(item.quantity || 1);
              const total = (item.price * quantity).toFixed(2);

              return (
                <div
                  key={index}
                  className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-1rem)] border p-4 rounded shadow bg-white"
                >
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p>
                    Unit Price: ₹{item.price} /{' '}
                    {item.unit.replace(/^\/?/, '').replace(/s$/, '')}
                  </p>
                  <p>Selected Quantity: {formatQuantity(quantity)}</p>
                  <p className="font-semibold">Total: ₹{total}</p>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t pt-4 flex flex-col items-end">
            <p className="text-xl font-semibold mb-4">
              Grand Total: ₹{calculateTotalAmount()}
            </p>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {/* Floating Address Form */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
            <h3 className="text-xl font-bold mb-4">Enter Delivery Details</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={address.name}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={address.street}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={address.phone}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowAddressForm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitOrder}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Placed Popup */}
      {showOrderPopup && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
          🎉 Order Placed Successfully!
        </div>
      )}
    </div>
  );
};

export default Cart;
