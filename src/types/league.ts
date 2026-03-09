/**
 * League types for tiered system
 */

import { Team } from './index';

export interface League {
  id: string;
  name: string;
  tier: number; // 1 = Diamond (top), 5 = Bronze (bottom)
  teams: Team[];
  promotionSlots: number;
  relegationSlots: number;
  revenueMultiplier: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'hardest';
  description: string;
}

export interface TierHistory {
  season: number;
  tier: number;
  leagueName: string;
  finalRank: number;
  record: { wins: number; losses: number };
  status: 'promoted' | 'relegated' | 'stayed';
}

export interface PromotionRelegation {
  teamId: string;
  teamName: string;
  fromTier: number;
  toTier: number;
  fromLeague: string;
  toLeague: string;
  reason: 'promotion' | 'relegation';
  finalRank: number;
  record: { wins: number; losses: number };
}

export const LEAGUE_CONFIGS: Omit<League, 'id' | 'teams'>[] = [
  {
    name: 'Diamond League',
    tier: 1,
    promotionSlots: 0, // Top tier, nowhere to go
    relegationSlots: 2,
    revenueMultiplier: 1.5,
    difficulty: 'hardest',
    description: 'Elite tier - The best of the best'
  },
  {
    name: 'Platinum League',
    tier: 2,
    promotionSlots: 2,
    relegationSlots: 2,
    revenueMultiplier: 1.3,
    difficulty: 'hard',
    description: 'High competition - One step from glory'
  },
  {
    name: 'Gold League',
    tier: 3,
    promotionSlots: 2,
    relegationSlots: 3,
    revenueMultiplier: 1.1,
    difficulty: 'medium',
    description: 'Mid-tier battles - Climb or fall'
  },
  {
    name: 'Silver League',
    tier: 4,
    promotionSlots: 3,
    relegationSlots: 4,
    revenueMultiplier: 1.0,
    difficulty: 'medium',
    description: 'Developmental league - Build your way up'
  },
  {
    name: 'Bronze League',
    tier: 5,
    promotionSlots: 4,
    relegationSlots: 0, // Bottom tier, safe from relegation
    revenueMultiplier: 0.8,
    difficulty: 'easy',
    description: 'Entry level - Start your journey here'
  }
];

export const TEAMS_PER_TIER = {
  1: 10,  // Diamond
  2: 16,  // Platinum
  3: 20,  // Gold
  4: 24,  // Silver
  5: 30   // Bronze
};
