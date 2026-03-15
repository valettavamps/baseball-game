import React from 'react';

const LeaguesPage: React.FC = () => {
  return (
    <div className="placeholder-page" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🏆 Leagues</h1>
      <p style={{ color: '#666' }}>League management coming soon...</p>
      
      <div style={{ marginTop: '32px' }}>
        <h2>Available Leagues</h2>
        <div style={{ 
          background: 'white', 
          border: '1px solid #e5e5e5', 
          borderRadius: '12px', 
          padding: '20px',
          marginTop: '16px'
        }}>
          <p style={{ color: '#999', fontStyle: 'italic' }}>No leagues available yet</p>
        </div>
      </div>
    </div>
  );
};

export default LeaguesPage;
