import React, { useState, useEffect } from 'react';
import './SeasonPage.css';
import './MultiLeagueSeasonPage.css';
import SeasonControl from '../components/SeasonControl';
import LiveGamesFeed from '../components/LiveGamesFeed';
import { MultiLeagueSeasonManager } from '../engine/MultiLeagueSeasonManager';
import { MockDataGenerator } from '../engine/MockDataGenerator';
import { GameResult } from '../engine/GameSimulator';
import { LeagueStanding } from '../types';

const MultiLeagueSeasonPage: React.FC = () => {
  const [seasonManager, setSeasonManager] = useState<MultiLeagueSeasonManager | null>(null);
  const [recentGames, setRecentGames] = useState<GameResult[]>([]);
  const [allStandings, setAllStandings] = useState<Map<number, LeagueStanding[]>>(new Map());
  const [selectedTier, setSelectedTier] = useState<number>(1); // Default to Diamond League
  const [isSimulating, setIsSimulating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize season on mount
  useEffect(() => {
    if (!isInitialized) {
      console.log('🎮 Initializing tiered baseball leagues...');
      const tieredTeams = MockDataGenerator.generateTieredLeagues();
      const manager = new MultiLeagueSeasonManager(tieredTeams, 2026);
      setSeasonManager(manager);
      setAllStandings(manager.getAllStandings());
      setIsInitialized(true);
      console.log('✅ Tiered leagues initialized! 100 teams across 5 tiers');
    }
  }, [isInitialized]);

  const handleStartSeason = () => {
    if (!seasonManager) return;
    
    setIsSimulating(true);
    setTimeout(() => {
      seasonManager.startSeason();
      setAllStandings(seasonManager.getAllStandings());
      setIsSimulating(false);
    }, 500);
  };

  const handleSimulateDay = () => {
    if (!seasonManager) return;

    setIsSimulating(true);
    setTimeout(() => {
      const resultsMap = seasonManager.simulateDay();
      
      // Flatten all results for the feed
      const allResults: GameResult[] = [];
      resultsMap.forEach(results => allResults.push(...results));
      
      setRecentGames([...allResults.slice(-20), ...recentGames].slice(0, 40));
      setAllStandings(seasonManager.getAllStandings());
      setIsSimulating(false);
    }, 800);
  };

  const handleSimulateDays = (days: number) => {
    if (!seasonManager) return;

    setIsSimulating(true);
    setTimeout(() => {
      const resultsMap = seasonManager.simulateDays(days);
      
      // Flatten all results
      const allResults: GameResult[] = [];
      resultsMap.forEach(results => allResults.push(...results));
      
      setRecentGames([...allResults.slice(-30), ...recentGames].slice(0, 40));
      setAllStandings(seasonManager.getAllStandings());
      setIsSimulating(false);
    }, 1500);
  };

  const handleRefreshGames = () => {
    if (!seasonManager) return;
    const recentMap = seasonManager.getRecentGames(10);
    const allResults: GameResult[] = [];
    recentMap.forEach(games => {
      games.forEach(g => g.result && allResults.push(g.result));
    });
    setRecentGames(allResults);
  };

  if (!seasonManager) {
    return (
      <div className="season-page">
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading tiered leagues...</p>
        </div>
      </div>
    );
  }

  const season = seasonManager.getSeason();
  const currentLeague = seasonManager.getLeagueConfig(selectedTier);
  const standings = allStandings.get(selectedTier) || [];
  
  // Get first league's season for the control panel
  const firstLeague = season.leagues.get(1);
  const controlSeason = firstLeague?.getSeason();

  const tierNames = ['Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];
  const tierEmojis = ['💎', '🏆', '🥇', '🥈', '🥉'];

  return (
    <div className="season-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="gradient-text">Tiered</span> Leagues
          </h1>
          <p className="page-subtitle">
            100 teams across 5 tiers • Promotion & relegation every season
          </p>
        </div>
      </div>

      {/* Season Control Panel */}
      {controlSeason && (
        <SeasonControl
          season={controlSeason}
          onSimulateDay={handleSimulateDay}
          onSimulateDays={handleSimulateDays}
          onStartSeason={handleStartSeason}
          isSimulating={isSimulating}
        />
      )}

      {/* League Tier Tabs */}
      <div className="tier-tabs">
        {[1, 2, 3, 4, 5].map((tier) => (
          <button
            key={tier}
            className={`tier-tab ${selectedTier === tier ? 'active' : ''}`}
            onClick={() => setSelectedTier(tier)}
          >
            <span className="tier-emoji">{tierEmojis[tier - 1]}</span>
            <span className="tier-name">{tierNames[tier - 1]}</span>
            {currentLeague && tier === selectedTier && (
              <span className="tier-teams-count">{currentLeague.teams.length} teams</span>
            )}
          </button>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="season-content">
        {/* Left: Recent Games */}
        <div className="games-section">
          <LiveGamesFeed 
            games={recentGames.filter(g => {
              // Show all games or filter by tier if needed
              return true;
            })} 
            onRefresh={handleRefreshGames}
          />
        </div>

        {/* Right: Standings for Selected Tier */}
        <div className="standings-section">
          <div className="standings-card">
            <div className="standings-header">
              <div className="standings-title-row">
                <span className="tier-emoji-large">{tierEmojis[selectedTier - 1]}</span>
                <div>
                  <h2>{currentLeague?.name || 'League'}</h2>
                  <p className="league-description">{currentLeague?.description || ''}</p>
                </div>
              </div>
              <div className="league-info">
                <span className="info-badge">
                  {currentLeague?.revenueMultiplier}x Revenue
                </span>
                {currentLeague && currentLeague.promotionSlots > 0 && (
                  <span className="info-badge promotion">
                    ↑ Top {currentLeague.promotionSlots}
                  </span>
                )}
                {currentLeague && currentLeague.relegationSlots > 0 && (
                  <span className="info-badge relegation">
                    ↓ Bottom {currentLeague.relegationSlots}
                  </span>
                )}
              </div>
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
                    {standings.map((standing) => {
                      const isPromotionZone = currentLeague && standing.rank <= currentLeague.promotionSlots;
                      const isRelegationZone = currentLeague && 
                        currentLeague.relegationSlots > 0 && 
                        standing.rank > (standings.length - currentLeague.relegationSlots);
                      
                      return (
                        <tr 
                          key={standing.team.id}
                          className={`
                            ${isPromotionZone ? 'promotion-zone' : ''}
                            ${isRelegationZone ? 'relegation-zone' : ''}
                          `}
                        >
                          <td className="rank-col">
                            {isPromotionZone && <span className="zone-indicator promotion">↑</span>}
                            {isRelegationZone && <span className="zone-indicator relegation">↓</span>}
                            {!isPromotionZone && !isRelegationZone && standing.rank}
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
                      );
                    })}
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

export default MultiLeagueSeasonPage;
