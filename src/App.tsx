import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileMenu from './components/MobileMenu';
import HomePage from './pages/HomePage';
import PlayersPage from './pages/PlayersPage';
import MultiLeagueSeasonPage from './pages/MultiLeagueSeasonPage';
import CreatePlayerPage from './pages/CreatePlayerPage';
import MyOffersPage from './pages/MyOffersPage';
import AuthPage from './pages/AuthPage';
import './styles/globals.css';
import './App.css';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('home');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = (user: any) => {
    setIsSignedIn(true);
    setUserData(user);
    setShowAuthModal(false);
    setActivePage('create-player');
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setUserData(null);
    setActivePage('home');
  };

  const handleSignInClick = () => {
    setShowAuthModal(true);
  };

  const renderPage = () => {
    const requiresAuth = ['create-player', 'my-offers', 'team'];
    
    if (!isSignedIn && requiresAuth.includes(activePage)) {
      return (
        <div className="auth-required-page">
          <div className="auth-required-content">
            <div className="auth-required-icon">🔒</div>
            <h2>Sign In Required</h2>
            <p>You need an account to access this feature</p>
            <button className="sign-in-cta-btn" onClick={handleSignInClick}>
              Sign Up / Sign In
            </button>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case 'home':
        return <HomePage isSignedIn={isSignedIn} onSignUp={handleSignInClick} />;
      case 'create-player':
        return <CreatePlayerPage onNavigate={setActivePage} />;
      case 'my-offers':
        return <MyOffersPage />;
      case 'season':
        return <MultiLeagueSeasonPage />;
      case 'players':
        return <PlayersPage />;
      case 'team':
        return <div className="placeholder-page"><h2>🏟️ Team</h2><p>Team management coming soon...</p></div>;
      case 'marketplace':
        return <div className="placeholder-page"><h2>🏪 Marketplace</h2><p>Player marketplace coming soon...</p></div>;
      default:
        return <HomePage isSignedIn={isSignedIn} onSignUp={handleSignInClick} />;
    }
  };

  return (
    <div className="app">
      <Header 
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isSignedIn={isSignedIn}
        onSignIn={handleSignInClick}
        onSignOut={handleSignOut}
        username={userData?.username}
      />
      <div className="app-body">
        {/* Sidebar removed - using slide-out menu for all screens */}
        
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          activeItem={activePage}
          onNavigate={(page) => {
            setActivePage(page);
            setMobileMenuOpen(false);
          }}
          pendingContracts={5}
        />
        
        <main className="main-content">
          {renderPage()}
        </main>
      </div>

      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAuthModal(false)}>×</button>
            <AuthPage onSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
