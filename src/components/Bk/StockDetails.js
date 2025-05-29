// src/components/StockDetails.js
import React, { useState, useEffect } from 'react';

const StockDetails = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('items') || '[]');
    setItems(savedItems);
  }, []);

  return (
    <div>
      <h1>Stock Details</h1>

      {items.length === 0 ? (
        <p>No items found. Please create some items first.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {items.map(item => (
            <div
              key={item.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                width: '180px',
                margin: '10px',
                padding: '10px',
                textAlign: 'center',
              }}
            >
              <img
                src={item.imageUrl || 'https://via.placeholder.com/100'}
                alt={item.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '8px' }}
              />
              <h4>{item.name}</h4>
              <p>Stock: {item.stock || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockDetails;
