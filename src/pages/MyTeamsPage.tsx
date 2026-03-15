import React, { useState, useEffect } from 'react';
import './MyTeamsPage.css';
import { StoredTeam } from '../services/localStorage';
import { getAllTeamsFromDb, getTeamByIdDb } from '../services/db';
import { getCurrentUser } from '../services/localStorage';

const TIER_NAMES = ['', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];
const TIER_COLORS = ['', '#b9f2ff', '#e5e4e2', '#ffd700', '#c0c0c0', '#cd7f32'];

const MyTeamsPage: React.FC = () => {
  const [ownedTeams, setOwnedTeams] = useState<StoredTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<StoredTeam | null>(null);
  const [user] = useState(getCurrentUser());

  useEffect(() => {
    loadOwnedTeams();
  }, []);

  const loadOwnedTeams = async () => {
    setLoading(true);
    const allTeams = await getAllTeamsFromDb();
    
    // Filter teams owned by current user (or mock for demo)
    // For now, let's show some teams as "owned" for demo purposes
    const owned = allTeams.slice(0, 2); // Just take first 2 for demo
    setOwnedTeams(owned);
    setLoading(false);
  };

  const handleTeamClick = async (team: StoredTeam) => {
    const fullTeam = await getTeamByIdDb(team.id);
    setSelectedTeam(fullTeam || team);
  };

  const renderTeamCard = (team: StoredTeam) => {
    const totalGames = team.wins + team.losses;
    const pct = totalGames > 0 ? (team.wins / totalGames * 100).toFixed(1) : '0.0';
    
    return (
      <div key={team.id} className="my-team-card" onClick={() => handleTeamClick(team)}>
        <div className="team-card-header">
          <span className="team-abbr">{team.abbreviation}</span>
          <span className="tier-badge" style={{ backgroundColor: TIER_COLORS[team.tier] }}>
            {TIER_NAMES[team.tier]}
          </span>
        </div>
        <div className="team-card-body">
          <h3 className="team-name">{team.city} {team.name}</h3>
          <div className="team-record">{team.wins}-{team.losses}</div>
          <div className="team-pct">{pct}%</div>
          <div className="team-rating">Rating: {team.rating}</div>
        </div>
        <div className="team-card-footer">
          <span className="view-home-btn">View Home →</span>
        </div>
      </div>
    );
  };

  const renderTeamHome = () => {
    if (!selectedTeam) return null;

    const totalGames = selectedTeam.wins + selectedTeam.losses;
    const pct = totalGames > 0 ? (selectedTeam.wins / totalGames * 100).toFixed(1) : '0.0';
    const diff = selectedTeam.runsScored - selectedTeam.runsAllowed;

    return (
      <div className="team-home">
        <button className="back-btn" onClick={() => setSelectedTeam(null)}>
          ← Back to My Teams
        </button>

        {/* Team Header */}
        <div className="team-home-header">
          <div className="team-logo">
            <span className="logo-abbr">{selectedTeam.abbreviation}</span>
          </div>
          <div className="team-home-info">
            <h1>{selectedTeam.city} {selectedTeam.name}</h1>
            <div className="team-home-meta">
              <span className="tier-badge-large" style={{ backgroundColor: TIER_COLORS[selectedTeam.tier] }}>
                {TIER_NAMES[selectedTeam.tier]} Tier
              </span>
              <span className="rating-badge">Rating: {selectedTeam.rating}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="team-quick-stats">
          <div className="quick-stat-card">
            <span className="qs-value">{selectedTeam.wins}</span>
            <span className="qs-label">Wins</span>
          </div>
          <div className="quick-stat-card">
            <span className="qs-value">{selectedTeam.losses}</span>
            <span className="qs-label">Losses</span>
          </div>
          <div className="quick-stat-card">
            <span className="qs-value">{pct}%</span>
            <span className="qs-label">Win %</span>
          </div>
          <div className="quick-stat-card">
            <span className="qs-value">{diff > 0 ? '+' : ''}{diff}</span>
            <span className="qs-label">Run Diff</span>
          </div>
        </div>

        {/* Team Sections */}
        <div className="team-home-sections">
          <div className="team-section">
            <h2>📋 Roster</h2>
            <p className="section-placeholder">No players on roster yet</p>
          </div>

          <div className="team-section">
            <h2>📊 Statistics</h2>
            <div className="stats-table-mini">
              <div className="stat-row">
                <span>Runs Scored</span>
                <span>{selectedTeam.runsScored}</span>
              </div>
              <div className="stat-row">
                <span>Runs Allowed</span>
                <span>{selectedTeam.runsAllowed}</span>
              </div>
              <div className="stat-row">
                <span>Revenue</span>
                <span>${selectedTeam.revenue?.toLocaleString() || 0}</span>
              </div>
              <div className="stat-row">
                <span>Attendance</span>
                <span>{selectedTeam.attendance?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          <div className="team-section">
            <h2>🏆 Stakes</h2>
            <p className="section-placeholder">No active stakes</p>
          </div>
        </div>

        {/* Owner Actions */}
        <div className="team-actions">
          <button className="action-btn primary">Manage Roster</button>
          <button className="action-btn secondary">Set Sliders</button>
          <button className="action-btn secondary">View Schedule</button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="my-teams-page">
        <div className="loading">Loading your teams...</div>
      </div>
    );
  }

  return (
    <div className="my-teams-page">
      {selectedTeam ? (
        renderTeamHome()
      ) : (
        <>
          <div className="my-teams-header">
            <h1>My Teams</h1>
            <p className="subtitle">
              {user ? `Teams owned by ${user.username}` : 'Your baseball teams'}
            </p>
          </div>

          {ownedTeams.length > 0 ? (
            <div className="my-teams-grid">
              {ownedTeams.map(renderTeamCard)}
            </div>
          ) : (
            <div className="no-teams">
              <div className="no-teams-icon">🏟️</div>
              <h2>No Teams Yet</h2>
              <p>You don't own any teams. Visit the marketplace to purchase a team!</p>
              <button className="buy-team-btn">Browse Marketplace</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyTeamsPage;
