import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'players', label: 'Players', icon: '⚾' },
  { id: 'team', label: 'Team', icon: '🏟️' },
  { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
  { id: 'forge', label: 'Forge', icon: '🔨' },
];

const bottomItems: MenuItem[] = [
  { id: 'help', label: 'Help', icon: '❓' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onNavigate }) => {
  return (
    <nav className="sidebar">
      <div className="sidebar-menu">
        <div className="menu-section">
          <span className="menu-section-label">GAME</span>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {item.badge && <span className="menu-badge">{item.badge}</span>}
              {activeItem === item.id && <div className="active-indicator" />}
            </button>
          ))}
        </div>
      </div>
      <div className="sidebar-bottom">
        <div className="menu-section">
          <span className="menu-section-label">INFO</span>
          {bottomItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
