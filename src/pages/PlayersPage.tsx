import React, { useState } from 'react';
import './PlayersPage.css';
import { Player } from '../types';

// Convert number to letter grade
function numberToGrade(value: number): string {
  if (value >= 97) return 'A+';
  if (value >= 93) return 'A';
  if (value >= 90) return 'A-';
  if (value >= 87) return 'B+';
  if (value >= 83) return 'B';
  if (value >= 80) return 'B-';
  if (value >= 77) return 'C+';
  if (value >= 73) return 'C';
  if (value >= 70) return 'C-';
  if (value >= 67) return 'D+';
  if (value >= 63) return 'D';
  if (value >= 60) return 'D-';
  return 'F';
}

interface PlayersPageProps {
  onPlayerClick?: (player: Player) => void;
}

// Mock transaction data
interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw' | 'salary' | 'bonus' | 'signing' | 'trade';
  amount: number;
  description: string;
}

const mockTransactions: Transaction[] = [
  { id: 't1', date: '2026-03-14', type: 'deposit', amount: 50000, description: 'BALLS Token Deposit' },
  { id: 't2', date: '2026-03-12', type: 'salary', amount: 15000, description: 'Marcus Johnson Salary' },
  { id: 't3', date: '2026-03-10', type: 'bonus', amount: 5000, description: 'Performance Bonus' },
  { id: 't4', date: '2026-03-08', type: 'buy', amount: -25000, description: 'Bought BALLS' },
  { id: 't5', date: '2026-03-05', type: 'signing', amount: -10000, description: 'Signing Bonus Paid' },
  { id: 't6', date: '2026-03-01', type: 'deposit', amount: 100000, description: 'BALLS Token Deposit' },
  { id: 't7', date: '2026-02-28', type: 'salary', amount: 18000, description: 'Diego Ramirez Salary' },
  { id: 't8', date: '2026-02-25', type: 'withdraw', amount: -10000, description: 'Withdrew to Wallet' },
];

// TODO: Replace with Supabase query - get players for current user
const mockPlayers: Player[] = [
  {
    id: 'p1',
    name: 'Marcus "Hammer" Johnson',
    position: 'CF',
    team: 'Solana Sluggers',
    teamId: 't1',
    overall: 92,
    attributes: { power: 88, contact: 95, speed: 90, fielding: 85, arm: 78, discipline: 82, endurance: 88 },
    stats: { gamesPlayed: 58, atBats: 230, hits: 82, homeRuns: 18, rbi: 52, battingAvg: 0.357, ops: 1.042, stolenBases: 24 },
    contract: { status: 'signed', teamId: 't1', teamName: 'Solana Sluggers', salary: 15000, duration: 3, seasonsRemaining: 2 },
    upcomingGames: [],
    // Extended data
    experience: 8,
    debutDate: '2018-04-03',
    salary: 2500000,
    acquired: 'Free Agent, 2022',
    throwingHand: 'R',
    battingHand: 'R',
    height: 72,
    weight: 195,
    age: 31,
    ratings: { discipline: 82, contact: 95, power: 88, speed: 90, runAccuracy: 78, glove: 85, arm: 78, endurance: 82 },
    potential: { discipline: 85, contact: 98, power: 92, speed: 92, runAccuracy: 82, glove: 88, arm: 82, endurance: 85 },
    seasonBatting: {
      year: 2026,
      teamId: 't1',
      teamName: 'Solana Sluggers',
      gamesPlayed: 145,
      pa: 612,
      ab: 538,
      runs: 98,
      hits: 172,
      doubles: 32,
      triples: 8,
      homeRuns: 28,
      rbi: 95,
      walks: 62,
      strikeouts: 95,
      stolenBases: 24,
      caughtStealing: 6,
      avg: 0.320,
      obp: 0.385,
      slg: 0.545,
      ops: 0.930,
      tb: 293,
      gbFb: 1.15,
      sf: 12,
      hbp: 8,
      gdp: 12,
      roe: 5,
      xb: 68,
      bro: 0.742,
      sa: 0.185,
      rc: 112.5,
      lWts: 42.18,
      abHr: 19.2,
      tbpa: 0.479
    },
    careerBatting: {
      gamesPlayed: 1245,
      pa: 5180,
      ab: 4520,
      runs: 825,
      hits: 1420,
      doubles: 285,
      triples: 45,
      homeRuns: 245,
      rbi: 890,
      walks: 580,
      strikeouts: 820,
      stolenBases: 145,
      caughtStealing: 38,
      avg: 0.314,
      obp: 0.378,
      slg: 0.518,
      ops: 0.896
    },
    fieldingStats: [
      { position: 'CF', gamesPlayed: 138, po: 285, a: 12, e: 3, tc: 300, dp: 8, sb: 0, cs: 0, csPct: 0, pct: 0.990, rng: 2.15 }
    ],
    awards: { mvp: 1, allStar: 4, goldGlove: 2, silverSlugger: 3, cyYoung: 0, roty: 0, playerOfGame: 45, worldSeriesRings: 1, hallOfFameScore: 0, hallOfFameInducted: false },
    seasonHistory: [
      { year: 2026, teamId: 't1', teamName: 'Solana Sluggers', position: 'CF', gamesPlayed: 145, avg: 0.320, hr: 28, rbi: 95 },
      { year: 2025, teamId: 't1', teamName: 'Solana Sluggers', position: 'CF', gamesPlayed: 158, avg: 0.312, hr: 32, rbi: 102 },
      { year: 2024, teamId: 't1', teamName: 'Solana Sluggers', position: 'CF', gamesPlayed: 155, avg: 0.298, hr: 25, rbi: 88 },
    ]
  },
  {
    id: 'p2',
    name: 'Diego "Fuego" Ramirez',
    position: 'P',
    team: 'Solana Sluggers',
    teamId: 't1',
    overall: 88,
    attributes: { power: 45, contact: 50, speed: 60, fielding: 72, arm: 95, discipline: 70, endurance: 85, velocity: 97, control: 88, movement: 92 },
    stats: { gamesPlayed: 22, atBats: 10, hits: 2, homeRuns: 0, rbi: 1, battingAvg: 0.200, ops: 0.450, stolenBases: 0, wins: 14, losses: 3, era: 2.45, strikeouts: 198, innings: 158 },
    contract: { status: 'signed', teamId: 't1', teamName: 'Solana Sluggers', salary: 18000, duration: 4, seasonsRemaining: 3 },
    upcomingGames: [],
    // Extended pitcher data
    experience: 6,
    debutDate: '2020-04-15',
    salary: 3200000,
    acquired: 'Draft, 2018 Round 2',
    draftYear: 2018,
    draftRound: 2,
    draftPick: 45,
    draftedBy: 'Solana Sluggers',
    throwingHand: 'R',
    battingHand: 'R',
    height: 76,
    weight: 225,
    age: 28,
    ratings: { discipline: 70, contact: 45, power: 50, speed: 40, runAccuracy: 55, glove: 60, arm: 95, endurance: 85 },
    potential: { discipline: 78, contact: 50, power: 55, speed: 45, runAccuracy: 60, glove: 65, arm: 98, endurance: 90 },
    seasonPitching: {
      year: 2026,
      teamId: 't1',
      teamName: 'Solana Sluggers',
      gamesPlayed: 28,
      gamesStarted: 28,
      wins: 16,
      losses: 8,
      era: 3.12,
      innings: 195.2,
      hits: 175,
      runs: 72,
      earnedRuns: 68,
      walks: 55,
      strikeouts: 205,
      hr: 18,
      so9: 9.4,
      bb9: 2.5,
      soBb: 3.73,
      go: 145,
      fo: 168,
      ffo: 22,
      ir: 18,
      irs: 8,
      oavg: 0.238,
      oobp: 0.312,
      oslg: 0.385,
      oops: 0.697,
      lWts: 45.2,
      babip: 0.285
    },
    fieldingStats: [
      { position: 'P', gamesPlayed: 28, po: 12, a: 18, e: 1, tc: 31, dp: 2, sb: 0, cs: 0, csPct: 0, pct: 0.968, rng: 1.07 }
    ],
    awards: { mvp: 0, allStar: 2, goldGlove: 0, silverSlugger: 0, cyYoung: 1, roty: 0, playerOfGame: 12, worldSeriesRings: 1, hallOfFameScore: 0, hallOfFameInducted: false },
    seasonHistory: [
      { year: 2026, teamId: 't1', teamName: 'Solana Sluggers', position: 'P', gamesPlayed: 28, avg: 0, hr: 0, rbi: 0, wins: 16, losses: 8, era: 3.12 },
      { year: 2025, teamId: 't1', teamName: 'Solana Sluggers', position: 'P', gamesPlayed: 30, avg: 0, hr: 0, rbi: 0, wins: 18, losses: 6, era: 2.85 },
    ]
  },
  {
    id: 'p3',
    name: 'Kenji "Flash" Tanaka',
    position: 'SS',
    team: 'Solana Sluggers',
    teamId: 't1',
    overall: 85,
    attributes: { power: 65, contact: 88, speed: 95, fielding: 92, arm: 82, discipline: 78, endurance: 80 },
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
    attributes: { power: 95, contact: 70, speed: 40, fielding: 65, arm: 60, discipline: 72, endurance: 75 },
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

const PlayersPage: React.FC<PlayersPageProps> = ({ onPlayerClick }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeTab, setActiveTab] = useState<'players' | 'finances'>('players');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter players based on search
  const filteredPlayers = mockPlayers.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate BALLS balance
  const ballsBalance = mockTransactions.reduce((sum, t) => sum + t.amount, 0);

  const handleCardClick = (player: Player) => {
    setSelectedPlayer(player);
    if (onPlayerClick) {
      onPlayerClick(player);
    }
  };

  const renderPlayersTab = () => (
    <div className="players-tab">
      <div className="players-header">
        <input
          type="text"
          placeholder="Search players..."
          className="player-search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="players-list">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className="player-card"
            onClick={() => onPlayerClick?.(player)}
          >
            <div className="player-info">
              <span className="player-name">{player.name}</span>
              <span className="player-position">{player.position}</span>
            </div>
            <div className="player-rating">
              <span className="rating-value">{numberToGrade(player.overall)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFinancesTab = () => (
    <div className="finances-tab">
      <div className="finances-header">
        <div className="balance-section">
          <span className="balance-label">BALLS Balance</span>
          <span className="balance-amount">{ballsBalance.toLocaleString()}</span>
        </div>
        <div className="balance-actions">
          <button className="buy-balls-btn">Buy BALLS</button>
          <button className="withdraw-btn">Withdraw</button>
        </div>
      </div>

      <div className="transactions-section">
        <h2>Transaction History</h2>
        <div className="transactions-list">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="transaction-row">
              <div className="tx-info">
                <span className="tx-date">{tx.date}</span>
                <span className="tx-desc">{tx.description}</span>
              </div>
              <span className={`tx-amount ${tx.amount >= 0 ? 'positive' : 'negative'}`}>
                {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="players-page">
      {/* Tabs */}
      <div className="page-tabs">
        <button 
          className={`page-tab ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          Players
        </button>
        <button 
          className={`page-tab ${activeTab === 'finances' ? 'active' : ''}`}
          onClick={() => setActiveTab('finances')}
        >
          Finances
        </button>
      </div>

      {activeTab === 'players' ? renderPlayersTab() : renderFinancesTab()}

      {/* Player Detail Panel */}
      {selectedPlayer && activeTab === 'players' && (
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
                      <span className="attr-value">{numberToGrade(value)}</span>
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
