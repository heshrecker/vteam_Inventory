import React, { useState, useEffect } from 'react';
import { fetchItems, saveItems } from '../api';

const CreateItem = () => {
  const [name, setName] = useState('');
  const [minStock, setMinStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [items, setItems] = useState([]);

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await toBase64(file);
      setImageFile(base64);
      setPreviewUrl(base64);
    } else {
      setImageFile(null);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    fetchItems()
      .then(setItems)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter item name');
      return;
    }
    if (!minStock || Number(minStock) < 0) {
      alert('Please enter a valid minimum stock');
      return;
    }

    const newItem = {
      id: Date.now(),
      name,
      minStock: Number(minStock),
      imageUrl: imageFile,
      stock: 0,
    };

    const updatedItems = [...items, newItem];

    try {
      await saveItems(updatedItems);
      alert('Item created!');
      setItems(updatedItems);
      setName('');
      setMinStock('');
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      alert('Failed to save item');
      console.error(error);
    }
  };

  const inputStyle = { width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc', marginBottom: 12 };

  return (
    <div>
      <h1>Create Item</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>Item Name:</label><br />
        <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />

        <label>Minimum Stock:</label><br />
        <input type="number" value={minStock} onChange={e => setMinStock(e.target.value)} min="0" required style={inputStyle} />

        <label>Item Image:</label><br />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && <div style={{ marginTop: 10, marginBottom: 12 }}>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>}

        <button type="submit" style={{
          padding: '8px 16px',
          backgroundColor: '#90ee90',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>Create Item</button>
      </form>
    </div>
  );
};

export default CreateItem;
