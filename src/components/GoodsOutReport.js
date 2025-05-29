import React, { useState, useEffect } from 'react';

const GoodsOutReport = ({ user }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug user object
  console.log('GoodsOutReport user:', user);

  const isAdmin = user?.isAdmin || user?.role === 'admin' || user?.username === 'admin';

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:1200/goodsOut');
      if (!res.ok) throw new Error('Failed to fetch report data');
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const res = await fetch(`http://localhost:1200/goodsOut/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete record');
      alert('Record deleted successfully');
      fetchReport(); // Refresh after delete
    } catch (err) {
      alert('Error deleting record: ' + err.message);
    }
  };

  if (loading) return <p>Loading report...</p>;
  if (error) return <p>Error loading report: {error}</p>;
  if (reportData.length === 0) return <p>No Goods Out records found.</p>;

  return (
    <div>
      <h1>Goods Out Report</h1>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Receiver</th>
            <th>Printed By</th>
            <th>Items</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {reportData.map(record => (
            <tr key={record.id}>
              <td>{new Date(record.date).toLocaleString()}</td>
              <td>{record.receiver}</td>
              <td>{record.printedUser}</td>
              <td>
                <table border="0" cellPadding="4" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td style={{ textAlign: 'center' }}>{item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              {isAdmin && (
                <td>
                  <button
                    onClick={() => handleDelete(record.id)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      padding: '6px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GoodsOutReport;
