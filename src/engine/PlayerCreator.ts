/**
 * PlayerCreator.ts
 * Player creation system with rarity, point distribution, and potential
 * 
 * Rules:
 * - 1 free player per human, then 500 BALLS per additional
 * - Hitters: 7 attrs (power, contact, speed, fielding, arm, discipline, endurance), 280 pts base
 * - Pitchers: 4 attrs (velocity, control, movement, endurance), 160 pts base
 * - Random distribution: low 10, high 70 per attr
 * - Rarity: Common (~94%), Rare (~5%), Epic (~1%)
 * - Rarity bonuses: Rare (+15/8 pts), Epic (+30/15 pts)
 * - Paid creation: +30 extra distributable points
 * - Hidden attrs + Potential assigned after creation
 */

import { 
  Player, 
  Position, 
  PlayerAttributes, 
  PlayerRarity, 
  HiddenAttributes, 
  AttributePotential,
  ContractInfo
} from '../types';

// Configuration constants
const HITTER_ATTRS = ['power', 'contact', 'speed', 'fielding', 'arm', 'discipline', 'endurance'] as const;
const PITCHER_ATTRS = ['velocity', 'control', 'movement', 'endurance'] as const;

const BASE_HITTER_POINTS = 280;
const BASE_PITCHER_POINTS = 160;

const RARITY_CHANCE: Record<PlayerRarity, number> = {
  epic: 0.01,      // 1%
  rare: 0.05,      // 5%
  common: 0.94     // 94%
};

const RARITY_BONUSES: Record<PlayerRarity, { hitter: number; pitcher: number; maxBonus: number }> = {
  common: { hitter: 0, pitcher: 0, maxBonus: 0 },
  rare: { hitter: 15, pitcher: 8, maxBonus: 5 },
  epic: { hitter: 30, pitcher: 15, maxBonus: 10 }
};

const HIDDEN_ATTR_BASE = 50; // Base value for hidden attributes
const POTENTIAL_MIN_GAIN = 10;
const POTENTIAL_MAX_GAIN = 40;

const FIRST_NAMES = [
  'Alex', 'Blake', 'Carlos', 'Derek', 'Ethan', 'Frank', 'George', 'Henry',
  'Isaac', 'Jack', 'Kevin', 'Luke', 'Mike', 'Nathan', 'Oscar', 'Paul',
  'Quinn', 'Ryan', 'Sam', 'Tyler', 'Victor', 'Wade', 'Xavier', 'Yuki', 'Zane',
  'Adrian', 'Brandon', 'Chris', 'Daniel', 'Eric', 'Felix', 'Grant', 'Hunter',
  'Jordan', 'Kyle', 'Lance', 'Mason', 'Noah', 'Oliver', 'Pierce', 'Quentin'
];

const LAST_NAMES = [
  'Anderson', 'Brown', 'Carter', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris',
  'Jackson', 'King', 'Lopez', 'Martinez', 'Nelson', 'O\'Brien', 'Parker', 'Quinn',
  'Rodriguez', 'Smith', 'Taylor', 'Upton', 'Valdez', 'Wilson', 'Young', 'Zhang',
  'Allen', 'Baker', 'Clark', 'Diaz', 'Edwards', 'Fisher', 'Green', 'Hall',
  'Irving', 'James', 'Kelly', 'Lawrence', 'Morgan', 'Nelson', 'Ortiz', 'Palmer'
];

export interface CreatePlayerOptions {
  position: Position;
  teamId: string;
  isPaidCreation?: boolean; // If player paid 500 BALLS
  customDistribution?: Partial<Record<keyof PlayerAttributes, number>>; // For paid: custom point allocation
}

export class PlayerCreator {
  
  /**
   * Roll for player rarity
   */
  static rollRarity(): PlayerRarity {
    const roll = Math.random();
    if (roll < RARITY_CHANCE.epic) return 'epic';
    if (roll < RARITY_CHANCE.epic + RARITY_CHANCE.rare) return 'rare';
    return 'common';
  }

  /**
   * Create a player with full creation system
   */
  static createPlayer(options: CreatePlayerOptions): Player {
    const { position, teamId, isPaidCreation = false, customDistribution } = options;
    const isPitcher = position === 'P';
    
    // Roll for rarity
    const rarity = this.rollRarity();
    
    // Determine base points and max per attribute
    let basePoints = isPitcher ? BASE_PITCHER_POINTS : BASE_HITTER_POINTS;
    let maxPerAttr = 70;
    
    // Apply rarity bonuses
    const bonus = RARITY_BONUSES[rarity];
    basePoints += isPitcher ? bonus.pitcher : bonus.hitter;
    maxPerAttr += bonus.maxBonus;
    
    // Add paid creation bonus
    if (isPaidCreation) {
      basePoints += 30;
    }
    
    // Generate attributes
    const attributes = this.distributePoints(isPitcher, basePoints, maxPerAttr, customDistribution);
    
    // Generate hidden attributes
    const hiddenAttributes = this.generateHiddenAttributes(rarity);
    
    // Generate potential
    const potential = this.generatePotential(attributes, isPitcher);
    
    // Calculate overall
    const overall = this.calculateOverall(attributes, position);
    
    // Generate name
    const firstName = this.randomChoice(FIRST_NAMES);
    const lastName = this.randomChoice(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    
    // Generate contract (minimal for created players)
    const contract: ContractInfo = {
      status: 'signed',
      teamId,
      salary: 50000 + overall * 500,
      duration: 3,
      seasonsRemaining: 3
    };

    return {
      id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      firstName,
      lastName,
      name,
      position,
      teamId,
      overall,
      rarity,
      attributes,
      hiddenAttributes,
      growthPotential: potential,
      contract,
      stats: {
        gamesPlayed: 0,
        atBats: 0,
        hits: 0,
        homeRuns: 0,
        rbi: 0,
        battingAvg: 0,
        ops: 0,
        stolenBases: 0
      },
      upcomingGames: []
    };
  }

  /**
   * Distribute points across attributes
   */
  private static distributePoints(
    isPitcher: boolean, 
    totalPoints: number, 
    maxPerAttr: number,
    customDistribution?: Partial<Record<keyof PlayerAttributes, number>>
  ): PlayerAttributes {
    const attrs = isPitcher ? [...PITCHER_ATTRS] : [...HITTER_ATTRS];
    const result: Partial<PlayerAttributes> = {};
    
    // Handle paid creation with custom distribution
    if (customDistribution) {
      attrs.forEach(attr => {
        const value = customDistribution[attr];
        if (value !== undefined) {
          result[attr] = Math.max(10, Math.min(maxPerAttr, value));
        }
      });
      
      // Fill remaining attributes with random values
      const attrsArray = [...attrs];
      const usedPoints = attrsArray.reduce((sum, attr) => sum + (result[attr] || 0), 0);
      const remainingPoints = totalPoints - usedPoints;
      const remainingAttrs = attrsArray.filter(attr => result[attr] === undefined);
      
      if (remainingPoints > 0 && remainingAttrs.length > 0) {
        const pointsPerAttr = Math.floor(remainingPoints / remainingAttrs.length);
        remainingAttrs.forEach(attr => {
          result[attr] = Math.max(10, Math.min(maxPerAttr, pointsPerAttr));
        });
      }
    } else {
      // Random distribution respecting constraints
      const minAttr = 10;
      let remaining = totalPoints;
      const attrsArray = [...attrs];
      
      // First pass: ensure minimums
      attrsArray.forEach(attr => {
        result[attr] = minAttr;
        remaining -= minAttr;
      });
      
      // Second pass: distribute remaining randomly
      while (remaining > 0) {
        const attr = this.randomChoice(attrsArray);
        if (result[attr]! < maxPerAttr) {
          result[attr] = (result[attr] || minAttr) + 1;
          remaining--;
        }
      }
    }
    
    return result as PlayerAttributes;
  }

  /**
   * Generate hidden attributes with rarity bonus
   */
  private static generateHiddenAttributes(rarity: PlayerRarity): HiddenAttributes {
    const bonus = rarity === 'epic' ? 20 : rarity === 'rare' ? 10 : 0;
    
    return {
      clutch: this.randomStat(HIDDEN_ATTR_BASE + bonus, 100),
      durability: this.randomStat(HIDDEN_ATTR_BASE + bonus, 100),
      consistency: this.randomStat(HIDDEN_ATTR_BASE + bonus, 100),
      workEthic: this.randomStat(HIDDEN_ATTR_BASE + bonus, 100),
      leadership: this.randomStat(HIDDEN_ATTR_BASE + bonus, 100),
      intelligence: this.randomStat(HIDDEN_ATTR_BASE + bonus, 100)
    };
  }

  /**
   * Generate potential (growth ceiling) for each attribute
   */
  private static generatePotential(attributes: PlayerAttributes, isPitcher: boolean): AttributePotential {
    const potential: Partial<AttributePotential> = {};
    const attrs = isPitcher 
      ? ['velocity', 'control', 'movement', 'endurance'] as const
      : ['power', 'contact', 'speed', 'fielding', 'arm', 'discipline', 'endurance'] as const;
    
    const attrsArray = [...attrs];
    attrsArray.forEach(attr => {
      const currentValue = attributes[attr] || 0;
      const gain = this.randomInt(POTENTIAL_MIN_GAIN, POTENTIAL_MAX_GAIN);
      potential[attr] = Math.min(100, currentValue + gain);
    });
    
    return potential as AttributePotential;
  }

  /**
   * Calculate overall rating from attributes
   */
  private static calculateOverall(attributes: PlayerAttributes, position: Position): number {
    if (position === 'P') {
      const velocity = attributes.velocity || 0;
      const control = attributes.control || 0;
      const movement = attributes.movement || 0;
      const endurance = attributes.endurance || 0;
      return Math.floor(velocity * 0.35 + control * 0.30 + movement * 0.20 + endurance * 0.15);
    } else {
      const { power, contact, speed, fielding, arm, discipline, endurance } = attributes;
      return Math.floor(
        contact * 0.22 + 
        power * 0.22 + 
        speed * 0.14 + 
        fielding * 0.14 + 
        arm * 0.10 + 
        discipline * 0.10 + 
        endurance * 0.08
      );
    }
  }

  /**
   * Helper: random choice from array
   */
  private static randomChoice<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Helper: random integer in range
   */
  private static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Helper: random stat with normal distribution
   */
  private static randomStat(min: number, max: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const mean = min + (max - min) * 0.6;
    const stdDev = (max - min) / 5;
    return Math.round(Math.max(min, Math.min(max, mean + z0 * stdDev)));
  }
}

/**
 * Utility: Convert number to letter grade
 */
export function numberToGrade(value: number): string {
  if (value >= 97) return 'A+';
  if (value >= 93) return 'A';
  if (value >= 90) return 'A-';
  if (value >= 87) return 'B+';
  if (value >= 83) return 'B';
  if (value >= 80) return 'B-';
  if (value >= 77) return 'C+';
  if (value >= 73) return 'C';
  if (value >= 70) return 'C-';
  if (value >= 67) return 'D+';
  if (value >= 63) return 'D';
  if (value >= 60) return 'D-';
  return 'F';
}

/**
 * Utility: Convert attribute to letter grade (for display)
 */
export function attributeToGrade(attr: number): string {
  return numberToGrade(attr);
}
