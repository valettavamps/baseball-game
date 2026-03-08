import React from 'react';
import './CryptoBanner.css';

interface CryptoBannerProps {
  solBalance: number;
  derbyBalance: number;
  crownBalance: number;
  crownStaked: number;
  localCurrencyValue: number;
}

const CryptoBanner: React.FC<CryptoBannerProps> = ({
  solBalance,
  derbyBalance,
  crownBalance,
  crownStaked,
  localCurrencyValue,
}) => {
  const derbyUsd = derbyBalance / 100;

  return (
    <div className="crypto-banner">
      <div className="banner-left">
        <div className="banner-item">
          <span className="banner-icon">◎</span>
          <span className="banner-label">SOL</span>
          <span className="banner-value">{solBalance.toFixed(2)}</span>
        </div>
        <div className="banner-divider" />
        <div className="banner-item">
          <span className="banner-icon derby-icon">⚾</span>
          <span className="banner-label">DERBY</span>
          <span className="banner-value">{derbyBalance.toLocaleString()}</span>
          <span className="banner-usd">(${derbyUsd.toFixed(2)})</span>
        </div>
        <div className="banner-divider" />
        <div className="banner-item">
          <span className="banner-icon crown-icon">👑</span>
          <span className="banner-label">CROWN</span>
          <span className="banner-value">{crownBalance.toLocaleString()}</span>
        </div>
      </div>
      <div className="banner-right">
        <div className="banner-item staked">
          <span className="banner-label">STAKED</span>
          <span className="banner-value staked-value">{crownStaked.toLocaleString()} CROWN</span>
        </div>
        <div className="banner-divider" />
        <div className="banner-item">
          <span className="banner-label">PORTFOLIO</span>
          <span className="banner-value usd-value">${localCurrencyValue.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CryptoBanner;
