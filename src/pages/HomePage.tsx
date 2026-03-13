import React, { useState, useCallback } from 'react';
import './HomePage.css';
import { Game, LeagueStanding, Team, Player } from '../types';
import LiveGameVisualizer, { PlayByPlay } from '../components/LiveGameVisualizer';
import { GameState } from '../components/BaseballField';
import { GameSimulator } from '../engine/GameSimulator';

interface HomePageProps {
  isSignedIn?: boolean;
  onSignUp?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ isSignedIn = false, onSignUp }) => {
  // Sample live game for visualizer
  const [liveGameState, setLiveGameState] = useState<GameState>({
    inning: 1,
    topBottom: 'top',
    outs: 0,
    balls: 0,
    strikes: 0,
    homeScore: 0,
    awayScore: 0,
    runners: [false, false, false],
    battingOrder: [],
    fielders: {
      pitcher: 'Marcus Webb',
      catcher: 'Jake Torres',
      firstBase: 'Carlos Mendez',
      secondBase: 'Tony Russo',
      thirdBase: 'Derek Kim',
      shortstop: 'Mike Santos',
      leftField: 'Tyler Blake',
      centerField: 'Chris Park',
      rightField: 'Danny O\'Brien'
    },
    batterId: 'Chen',
    pitcherId: 'Kevin Hart',
    fieldConfig: 'standard'
  });
  
  const [livePlayByPlay, setLivePlayByPlay] = useState<PlayByPlay[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [gameInning, setGameInning] = useState(1);
  const [isTop, setIsTop] = useState(true);

  // Create mock teams for simulation
  const createMockTeam = (name: string): Team => ({
    id: name.toLowerCase().replace(/\s/g, '-'),
    name,
    owner: 'AI',
    roster: Array.from({ length: 9 }, (_, i) => ({
      id: `p${i}`,
      name: `Player ${i + 1}`,
      position: i === 0 ? 'P' : i === 1 ? 'C' : i === 2 ? '1B' : i === 3 ? '2B' : i === 4 ? '3B' : i === 5 ? 'SS' : i === 6 ? 'LF' : i === 7 ? 'CF' : 'RF',
      overall: 70 + Math.floor(Math.random() * 25),
      contact: 60 + Math.floor(Math.random() * 35),
      power: 60 + Math.floor(Math.random() * 35),
      speed: 60 + Math.floor(Math.random() * 35),
      discipline: 60 + Math.floor(Math.random() * 35),
      arm: 60 + Math.floor(Math.random() * 35),
    })) as Player[],
    record: { wins: Math.floor(Math.random() * 30), losses: Math.floor(Math.random() * 30) },
    league: 'Diamond League',
    currentTier: 1,
    tierHistory: [],
    overallRating: 75,
    crownStaked: 1000,
    treasury: 5000,
  });

  // Simulate a full game
  const simulateGame = useCallback(() => {
    setIsSimulating(true);
    setGameInning(1);
    setIsTop(true);
    setLivePlayByPlay([]);
    
    const homeTeam = createMockTeam('New York Eagles');
    const awayTeam = createMockTeam('Boston Wolves');
    
    // Run simulation
    const result = GameSimulator.simulateGame(homeTeam, awayTeam);
    
    // Build play-by-play from innings
    const newPlayByPlay: PlayByPlay[] = [];
    let currentInning = 1;
    let isTopInning = true;
    
    // Process each inning
    const processInning = () => {
      if (currentInning > 9) {
        setIsSimulating(false);
        return;
      }
      
      const inningResult = result.innings[currentInning - 1];
      if (!inningResult) {
        currentInning++;
        setGameInning(currentInning);
        setTimeout(processInning, 500);
        return;
      }
      
      const events = isTopInning ? inningResult.events : inningResult.events;
      
      // Update game state for each event
      events.forEach((event, idx) => {
        newPlayByPlay.push({
          inning: currentInning,
          topBottom: isTopInning ? 'top' : 'bottom',
          description: event.description,
          runsThisPlay: event.rbi || 0
        });
        
        // Update game state
        setLiveGameState(prev => ({
          ...prev,
          inning: currentInning,
          topBottom: isTopInning ? 'top' : 'bottom',
          outs: prev.outs + (event.type === 'out' || event.type === 'strikeout' ? 1 : 0),
          balls: event.type === 'walk' ? 4 : 0,
          strikes: event.type === 'strikeout' ? 3 : (event.type === 'out' ? 1 : 0),
          homeScore: isTopInning ? prev.homeScore : (prev.homeScore + (event.rbi || 0)),
          awayScore: isTopInning ? (prev.awayScore + (event.rbi || 0)) : prev.awayScore,
          runners: event.type === 'single' ? [true, prev.runners[0], prev.runners[1]] :
                   event.type === 'double' ? [false, true, prev.runners[0]] :
                   event.type === 'walk' ? [true, prev.runners[0], prev.runners[1]] : prev.runners
        }));
      });
      
      setLivePlayByPlay([...newPlayByPlay]);
      
      // Move to next half-inning or inning
      if (isTopInning) {
        setIsTop(false);
      } else {
        setIsTop(true);
        currentInning++;
      }
      setGameInning(currentInning);
      
      setTimeout(processInning, 800);
    };
    
    // Start the simulation loop
    setTimeout(processInning, 500);
  }, []);

// Mock data
const upcomingGames: Game[] = [
  {
    id: '1',
    homeTeam: { id: 't1', name: 'Solana Sluggers', record: { wins: 42, losses: 18 } },
    awayTeam: { id: 't2', name: 'Phantom Pitchers', record: { wins: 38, losses: 22 } },
    scheduledTime: '2026-03-08T22:00:00Z',
    status: 'scheduled',
    league: 'Diamond League',
  },
  {
    id: '2',
    homeTeam: { id: 't3', name: 'Anchor Arms', record: { wins: 35, losses: 25 } },
    awayTeam: { id: 't4', name: 'Metaplex Maulers', record: { wins: 33, losses: 27 } },
    scheduledTime: '2026-03-08T23:30:00Z',
    status: 'live',
    score: { home: 4, away: 2 },
    league: 'Diamond League',
  },
  {
    id: '3',
    homeTeam: { id: 't5', name: 'Raydium Rockets', record: { wins: 30, losses: 30 } },
    awayTeam: { id: 't6', name: 'Jupiter Giants', record: { wins: 28, losses: 32 } },
    scheduledTime: '2026-03-09T01:00:00Z',
    status: 'scheduled',
    league: 'Silver League',
  },
];

const standings: LeagueStanding[] = [
  { rank: 1, team: { id: 't1', name: 'Solana Sluggers', record: { wins: 42, losses: 18 } }, gamesPlayed: 60, wins: 42, losses: 18, winPct: 0.700, streak: 'W5' },
  { rank: 2, team: { id: 't2', name: 'Phantom Pitchers', record: { wins: 38, losses: 22 } }, gamesPlayed: 60, wins: 38, losses: 22, winPct: 0.633, streak: 'W2' },
  { rank: 3, team: { id: 't3', name: 'Anchor Arms', record: { wins: 35, losses: 25 } }, gamesPlayed: 60, wins: 35, losses: 25, winPct: 0.583, streak: 'L1' },
  { rank: 4, team: { id: 't4', name: 'Metaplex Maulers', record: { wins: 33, losses: 27 } }, gamesPlayed: 60, wins: 33, losses: 27, winPct: 0.550, streak: 'W3' },
  { rank: 5, team: { id: 't5', name: 'Raydium Rockets', record: { wins: 30, losses: 30 } }, gamesPlayed: 60, wins: 30, losses: 30, winPct: 0.500, streak: 'L2' },
  { rank: 6, team: { id: 't6', name: 'Jupiter Giants', record: { wins: 28, losses: 32 } }, gamesPlayed: 60, wins: 28, losses: 32, winPct: 0.467, streak: 'W1' },
  { rank: 7, team: { id: 't7', name: 'Orca Outfielders', record: { wins: 25, losses: 35 } }, gamesPlayed: 60, wins: 25, losses: 35, winPct: 0.417, streak: 'L3' },
  { rank: 8, team: { id: 't8', name: 'Sage Ballers', record: { wins: 22, losses: 38 } }, gamesPlayed: 60, wins: 22, losses: 38, winPct: 0.367, streak: 'W2' },
];

  return (
    <div className="home-page">
      {/* Hero / Overview */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">SIMFORGE</span> BASEBALL
          </h1>
          <p className="hero-subtitle">
            Build your dynasty. Own your players. Dominate the league.
          </p>
          
          {!isSignedIn && onSignUp && (
            <div className="hero-cta">
              <button className="cta-btn primary" onClick={onSignUp}>
                <span className="cta-icon">⭐</span>
                Start Your Career
              </button>
              <p className="cta-subtext">Create your player • Get scouted • Sign contracts</p>
            </div>
          )}

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">2,847</span>
              <span className="hero-stat-label">Active Players</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">186</span>
              <span className="hero-stat-label">Teams</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">24</span>
              <span className="hero-stat-label">Leagues</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">$142K</span>
              <span className="hero-stat-label">Total Staked</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Game Visualizer */}
      <section className="live-game-section">
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <button 
            onClick={simulateGame} 
            disabled={isSimulating}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: isSimulating ? '#666' : '#4ecca3',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: isSimulating ? 'not-allowed' : 'pointer'
            }}
          >
            {isSimulating ? 'Simulating Game...' : '⚾ Simulate New Game'}
          </button>
        </div>
        <LiveGameVisualizer
          homeTeamName="New York Eagles"
          awayTeamName="Boston Wolves"
          homeTeamColor="#4ecca3"
          awayTeamColor="#e94560"
          gameState={liveGameState}
          playByPlay={livePlayByPlay}
          isLive={true}
        />
      </section>

      <div className="home-grid">
        {/* Upcoming Games */}
        <section className="card upcoming-games">
          <div className="card-header">
            <h2>Upcoming Games</h2>
            <a href="#games" className="view-all">View All →</a>
          </div>
          <div className="games-list">
            {upcomingGames.map((game) => (
              <div key={game.id} className={`game-card ${game.status}`}>
                {game.status === 'live' && (
                  <div className="live-badge">
                    <span className="live-dot-sm" />
                    LIVE
                  </div>
                )}
                <div className="game-teams">
                  <div className="game-team">
                    <span className="team-name">{game.awayTeam.name}</span>
                    <span className="team-record">
                      ({game.awayTeam.record.wins}-{game.awayTeam.record.losses})
                    </span>
                  </div>
                  <div className="game-vs">
                    {game.score ? (
                      <span className="game-score">
                        {game.score.away} - {game.score.home}
                      </span>
                    ) : (
                      <span className="game-time">
                        {new Date(game.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <div className="game-team">
                    <span className="team-name">{game.homeTeam.name}</span>
                    <span className="team-record">
                      ({game.homeTeam.record.wins}-{game.homeTeam.record.losses})
                    </span>
                  </div>
                </div>
                <div className="game-league">{game.league}</div>
              </div>
            ))}
          </div>
        </section>

        {/* League Standings */}
        <section className="card standings">
          <div className="card-header">
            <h2>Top Standings</h2>
            <a href="#standings" className="view-all">View All →</a>
          </div>
          <table className="standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>W</th>
                <th>L</th>
                <th>PCT</th>
                <th>STR</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s) => (
                <tr key={s.rank}>
                  <td className="rank">{s.rank}</td>
                  <td className="team-cell">{s.team.name}</td>
                  <td>{s.wins}</td>
                  <td>{s.losses}</td>
                  <td className="pct">{s.winPct.toFixed(3)}</td>
                  <td className={`streak ${s.streak.startsWith('W') ? 'win-streak' : 'loss-streak'}`}>
                    {s.streak}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
