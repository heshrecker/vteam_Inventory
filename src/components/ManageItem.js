import React, { useState, useEffect } from 'react';
import { fetchItems, saveItems } from '../api';

const ManageItem = () => {
  const [items, setItems] = useState([]);

  // Load items on mount
  useEffect(() => {
    fetchItems()
      .then(setItems)
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    const itemToDelete = items.find(item => item.id === id);

    if (!itemToDelete) return;

    // Prevent delete if stock > 0
    if ((itemToDelete.stock || 0) > 0) {
      alert('Cannot delete item with stock greater than zero.');
      return;
    }

    // Confirm before delete
    const confirmDelete = window.confirm(`Are you sure you want to delete "${itemToDelete.name}"?`);
    if (!confirmDelete) return;

    const filteredItems = items.filter(item => item.id !== id);
    try {
      await saveItems(filteredItems);
      setItems(filteredItems);
    } catch (error) {
      alert('Failed to delete item');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Manage Items</h1>
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
              <p>Minimum Stock: {item.minStock}</p>
              <p>Stock: {item.stock || 0}</p>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  backgroundColor: '#90ee90',
                  color: 'black',
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageItem;
