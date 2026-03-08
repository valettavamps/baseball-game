import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">⚾</span>
          <span className="logo-text">DIAMOND<span className="logo-highlight">CHAIN</span></span>
        </div>
      </div>
      <div className="header-center">
        <div className="live-indicator">
          <span className="live-dot" />
          <span className="live-text">3 LIVE GAMES</span>
        </div>
      </div>
      <div className="header-right">
        <button className="header-btn notifications-btn">
          <span>🔔</span>
        </button>
        <button className="header-btn wallet-btn">
          <span className="wallet-icon">👛</span>
          <span>Connect Wallet</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
