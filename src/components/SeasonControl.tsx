import React from 'react';
import './SeasonControl.css';
import { Season } from '../engine/SeasonManager';

interface SeasonControlProps {
  season: Season;
  onSimulateDay: () => void;
  onSimulateDays: (days: number) => void;
  onStartSeason: () => void;
  isSimulating: boolean;
}

const SeasonControl: React.FC<SeasonControlProps> = ({
  season,
  onSimulateDay,
  onSimulateDays,
  onStartSeason,
  isSimulating
}) => {
  const progress = Math.min((season.currentDay / season.totalDays) * 100, 100);
  const gamesCompleted = season.schedule.filter(g => g.status === 'completed').length;
  const totalGames = season.schedule.length;

  const getStatusBadge = () => {
    switch (season.status) {
      case 'upcoming':
        return <span className="status-badge upcoming">Upcoming</span>;
      case 'active':
        return <span className="status-badge active">
          <span className="status-dot" />
          Active
        </span>;
      case 'completed':
        return <span className="status-badge completed">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="season-control">
      <div className="season-header">
        <div className="season-title">
          <h3>{season.name}</h3>
          {getStatusBadge()}
        </div>
        <div className="season-subtitle">
          Day {season.currentDay} of {season.totalDays}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
          <div className="progress-marker" style={{ left: `${progress}%` }}>
            <span className="progress-marker-label">{progress.toFixed(1)}%</span>
          </div>
        </div>
        <div className="progress-labels">
          <span>Start</span>
          <span>{gamesCompleted} / {totalGames} games</span>
          <span>End</span>
        </div>
      </div>

      {/* Season Stats */}
      <div className="season-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-content">
            <span className="stat-label">Games Played</span>
            <span className="stat-value">{gamesCompleted.toLocaleString()}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <span className="stat-label">Current Day</span>
            <span className="stat-value">{season.currentDay}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏟️</div>
          <div className="stat-content">
            <span className="stat-label">Teams</span>
            <span className="stat-value">{season.teams.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <span className="stat-label">Days Remaining</span>
            <span className="stat-value">{Math.max(0, season.totalDays - season.currentDay)}</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="control-buttons">
        {season.status === 'upcoming' && (
          <button 
            className="control-btn start-btn"
            onClick={onStartSeason}
            disabled={isSimulating}
          >
            <span className="btn-icon">▶️</span>
            Start Season
          </button>
        )}

        {season.status === 'active' && (
          <>
            <button 
              className="control-btn simulate-btn"
              onClick={onSimulateDay}
              disabled={isSimulating}
            >
              <span className="btn-icon">⏭️</span>
              Simulate 1 Day
            </button>

            <button 
              className="control-btn simulate-btn secondary"
              onClick={() => onSimulateDays(7)}
              disabled={isSimulating}
            >
              <span className="btn-icon">⏩</span>
              Simulate 1 Week
            </button>

            <button 
              className="control-btn simulate-btn secondary"
              onClick={() => onSimulateDays(30)}
              disabled={isSimulating}
            >
              <span className="btn-icon">⏩⏩</span>
              Simulate 1 Month
            </button>
          </>
        )}

        {season.status === 'completed' && (
          <div className="season-complete">
            <span className="complete-icon">🏆</span>
            <div className="complete-text">
              <h4>Season Complete!</h4>
              <p>Check the standings for final results</p>
            </div>
          </div>
        )}
      </div>

      {isSimulating && (
        <div className="simulating-indicator">
          <div className="spinner" />
          <span>Simulating games...</span>
        </div>
      )}
    </div>
  );
};

export default SeasonControl;
