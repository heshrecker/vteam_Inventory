import React, { useState, useEffect } from 'react';
import { fetchItems } from '../api';

const StockDetails = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems()
      .then(setItems)
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Stock Details</h1>

      {items.length === 0 ? (
        <p>No items found. Please create some items first.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {items.map(item => {
            const lowStock = (item.stock || 0) < (item.minStock || 0);
            return (
              <div
                key={item.id}
                style={{
                  border: lowStock ? '3px solid #ff4d4f' : '1px solid #ccc',
                  backgroundColor: lowStock ? '#fff1f0' : '#fff',
                  borderRadius: '8px',
                  width: '180px',
                  margin: '10px',
                  padding: '10px',
                  textAlign: 'center',
                  boxShadow: lowStock ? '0 0 8px rgba(255,77,79,0.6)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '8px' }}
                />
                <h4>{item.name}</h4>
                <p style={{
                  color: lowStock ? 'red' : 'green',
                  fontWeight: 'bold',
                }}>
                  Stock: {item.stock || 0}
                </p>
                <p>Minimum Stock: {item.minStock || 0}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StockDetails;
