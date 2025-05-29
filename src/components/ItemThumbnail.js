// src/components/ItemThumbnail.jsx
import React from 'react';

const ItemThumbnail = ({ item, onClick }) => {
  return (
    <div
      onClick={() => onClick(item)}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        width: '150px',
        margin: '10px',
        padding: '10px',
        cursor: 'pointer',
        textAlign: 'center',
      }}
    >
      <img
        src={item.image || 'https://via.placeholder.com/100'}
        alt={item.name}
        style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '8px' }}
      />
      <h4>{item.name}</h4>
      <p>Stock: {item.stock}</p>
    </div>
  );
};

export default ItemThumbnail;
