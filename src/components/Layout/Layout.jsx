import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', width: '100%', margin: 0, padding: 0 }}>
      <Navbar />
      <main style={{ padding: 0, margin: 0, width: '100%' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 