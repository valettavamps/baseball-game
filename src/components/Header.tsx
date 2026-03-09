import React from 'react';
import './Header.css';

interface HeaderProps {
  onMenuToggle?: () => void;
  isSignedIn?: boolean;
  onSignIn?: () => void;
  onSignOut?: () => void;
  username?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuToggle,
  isSignedIn = false,
  onSignIn,
  onSignOut,
  username
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={onMenuToggle}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className="logo">
          <span className="logo-icon">⚾</span>
          <span className="logo-text">DIAMOND<span className="logo-highlight">CHAIN</span></span>
        </div>
      </div>
      
      <div className="header-center">
        <div className="live-indicator">
          <span className="live-dot" />
          <span className="live-text">SEASON ACTIVE</span>
        </div>
      </div>
      
      <div className="header-right">
        {isSignedIn ? (
          <>
            <button className="header-btn notifications-btn">
              <span>🔔</span>
            </button>
            <div className="user-menu">
              <span className="username-display">{username || 'Player'}</span>
              <button className="header-btn sign-out-btn" onClick={onSignOut}>
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <button className="header-btn sign-in-header-btn" onClick={onSignIn}>
            <span className="btn-icon">🔐</span>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
