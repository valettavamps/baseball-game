/**
 * Plate Discipline Simulation Engine
 * Based on research from mcneo/ball open source engine
 * More realistic outcomes based on batter/pitcher matchups
 */

import { 
  EnhancedPlayerAttributes, 
  HiddenAttributes,
  PitchMix,
  calculateEffectiveRating 
} from './types/PlayerTypes';
import { LeagueSettings } from './types/LeagueSettings';

export interface PitchResult {
  type: 'strike' | 'ball' | 'foul' | 'swinging_strike' | 'in_play';
  outcome?: 'single' | 'double' | 'triple' | 'homerun' | 'out' | 'strikeout' | 'walk' | 'error' | 'sacrifice';
  description: string;
}

export interface AtBatResult {
  outcome: 'single' | 'double' | 'triple' | 'homerun' | 'out' | 'strikeout' | 'walk' | 'error' | 'sacrifice';
  runsScored: number;
  rbi: number;
  description: string;
  pitches: PitchResult[];
}

// Plate discipline calculations
function calculateSwingChance(
  inZone: boolean,
  batter: { discipline: number; vision: number; effectiveDiscipline: number }
): number {
  const baseSwing = inZone 
    ? 0.65 + (batter.effectiveDiscipline / 200) // 65-115% in zone
    : 0.20 + (batter.effectiveDiscipline / 333) - (batter.vision / 500); // 20-40% out of zone
  
  return Math.max(0.05, Math.min(0.95, baseSwing));
}

function calculateContactChance(
  inZone: boolean,
  batter: { contact: number; effectiveContact: number },
  pitcher: { movement: number }
): number {
  const baseContact = inZone
    ? 0.70 + (batter.effectiveContact / 333) // 70-100% in zone
    : 0.40 + (batter.effectiveContact / 250); // 40-80% out of zone
  
  // Pitcher movement reduces contact
  const movementPenalty = pitcher.movement / 500;
  
  return Math.max(0.1, baseContact - movementPenalty);
}

function calculateHitType(
  batter: { power: number; speed: number; effectivePower: number; effectiveContact: number },
  pitcher: { movement: number },
  league: LeagueSettings,
  runnersOnBase: number[]
): AtBatResult['outcome'] {
  // Calculate base probabilities from league settings
  const contactQuality = (batter.effectivePower + batter.effectiveContact) / 2;
  
  const roll = Math.random() * 100;
  
  // Home run: based on power and league HR rate
  const hrChance = league.modifiers.homeRunRate * 1000 * (batter.effectivePower / 50);
  if (roll < hrChance) return 'homerun';
  
  // Triple: fast runners, rare
  const tripleChance = league.modifiers.tripleRate * 1000 * (batter.speed / 50);
  if (roll < hrChance + tripleChance) return 'triple';
  
  // Double: power + speed
  const doubleChance = league.modifiers.doubleRate * 1000 * ((batter.effectivePower + batter.speed) / 100);
  if (roll < hrChance + tripleChance + doubleChance) return 'double';
  
  // Single: contact ability
  const singleChance = league.modifiers.hitRate * 1000 * (batter.effectiveContact / 50);
  if (roll < hrChance + tripleChance + doubleChance + singleChance) return 'single';
  
  // Everything else is an out
  return 'out';
}

export function simulatePitch(
  batter: {
    attributes: EnhancedPlayerAttributes;
    hidden?: HiddenAttributes;
    effectiveRatings: EnhancedPlayerAttributes;
  },
  pitcher: {
    attributes: EnhancedPlayerAttributes;
    pitchMix: PitchMix;
  },
  league: LeagueSettings,
  count: { balls: number; strikes: number },
  runnersOnBase: number[]
): PitchResult {
  // Determine if pitch is in zone (based on pitcher control)
  const control = pitcher.attributes.control || 70;
  const inZone = Math.random() * 100 < control;
  
  // Batter decides to swing
  const swingChance = calculateSwingChance(inZone, {
    discipline: batter.attributes.discipline,
    vision: batter.attributes.vision,
    effectiveDiscipline: batter.effectiveRatings.discipline
  });
  
  const isSwing = Math.random() < swingChance;
  
  if (!isSwing) {
    if (inZone) {
      return { type: 'strike', description: 'Called strike' };
    } else {
      return { type: 'ball', description: 'Ball' };
    }
  }
  
  // Batter swings - check contact
  const contactChance = calculateContactChance(
    inZone,
    { 
      contact: batter.attributes.contact, 
      effectiveContact: batter.effectiveRatings.contact 
    },
    { movement: pitcher.attributes.movement || 50 }
  );
  
  const makesContact = Math.random() < contactChance;
  
  if (!makesContact) {
    // Check if foul (can extend count)
    const foulChance = inZone ? 0.3 : 0.5;
    if (Math.random() < foulChance && count.strikes < 2) {
      return { type: 'foul', description: 'Foul ball' };
    }
    return { type: 'swinging_strike', description: 'Swinging strike' };
  }
  
  // Contact made - determine outcome
  const outcome = calculateHitType(
    {
      power: batter.attributes.power,
      speed: batter.attributes.speed,
      effectivePower: batter.effectiveRatings.power,
      effectiveContact: batter.effectiveRatings.contact
    },
    { movement: pitcher.attributes.movement || 50 },
    league,
    runnersOnBase
  );
  
  return {
    type: 'in_play',
    outcome,
    description: `${outcome} in play`
  };
}

export function simulateAtBat(
  batter: {
    attributes: EnhancedPlayerAttributes;
    hidden?: HiddenAttributes;
    effectiveRatings: EnhancedPlayerAttributes;
  },
  pitcher: {
    attributes: EnhancedPlayerAttributes;
    pitchMix: PitchMix;
  },
  league: LeagueSettings,
  runnersOnBase: number[]
): AtBatResult {
  const pitches: PitchResult[] = [];
  let balls = 0;
  let strikes = 0;
  
  // Work the count
  while (balls < 4 && strikes < 3) {
    const result = simulatePitch(batter, pitcher, league, { balls, strikes }, runnersOnBase);
    pitches.push(result);
    
    switch (result.type) {
      case 'ball':
        balls++;
        break;
      case 'strike':
      case 'swinging_strike':
        strikes++;
        break;
      case 'foul':
        if (strikes < 2) strikes++;
        break;
      case 'in_play':
        // Determine final outcome
        const outcome = result.outcome!;
        let rbi = 0;
        let runsScored = 0;
        
        // Calculate RBI and runs
        if (outcome === 'homerun') {
          runsScored = runnersOnBase.length + 1;
          rbi = runsScored;
        } else if (outcome === 'triple') {
          runsScored = runnersOnBase.length;
          rbi = runsScored;
        } else if (outcome === 'double') {
          runsScored = Math.min(2, runnersOnBase.length);
          rbi = runsScored;
        } else if (outcome === 'single') {
          runsScored = Math.min(1, runnersOnBase.length);
          rbi = runsScored;
        }
        
        return {
          outcome,
          runsScored,
          rbi,
          description: `${batter.attributes.power >= 80 ? 'Smashed' : 'Hit'} a ${outcome}!`,
          pitches
        };
    }
  }
  
  // Result determined by count
  if (balls >= 4) {
    return {
      outcome: 'walk',
      runsScored: 0,
      rbi: 0,
      description: 'Walk',
      pitches
    };
  } else {
    return {
      outcome: 'strikeout',
      runsScored: 0,
      rbi: 0,
      description: 'Struck out',
      pitches
    };
  }
}
