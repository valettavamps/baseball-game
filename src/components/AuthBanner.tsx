import React, { useState } from 'react';
import './AuthBanner.css';

interface AuthBannerProps {
  isSignedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  walletAddress?: string;
  solBalance?: number;
  derbyBalance?: number;
  crownBalance?: number;
  crownStaked?: number;
  localCurrencyValue?: number;
}

const AuthBanner: React.FC<AuthBannerProps> = ({
  isSignedIn,
  onSignIn,
  onSignOut,
  walletAddress,
  solBalance = 0,
  derbyBalance = 0,
  crownBalance = 0,
  crownStaked = 0,
  localCurrencyValue = 0
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // This banner is only shown when signed in
  // Auth page handles sign-in UI

  return (
    <div className="auth-banner signed-in">
      <div className="auth-banner-content">
        <div className="wallet-info">
          {!walletAddress ? (
            <button className="connect-wallet-btn" onClick={onSignIn}>
              <span className="wallet-icon">💰</span>
              Connect Wallet (Optional)
            </button>
          ) : (
            <>
              <button 
                className="wallet-address-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="wallet-icon">👤</span>
                <span className="wallet-address">{formatAddress(walletAddress)}</span>
                <span className="dropdown-icon">{showDropdown ? '▲' : '▼'}</span>
              </button>

              {showDropdown && (
                <div className="wallet-dropdown">
                  <button className="dropdown-item" onClick={onSignOut}>
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="balances">
          <div className="balance-item">
            <span className="balance-icon">◎</span>
            <span className="balance-value">{solBalance.toFixed(2)}</span>
            <span className="balance-label">SOL</span>
          </div>

          <div className="balance-divider" />

          <div className="balance-item">
            <span className="balance-icon">⚾</span>
            <span className="balance-value">{derbyBalance.toLocaleString()}</span>
            <span className="balance-label">DERBY</span>
          </div>

          <div className="balance-divider" />

          <div className="balance-item">
            <span className="balance-icon">👑</span>
            <span className="balance-value">{crownBalance.toLocaleString()}</span>
            <span className="balance-label">CROWN</span>
          </div>

          {crownStaked > 0 && (
            <>
              <div className="balance-divider" />
              <div className="balance-item staked">
                <span className="balance-icon">🔒</span>
                <span className="balance-value">{crownStaked.toLocaleString()}</span>
                <span className="balance-label">Staked</span>
              </div>
            </>
          )}
        </div>

        <div className="local-value">
          ≈ ${localCurrencyValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </div>
      </div>
    </div>
  );
};

export default AuthBanner;
