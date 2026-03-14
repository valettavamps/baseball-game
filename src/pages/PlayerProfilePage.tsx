import React, { useState } from 'react';
import './PlayerProfilePage.css';

interface PlayerRatings {
  discipline: number;
  contact: number;
  power: number;
  speed: number;
  runAccuracy: number;
  glove: number;
  arm: number;
  endurance: number;
}

interface SeasonBatting {
  year: number;
  teamName: string;
  gamesPlayed: number;
  pa: number;
  ab: number;
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
  avg: number;
  obp: number;
  slg: number;
  ops: number;
  // Extended
  tb: number;
  gbFb: number;
  sf: number;
  hbp: number;
  gdp: number;
  roe: number;
  xb: number;
  bro: number;
  sa: number;
  rc: number;
  lWts: number;
  abHr: number;
  tbpa: number;
}

interface CareerBatting {
  gamesPlayed: number;
  pa: number;
  ab: number;
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
  avg: number;
  obp: number;
  slg: number;
  ops: number;
}

interface FieldingStats {
  position: string;
  gamesPlayed: number;
  po: number;
  a: number;
  e: number;
  tc: number;
  dp: number;
  sb: number;
  cs: number;
  csPct: number;
  pct: number;
  rng: number;
}

interface SeasonPitching {
  year: number;
  teamName: string;
  gamesPlayed: number;
  gamesStarted: number;
  wins: number;
  losses: number;
  era: number;
  innings: number;
  hits: number;
  runs: number;
  earnedRuns: number;
  walks: number;
  strikeouts: number;
  hr: number;
  so9: number;
  bb9: number;
  soBb: number;
  go: number;
  fo: number;
  ffo: number;
  ir: number;
  irs: number;
  oavg: number;
  oobp: number;
  oslg: number;
  oops: number;
  lWts: number;
  babip: number;
}

interface PlayerAwards {
  mvp: number;
  allStar: number;
  goldGlove: number;
  silverSlugger: number;
  cyYoung: number;
  roty: number;
  playerOfGame: number;
  worldSeriesRings: number;
  hallOfFameScore: number;
  hallOfFameInducted: boolean;
}

interface PlayerAchievement {
  date: string;
  achievement: string;
  opponent: string;
  result: string;
}

interface SeasonHistoryEntry {
  year: number;
  teamName: string;
  position: string;
  gamesPlayed: number;
  avg: number;
  hr: number;
  rbi: number;
  wins?: number;
  losses?: number;
  era?: number;
}

interface PlayerProfileProps {
  player: {
    id: string;
    name: string;
    position: string;
    team?: string;
    teamId?: string;
    overall: number;
    throwingHand: string;
    battingHand: string;
    height: number;
    weight: number;
    age: number;
    experience?: number;
    debutDate?: string;
    lastGameDate?: string;
    salary?: number;
    acquired?: string;
    draftYear?: number;
    draftRound?: number;
    draftPick?: number;
    draftedBy?: string;
    ratings?: PlayerRatings;
    potential?: PlayerRatings;
    seasonBatting?: SeasonBatting;
    careerBatting?: CareerBatting;
    fieldingStats?: FieldingStats[];
    seasonPitching?: SeasonPitching;
    awards?: PlayerAwards;
    achievements?: PlayerAchievement[];
    seasonHistory?: SeasonHistoryEntry[];
  };
  onBack: () => void;
}

type TabType = 'summary' | 'stats' | 'awards' | 'history';

const PlayerProfilePage: React.FC<PlayerProfileProps> = ({ player, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [showExtended, setShowExtended] = useState(false);

  const getOverallColor = (overall: number): string => {
    if (overall >= 90) return '#00d4aa';
    if (overall >= 80) return '#3b82f6';
    if (overall >= 70) return '#f59e0b';
    return '#94a3b8';
  };

  const isPitcher = player.position === 'P';

  return (
    <div className="player-profile-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="profile-info">
          <h1>{player.name}</h1>
          <div className="profile-meta">
            <span className="meta-position">{player.position}</span>
            <span className="meta-overall" style={{ color: getOverallColor(player.overall) }}>
              OVR: {player.overall}
            </span>
            <span className="meta-team">{player.team || 'Free Agent'}</span>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="info-bar">
        <div className="info-item"><span className="info-label">Age</span><span className="info-value">{player.age}</span></div>
        <div className="info-item"><span className="info-label">Bats</span><span className="info-value">{player.battingHand}</span></div>
        <div className="info-item"><span className="info-label">Throws</span><span className="info-value">{player.throwingHand}</span></div>
        <div className="info-item"><span className="info-label">Height</span><span className="info-value">{Math.floor(player.height / 12)}'{player.height % 12}"</span></div>
        <div className="info-item"><span className="info-label">Weight</span><span className="info-value">{player.weight}#</span></div>
        {player.experience !== undefined && (
          <div className="info-item"><span className="info-label">Experience</span><span className="info-value">{player.experience} years</span></div>
        )}
        {player.salary !== undefined && (
          <div className="info-item"><span className="info-label">Salary</span><span className="info-value">${player.salary?.toLocaleString()}</span></div>
        )}
        {player.acquired && (
          <div className="info-item"><span className="info-label">Acquired</span><span className="info-value">{player.acquired}</span></div>
        )}
      </div>

      {/* Ratings Section */}
      {(player.ratings || player.potential) && (
        <div className="ratings-section">
          <h3>Ratings</h3>
          <div className="ratings-tables">
            <div className="ratings-table">
              <h4>Current</h4>
              <div className="ratings-grid">
                {player.ratings && Object.entries(player.ratings).map(([key, value]) => (
                  <div key={key} className="rating-item">
                    <span className="rating-label">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                    <div className="rating-bar">
                      <div className="rating-fill" style={{ width: `${value}%`, background: getOverallColor(value) }} />
                    </div>
                    <span className="rating-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ratings-table">
              <h4>Potential</h4>
              <div className="ratings-grid">
                {player.potential && Object.entries(player.potential).map(([key, value]) => (
                  <div key={key} className="rating-item">
                    <span className="rating-label">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                    <div className="rating-bar">
                      <div className="rating-fill" style={{ width: `${value}%`, background: getOverallColor(value) }} />
                    </div>
                    <span className="rating-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs">
        <button className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary</button>
        <button className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Stats</button>
        <button className={`tab-btn ${activeTab === 'awards' ? 'active' : ''}`} onClick={() => setActiveTab('awards')}>Awards</button>
        <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History</button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'summary' && (
          <div className="summary-tab">
            {isPitcher ? (
              // Pitcher Summary
              player.seasonPitching && (
                <div className="stats-section">
                  <h4>{player.seasonPitching.year} Season</h4>
                  <div className="stats-grid">
                    <div className="stat-box"><span className="stat-val">{player.seasonPitching.wins}</span><span className="stat-lbl">W</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonPitching.losses}</span><span className="stat-lbl">L</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonPitching.era.toFixed(2)}</span><span className="stat-lbl">ERA</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonPitching.innings.toFixed(1)}</span><span className="stat-lbl">IP</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonPitching.strikeouts}</span><span className="stat-lbl">K</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonPitching.walks}</span><span className="stat-lbl">BB</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonPitching.hits}</span><span className="stat-lbl">H</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonPitching.hr}</span><span className="stat-lbl">HR</span></div>
                  </div>
                </div>
              )
            ) : (
              // Batter Summary
              player.seasonBatting && (
                <div className="stats-section">
                  <h4>{player.seasonBatting.year} Season</h4>
                  <div className="stats-grid">
                    <div className="stat-box"><span className="stat-val">{player.seasonBatting.gamesPlayed}</span><span className="stat-lbl">G</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonBatting.pa}</span><span className="stat-lbl">PA</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonBatting.hits}</span><span className="stat-lbl">H</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonBatting.homeRuns}</span><span className="stat-lbl">HR</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonBatting.rbi}</span><span className="stat-lbl">RBI</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonBatting.runs}</span><span className="stat-lbl">R</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonBatting.avg.toFixed(3)}</span><span className="stat-lbl">AVG</span></div>
                    <div className="stat-box"><span className="stat-val">{player.seasonBatting.ops.toFixed(3)}</span><span className="stat-lbl">OPS</span></div>
                  </div>
                </div>
              )
            )}
            
            {/* Fielding */}
            {player.fieldingStats && player.fieldingStats.length > 0 && (
              <div className="stats-section">
                <h4>Fielding</h4>
                <table className="fielding-table">
                  <thead>
                    <tr>
                      <th>Pos</th><th>G</th><th>PO</th><th>A</th><th>E</th><th>TC</th><th>DP</th><th>PCT</th><th>RNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {player.fieldingStats.map((f, i) => (
                      <tr key={i}>
                        <td>{f.position}</td>
                        <td>{f.gamesPlayed}</td>
                        <td>{f.po}</td>
                        <td>{f.a}</td>
                        <td>{f.e}</td>
                        <td>{f.tc}</td>
                        <td>{f.dp}</td>
                        <td>{f.pct.toFixed(3)}</td>
                        <td>{f.rng.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-tab">
            <div className="stats-toggle">
              <button className={!showExtended ? 'active' : ''} onClick={() => setShowExtended(false)}>Standard</button>
              <button className={showExtended ? 'active' : ''} onClick={() => setShowExtended(true)}>Extended</button>
            </div>
            
            {isPitcher ? (
              <div className="pitching-stats">
                <h4>{player.seasonPitching?.year || '2026'} Pitching Stats</h4>
                <table className="stats-table">
                  <thead>
                    <tr>
                      {!showExtended ? (
                        <>
                          <th>W</th><th>L</th><th>ERA</th><th>IP</th><th>H</th><th>R</th><th>BB</th><th>K</th><th>HR</th>
                        </>
                      ) : (
                        <>
                          <th>W</th><th>L</th><th>ERA</th><th>IP</th><th>SO9</th><th>BB9</th><th>SOBB</th><th>GO</th><th>FO</th><th>HR</th><th>OAVG</th><th>OOPS</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {player.seasonPitching && (
                      <tr>
                        {!showExtended ? (
                          <>
                            <td>{player.seasonPitching.wins}</td>
                            <td>{player.seasonPitching.losses}</td>
                            <td>{player.seasonPitching.era.toFixed(2)}</td>
                            <td>{player.seasonPitching.innings.toFixed(1)}</td>
                            <td>{player.seasonPitching.hits}</td>
                            <td>{player.seasonPitching.runs}</td>
                            <td>{player.seasonPitching.walks}</td>
                            <td>{player.seasonPitching.strikeouts}</td>
                            <td>{player.seasonPitching.hr}</td>
                          </>
                        ) : (
                          <>
                            <td>{player.seasonPitching.wins}</td>
                            <td>{player.seasonPitching.losses}</td>
                            <td>{player.seasonPitching.era.toFixed(2)}</td>
                            <td>{player.seasonPitching.innings.toFixed(1)}</td>
                            <td>{player.seasonPitching.so9.toFixed(1)}</td>
                            <td>{player.seasonPitching.bb9.toFixed(1)}</td>
                            <td>{player.seasonPitching.soBb.toFixed(2)}</td>
                            <td>{player.seasonPitching.go}</td>
                            <td>{player.seasonPitching.fo}</td>
                            <td>{player.seasonPitching.hr}</td>
                            <td>{player.seasonPitching.oavg.toFixed(3)}</td>
                            <td>{player.seasonPitching.oops.toFixed(3)}</td>
                          </>
                        )}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="batting-stats">
                <h4>{player.seasonBatting?.year || '2026'} Batting Stats</h4>
                <table className="stats-table">
                  <thead>
                    <tr>
                      {!showExtended ? (
                        <>
                          <th>G</th><th>PA</th><th>AB</th><th>R</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>RBI</th><th>BB</th><th>SO</th><th>SB</th><th>AVG</th><th>OBP</th><th>SLG</th><th>OPS</th>
                        </>
                      ) : (
                        <>
                          <th>PA</th><th>TB</th><th>GBFB</th><th>SF</th><th>HBP</th><th>GDP</th><th>ROE</th><th>XB</th><th>BRO</th><th>SA</th><th>RC</th><th>LWTS</th><th>ABHR</th><th>TBPA</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {player.seasonBatting && (
                      <tr>
                        {!showExtended ? (
                          <>
                            <td>{player.seasonBatting.gamesPlayed}</td>
                            <td>{player.seasonBatting.pa}</td>
                            <td>{player.seasonBatting.ab}</td>
                            <td>{player.seasonBatting.runs}</td>
                            <td>{player.seasonBatting.hits}</td>
                            <td>{player.seasonBatting.doubles}</td>
                            <td>{player.seasonBatting.triples}</td>
                            <td>{player.seasonBatting.homeRuns}</td>
                            <td>{player.seasonBatting.rbi}</td>
                            <td>{player.seasonBatting.walks}</td>
                            <td>{player.seasonBatting.strikeouts}</td>
                            <td>{player.seasonBatting.stolenBases}</td>
                            <td>{player.seasonBatting.avg.toFixed(3)}</td>
                            <td>{player.seasonBatting.obp.toFixed(3)}</td>
                            <td>{player.seasonBatting.slg.toFixed(3)}</td>
                            <td>{player.seasonBatting.ops.toFixed(3)}</td>
                          </>
                        ) : (
                          <>
                            <td>{player.seasonBatting.pa}</td>
                            <td>{player.seasonBatting.tb}</td>
                            <td>{player.seasonBatting.gbFb}%</td>
                            <td>{player.seasonBatting.sf}</td>
                            <td>{player.seasonBatting.hbp}</td>
                            <td>{player.seasonBatting.gdp}</td>
                            <td>{player.seasonBatting.roe}</td>
                            <td>{player.seasonBatting.xb}</td>
                            <td>{player.seasonBatting.bro.toFixed(3)}</td>
                            <td>{player.seasonBatting.sa.toFixed(3)}</td>
                            <td>{player.seasonBatting.rc.toFixed(1)}</td>
                            <td>{player.seasonBatting.lWts.toFixed(2)}</td>
                            <td>{player.seasonBatting.abHr.toFixed(2)}</td>
                            <td>{player.seasonBatting.tbpa.toFixed(3)}</td>
                          </>
                        )}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'awards' && (
          <div className="awards-tab">
            {player.awards && (
              <div className="awards-summary">
                <div className="award-stat"><span className="award-val">{player.awards.mvp}</span><span className="award-lbl">MVP</span></div>
                <div className="award-stat"><span className="award-val">{player.awards.allStar}</span><span className="award-lbl">All-Star</span></div>
                <div className="award-stat"><span className="award-val">{player.awards.goldGlove}</span><span className="award-lbl">Gold Glove</span></div>
                <div className="award-stat"><span className="award-val">{player.awards.silverSlugger}</span><span className="award-lbl">Silver Slugger</span></div>
                {player.awards.cyYoung > 0 && <div className="award-stat"><span className="award-val">{player.awards.cyYoung}</span><span className="award-lbl">Cy Young</span></div>}
                <div className="award-stat"><span className="award-val">{player.awards.worldSeriesRings}</span><span className="award-lbl">Rings</span></div>
                {player.awards.hallOfFameScore > 0 && (
                  <div className="award-stat"><span className="award-val">{player.awards.hallOfFameScore.toFixed(2)}</span><span className="award-lbl">HOF Score</span></div>
                )}
              </div>
            )}
            
            {player.achievements && player.achievements.length > 0 && (
              <div className="achievements-section">
                <h4>Achievements</h4>
                <table className="achievements-table">
                  <thead><tr><th>Date</th><th>Achievement</th><th>Opponent</th><th>Result</th></tr></thead>
                  <tbody>
                    {player.achievements.map((a, i) => (
                      <tr key={i}>
                        <td>{a.date}</td>
                        <td>{a.achievement}</td>
                        <td>{a.opponent}</td>
                        <td>{a.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {!player.awards && (!player.achievements || player.achievements.length === 0) && (
              <p className="no-data">No awards or achievements yet.</p>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            {player.seasonHistory && player.seasonHistory.length > 0 ? (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Year</th><th>Team</th><th>Pos</th><th>G</th><th>AVG</th><th>HR</th><th>RBI</th>
                    {isPitcher && <th>W-L</th><th>ERA</th>}
                  </tr>
                </thead>
                <tbody>
                  {player.seasonHistory.map((h, i) => (
                    <tr key={i}>
                      <td>{h.year}</td>
                      <td>{h.teamName}</td>
                      <td>{h.position}</td>
                      <td>{h.gamesPlayed}</td>
                      <td>{h.avg.toFixed(3)}</td>
                      <td>{h.hr}</td>
                      <td>{h.rbi}</td>
                      {isPitcher && <td>{h.wins}-{h.losses}</td>}
                      {isPitcher && <td>{h.era?.toFixed(2)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No season history yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfilePage;
