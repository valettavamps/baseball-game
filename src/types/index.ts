// Player types
export interface Player {
  id: string;
  name: string;
  position: Position;
  team?: string;
  teamId?: string;
  overall: number;
  avatar?: string;
  
  // Attributes
  attributes: PlayerAttributes;
  
  // Stats
  stats: PlayerStats;
  
  // Contract
  contract: ContractInfo;
  
  // Upcoming games
  upcomingGames: Game[];
}

export type Position = 
  | 'P' | 'C' | '1B' | '2B' | '3B' | 'SS' 
  | 'LF' | 'CF' | 'RF' | 'DH';

export interface PlayerAttributes {
  power: number;       // 1-100
  contact: number;     // 1-100
  speed: number;       // 1-100
  fielding: number;    // 1-100
  arm: number;         // 1-100
  discipline: number;  // 1-100
  stamina: number;     // 1-100
  // Pitching (if applicable)
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
  crownStaked: number;
  treasury: number;
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
