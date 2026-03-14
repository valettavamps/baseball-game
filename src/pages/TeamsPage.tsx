import React, { useState, useEffect } from 'react';
import './TeamsPage.css';
import { StoredTeam } from '../services/localStorage';
import { getAllTeamsFromDb, getTeamByIdDb } from '../services/db';

const TIER_NAMES = ['', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];
const TIER_COLORS = ['', '#b9f2ff', '#e5e4e2', '#ffd700', '#c0c0c0', '#cd7f32'];

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<StoredTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<StoredTeam | null>(null);
  const [activeTab, setActiveTab] = useState<'standings' | 'teams'>('standings');
  const [filterTier, setFilterTier] = useState<number | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setLoading(true);
    const loadedTeams = await getAllTeamsFromDb();
    setTeams(loadedTeams);
    setLoading(false);
  };

  const getTeamsByTier = (tier: number) => {
    return teams.filter(t => t.tier === tier);
  };

  const getStandings = () => {
    return [...teams].sort((a, b) => {
      // Sort by wins desc, then runs scored desc
      const winsDiff = b.wins - a.wins;
      if (winsDiff !== 0) return winsDiff;
      return b.runsScored - a.runsScored;
    });
  };

  const handleTeamClick = async (team: StoredTeam) => {
    const fullTeam = await getTeamByIdDb(team.id);
    setSelectedTeam(fullTeam || team);
  };

  const renderStandings = () => {
    const standings = getStandings();
    
    return (
      <div className="standings-container">
        <table className="standings-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Tier</th>
              <th>W</th>
              <th>L</th>
              <th>Pct</th>
              <th>RS</th>
              <th>RA</th>
              <th>Diff</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, idx) => {
              const totalGames = team.wins + team.losses;
              const pct = totalGames > 0 ? (team.wins / totalGames).toFixed(3) : '.000';
              const diff = team.runsScored - team.runsAllowed;
              
              return (
                <tr 
                  key={team.id} 
                  onClick={() => handleTeamClick(team)}
                  className="standings-row"
                >
                  <td className="rank-cell">{idx + 1}</td>
                  <td className="team-cell">
                    <span className="team-location">{team.city}</span>
                    <span className="team-name">{team.name}</span>
                  </td>
                  <td>
                    <span 
                      className="tier-badge"
                      style={{ backgroundColor: TIER_COLORS[team.tier] }}
                    >
                      {TIER_NAMES[team.tier]}
                    </span>
                  </td>
                  <td className="wins-cell">{team.wins}</td>
                  <td className="losses-cell">{team.losses}</td>
                  <td className="pct-cell">{pct}</td>
                  <td className="rs-cell">{team.runsScored}</td>
                  <td className="ra-cell">{team.runsAllowed}</td>
                  <td className={`diff-cell ${diff >= 0 ? 'positive' : 'negative'}`}>
                    {diff > 0 ? '+' : ''}{diff}
                  </td>
                  <td className="rating-cell">{team.rating}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTeamsList = () => {
    const tiers = [1, 2, 3, 4, 5];
    const filteredTeams = filterTier ? teams.filter(t => t.tier === filterTier) : teams;
    
    return (
      <div className="teams-list-container">
        <div className="tier-filter">
          <button 
            className={`filter-btn ${filterTier === null ? 'active' : ''}`}
            onClick={() => setFilterTier(null)}
          >
            All ({teams.length})
          </button>
          {tiers.map(tier => (
            <button
              key={tier}
              className={`filter-btn ${filterTier === tier ? 'active' : ''}`}
              style={{ '--tier-color': TIER_COLORS[tier] } as React.CSSProperties}
              onClick={() => setFilterTier(tier)}
            >
              {TIER_NAMES[tier]} ({getTeamsByTier(tier).length})
            </button>
          ))}
        </div>

        {filterTier === null ? (
          tiers.map(tier => {
            const tierTeams = getTeamsByTier(tier);
            if (tierTeams.length === 0) return null;
            
            return (
              <div key={tier} className="tier-section">
                <h3 className="tier-header" style={{ color: TIER_COLORS[tier] }}>
                  {TIER_NAMES[tier]} Tier ({tierTeams.length} teams)
                </h3>
                <div className="teams-grid">
                  {tierTeams.map(team => (
                    <div 
                      key={team.id} 
                      className="team-card"
                      onClick={() => handleTeamClick(team)}
                    >
                      <div className="team-card-header">
                        <span className="team-abbr">{team.abbreviation}</span>
                        <span 
                          className="tier-dot"
                          style={{ backgroundColor: TIER_COLORS[team.tier] }}
                        />
                      </div>
                      <div className="team-card-city">{team.city}</div>
                      <div className="team-card-name">{team.name}</div>
                      <div className="team-card-record">
                        {team.wins}-{team.losses}
                      </div>
                      <div className="team-card-rating">
                        Rating: {team.rating}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="teams-grid single-tier">
            {filteredTeams.map(team => (
              <div 
                key={team.id} 
                className="team-card"
                onClick={() => handleTeamClick(team)}
              >
                <div className="team-card-header">
                  <span className="team-abbr">{team.abbreviation}</span>
                  <span 
                    className="tier-dot"
                    style={{ backgroundColor: TIER_COLORS[team.tier] }}
                  />
                </div>
                <div className="team-card-city">{team.city}</div>
                <div className="team-card-name">{team.name}</div>
                <div className="team-card-record">
                  {team.wins}-{team.losses}
                </div>
                <div className="team-card-rating">
                  Rating: {team.rating}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTeamDetail = () => {
    if (!selectedTeam) return null;

    const totalGames = selectedTeam.wins + selectedTeam.losses;
    const pct = totalGames > 0 ? (selectedTeam.wins / totalGames * 100).toFixed(1) : '0.0';
    const diff = selectedTeam.runsScored - selectedTeam.runsAllowed;

    return (
      <div className="team-detail">
        <button className="back-btn" onClick={() => setSelectedTeam(null)}>
          ← Back to League
        </button>
        
        <div className="team-header">
          <div className="team-logo-large">
            <span className="logo-abbr">{selectedTeam.abbreviation}</span>
          </div>
          <div className="team-info">
            <h1>{selectedTeam.city} {selectedTeam.name}</h1>
            <div className="team-meta">
              <span 
                className="tier-badge-large"
                style={{ backgroundColor: TIER_COLORS[selectedTeam.tier] }}
              >
                {TIER_NAMES[selectedTeam.tier]}
              </span>
              <span className="rating-badge">Rating: {selectedTeam.rating}</span>
            </div>
          </div>
        </div>

        <div className="team-stats-grid">
          <div className="stat-card">
            <div className="stat-value">{selectedTeam.wins}</div>
            <div className="stat-label">Wins</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{selectedTeam.losses}</div>
            <div className="stat-label">Losses</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{pct}%</div>
            <div className="stat-label">Win %</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{selectedTeam.runsScored}</div>
            <div className="stat-label">Runs Scored</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{selectedTeam.runsAllowed}</div>
            <div className="stat-label">Runs Allowed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{diff > 0 ? '+' : ''}{diff}</div>
            <div className="stat-label">Run Differential</div>
          </div>
        </div>

        {selectedTeam.streak && (
          <div className="streak-banner">
            Current Streak: {selectedTeam.streakCount > 0 
              ? `${selectedTeam.streakCount} ${selectedTeam.streak}` 
              : 'None'}
          </div>
        )}

        {selectedTeam.stakers && selectedTeam.stakers.length > 0 && (
          <div className="stakers-section">
            <h3>🏆 Team Stakers</h3>
            <div className="stakers-list">
              {selectedTeam.stakers.map((staker, idx) => (
                <div key={idx} className="staker-row">
                  <span className="staker-user">User: {staker.userId}</span>
                  <span className="staker-amount">{staker.amount} CROWN</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="team-actions">
          <button className="action-btn primary">
            🎫 Buy Team Shares
          </button>
          <button className="action-btn secondary">
            📊 View Team Stats
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="teams-page">
        <div className="loading">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="teams-page">
      <div className="teams-header">
        <h1>⚾ League Teams</h1>
        <p className="subtitle">{teams.length} teams across 5 tiers</p>
      </div>

      {selectedTeam ? (
        renderTeamDetail()
      ) : (
        <>
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'standings' ? 'active' : ''}`}
              onClick={() => setActiveTab('standings')}
            >
              📊 Standings
            </button>
            <button 
              className={`tab ${activeTab === 'teams' ? 'active' : ''}`}
              onClick={() => setActiveTab('teams')}
            >
              🏟️ All Teams
            </button>
          </div>

          {activeTab === 'standings' ? renderStandings() : renderTeamsList()}
        </>
      )}
    </div>
  );
};

export default TeamsPage;
