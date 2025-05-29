// src/components/Sidebar.js
import React from 'react';
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaPlusCircle,
  FaTools,
  FaClipboardList,
  FaChartBar,
  FaBug,
} from 'react-icons/fa';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { key: 'goodsIn', label: 'Goods In', icon: <FaSignInAlt /> },
    { key: 'goodsOut', label: 'Goods Out', icon: <FaSignOutAlt /> },
    { key: 'createItem', label: 'Create Item', icon: <FaPlusCircle /> },
    { key: 'manageItem', label: 'Manage Item', icon: <FaTools /> },
    { key: 'stockDetails', label: 'Stock Details', icon: <FaClipboardList /> },
    { key: 'report', label: 'Report', icon: <FaChartBar /> },
    { key: 'issueReport', label: 'Issue Report', icon: <FaBug /> },
    { key: 'goodsOutReport', label: 'Goods Out Report', icon: <FaClipboardList /> }, // New menu item
  ];

  return (
    <div style={{ width: '200px', backgroundColor: '#727371', color: '#fff', height: '100vh', padding: '20px' }}>
      {/* Logo */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <img
          src="/logo.png"
          alt="V Team Inventory Logo"
          style={{ maxWidth: '60%', height: 'auto', borderRadius: '8px' }}
        />
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>V Team Inventory</h2>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map(item => (
          <li
            key={item.key}
            onClick={() => setCurrentPage(item.key)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: currentPage === item.key ? '#444' : 'transparent',
              marginBottom: '8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '18px',
            }}
          >
            {item.icon}
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
