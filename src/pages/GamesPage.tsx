import React, { useState } from 'react';

const GamesPage: React.FC = () => {
  const [view, setView] = useState<'upcoming' | 'live' | 'completed'>('upcoming');

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🎯 Games</h1>
      
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        borderBottom: '2px solid #eee'
      }}>
        <button
          onClick={() => setView('upcoming')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: view === 'upcoming' ? '3px solid #1a1a2e' : '3px solid transparent',
            marginBottom: '-2px',
            fontWeight: view === 'upcoming' ? '600' : '400'
          }}
        >
          Upcoming
        </button>
        <button
          onClick={() => setView('live')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: view === 'live' ? '3px solid #1a1a2e' : '3px solid transparent',
            marginBottom: '-2px',
            fontWeight: view === 'live' ? '600' : '400'
          }}
        >
          Live
        </button>
        <button
          onClick={() => setView('completed')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: view === 'completed' ? '3px solid #1a1a2e' : '3px solid transparent',
            marginBottom: '-2px',
            fontWeight: view === 'completed' ? '600' : '400'
          }}
        >
          Completed
        </button>
      </div>

      <div style={{ 
        background: 'white', 
        border: '1px solid #e5e5e5', 
        borderRadius: '12px', 
        padding: '40px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#999', fontStyle: 'italic' }}>
          {view === 'upcoming' && 'No upcoming games'}
          {view === 'live' && 'No live games'}
          {view === 'completed' && 'No completed games'}
        </p>
      </div>
    </div>
  );
};

export default GamesPage;
