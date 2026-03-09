import React from 'react';
import './PlayerCard.css';

const getLetterGrade = (value: number): string => {
  if (value >= 95) return 'A+';
  if (value >= 90) return 'A';
  if (value >= 85) return 'A-';
  if (value >= 80) return 'B+';
  if (value >= 75) return 'B';
  if (value >= 70) return 'B-';
  if (value >= 65) return 'C+';
  if (value >= 60) return 'C';
  if (value >= 55) return 'C-';
  if (value >= 50) return 'D+';
  if (value >= 45) return 'D';
  if (value >= 40) return 'D-';
  return 'F';
};

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
          <div className="overall-badge">{getLetterGrade(overall)}</div>
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
