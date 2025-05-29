import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register'; // Assuming you have this
import Sidebar from './components/Sidebar';
import GoodsIn from './components/GoodsIn';
import GoodsOut from './components/GoodsOut';
import GoodsOutReport from './components/GoodsOutReport';  // <-- Added import
import CreateItem from './components/CreateItem';
import ManageItem from './components/ManageItem';
import StockDetails from './components/StockDetails';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('stockDetails');
  const [authPage, setAuthPage] = useState('login'); // 'login' or 'register'

  // Load user from localStorage on mount
  useEffect(() => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
}, [user]);


  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('stockDetails');
    setAuthPage('login');
  };

  // Show Login or Register screen if not logged in
  if (!user) {
    return authPage === 'login' ? (
      <Login
        onLoginSuccess={setUser}
        onSwitchToRegister={() => setAuthPage('register')}
        onForgotPassword={() => alert('Forgot Password functionality not implemented yet.')}
      />
    ) : (
      <Register
        onRegisterSuccess={() => setAuthPage('login')}
        onSwitchToLogin={() => setAuthPage('login')}
      />
    );
  }

  // Main app after login
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div
          style={{
            marginBottom: 10,
            textAlign: 'right',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt={user.username}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #4caf50',
              }}
            />
          )}
          <span>
            Logged in as <strong>{user.username}</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>

        {currentPage === 'goodsIn' && <GoodsIn />}
        {currentPage === 'goodsOut' && <GoodsOut loggedInUser={user.username} />}
       {currentPage === 'goodsOutReport' && <GoodsOutReport user={user} />} {/* <-- Render new report */}
        {currentPage === 'createItem' && <CreateItem />}
        {currentPage === 'manageItem' && <ManageItem />}
        {currentPage === 'stockDetails' && <StockDetails />}
      </div>
    </div>
  );
};

export default App;
