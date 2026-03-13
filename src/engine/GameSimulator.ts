/**
 * GameSimulator.ts
 * Core game simulation engine - stats-based baseball game outcomes
 */

import { Player, Team, Game, Position } from '../types';

export interface GameResult {
  gameId: string;
  homeTeam: {
    id: string;
    name: string;
    score: number;
    hits: number;
    errors: number;
  };
  awayTeam: {
    id: string;
    name: string;
    score: number;
    hits: number;
    errors: number;
  };
  innings: InningResult[];
  highlights: GameHighlight[];
  winner: 'home' | 'away';
  attendance: number;
  revenue: number; // Revenue generated from this game
}

export interface InningResult {
  inning: number;
  homeScore: number;
  awayScore: number;
  events: InningEvent[];
}

export interface InningEvent {
  type: 'single' | 'double' | 'triple' | 'homerun' | 'out' | 'strikeout' | 'walk' | 'error';
  batter: string;
  pitcher: string;
  description: string;
  rbi?: number;
}

export interface GameHighlight {
  inning: number;
  description: string;
  importance: 'low' | 'medium' | 'high';
}

interface BatterResult {
  outcome: 'single' | 'double' | 'triple' | 'homerun' | 'out' | 'strikeout' | 'walk' | 'error';
  rbi: number;
  batterName: string;
  pitcherName: string;
}

export class GameSimulator {
  /**
   * Simulate a full game between two teams
   */
  static simulateGame(homeTeam: Team, awayTeam: Team): GameResult {
    const gameId = `${homeTeam.id}-vs-${awayTeam.id}-${Date.now()}`;
    const innings: InningResult[] = [];
    let homeScore = 0;
    let awayScore = 0;
    let homeHits = 0;
    let awayHits = 0;
    let homeErrors = 0;
    let awayErrors = 0;
    const highlights: GameHighlight[] = [];

    // Get starting pitchers
    const homePitcher = this.getStartingPitcher(homeTeam);
    const awayPitcher = this.getStartingPitcher(awayTeam);

    // Simulate 9 innings (or more if tied)
    for (let inning = 1; inning <= 9; inning++) {
      const inningResult = this.simulateInning(
        inning,
        awayTeam,
        homeTeam,
        homePitcher,
        awayPitcher,
        'top'
      );
      
      awayScore += inningResult.runs;
      awayHits += inningResult.hits;
      homeErrors += inningResult.errors;

      const bottomInning = this.simulateInning(
        inning,
        homeTeam,
        awayTeam,
        awayPitcher,
        homePitcher,
        'bottom'
      );

      homeScore += bottomInning.runs;
      homeHits += bottomInning.hits;
      awayErrors += bottomInning.errors;

      innings.push({
        inning,
        homeScore,
        awayScore,
        events: [...inningResult.events, ...bottomInning.events]
      });

      // Generate highlights for significant innings
      if (inningResult.runs > 2 || bottomInning.runs > 2) {
        highlights.push({
          inning,
          description: this.generateInningHighlight(inningResult, bottomInning, homeTeam.name, awayTeam.name),
          importance: 'high'
        });
      }
    }

    // Extra innings if tied
    let extraInning = 10;
    while (homeScore === awayScore && extraInning <= 15) {
      const topExtra = this.simulateInning(extraInning, awayTeam, homeTeam, homePitcher, awayPitcher, 'top');
      awayScore += topExtra.runs;
      
      const bottomExtra = this.simulateInning(extraInning, homeTeam, awayTeam, awayPitcher, homePitcher, 'bottom');
      homeScore += bottomExtra.runs;

      innings.push({
        inning: extraInning,
        homeScore,
        awayScore,
        events: [...topExtra.events, ...bottomExtra.events]
      });

      if (homeScore !== awayScore) {
        highlights.push({
          inning: extraInning,
          description: `Extra innings thriller! Game ends in the ${extraInning}th inning!`,
          importance: 'high'
        });
      }

      extraInning++;
    }

    const winner = homeScore > awayScore ? 'home' : 'away';
    const attendance = this.calculateAttendance(homeTeam, awayTeam);
    const revenue = this.calculateGameRevenue(attendance, winner === 'home');

    return {
      gameId,
      homeTeam: {
        id: homeTeam.id,
        name: homeTeam.name,
        score: homeScore,
        hits: homeHits,
        errors: homeErrors
      },
      awayTeam: {
        id: awayTeam.id,
        name: awayTeam.name,
        score: awayScore,
        hits: awayHits,
        errors: awayErrors
      },
      innings,
      highlights,
      winner,
      attendance,
      revenue
    };
  }

  /**
   * Simulate a single inning (top or bottom)
   */
  private static simulateInning(
    inning: number,
    battingTeam: Team,
    fieldingTeam: Team,
    pitcher: Player,
    opposingPitcher: Player,
    half: 'top' | 'bottom'
  ): { runs: number; hits: number; errors: number; events: InningEvent[] } {
    let runs = 0;
    let hits = 0;
    let errors = 0;
    let outs = 0;
    const events: InningEvent[] = [];
    let baseRunners = { first: false, second: false, third: false };

    const lineup = this.getLineup(battingTeam);
    let batterIndex = (inning - 1) % lineup.length;

    // Process batters until 3 outs
    while (outs < 3) {
      const batter = lineup[batterIndex % lineup.length];
      const result = this.simulateAtBat(batter, pitcher, fieldingTeam);

      events.push({
        type: result.outcome,
        batter: result.batterName,
        pitcher: result.pitcherName,
        description: this.describeAtBat(result),
        rbi: result.rbi
      });

      // Update game state based on outcome
      switch (result.outcome) {
        case 'homerun':
          runs += 1 + this.countBaseRunners(baseRunners) + result.rbi;
          hits++;
          baseRunners = { first: false, second: false, third: false };
          break;
        case 'triple':
          runs += this.countBaseRunners(baseRunners);
          hits++;
          baseRunners = { first: false, second: false, third: true };
          break;
        case 'double':
          runs += (baseRunners.third ? 1 : 0) + (baseRunners.second ? 1 : 0);
          hits++;
          baseRunners = { first: false, second: true, third: baseRunners.first };
          break;
        case 'single':
          runs += (baseRunners.third ? 1 : 0);
          hits++;
          baseRunners = { 
            first: true, 
            second: baseRunners.first, 
            third: baseRunners.second 
          };
          break;
        case 'walk':
          if (baseRunners.first && baseRunners.second && baseRunners.third) {
            runs++;
          }
          baseRunners.third = baseRunners.second && baseRunners.first;
          baseRunners.second = baseRunners.first;
          baseRunners.first = true;
          break;
        case 'error':
          errors++;
          baseRunners.first = true;
          break;
        case 'out':
        case 'strikeout':
          outs++;
          break;
      }

      batterIndex++;
    }

    return { runs, hits, errors, events };
  }

  /**
   * Simulate a single at-bat
   * Tuned for realistic MLB scoring (3-5 runs per team per game)
   */
  private static simulateAtBat(batter: Player, pitcher: Player, fieldingTeam: Team): BatterResult {
    const batterPower = batter.attributes.power;
    const batterContact = batter.attributes.contact;
    const batterDiscipline = batter.attributes.discipline;
    const pitcherControl = pitcher.attributes.control || 50;
    const pitcherVelocity = pitcher.attributes.velocity || 50;

    // REALISTIC MLB probabilities (2024-2025 stats):
    // - ~23% hit rate (BA ~.250)
    // - ~8% walk rate  
    // - ~20% strikeout rate
    // - ~3-4% HR rate, ~4-5% 2B, ~1% 3B
    
    // Contact adjusted for realism (reduce high contact rates)
    const baseContact = batterContact / 100; // 0.6-0.9
    const pitcherEffect = (100 - pitcherVelocity) / 100 * 0.3; // pitcher reduces contact
    const contactChance = Math.min(0.35, Math.max(0.15, baseContact * 0.4 - pitcherEffect));
    
    // Power chance - reduced significantly
    const powerChance = Math.min(0.12, (batterPower / 100) * 0.15);
    
    // Walk chance - realistic
    const walkChance = Math.min(0.12, Math.max(0.05, (batterDiscipline / 100) * 0.15));
    
    // Error rate - very low in MLB
    const errorChance = 0.02;

    const roll = Math.random();

    // Walk
    if (roll < walkChance) {
      return {
        outcome: 'walk',
        rbi: 0,
        batterName: batter.name,
        pitcherName: pitcher.name
      };
    }

    // Contact made
    if (roll < contactChance + walkChance) {
      const hitQuality = Math.random();
      
      // Error by fielding team
      if (hitQuality < errorChance) {
        return {
          outcome: 'error',
          rbi: 0,
          batterName: batter.name,
          pitcherName: pitcher.name
        };
      }

      // Home run - ~5% of hits in modern MLB
      if (hitQuality < 0.05) {
        return {
          outcome: 'homerun',
          rbi: 1,
          batterName: batter.name,
          pitcherName: pitcher.name
        };
      }

      // Triple - rare, ~1% of hits
      if (hitQuality < 0.06) {
        return {
          outcome: 'triple',
          rbi: 0,
          batterName: batter.name,
          pitcherName: pitcher.name
        };
      }

      // Double - ~20% of hits
      if (hitQuality < 0.26) {
        return {
          outcome: 'double',
          rbi: 0,
          batterName: batter.name,
          pitcherName: pitcher.name
        };
      }

      // Single - remaining ~73% of hits
      return {
        outcome: 'single',
        rbi: 0,
        batterName: batter.name,
        pitcherName: pitcher.name
      };
    }

    // Out (strikeout or fielded out) - ~65% of at-bats in MLB
    const strikeoutChance = Math.min(0.35, (pitcherVelocity / 100) * 0.4);
    if (Math.random() < strikeoutChance) {
      return {
        outcome: 'strikeout',
        rbi: 0,
        batterName: batter.name,
        pitcherName: pitcher.name
      };
    }

    return {
      outcome: 'out',
      rbi: 0,
      batterName: batter.name,
      pitcherName: pitcher.name
    };
  }

  /**
   * Get starting pitcher for a team
   */
  private static getStartingPitcher(team: Team): Player {
    const pitchers = team.roster.filter(p => p.position === 'P');
    return pitchers[0] || team.roster[0]; // Fallback to any player
  }

  /**
   * Get batting lineup for a team
   */
  private static getLineup(team: Team): Player[] {
    // For now, return non-pitchers sorted by overall rating
    return team.roster
      .filter(p => p.position !== 'P')
      .sort((a, b) => b.overall - a.overall)
      .slice(0, 9);
  }

  /**
   * Count runners on base
   */
  private static countBaseRunners(baseRunners: { first: boolean; second: boolean; third: boolean }): number {
    return (baseRunners.first ? 1 : 0) + (baseRunners.second ? 1 : 0) + (baseRunners.third ? 1 : 0);
  }

  /**
   * Describe an at-bat result
   */
  private static describeAtBat(result: BatterResult): string {
    const { outcome, batterName, pitcherName } = result;
    
    switch (outcome) {
      case 'homerun':
        return `💥 ${batterName} crushes a home run off ${pitcherName}!`;
      case 'triple':
        return `${batterName} rips a triple to the gap!`;
      case 'double':
        return `${batterName} drives a double into the outfield!`;
      case 'single':
        return `${batterName} singles up the middle.`;
      case 'walk':
        return `${batterName} draws a walk from ${pitcherName}.`;
      case 'strikeout':
        return `${pitcherName} strikes out ${batterName} swinging!`;
      case 'error':
        return `${batterName} reaches on an error!`;
      case 'out':
        return `${batterName} grounds out.`;
      default:
        return `${batterName} at bat.`;
    }
  }

  /**
   * Generate highlight text for an inning
   */
  private static generateInningHighlight(
    topInning: any,
    bottomInning: any,
    homeName: string,
    awayName: string
  ): string {
    if (topInning.runs > 2) {
      return `Big inning for ${awayName}! They score ${topInning.runs} runs!`;
    }
    if (bottomInning.runs > 2) {
      return `${homeName} responds with ${bottomInning.runs} runs!`;
    }
    return `Exciting inning with runs scored on both sides!`;
  }

  /**
   * Calculate attendance based on team quality and records
   */
  private static calculateAttendance(homeTeam: Team, awayTeam: Team): number {
    const baseAttendance = 15000;
    const homeWinPct = homeTeam.record.wins / (homeTeam.record.wins + homeTeam.record.losses || 1);
    const awayWinPct = awayTeam.record.wins / (awayTeam.record.wins + awayTeam.record.losses || 1);
    
    const qualityMultiplier = 1 + (homeWinPct * 0.5) + (awayWinPct * 0.3);
    const attendance = Math.floor(baseAttendance * qualityMultiplier * (0.8 + Math.random() * 0.4));
    
    return Math.min(attendance, 45000); // Max stadium capacity
  }

  /**
   * Calculate revenue from a game
   */
  private static calculateGameRevenue(attendance: number, homeWin: boolean): number {
    const avgTicketPrice = 35; // $35 per ticket
    const ticketRevenue = attendance * avgTicketPrice;
    const concessionRevenue = attendance * 15; // $15 per person in concessions
    const winBonus = homeWin ? 5000 : 0; // Bonus for home win
    
    return ticketRevenue + concessionRevenue + winBonus;
  }
}
