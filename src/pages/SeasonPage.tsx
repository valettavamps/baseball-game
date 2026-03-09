import React, { useState, useEffect } from 'react';
import './SeasonPage.css';
import SeasonControl from '../components/SeasonControl';
import LiveGamesFeed from '../components/LiveGamesFeed';
import { SeasonManager } from '../engine/SeasonManager';
import { MockDataGenerator } from '../engine/MockDataGenerator';
import { GameResult } from '../engine/GameSimulator';
import { LeagueStanding } from '../types';

const SeasonPage: React.FC = () => {
  const [seasonManager, setSeasonManager] = useState<SeasonManager | null>(null);
  const [recentGames, setRecentGames] = useState<GameResult[]>([]);
  const [standings, setStandings] = useState<LeagueStanding[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize season on mount
  useEffect(() => {
    if (!isInitialized) {
      console.log('🎮 Initializing baseball season...');
      const teams = MockDataGenerator.generateLeague(30);
      const manager = new SeasonManager(teams, 2026);
      setSeasonManager(manager);
      setStandings(manager.getStandings());
      setIsInitialized(true);
      console.log('✅ Season initialized!');
    }
  }, [isInitialized]);

  const handleStartSeason = () => {
    if (!seasonManager) return;
    
    setIsSimulating(true);
    setTimeout(() => {
      seasonManager.startSeason();
      setStandings(seasonManager.getStandings());
      setIsSimulating(false);
    }, 500);
  };

  const handleSimulateDay = () => {
    if (!seasonManager) return;

    setIsSimulating(true);
    setTimeout(() => {
      const results = seasonManager.simulateDay();
      setRecentGames([...results, ...recentGames].slice(0, 20));
      setStandings(seasonManager.getStandings());
      setIsSimulating(false);
    }, 800);
  };

  const handleSimulateDays = (days: number) => {
    if (!seasonManager) return;

    setIsSimulating(true);
    setTimeout(() => {
      const results = seasonManager.simulateDays(days);
      setRecentGames([...results.slice(-20), ...recentGames].slice(0, 20));
      setStandings(seasonManager.getStandings());
      setIsSimulating(false);
    }, 1500);
  };

  const handleRefreshGames = () => {
    if (!seasonManager) return;
    const recent = seasonManager.getRecentGames(20);
    setRecentGames(recent.map(g => g.result!).filter(r => r));
  };

  if (!seasonManager) {
    return (
      <div className="season-page">
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading season...</p>
        </div>
      </div>
    );
  }

  const season = seasonManager.getSeason();

  return (
    <div className="season-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="gradient-text">Season</span> Dashboard
          </h1>
          <p className="page-subtitle">
            Manage and simulate the {season.year} baseball season
          </p>
        </div>
      </div>

      {/* Season Control Panel */}
      <SeasonControl
        season={season}
        onSimulateDay={handleSimulateDay}
        onSimulateDays={handleSimulateDays}
        onStartSeason={handleStartSeason}
        isSimulating={isSimulating}
      />

      {/* Two Column Layout */}
      <div className="season-content">
        {/* Left: Recent Games */}
        <div className="games-section">
          <LiveGamesFeed 
            games={recentGames} 
            onRefresh={handleRefreshGames}
          />
        </div>

        {/* Right: Standings */}
        <div className="standings-section">
          <div className="standings-card">
            <div className="standings-header">
              <h2>League Standings</h2>
              <span className="standings-count">{standings.length} teams</span>
            </div>
            
            {standings.length === 0 ? (
              <div className="no-standings">
                <p>Start the season to see standings</p>
              </div>
            ) : (
              <div className="standings-table-container">
                <table className="standings-table">
                  <thead>
                    <tr>
                      <th className="rank-col">#</th>
                      <th className="team-col">Team</th>
                      <th>W</th>
                      <th>L</th>
                      <th>PCT</th>
                      <th>STR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((standing) => (
                      <tr 
                        key={standing.team.id}
                        className={standing.rank <= 3 ? 'top-team' : ''}
                      >
                        <td className="rank-col">
                          {standing.rank <= 3 && (
                            <span className="rank-badge">{standing.rank}</span>
                          )}
                          {standing.rank > 3 && standing.rank}
                        </td>
                        <td className="team-col">
                          <span className="team-name">{standing.team.name}</span>
                        </td>
                        <td className="wins-col">{standing.wins}</td>
                        <td className="losses-col">{standing.losses}</td>
                        <td className="pct-col">{standing.winPct.toFixed(3)}</td>
                        <td className={`streak-col ${standing.streak.startsWith('W') ? 'win-streak' : 'loss-streak'}`}>
                          {standing.streak}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonPage;
