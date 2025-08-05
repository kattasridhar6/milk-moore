import React from 'react';


const Partners = () => {
  return (
    <div className="partners-container">
      <h1>Our Partners</h1>
      
      <div className="subscriptions-navbar">
        <input
          type="text"
          className="subscriptions-input"
        />
         <button className="subscriptions-button">
          Payment
        </button>
        <input
          type="date"
          className="subscriptions-input"
        />
        <input
          type="date"
          className="subscriptions-input"
        />
       
      </div>
    </div>
  );
};

export default Partners;
