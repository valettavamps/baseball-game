import React from 'react';
import './MobileMenu.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: string;
  onNavigate: (item: string) => void;
  pendingContracts?: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'create-player', label: 'Create Player', icon: '⭐' },
  { id: 'my-offers', label: 'My Offers', icon: '📬' },
  { id: 'season', label: 'Season', icon: '📅' },
  { id: 'simulator', label: 'Simulator', icon: '🎮' },
  { id: 'players', label: 'My Players', icon: '⚾' },
  { id: 'team', label: 'My Teams', icon: '🏟️' },
  { id: 'leagues', label: 'Leagues', icon: '🏆' },
  { id: 'standings', label: 'Standings', icon: '📊' },
  { id: 'games', label: 'Games', icon: '🎯' },
  { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
];

const bottomItems: MenuItem[] = [
  { id: 'help', label: 'Help', icon: '❓' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
];

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  activeItem, 
  onNavigate,
  pendingContracts = 0
}) => {
  const handleNavigate = (item: string) => {
    onNavigate(item);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="menu-overlay" onClick={onClose} />}
      
      {/* Slide-out Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="mobile-menu-content">
          <div className="menu-section">
            <span className="menu-section-label">GAME</span>
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => handleNavigate(item.id)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
                {item.id === 'my-offers' && pendingContracts > 0 && (
                  <span className="menu-badge">{pendingContracts}</span>
                )}
                {activeItem === item.id && <div className="active-indicator" />}
              </button>
            ))}
          </div>

          <div className="menu-section">
            <span className="menu-section-label">INFO</span>
            {bottomItems.map((item) => (
              <button
                key={item.id}
                className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => handleNavigate(item.id)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
