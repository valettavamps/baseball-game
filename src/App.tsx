import React, { useState } from 'react';
import AuthBanner from './components/AuthBanner';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import PlayersPage from './pages/PlayersPage';
import MultiLeagueSeasonPage from './pages/MultiLeagueSeasonPage';
import CreatePlayerPage from './pages/CreatePlayerPage';
import MyOffersPage from './pages/MyOffersPage';
import AuthPage from './pages/AuthPage';
import './styles/globals.css';
import './App.css';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('create-player');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const handleAuthSuccess = (user: any) => {
    setIsSignedIn(true);
    setUserData(user);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setUserData(null);
    setWalletAddress('');
  };

  const handleConnectWallet = () => {
    // TODO: Implement real Solana wallet connection
    setWalletAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
    alert('Wallet connected! (Mock - for deposits/withdrawals only)');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
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
        return <CreatePlayerPage onNavigate={setActivePage} />;
    }
  };

  // Show auth page if not signed in
  if (!isSignedIn) {
    return <AuthPage onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app">
      <AuthBanner
        isSignedIn={isSignedIn}
        onSignIn={handleConnectWallet}
        onSignOut={handleSignOut}
        walletAddress={walletAddress}
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
