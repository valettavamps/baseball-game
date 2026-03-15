import React, { useState, useEffect } from 'react';
import './TeamsPage.css'; // Reuse TeamsPage styles
import { StoredTeam } from '../services/localStorage';
import { getAllTeamsFromDb } from '../services/db';

const TIER_NAMES = ['', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];
const TIER_COLORS = ['', '#b9f2ff', '#e5e4e2', '#ffd700', '#c0c0c0', '#cd7f32'];

const StandingsPage: React.FC = () => {
  const [teams, setTeams] = useState<StoredTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setLoading(true);
    const loadedTeams = await getAllTeamsFromDb();
    setTeams(loadedTeams);
    setLoading(false);
  };

  const getStandings = () => {
    return [...teams].sort((a, b) => {
      const winsDiff = b.wins - a.wins;
      if (winsDiff !== 0) return winsDiff;
      return b.runsScored - a.runsScored;
    });
  };

  if (loading) {
    return (
      <div className="teams-page">
        <div className="loading">Loading standings...</div>
      </div>
    );
  }

  const standings = getStandings();

  return (
    <div className="teams-page">
      <div className="teams-header">
        <h1>📊 League Standings</h1>
        <p className="subtitle">{teams.length} teams</p>
      </div>

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
            </tr>
          </thead>
          <tbody>
            {standings.map((team, idx) => {
              const totalGames = team.wins + team.losses;
              const pct = totalGames > 0 ? (team.wins / totalGames).toFixed(3) : '.000';
              const diff = team.runsScored - team.runsAllowed;
              
              return (
                <tr key={team.id} className="standings-row">
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsPage;
