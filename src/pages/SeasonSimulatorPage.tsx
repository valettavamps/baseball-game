/**
 * SeasonSimulatorPage.tsx
 * Full season simulation with team stats and box scores - BaseHit style
 */

import React, { useState } from 'react';
import { GameSimulator } from '../engine/GameSimulator';
import { Team, Player, PlayerStats } from '../types';
import './SeasonSimulatorPage.css';
import './SeasonSimulatorPage.css';

interface SeasonGame {
  id: number;
  date: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeHits: number;
  awayHits: number;
  homeErrors: number;
  awayErrors: number;
  winner: 'home' | 'away';
  homePitcher: string;
  awayPitcher: string;
}

interface PlayerSeasonStats {
  id: string;
  name: string;
  position: string;
  games: number;
  atBats: number;
  runs: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  rbi: number;
  walks: number;
  strikeouts: number;
  stolenBases: number;
  caughtStealing: number;
}

const SeasonSimulatorPage: React.FC = () => {
  const [games, setGames] = useState<SeasonGame[]>([]);
  const [team1Stats, setTeam1Stats] = useState<PlayerSeasonStats[]>([]);
  const [team2Stats, setTeam2Stats] = useState<PlayerSeasonStats[]>([]);
  const [team1, setTeam1] = useState<Team | null>(null);
  const [team2, setTeam2] = useState<Team | null>(null);
  const [simming, setSimming] = useState(false);
  const [selectedGame, setSelectedGame] = useState<SeasonGame | null>(null);
  const [view, setView] = useState<'schedule' | 'team1' | 'team2'>('schedule');

  // Generate realistic team
  const generateTeam = (teamId: string, teamName: string, seed: number): Team => {
    const positions = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];
    const roster: Player[] = [];

    const namePool = ['Mike', 'Chris', 'Carlos', 'Juan', 'Alex', 'David', 'Jose', 'Anthony', 'Jacob', 'Nick', 'Matt', 'Ryan', 'Steve', 'Paul', 'Mark', 'Tom', 'James', 'John', 'William', 'Robert'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin'];

    // 5 pitchers
    for (let i = 0; i < 5; i++) {
      const velocity = 70 + Math.floor(Math.random() * 25) + (seed % 10);
      const control = 60 + Math.floor(Math.random() * 30);
      roster.push({
        id: `${teamId}-P${i + 1}`,
        name: `${namePool[(seed + i * 3) % namePool.length]} ${lastNames[(seed * 2 + i * 7) % lastNames.length]}`,
        position: 'P',
        teamId,
        overall: Math.floor((velocity + control) / 2),
        attributes: {
          contact: 30 + Math.floor(Math.random() * 30),
          power: 30 + Math.floor(Math.random() * 30),
          speed: 20 + Math.floor(Math.random() * 40),
          discipline: 40 + Math.floor(Math.random() * 40),
          fielding: 40 + Math.floor(Math.random() * 40),
          arm: 50 + Math.floor(Math.random() * 40),
          stamina: 60 + Math.floor(Math.random() * 40),
          velocity,
          control,
          movement: 40 + Math.floor(Math.random() * 40)
        },
        stats: { gamesPlayed: 0, atBats: 0, hits: 0, homeRuns: 0, rbi: 0, battingAvg: 0, ops: 0, stolenBases: 0 },
        contract: { status: 'signed', salary: 100000, duration: 3, seasonsRemaining: 3 },
        upcomingGames: []
      });
    }

    // 9 position players
    for (let i = 0; i < 9; i++) {
      const overall = 60 + Math.floor(Math.random() * 38);
      const isPowerHitter = Math.random() > 0.5;
      
      roster.push({
        id: `${teamId}-${i + 1}`,
        name: `${namePool[(seed + i * 5 + 10) % namePool.length]} ${lastNames[(seed * 3 + i * 11) % lastNames.length]}`,
        position: positions[i],
        teamId,
        overall,
        attributes: {
          contact: 50 + Math.floor(Math.random() * 40),
          power: isPowerHitter ? 70 + Math.floor(Math.random() * 30) : 40 + Math.floor(Math.random() * 30),
          speed: 30 + Math.floor(Math.random() * 60),
          discipline: 50 + Math.floor(Math.random() * 40),
          fielding: 50 + Math.floor(Math.random() * 40),
          arm: 50 + Math.floor(Math.random() * 40),
          stamina: 70 + Math.floor(Math.random() * 30),
          velocity: 30 + Math.floor(Math.random() * 30),
          control: 40 + Math.floor(Math.random() * 30),
          movement: 30 + Math.floor(Math.random() * 40)
        },
        stats: { gamesPlayed: 0, atBats: 0, hits: 0, homeRuns: 0, rbi: 0, battingAvg: 0, ops: 0, stolenBases: 0 },
        contract: { status: 'signed', salary: overall * 2000, duration: 3, seasonsRemaining: 3 },
        upcomingGames: []
      });
    }

    return {
      id: teamId,
      name: teamName,
      owner: 'system',
      roster,
      record: { wins: 0, losses: 0 },
      league: 'Test League',
      division: 'Test',
      currentTier: 1,
      tierHistory: [],
      overallRating: 75,
      crownStaked: 0,
      treasury: 0
    };
  };

  const calculateBattingStats = (team: Team, games: SeasonGame[]): PlayerSeasonStats[] => {
    const stats: Map<string, PlayerSeasonStats> = new Map();

    // Initialize stats for all position players
    team.roster.filter(p => p.position !== 'P').forEach(player => {
      stats.set(player.id, {
        id: player.id,
        name: player.name,
        position: player.position,
        games: 0,
        atBats: 0,
        runs: 0,
        hits: 0,
        doubles: 0,
        triples: 0,
        homeRuns: 0,
        rbi: 0,
        walks: 0,
        strikeouts: 0,
        stolenBases: 0,
        caughtStealing: 0
      });
    });

    // Simulate stats based on game outcomes (simplified)
    const teamGames = games.filter(g => g.homeTeam === team.name || g.awayTeam === team.name);
    const isHome = teamGames.map(g => g.homeTeam === team.name);
    
    teamGames.forEach((game, idx) => {
      const home = isHome[idx];
      const score = home ? game.homeScore : game.awayScore;
      const hits = home ? game.homeHits : game.awayHits;
      const runs = score;
      
      // Distribute hits and runs across players
      const players = team.roster.filter(p => p.position !== 'P');
      let remainingHits = hits;
      let remainingRuns = runs;
      
      players.forEach((player, i) => {
        const s = stats.get(player.id)!;
        s.games++;
        s.atBats += 4; // Approximate AB per game
        
        // Random distribution
        if (remainingHits > 0 && Math.random() < 0.3) {
          const hitType = Math.random();
          s.hits++;
          if (hitType < 0.03) { s.homeRuns++; s.rbi += Math.random() > 0.5 ? 1 : 0; }
          else if (hitType < 0.05) { s.triples++; }
          else if (hitType < 0.25) { s.doubles++; }
          remainingHits--;
        }
        
        if (remainingRuns > 0 && Math.random() < 0.2) {
          s.runs++;
          remainingRuns--;
        }
        
        if (Math.random() < 0.08) s.walks++;
        if (Math.random() < 0.22) s.strikeouts++;
        if (Math.random() < 0.02) s.stolenBases++;
        if (Math.random() < 0.01) s.caughtStealing++;
      });
    });

    return Array.from(stats.values()).sort((a, b) => b.hits - a.hits);
  };

  const runSeason = async (numGames: number = 160) => {
    setSimming(true);
    
    // Generate teams
    const t1 = generateTeam('team1', 'Brooklyn Bombers', 1);
    const t2 = generateTeam('team2', 'Queens Kings', 2);
    setTeam1(t1);
    setTeam2(t2);

    const simulatedGames: SeasonGame[] = [];
    
    // Simulate games
    for (let i = 0; i < numGames; i++) {
      const isHome = i % 2 === 0;
      const homeTeam = isHome ? t1 : t2;
      const awayTeam = isHome ? t2 : t1;
      
      const result = GameSimulator.simulateGame(homeTeam, awayTeam);
      
      const game: SeasonGame = {
        id: i + 1,
        date: i + 1,
        homeTeam: homeTeam.name,
        awayTeam: awayTeam.name,
        homeScore: result.homeTeam.score,
        awayScore: result.awayTeam.score,
        homeHits: result.homeTeam.hits,
        awayHits: result.awayTeam.hits,
        homeErrors: result.homeTeam.errors,
        awayErrors: result.awayTeam.errors,
        winner: result.winner,
        homePitcher: homeTeam.roster.find(p => p.position === 'P')?.name || 'Unknown',
        awayPitcher: awayTeam.roster.find(p => p.position === 'P')?.name || 'Unknown'
      };
      
      simulatedGames.push(game);
      
      // Update records
      if (result.winner === 'home') {
        if (isHome) { t1.record.wins++; t2.record.losses++; }
        else { t2.record.wins++; t1.record.losses++; }
      } else {
        if (!isHome) { t1.record.wins++; t2.record.losses++; }
        else { t2.record.wins++; t1.record.losses++; }
      }
    }

    setGames(simulatedGames);
    setTeam1Stats(calculateBattingStats(t1, simulatedGames));
    setTeam2Stats(calculateBattingStats(t2, simulatedGames));
    setSimming(false);
  };

  const calcAvg = (hits: number, ab: number) => ab > 0 ? (hits / ab).toFixed(3).replace(/^0/, '') : '.000';
  const calcOBP = (h: number, bb: number, ab: number) => ab > 0 ? ((h + bb) / (ab + bb)).toFixed(3).replace(/^0/, '') : '.000';
  const calcSLG = (h: number, d: number, t: number, hr: number, ab: number) => {
    if (ab === 0) return '.000';
    const bases = d + 2*t + 3*hr;
    const slg = bases / ab;
    return slg.toFixed(3).replace(/^0/, '');
  };

  return (
    <div className="season-simulator">
      <div className="sim-header">
        <h1>🏆 Season Simulator</h1>
        <p>Simulate a full 160-game season and view stats BaseHit-style</p>
        
        {!games.length && (
          <button 
            className="sim-btn" 
            onClick={() => runSeason(160)}
            disabled={simming}
          >
            {simming ? 'Simulating...' : '▶ Sim 160 Game Season'}
          </button>
        )}

        {games.length > 0 && (
          <div className="sim-controls">
            <button className="sim-btn secondary" onClick={() => runSeason(160)} disabled={simming}>
              🔄 Run Another Season
            </button>
            <div className="view-tabs">
              <button className={view === 'schedule' ? 'active' : ''} onClick={() => setView('schedule')}>
                📅 Schedule
              </button>
              <button className={view === 'team1' ? 'active' : ''} onClick={() => setView('team1')}>
                ⚾ {team1?.name}
              </button>
              <button className={view === 'team2' ? 'active' : ''} onClick={() => setView('team2')}>
                ⚾ {team2?.name}
              </button>
            </div>
          </div>
        )}
      </div>

      {games.length > 0 && (
        <div className="sim-content">
          {/* Record Summary */}
          <div className="record-summary">
            <div className="team-record">
              <h3>{team1?.name}</h3>
              <span className="record">{team1?.record.wins}W - {team1?.record.losses}L</span>
            </div>
            <div className="vs">VS</div>
            <div className="team-record">
              <h3>{team2?.name}</h3>
              <span className="record">{team2?.record.wins}W - {team2?.record.losses}L</span>
            </div>
          </div>

          {/* Schedule View */}
          {view === 'schedule' && (
            <div className="schedule-view">
              <h2>📅 Season Schedule & Results</h2>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Date</th>
                    <th>Away</th>
                    <th>Home</th>
                    <th>Result</th>
                    <th>Score</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {games.slice(0, 50).map(game => (
                    <tr key={game.id} className={game.id % 2 === 0 ? 'even' : ''}>
                      <td>{game.id}</td>
                      <td>Day {game.date}</td>
                      <td>{game.awayTeam}</td>
                      <td>{game.homeTeam}</td>
                      <td>
                        <span className={game.winner === 'home' ? 'win' : 'loss'}>
                          {game.winner === 'home' ? 'W' : 'L'}
                        </span>
                      </td>
                      <td>{game.winner === 'home' ? `${game.homeScore}-${game.awayScore}` : `${game.awayScore}-${game.homeScore}`}</td>
                      <td>
                        <button className="box-btn" onClick={() => setSelectedGame(game)}>
                          📊 Box
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {games.length > 50 && <p className="more-games">...and {games.length - 50} more games</p>}
            </div>
          )}

          {/* Team Stats View */}
          {(view === 'team1' || view === 'team2') && (
            <div className="stats-view">
              <h2>📊 {view === 'team1' ? team1?.name : team2?.name} - Batting Stats</h2>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Name</th>
                    <th>G</th>
                    <th>AB</th>
                    <th>R</th>
                    <th>H</th>
                    <th>2B</th>
                    <th>3B</th>
                    <th>HR</th>
                    <th>RBI</th>
                    <th>BB</th>
                    <th>SO</th>
                    <th>SB</th>
                    <th>CS</th>
                    <th>AVG</th>
                    <th>OBP</th>
                    <th>SLG</th>
                    <th>OPS</th>
                  </tr>
                </thead>
                <tbody>
                  {(view === 'team1' ? team1Stats : team2Stats).map(player => {
                    const avg = calcAvg(player.hits, player.atBats);
                    const obp = calcOBP(player.hits, player.walks, player.atBats);
                    const slg = calcSLG(player.hits, player.doubles, player.triples, player.homeRuns, player.atBats);
                    const ops = (parseFloat(obp) + parseFloat(slg)).toFixed(3).replace(/^0/, '');
                    return (
                      <tr key={player.id}>
                        <td>{player.position}</td>
                        <td>{player.name}</td>
                        <td>{player.games}</td>
                        <td>{player.atBats}</td>
                        <td>{player.runs}</td>
                        <td>{player.hits}</td>
                        <td>{player.doubles}</td>
                        <td>{player.triples}</td>
                        <td>{player.homeRuns}</td>
                        <td>{player.rbi}</td>
                        <td>{player.walks}</td>
                        <td>{player.strikeouts}</td>
                        <td>{player.stolenBases}</td>
                        <td>{player.caughtStealing}</td>
                        <td>{avg}</td>
                        <td>{obp}</td>
                        <td>{slg}</td>
                        <td>{ops}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Box Score Modal */}
      {selectedGame && (
        <div className="box-modal" onClick={() => setSelectedGame(null)}>
          <div className="box-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedGame(null)}>×</button>
            <h2>📊 Box Score - Game {selectedGame.id}</h2>
            
            <div className="box-score">
              <div className="inning-header">
                <span></span>
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                <span>6</span><span>7</span><span>8</span><span>9</span>
                <span>R</span><span>H</span><span>E</span>
              </div>
              <div className="team-row">
                <span>{selectedGame.awayTeam}</span>
                <span>0</span><span>0</span><span>0</span><span>{selectedGame.winner === 'away' ? selectedGame.awayScore : 0}</span>
                <span>0</span><span>0</span><span>0</span><span>0</span><span>0</span>
                <span>{selectedGame.awayScore}</span>
                <span>{selectedGame.awayHits}</span>
                <span>{selectedGame.awayErrors}</span>
              </div>
              <div className="team-row">
                <span>{selectedGame.homeTeam}</span>
                <span>0</span><span>0</span><span>0</span><span>{selectedGame.winner === 'home' ? selectedGame.homeScore : 0}</span>
                <span>0</span><span>0</span><span>0</span><span>0</span><span>0</span>
                <span>{selectedGame.homeScore}</span>
                <span>{selectedGame.homeHits}</span>
                <span>{selectedGame.homeErrors}</span>
              </div>
            </div>

            <div className="box-details">
              <p><strong>W:</strong> {selectedGame.winner === 'home' ? selectedGame.homePitcher : selectedGame.awayPitcher}</p>
              <p><strong>L:</strong> {selectedGame.winner === 'away' ? selectedGame.homePitcher : selectedGame.awayPitcher}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonSimulatorPage;
