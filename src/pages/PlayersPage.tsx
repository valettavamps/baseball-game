import React from 'react';
import './PlayersPage.css';
import { Player } from '../types';

// Mock player data
const mockPlayers: Player[] = [
  {
    id: 'p1',
    name: 'Marcus "Hammer" Johnson',
    position: 'CF',
    team: 'Solana Sluggers',
    teamId: 't1',
    overall: 92,
    attributes: { power: 88, contact: 95, speed: 90, fielding: 85, arm: 78, discipline: 82, stamina: 88 },
    stats: { gamesPlayed: 58, atBats: 230, hits: 82, homeRuns: 18, rbi: 52, battingAvg: 0.357, ops: 1.042, stolenBases: 24 },
    contract: { status: 'signed', teamId: 't1', teamName: 'Solana Sluggers', salary: 15000, duration: 3, seasonsRemaining: 2 },
    upcomingGames: [],
  },
  {
    id: 'p2',
    name: 'Diego "Fuego" Ramirez',
    position: 'P',
    team: 'Solana Sluggers',
    teamId: 't1',
    overall: 88,
    attributes: { power: 45, contact: 50, speed: 60, fielding: 72, arm: 95, discipline: 70, stamina: 85, velocity: 97, control: 88, movement: 92 },
    stats: { gamesPlayed: 22, atBats: 10, hits: 2, homeRuns: 0, rbi: 1, battingAvg: 0.200, ops: 0.450, stolenBases: 0, wins: 14, losses: 3, era: 2.45, strikeouts: 198, innings: 158 },
    contract: { status: 'signed', teamId: 't1', teamName: 'Solana Sluggers', salary: 18000, duration: 4, seasonsRemaining: 3 },
    upcomingGames: [],
  },
  {
    id: 'p3',
    name: 'Kenji "Flash" Tanaka',
    position: 'SS',
    team: 'Solana Sluggers',
    teamId: 't1',
    overall: 85,
    attributes: { power: 65, contact: 88, speed: 95, fielding: 92, arm: 82, discipline: 78, stamina: 80 },
    stats: { gamesPlayed: 60, atBats: 245, hits: 78, homeRuns: 8, rbi: 35, battingAvg: 0.318, ops: 0.865, stolenBases: 38 },
    contract: { status: 'signed', teamId: 't1', teamName: 'Solana Sluggers', salary: 12000, duration: 2, seasonsRemaining: 1 },
    upcomingGames: [],
  },
  {
    id: 'p4',
    name: 'Big Mike Williams',
    position: '1B',
    team: undefined,
    overall: 78,
    attributes: { power: 95, contact: 70, speed: 40, fielding: 65, arm: 60, discipline: 72, stamina: 75 },
    stats: { gamesPlayed: 45, atBats: 170, hits: 48, homeRuns: 22, rbi: 58, battingAvg: 0.282, ops: 0.985, stolenBases: 0 },
    contract: { status: 'free_agent', salary: 0, duration: 0, seasonsRemaining: 0 },
    upcomingGames: [],
  },
];

const getOverallColor = (overall: number): string => {
  if (overall >= 90) return '#00d4aa';
  if (overall >= 80) return '#3b82f6';
  if (overall >= 70) return '#f59e0b';
  return '#94a3b8';
};

const PlayersPage: React.FC = () => {
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);

  return (
    <div className="players-page">
      <div className="players-header">
        <div>
          <h1>My Players</h1>
          <p className="players-subtitle">Your stable of {mockPlayers.length} players</p>
        </div>
        <button className="create-player-btn">
          <span>+</span> Create Player
        </button>
      </div>

      <div className="players-grid">
        {mockPlayers.map((player) => (
          <div
            key={player.id}
            className={`baseball-card ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
            onClick={() => setSelectedPlayer(player)}
          >
            <div className="card-top" style={{ borderColor: getOverallColor(player.overall) }}>
              <div className="card-overall" style={{ background: getOverallColor(player.overall) }}>
                {player.overall}
              </div>
              <div className="card-position">{player.position}</div>
            </div>
            <div className="card-avatar">
              <div className="avatar-placeholder">
                {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            </div>
            <div className="card-info">
              <h3 className="card-name">{player.name}</h3>
              <span className={`card-team ${!player.team ? 'free-agent' : ''}`}>
                {player.team || 'Free Agent'}
              </span>
            </div>
            <div className="card-quick-stats">
              <div className="quick-stat">
                <span className="qs-value">{player.stats.battingAvg.toFixed(3)}</span>
                <span className="qs-label">AVG</span>
              </div>
              <div className="quick-stat">
                <span className="qs-value">{player.stats.homeRuns}</span>
                <span className="qs-label">HR</span>
              </div>
              <div className="quick-stat">
                <span className="qs-value">{player.stats.rbi}</span>
                <span className="qs-label">RBI</span>
              </div>
            </div>
            <div className="card-contract-badge">
              <span className={`contract-status ${player.contract.status}`}>
                {player.contract.status === 'signed' 
                  ? `${player.contract.seasonsRemaining}yr left` 
                  : 'Free Agent'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Player Detail Panel */}
      {selectedPlayer && (
        <div className="player-detail-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="player-detail" onClick={(e) => e.stopPropagation()}>
            <button className="close-detail" onClick={() => setSelectedPlayer(null)}>✕</button>
            <div className="detail-header">
              <div className="detail-avatar">
                {selectedPlayer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="detail-info">
                <h2>{selectedPlayer.name}</h2>
                <div className="detail-meta">
                  <span className="detail-position">{selectedPlayer.position}</span>
                  <span className="detail-overall" style={{ color: getOverallColor(selectedPlayer.overall) }}>
                    {selectedPlayer.overall} OVR
                  </span>
                  <span className={`detail-team ${!selectedPlayer.team ? 'free-agent' : ''}`}>
                    {selectedPlayer.team || 'Free Agent'}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-sections">
              <div className="detail-section">
                <h3>Attributes</h3>
                <div className="attributes-grid">
                  {Object.entries(selectedPlayer.attributes).map(([key, value]) => (
                    <div key={key} className="attribute-bar">
                      <span className="attr-label">{key.toUpperCase()}</span>
                      <div className="attr-track">
                        <div className="attr-fill" style={{ width: `${value}%`, background: getOverallColor(value) }} />
                      </div>
                      <span className="attr-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-item"><span className="stat-val">{selectedPlayer.stats.gamesPlayed}</span><span className="stat-lbl">GP</span></div>
                  <div className="stat-item"><span className="stat-val">{selectedPlayer.stats.battingAvg.toFixed(3)}</span><span className="stat-lbl">AVG</span></div>
                  <div className="stat-item"><span className="stat-val">{selectedPlayer.stats.homeRuns}</span><span className="stat-lbl">HR</span></div>
                  <div className="stat-item"><span className="stat-val">{selectedPlayer.stats.rbi}</span><span className="stat-lbl">RBI</span></div>
                  <div className="stat-item"><span className="stat-val">{selectedPlayer.stats.ops.toFixed(3)}</span><span className="stat-lbl">OPS</span></div>
                  <div className="stat-item"><span className="stat-val">{selectedPlayer.stats.stolenBases}</span><span className="stat-lbl">SB</span></div>
                  {selectedPlayer.stats.era !== undefined && (
                    <>
                      <div className="stat-item"><span className="stat-val">{selectedPlayer.stats.era?.toFixed(2)}</span><span className="stat-lbl">ERA</span></div>
                      <div className="stat-item"><span className="stat-val">{selectedPlayer.stats.strikeouts}</span><span className="stat-lbl">K</span></div>
                      <div className="stat-item"><span className="stat-val">{selectedPlayer.stats.wins}-{selectedPlayer.stats.losses}</span><span className="stat-lbl">W-L</span></div>
                    </>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3>Contract</h3>
                <div className="contract-info">
                  <div className="contract-row">
                    <span>Status</span>
                    <span className={selectedPlayer.contract.status}>{selectedPlayer.contract.status.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  {selectedPlayer.contract.teamName && (
                    <div className="contract-row">
                      <span>Team</span>
                      <span>{selectedPlayer.contract.teamName}</span>
                    </div>
                  )}
                  {selectedPlayer.contract.salary > 0 && (
                    <div className="contract-row">
                      <span>Salary</span>
                      <span>{selectedPlayer.contract.salary.toLocaleString()} DERBY/season</span>
                    </div>
                  )}
                  {selectedPlayer.contract.seasonsRemaining > 0 && (
                    <div className="contract-row">
                      <span>Remaining</span>
                      <span>{selectedPlayer.contract.seasonsRemaining} seasons</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersPage;
