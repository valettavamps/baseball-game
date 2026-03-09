import React, { useState, useEffect } from 'react';
import './LiveGamesFeed.css';
import { GameResult } from '../engine/GameSimulator';

interface LiveGamesFeedProps {
  games: GameResult[];
  onRefresh?: () => void;
}

const LiveGamesFeed: React.FC<LiveGamesFeedProps> = ({ games, onRefresh }) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const formatScore = (score: number) => {
    return score.toString().padStart(2, '0');
  };

  const getWinnerClass = (game: GameResult, team: 'home' | 'away') => {
    return game.winner === team ? 'winner' : 'loser';
  };

  return (
    <div className="live-games-feed">
      <div className="feed-header">
        <h2>
          <span className="live-indicator">
            <span className="live-dot" />
            LIVE
          </span>
          Games
        </h2>
        {onRefresh && (
          <button className="refresh-btn" onClick={onRefresh}>
            <span className="refresh-icon">⟳</span>
            Refresh
          </button>
        )}
      </div>

      {games.length === 0 ? (
        <div className="no-games">
          <div className="no-games-icon">⚾</div>
          <p>No games in progress</p>
          <span className="no-games-subtitle">Check back soon!</span>
        </div>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <div
              key={game.gameId}
              className={`game-card ${selectedGame === game.gameId ? 'selected' : ''}`}
              onClick={() => setSelectedGame(selectedGame === game.gameId ? null : game.gameId)}
            >
              {/* Game Header */}
              <div className="game-header">
                <span className="game-status completed">FINAL</span>
                <span className="game-attendance">
                  👥 {game.attendance.toLocaleString()}
                </span>
              </div>

              {/* Teams & Scores */}
              <div className="game-teams">
                <div className={`team away ${getWinnerClass(game, 'away')}`}>
                  <div className="team-info">
                    <span className="team-name">{game.awayTeam.name}</span>
                    <span className="team-record">
                      H: {game.awayTeam.hits} E: {game.awayTeam.errors}
                    </span>
                  </div>
                  <div className={`team-score ${game.winner === 'away' ? 'winner-score' : ''}`}>
                    {formatScore(game.awayTeam.score)}
                  </div>
                </div>

                <div className="vs-divider">@</div>

                <div className={`team home ${getWinnerClass(game, 'home')}`}>
                  <div className="team-info">
                    <span className="team-name">{game.homeTeam.name}</span>
                    <span className="team-record">
                      H: {game.homeTeam.hits} E: {game.homeTeam.errors}
                    </span>
                  </div>
                  <div className={`team-score ${game.winner === 'home' ? 'winner-score' : ''}`}>
                    {formatScore(game.homeTeam.score)}
                  </div>
                </div>
              </div>

              {/* Game Stats */}
              <div className="game-stats">
                <div className="stat-item">
                  <span className="stat-label">Revenue</span>
                  <span className="stat-value revenue">
                    ${(game.revenue / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Innings</span>
                  <span className="stat-value">{game.innings.length}</span>
                </div>
              </div>

              {/* Highlights (Expandable) */}
              {selectedGame === game.gameId && game.highlights.length > 0 && (
                <div className="game-highlights">
                  <div className="highlights-header">
                    <span className="highlights-icon">⭐</span>
                    Highlights
                  </div>
                  {game.highlights.slice(0, 3).map((highlight, idx) => (
                    <div key={idx} className={`highlight highlight-${highlight.importance}`}>
                      <span className="highlight-inning">Inning {highlight.inning}</span>
                      <span className="highlight-text">{highlight.description}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Expand indicator */}
              {game.highlights.length > 0 && (
                <div className="expand-indicator">
                  {selectedGame === game.gameId ? '▼ Hide Details' : '▶ Show Highlights'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveGamesFeed;
