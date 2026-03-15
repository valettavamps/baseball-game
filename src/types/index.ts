// Player types
export interface Player {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  position: Position;
  team?: string;
  teamId?: string;
  overall: number;
  avatar?: string;
  
  // Rarity
  rarity?: PlayerRarity;
  
  // Physical
  throwingHand?: string;
  battingHand?: string;
  height?: number;
  weight?: number;
  age?: number;
  
  // Attributes
  attributes: PlayerAttributes;
  
  // Hidden attributes (randomized after creation)
  hiddenAttributes?: HiddenAttributes;
  
  // Potential (growth ceiling per attribute)
  growthPotential?: AttributePotential;
  
  // Stats
  stats: PlayerStats;
  
  // Contract
  contract: ContractInfo;
  
  // Upcoming games
  upcomingGames: Game[];
  
  // Extended data (from BaseHit)
  experience?: number;
  debutDate?: string;
  lastGameDate?: string;
  salary?: number;
  acquired?: string;
  draftYear?: number;
  draftRound?: number;
  draftPick?: number;
  draftedBy?: string;
  draftInfo?: DraftInfo;
  
  // Ratings
  ratings?: PlayerRatings;
  potential?: PlayerRatings;
  
  // Season stats
  seasonBatting?: SeasonBattingStats;
  seasonPitching?: SeasonPitchingStats;
  
  // Career totals
  careerBatting?: CareerBattingStats;
  careerPitching?: CareerPitchingStats;
  
  // Fielding
  fieldingStats?: FieldingStats[];
  
  // Awards
  awards?: PlayerAwards;
  
  // History
  seasonHistory?: SeasonHistoryEntry[];
  achievements?: PlayerAchievement[];
}

export interface DraftInfo {
  year: number;
  round: number;
  pick: number;
  team: string;
}

export interface PlayerRatings {
  discipline: number;   // DI
  contact: number;     // CN
  power: number;       // BA
  speed: number;       // SP
  runAccuracy: number; // RA
  glove: number;       // GL
  arm: number;         // AR
  endurance: number;   // EN
}

export interface SeasonBattingStats {
  year: number;
  teamId: string;
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

export interface CareerBattingStats {
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

export interface SeasonPitchingStats {
  year: number;
  teamId: string;
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
  // Extended
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

export interface CareerPitchingStats {
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
  homeRuns: number;
  so9: number;
  bb9: number;
  soBb: number;
  go: number;
  fo: number;
  oavg: number;
  oobp: number;
  oslg: number;
  oops: number;
}

export interface FieldingStats {
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

export interface PlayerAwards {
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
  hallOfFameYear?: number;
}

export interface PlayerAchievement {
  date: string;
  achievement: string;
  opponent: string;
  opponentId: string;
  result: string;
  gameId: string;
}

export interface SeasonHistoryEntry {
  year: number;
  teamId: string;
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

export type Position = 
  | 'P' | 'C' | '1B' | '2B' | '3B' | 'SS' 
  | 'LF' | 'CF' | 'RF' | 'DH';

// Player rarity tiers
export type PlayerRarity = 'common' | 'rare' | 'epic';

// Hidden attributes (randomized after creation)
export interface HiddenAttributes {
  clutch: number;        // Performance in high-pressure situations
  durability: number;     // Resistance to injury
  consistency: number;    // Performance variance game-to-game
  workEthic: number;      // Development speed
  leadership: number;      // Team morale boost
  intelligence: number;   // Game awareness
}

// Potential per attribute (growth ceiling)
export interface AttributePotential {
  power: number;
  contact: number;
  speed: number;
  fielding: number;
  arm: number;
  discipline: number;
  // Hitter-specific
  endurance?: number;
  // Pitcher-specific
  velocity?: number;
  control?: number;
  movement?: number;
  stamina?: number;
}

export interface PlayerAttributes {
  power: number;       // 1-100
  contact: number;     // 1-100
  speed: number;       // 1-100
  fielding: number;    // 1-100
  arm: number;         // 1-100
  discipline: number;  // 1-100
  // Hitter-specific
  endurance?: number;   // Hitters only - 1-100
  // Pitcher-specific
  stamina?: number;    // Pitchers only - 1-100
  velocity?: number;
  control?: number;
  movement?: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  atBats: number;
  hits: number;
  homeRuns: number;
  rbi: number;
  battingAvg: number;
  ops: number;
  stolenBases: number;
  // Pitching
  wins?: number;
  losses?: number;
  era?: number;
  strikeouts?: number;
  innings?: number;
}

export interface ContractInfo {
  status: 'free_agent' | 'signed' | 'expired';
  teamId?: string;
  teamName?: string;
  salary: number; // in DERBY tokens
  duration: number; // seasons
  seasonsRemaining: number;
}

export interface Game {
  id: string;
  homeTeam: TeamSummary;
  awayTeam: TeamSummary;
  scheduledTime: string;
  status: 'scheduled' | 'live' | 'completed';
  score?: { home: number; away: number };
  league: string;
}

export interface TeamSummary {
  id: string;
  name: string;
  logo?: string;
  record: { wins: number; losses: number };
}

export interface Team {
  id: string;
  name: string;
  owner: string;
  logo?: string;
  record: { wins: number; losses: number };
  roster: Player[];
  league: string;
  currentTier: number; // 1-5
  tierHistory: TierHistory[];
  overallRating: number; // Team strength 45-95
  crownStaked: number;
  treasury: number;
}

export interface TierHistory {
  season: number;
  tier: number;
  leagueName: string;
  finalRank: number;
  record: { wins: number; losses: number };
  status?: 'promoted' | 'relegated' | 'stayed';
}

// Token types
export interface WalletInfo {
  address: string;
  solBalance: number;
  derbyBalance: number;   // pegged 100 = $1
  crownBalance: number;
  crownStaked: number;
  localCurrencyValue: number;
}

// League standings
export interface LeagueStanding {
  rank: number;
  team: TeamSummary;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winPct: number;
  streak: string;
}
