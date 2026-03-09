import React, { useState } from 'react';
import CryptoBanner from './components/CryptoBanner';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import PlayersPage from './pages/PlayersPage';
import SeasonPage from './pages/SeasonPage';
import './styles/globals.css';
import './App.css';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('season');

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'season':
        return <SeasonPage />;
      case 'players':
        return <PlayersPage />;
      case 'team':
        return <div className="placeholder-page"><h2>🏟️ Team</h2><p>Team management coming soon...</p></div>;
      case 'marketplace':
        return <div className="placeholder-page"><h2>🏪 Marketplace</h2><p>Player marketplace coming soon...</p></div>;
      case 'forge':
        return <div className="placeholder-page"><h2>🔨 Forge</h2><p>Player forging coming soon...</p></div>;
      case 'help':
        return <div className="placeholder-page"><h2>❓ Help</h2><p>Help documentation coming soon...</p></div>;
      case 'about':
        return <div className="placeholder-page"><h2>ℹ️ About</h2><p>About DiamondChain coming soon...</p></div>;
      default:
        return <SeasonPage />;
    }
  };

  return (
    <div className="app">
      <CryptoBanner
        solBalance={12.45}
        derbyBalance={25000}
        crownBalance={1500}
        crownStaked={800}
        localCurrencyValue={1842.50}
      />
      <Header />
      <div className="app-body">
        <Sidebar activeItem={activePage} onNavigate={setActivePage} />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
