// src/components/GoodsOut.js
import React, { useState, useEffect } from 'react';

const GoodsOut = () => {
  const [items, setItems] = useState([]);
  const [selectedQty, setSelectedQty] = useState({}); // { itemId: qty }
  const [addedItems, setAddedItems] = useState([]);   // items added to grid

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('items') || '[]');

    const itemsWithStock = savedItems.map(item => ({
      ...item,
      stock: typeof item.stock === 'number' ? item.stock : 0,
    }));

    setItems(itemsWithStock);
  }, []);

  const handleQtyChange = (id, value) => {
    if (value === '' || (/^\d+$/.test(value) && Number(value) >= 0)) {
      setSelectedQty(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleAdd = (item) => {
    const qty = Number(selectedQty[item.id]);
    if (!qty || qty <= 0) {
      alert('Please enter a valid quantity greater than 0');
      return;
    }

    if (qty > Number(item.stock)) {
      alert(`Cannot remove more than current stock (${item.stock})`);
      return;
    }

    const exists = addedItems.find(i => i.id === item.id);
    if (exists) {
      if (exists.qty + qty > Number(item.stock)) {
        alert(`Total quantity exceeds current stock (${item.stock})`);
        return;
      }
      setAddedItems(prev =>
        prev.map(i => i.id === item.id ? { ...i, qty: i.qty + qty } : i)
      );
    } else {
      setAddedItems(prev => [...prev, { ...item, qty }]);
    }

    setSelectedQty(prev => ({ ...prev, [item.id]: '' }));
  };

  const handleSubmit = () => {
    if (addedItems.length === 0) {
      alert('Add at least one item with quantity before submitting.');
      return;
    }

    const savedItems = JSON.parse(localStorage.getItem('items') || '[]');

    const updatedItems = savedItems.map(item => {
      const added = addedItems.find(i => i.id === item.id);
      if (added) {
        return { ...item, stock: Number(item.stock) - added.qty };
      }
      return item;
    });

    localStorage.setItem('items', JSON.stringify(updatedItems));

    alert('Goods Out updated successfully!');

    setAddedItems([]);
    setItems(updatedItems);
  };

  const inputStyle = {
    width: '60px',
    marginRight: '10px',
    padding: 8,
    borderRadius: '8px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    backgroundColor: '#90ee90', // light green
    color: 'black',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div>
      <h1>Goods Out</h1>

      <h3>Select quantity for items and add to grid:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {items.length === 0 && <p>No items found. Please create items first.</p>}
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
            <p>Current Stock: {item.stock}</p>

            <input
              type="number"
              min="0"
              placeholder="Qty"
              value={selectedQty[item.id] || ''}
              onChange={e => handleQtyChange(item.id, e.target.value)}
              style={inputStyle}
            />
            <button onClick={() => handleAdd(item)} style={buttonStyle}>Add</button>
          </div>
        ))}
      </div>

      <h3>Goods Out Grid</h3>
      {addedItems.length === 0 ? (
        <p>No items added yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {addedItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={handleSubmit}
        disabled={addedItems.length === 0}
        style={{
          marginTop: 20,
          padding: '8px 16px',
          cursor: addedItems.length === 0 ? 'not-allowed' : 'pointer',
          backgroundColor: '#90ee90', // light green
          color: 'black',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default GoodsOut;
