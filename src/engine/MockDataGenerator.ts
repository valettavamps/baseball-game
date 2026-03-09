/**
 * MockDataGenerator.ts
 * Generate mock teams, players, and data for testing
 */

import { Team, Player, Position, PlayerAttributes, PlayerStats, ContractInfo } from '../types';

export class MockDataGenerator {
  private static readonly TEAM_NAMES = [
    'Solana Sluggers',
    'Phantom Pitchers',
    'Anchor Arms',
    'Metaplex Maulers',
    'Raydium Rockets',
    'Jupiter Giants',
    'Serum Strikers',
    'Orca Outlaws',
    'Mango Mavericks',
    'Pyth Pythons',
    'Marinade Marines',
    'Saber Sabres',
    'Step Steppers',
    'Drift Drifters',
    'Kamino Kings',
    'Jito Jets',
    'Tensor Titans',
    'Magic Eden Eagles',
    'Star Atlas Aces',
    'Genopets Gladiators',
    'Aurory Avengers',
    'DeFi Dragons',
    'Solend Soldiers',
    'Port Finance Pirates',
    'Francium Falcons',
    'Quarry Crushers',
    'Tulip Tornadoes',
    'Sunny Suns',
    'Mercurial Meteors',
    'Zeta Zealots'
  ];

  private static readonly FIRST_NAMES = [
    'Alex', 'Blake', 'Carlos', 'Derek', 'Ethan', 'Frank', 'George', 'Henry',
    'Isaac', 'Jack', 'Kevin', 'Luke', 'Mike', 'Nathan', 'Oscar', 'Paul',
    'Quinn', 'Ryan', 'Sam', 'Tyler', 'Victor', 'Wade', 'Xavier', 'Yuki', 'Zane',
    'Adrian', 'Brandon', 'Chris', 'Daniel', 'Eric', 'Felix', 'Grant', 'Hunter'
  ];

  private static readonly LAST_NAMES = [
    'Anderson', 'Brown', 'Carter', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris',
    'Jackson', 'King', 'Lopez', 'Martinez', 'Nelson', 'O\'Brien', 'Parker', 'Quinn',
    'Rodriguez', 'Smith', 'Taylor', 'Upton', 'Valdez', 'Wilson', 'Young', 'Zhang',
    'Allen', 'Baker', 'Clark', 'Diaz', 'Edwards', 'Fisher', 'Green', 'Hall'
  ];

  /**
   * Generate a full league of teams
   */
  static generateLeague(numTeams: number = 30): Team[] {
    const teams: Team[] = [];
    const selectedNames = this.shuffleArray([...this.TEAM_NAMES]).slice(0, numTeams);

    for (let i = 0; i < numTeams; i++) {
      teams.push(this.generateTeam(selectedNames[i], `team-${i + 1}`));
    }

    return teams;
  }

  /**
   * Generate a single team with full roster
   */
  static generateTeam(name: string, id: string): Team {
    const roster: Player[] = [];
    
    // Generate pitchers (10)
    for (let i = 0; i < 10; i++) {
      roster.push(this.generatePlayer('P', id));
    }

    // Generate position players
    const positions: Position[] = ['C', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];
    positions.forEach(pos => {
      roster.push(this.generatePlayer(pos, id));
    });

    // Generate bench players (6 more)
    for (let i = 0; i < 6; i++) {
      const benchPos: Position[] = ['1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];
      roster.push(this.generatePlayer(benchPos[i % benchPos.length], id));
    }

    return {
      id,
      name,
      owner: 'AI', // All teams start AI-managed
      record: { wins: 0, losses: 0 },
      roster,
      league: 'Diamond League',
      crownStaked: 0,
      treasury: 100000 // Starting funds
    };
  }

  /**
   * Generate a single player
   */
  static generatePlayer(position: Position, teamId: string): Player {
    const firstName = this.randomChoice(this.FIRST_NAMES);
    const lastName = this.randomChoice(this.LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    
    const attributes = this.generateAttributes(position);
    const overall = this.calculateOverall(attributes, position);

    return {
      id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      position,
      teamId,
      overall,
      attributes,
      stats: this.generateFreshStats(),
      contract: this.generateContract(teamId, overall),
      upcomingGames: []
    };
  }

  /**
   * Generate player attributes based on position
   */
  private static generateAttributes(position: Position): PlayerAttributes {
    const isPitcher = position === 'P';

    if (isPitcher) {
      return {
        power: this.randomStat(20, 50),
        contact: this.randomStat(20, 50),
        speed: this.randomStat(30, 60),
        fielding: this.randomStat(50, 80),
        arm: this.randomStat(60, 95),
        discipline: this.randomStat(40, 70),
        stamina: this.randomStat(60, 95),
        velocity: this.randomStat(65, 100), // Pitcher-specific
        control: this.randomStat(55, 95),   // Pitcher-specific
        movement: this.randomStat(50, 90)   // Pitcher-specific
      };
    } else {
      // Position players
      const baseStats = {
        power: this.randomStat(40, 95),
        contact: this.randomStat(45, 95),
        speed: this.randomStat(40, 90),
        fielding: this.randomStat(45, 90),
        arm: this.randomStat(40, 85),
        discipline: this.randomStat(40, 85),
        stamina: this.randomStat(60, 90)
      };

      // Position-specific adjustments
      switch (position) {
        case 'C':
          baseStats.arm += 10;
          baseStats.speed -= 15;
          break;
        case '1B':
          baseStats.power += 10;
          baseStats.speed -= 10;
          break;
        case 'SS':
        case '2B':
          baseStats.fielding += 10;
          baseStats.speed += 5;
          break;
        case 'CF':
          baseStats.speed += 10;
          baseStats.fielding += 5;
          break;
        case 'LF':
        case 'RF':
          baseStats.arm += 5;
          break;
      }

      // Clamp values to 1-100
      Object.keys(baseStats).forEach(key => {
        baseStats[key as keyof typeof baseStats] = Math.max(1, Math.min(100, baseStats[key as keyof typeof baseStats]));
      });

      return baseStats;
    }
  }

  /**
   * Calculate overall rating from attributes
   */
  private static calculateOverall(attributes: PlayerAttributes, position: Position): number {
    if (position === 'P') {
      // Pitcher overall
      const velocity = attributes.velocity || 0;
      const control = attributes.control || 0;
      const movement = attributes.movement || 0;
      const stamina = attributes.stamina || 0;
      return Math.floor((velocity * 0.35 + control * 0.30 + movement * 0.20 + stamina * 0.15));
    } else {
      // Position player overall
      const { power, contact, speed, fielding, arm, discipline } = attributes;
      return Math.floor(
        (contact * 0.25 + power * 0.25 + speed * 0.15 + fielding * 0.15 + arm * 0.10 + discipline * 0.10)
      );
    }
  }

  /**
   * Generate fresh (empty) player stats
   */
  private static generateFreshStats(): PlayerStats {
    return {
      gamesPlayed: 0,
      atBats: 0,
      hits: 0,
      homeRuns: 0,
      rbi: 0,
      battingAvg: 0,
      ops: 0,
      stolenBases: 0
    };
  }

  /**
   * Generate player contract
   */
  private static generateContract(teamId: string, overall: number): ContractInfo {
    const baseSalary = 50000; // 50k DERBY tokens
    const salary = Math.floor(baseSalary + (overall * 1000)); // Higher overall = higher salary
    
    return {
      status: 'signed',
      teamId,
      salary,
      duration: this.randomChoice([1, 2, 3, 4, 5]),
      seasonsRemaining: this.randomChoice([1, 2, 3])
    };
  }

  /**
   * Generate a random stat in range
   */
  private static randomStat(min: number, max: number): number {
    // Use normal distribution for more realistic stats
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    // Convert to range with mean at 70% of range
    const mean = min + (max - min) * 0.7;
    const stdDev = (max - min) / 4;
    const value = mean + z0 * stdDev;
    
    return Math.round(Math.max(min, Math.min(max, value)));
  }

  /**
   * Random choice from array
   */
  private static randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Shuffle array
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
