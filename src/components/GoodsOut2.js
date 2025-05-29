import React, { useState, useEffect } from 'react';
import { fetchItems, saveItems } from '../api';

const GoodsOut = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQty, setSelectedQty] = useState({});
  const [addedItems, setAddedItems] = useState([]);

  const [receiverNames, setReceiverNames] = useState(() => {
    const saved = localStorage.getItem('receiverNames');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedReceiver, setSelectedReceiver] = useState('');
  const [newReceiver, setNewReceiver] = useState('');

  useEffect(() => {
    fetchItems()
      .then(data => {
        const itemsWithStock = data.map(item => ({
          ...item,
          stock: typeof item.stock === 'number' ? item.stock : 0,
        }));
        setItems(itemsWithStock);
      })
      .catch(err => console.error(err));
  }, []);

  const saveReceiverNames = (names) => {
    setReceiverNames(names);
    localStorage.setItem('receiverNames', JSON.stringify(names));
  };

  const handleAddReceiver = () => {
    const trimmed = newReceiver.trim();
    if (!trimmed) return alert('Enter a receiver name');
    if (receiverNames.includes(trimmed)) return alert('Receiver already exists');

    const updated = [...receiverNames, trimmed];
    saveReceiverNames(updated);
    setSelectedReceiver(trimmed);
    setNewReceiver('');
  };

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

    if (!selectedReceiver) {
      alert('Please select a receiver');
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

  const handleSubmit = async () => {
    if (addedItems.length === 0) {
      alert('Add at least one item with quantity before submitting.');
      return;
    }
    if (!selectedReceiver) {
      alert('Please select a receiver');
      return;
    }

    try {
      // Update stock quantities
      const updatedItems = items.map(item => {
        const added = addedItems.find(i => i.id === item.id);
        if (added) {
          return { ...item, stock: Number(item.stock) - added.qty };
        }
        return item;
      });

      // Save updated stock to backend
      await saveItems(updatedItems);

      // Prepare goods out transaction record
      const goodsOutRecord = {
        id: Date.now(),
        date: new Date().toISOString(),
        receiver: selectedReceiver,
        items: addedItems.map(({ id, name, qty }) => ({ id, name, qty })),
      };

      // POST goods out transaction to backend
      await fetch('http://localhost:1200/goodsOut', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goodsOutRecord),
      });

      alert(`Goods Out updated successfully for receiver: ${selectedReceiver}!`);

      // Update state
      setAddedItems([]);
      setItems(updatedItems);
      setSelectedReceiver('');
    } catch (error) {
      alert('Failed to update goods out.');
      console.error(error);
    }
  };

  const inputStyle = {
    width: '60px',
    marginRight: '10px',
    padding: 8,
    borderRadius: '8px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    backgroundColor: '#90ee90',
    color: 'black',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Goods Out</h1>

      {/* Receiver Selector */}
      <div style={{ marginBottom: 20, maxWidth: 400 }}>
        <label>Receiver Name:</label><br />
        <select
          value={selectedReceiver}
          onChange={e => setSelectedReceiver(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc', width: '70%' }}
        >
          <option value="">-- Select Receiver --</option>
          {receiverNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Add new receiver"
          value={newReceiver}
          onChange={e => setNewReceiver(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 8,
            border: '1px solid #ccc',
            width: '25%',
            marginLeft: 10,
            boxSizing: 'border-box',
          }}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddReceiver())}
        />
        <button
          onClick={handleAddReceiver}
          style={{
            marginLeft: 10,
            ...buttonStyle,
            padding: '6px 10px',
            width: 'auto',
          }}
          title="Add Receiver"
        >
          +
        </button>
      </div>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          padding: '8px',
          width: '100%',
          maxWidth: 400,
          marginBottom: 20,
          borderRadius: 8,
          border: '1px solid #ccc',
          fontSize: 16,
        }}
      />

      <h3>Select quantity for items and add to grid:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredItems.length === 0 && <p>No items found. Please create items first.</p>}
        {filteredItems.map(item => (
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
        disabled={addedItems.length === 0 || !selectedReceiver}
        style={{
          marginTop: 20,
          padding: '8px 16px',
          cursor: (addedItems.length === 0 || !selectedReceiver) ? 'not-allowed' : 'pointer',
          backgroundColor: '#90ee90',
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
