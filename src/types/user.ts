/**
 * User and account types
 */

export interface User {
  id: string;
  username: string;
  email?: string;
  walletAddress?: string;
  createdAt: Date;
  playerProfile?: UserPlayerProfile;
}

export interface UserPlayerProfile {
  playerId: string; // Links to Player in game
  position: string;
  jerseyNumber?: number;
  currentTeamId?: string;
  currentTier: number;
  careerStats: CareerStats;
  contracts: Contract[];
  offers: TeamOffer[];
  achievements: Achievement[];
}

export interface CareerStats {
  seasonsPlayed: number;
  totalGames: number;
  totalHits: number;
  totalHomeRuns: number;
  totalRBI: number;
  careerBattingAvg: number;
  careerOPS: number;
  // Pitching stats
  totalWins?: number;
  totalLosses?: number;
  careerERA?: number;
  totalStrikeouts?: number;
}

export interface Contract {
  teamId: string;
  teamName: string;
  tier: number;
  startSeason: number;
  duration: number; // seasons
  salary: number; // DERBY per season
  bonuses: ContractBonus[];
  status: 'active' | 'completed' | 'terminated';
}

export interface ContractBonus {
  type: 'performance' | 'team_success' | 'milestone';
  description: string;
  amount: number;
  achieved: boolean;
}

export interface TeamOffer {
  id: string;
  teamId: string;
  teamName: string;
  tier: number;
  position: string;
  salary: number;
  duration: number;
  bonuses: ContractBonus[];
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  scoutingReport: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface PlayerCreationData {
  firstName: string;
  lastName: string;
  position: 'P' | 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF' | 'DH';
  throwingHand: 'left' | 'right';
  battingHand: 'left' | 'right' | 'switch';
  height: number; // inches
  weight: number; // lbs
  age: number;
  attributes: {
    power: number;
    contact: number;
    speed: number;
    fielding: number;
    arm: number;
    discipline: number;
    stamina: number;
    // Pitcher specific
    velocity?: number;
    control?: number;
    movement?: number;
  };
}
