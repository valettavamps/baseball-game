import React, { useState } from 'react';
import AuthBanner from './components/AuthBanner';
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
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = (user: any) => {
    setIsSignedIn(true);
    setUserData(user);
    setShowAuthModal(false);
    setActivePage('create-player'); // Take them to player creation after sign up
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setUserData(null);
    setWalletAddress('');
    setActivePage('home');
  };

  const handleConnectWallet = () => {
    // TODO: Implement real Solana wallet connection
    setWalletAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
    alert('Wallet connected! (Mock - for deposits/withdrawals only)');
  };

  const handleSignInClick = () => {
    setShowAuthModal(true);
  };

  const renderPage = () => {
    // Pages that require sign-in
    const requiresAuth = ['create-player', 'my-offers', 'team'];
    
    if (!isSignedIn && requiresAuth.includes(activePage)) {
      return (
        <div className="auth-required-page">
          <div className="auth-required-content">
            <div className="auth-required-icon">🔒</div>
            <h2>Sign In Required</h2>
            <p>You need to sign in to access this feature</p>
            <button className="sign-in-cta-btn" onClick={handleSignInClick}>
              Sign In / Sign Up
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
      case 'forge':
        return <div className="placeholder-page"><h2>🔨 Forge</h2><p>Player forging coming soon...</p></div>;
      case 'help':
        return <div className="placeholder-page"><h2>❓ Help</h2><p>Help documentation coming soon...</p></div>;
      case 'about':
        return <div className="placeholder-page"><h2>ℹ️ About</h2><p>About DiamondChain coming soon...</p></div>;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app">
      <Header 
        onMenuToggle={() => setMobileMenuOpen(true)}
        isSignedIn={isSignedIn}
        onSignIn={handleSignInClick}
        onSignOut={handleSignOut}
        username={userData?.username}
      />
      <div className="app-body">
        {/* Desktop Sidebar */}
        <Sidebar activeItem={activePage} onNavigate={setActivePage} />
        
        {/* Mobile Slide-out Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          activeItem={activePage}
          onNavigate={setActivePage}
          pendingContracts={5}
        />
        
        <main className="main-content">
          {renderPage()}
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAuthModal(false)}>
              ×
            </button>
            <AuthPage onSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
