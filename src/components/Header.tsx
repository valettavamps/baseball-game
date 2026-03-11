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
        <button className="hamburger-btn" onClick={onMenuToggle} aria-label="Menu">
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
        <div className="logo">
          <span className="logo-icon">⚾</span>
          <span className="logo-text hide-mobile">SIMFORGE<span className="logo-highlight">BASEBALL</span></span>
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
            <span className="username-display">👤 {username || 'Player'}</span>
            <button className="header-btn sign-out-btn" onClick={onSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button className="header-btn sign-up-btn" onClick={onSignIn}>
              Sign Up
            </button>
            <button className="header-btn sign-in-btn" onClick={onSignIn}>
              Sign In
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
