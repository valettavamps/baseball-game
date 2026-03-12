/**
 * Enhanced Player Types
 * Includes hidden attributes, endurance, consumables support
 */

export interface EnhancedPlayerAttributes {
  // Visible attributes
  power: number;       // 1-100: Hit distance
  contact: number;     // 1-100: Ability to make contact
  speed: number;       // 1-100: Baserunning speed
  discipline: number;  // 1-100: Plate patience
  vision: number;      // 1-100: Ball tracking, foul balls
  
  // Pitcher-specific
  velocity?: number;   // 1-100: Fastball speed
  control?: number;    // 1-100: Strike %
  movement?: number;   // 1-100: Pitch break
  
  // Fielder-specific  
  range?: number;      // 1-100: Ball reach
  glove?: number;      // 1-100: Error probability
  arm?: number;        // 1-100: Throw strength
  
  // Stamina/Endurance
  stamina: number;     // 1-100: How deep can play
  endurance: number;    // 1-100: Fatigue resistance
}

export interface HiddenAttributes {
  clutch: number;      // 1-100: Performs under pressure
  durability: number;  // 1-100: Injury probability
  consistency: number; // 1-100: Performance variance
  leadership: number;   // 1-100: Team chemistry boost
  workEthic: number;   // 1-100: Development rate
}

export interface PlayerWithHidden {
  id: string;
  name: string;
  position: string;
  teamId?: string;
  
  // Visible
  attributes: EnhancedPlayerAttributes;
  
  // Hidden (only used internally)
  hidden?: HiddenAttributes;
  
  // Current state
  fatigue: number;     // 0-100: Current fatigue level
  effectiveRatings: EnhancedPlayerAttributes; // Modified by fatigue
}

export interface ConsumableEffect {
  playerId: string;
  statModified: keyof EnhancedPlayerAttributes;
  modifier: number;
  duration: number;    // Games remaining
  expiresAt: number;
}

export interface ActiveConsumables {
  playerId: string;
  effects: ConsumableEffect[];
}

// Pitch types for fatigue calculation
export type PitchType = 'fastball' | 'slider' | 'changeup' | 'curveball' | 'cutter';

// Pitch mix percentage
export interface PitchMix {
  fastball: number;    // Percentage (0-1)
  slider: number;
  changeup: number;
  curveball: number;
  cutter?: number;
}

// Fatigue modifiers based on pitch type
export const PITCH_FATIGUE_MODIFIERS: Record<PitchType, number> = {
  fastball: 1.2,   // Drains more
  slider: 0.9,
  changeup: 0.7,   // Conserves
  curveball: 0.8,
  cutter: 1.0
};

// Calculate effective rating after all modifiers
export function calculateEffectiveRating(
  baseRating: number,
  fatigue: number,
  consumableModifier: number = 0,
  clutchModifier: number = 0
): number {
  // Fatigue reduces effectiveness (starts affecting at 50 fatigue)
  const fatigueImpact = fatigue > 50 ? (fatigue - 50) * 0.2 : 0;
  
  // Apply all modifiers
  const effective = baseRating - fatigueImpact + consumableModifier + clutchModifier;
  
  // Clamp between 1-100
  return Math.max(1, Math.min(100, effective));
}

// Calculate fatigue from pitch count
export function calculatePitchFatigue(
  pitchCount: number,
  velocity: number,
  pitchMix: PitchMix,
  endurance: number,
  isNoHitBid: boolean,
  noHitThroughInnings: number
): number {
  // Base fatigue from pitch count
  let fatigue = pitchCount * 0.5;
  
  // Velocity modifier (hard throwers tire faster)
  if (velocity >= 95) fatigue *= 1.2;
  else if (velocity >= 90) fatigue *= 1.0;
  else fatigue *= 0.8;
  
  // Pitch mix modifier
  const fastballPercentage = pitchMix.fastball || 0;
  const offSpeedPercentage = (pitchMix.changeup || 0) + (pitchMix.curveball || 0);
  fatigue *= (fastballPercentage * 1.2 + offSpeedPercentage * 0.7);
  
  // Endurance reduces fatigue impact
  const enduranceFactor = 1 - (endurance / 200); // Higher endurance = less fatigue
  fatigue *= enduranceFactor;
  
  // No-hit momentum (adrenaline)
  if (isNoHitBid) {
    if (noHitThroughInnings >= 7) fatigue *= 0.5;
    else if (noHitThroughInnings >= 5) fatigue *= 0.7;
  }
  
  return Math.min(100, fatigue);
}
