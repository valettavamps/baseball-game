import React from 'react';
import './PlayerCard.css';

interface PlayerCardProps {
  playerName: string;
  position: string;
  overall: number;
  teamName?: string;
  pendingContracts?: number;
  onViewContracts?: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  playerName,
  position,
  overall,
  teamName,
  pendingContracts = 0,
  onViewContracts
}) => {
  return (
    <div className="player-card">
      {pendingContracts > 0 && (
        <div className="contract-alert">
          <div className="alert-icon">📬</div>
          <div className="alert-content">
            <span className="alert-text">
              You have <strong>{pendingContracts}</strong> pending contract offer{pendingContracts > 1 ? 's' : ''}!
            </span>
            {onViewContracts && (
              <button className="view-contracts-btn" onClick={onViewContracts}>
                View Offers →
              </button>
            )}
          </div>
        </div>
      )}

      <div className="player-card-content">
        <div className="player-avatar">
          <span className="avatar-icon">⚾</span>
          <div className="overall-badge">{overall}</div>
        </div>

        <div className="player-info">
          <h3 className="player-name">{playerName}</h3>
          <div className="player-details">
            <span className="player-position">{position}</span>
            {teamName && (
              <>
                <span className="detail-divider">•</span>
                <span className="player-team">{teamName}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
