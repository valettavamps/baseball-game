/**
 * SeasonManager.ts
 * Manages full season simulation, scheduling, and standings
 */

import { Team, Game, LeagueStanding } from '../types';
import { GameSimulator, GameResult } from './GameSimulator';

export interface Season {
  id: string;
  name: string;
  year: number;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  teams: Team[];
  schedule: ScheduledGame[];
  standings: LeagueStanding[];
  currentDay: number;
  totalDays: number;
}

export interface ScheduledGame {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledDate: Date;
  gameDay: number; // Which day of the season
  status: 'scheduled' | 'in_progress' | 'completed';
  result?: GameResult;
}

export interface SeasonStats {
  totalGames: number;
  gamesCompleted: number;
  totalRevenue: number;
  averageAttendance: number;
  teamStats: Map<string, TeamSeasonStats>;
}

export interface TeamSeasonStats {
  teamId: string;
  teamName: string;
  wins: number;
  losses: number;
  runsScored: number;
  runsAllowed: number;
  totalRevenue: number;
  totalAttendance: number;
  homeRecord: { wins: number; losses: number };
  awayRecord: { wins: number; losses: number };
  currentStreak: string;
}

export class SeasonManager {
  private season: Season;
  private stats: SeasonStats;

  constructor(teams: Team[], seasonYear: number) {
    const seasonId = `season-${seasonYear}`;
    const startDate = new Date();
    const gamesPerTeam = 162; // Standard MLB season
    const totalDays = 180; // ~6 months

    this.season = {
      id: seasonId,
      name: `${seasonYear} Season`,
      year: seasonYear,
      startDate,
      endDate: new Date(startDate.getTime() + totalDays * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      teams,
      schedule: [],
      standings: [],
      currentDay: 0,
      totalDays
    };

    this.stats = {
      totalGames: 0,
      gamesCompleted: 0,
      totalRevenue: 0,
      averageAttendance: 0,
      teamStats: new Map()
    };

    // Initialize team stats
    teams.forEach(team => {
      this.stats.teamStats.set(team.id, {
        teamId: team.id,
        teamName: team.name,
        wins: 0,
        losses: 0,
        runsScored: 0,
        runsAllowed: 0,
        totalRevenue: 0,
        totalAttendance: 0,
        homeRecord: { wins: 0, losses: 0 },
        awayRecord: { wins: 0, losses: 0 },
        currentStreak: '-'
      });
    });

    // Generate schedule
    this.generateSchedule(gamesPerTeam);
  }

  /**
   * Generate a balanced schedule for the season
   */
  private generateSchedule(gamesPerTeam: number): void {
    const teams = this.season.teams;
    const schedule: ScheduledGame[] = [];
    const gamesPerMatchup = Math.floor(gamesPerTeam / (teams.length - 1));

    let gameId = 1;
    let gameDay = 1;

    // Round-robin scheduling
    for (let round = 0; round < gamesPerMatchup; round++) {
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          // Home game for team i
          schedule.push({
            id: `game-${gameId++}`,
            homeTeamId: teams[i].id,
            awayTeamId: teams[j].id,
            scheduledDate: new Date(
              this.season.startDate.getTime() + 
              gameDay * 24 * 60 * 60 * 1000
            ),
            gameDay,
            status: 'scheduled'
          });

          // Away game (reverse home/away)
          schedule.push({
            id: `game-${gameId++}`,
            homeTeamId: teams[j].id,
            awayTeamId: teams[i].id,
            scheduledDate: new Date(
              this.season.startDate.getTime() + 
              (gameDay + 1) * 24 * 60 * 60 * 1000
            ),
            gameDay: gameDay + 1,
            status: 'scheduled'
          });

          gameDay += 2;
        }
      }
    }

    this.season.schedule = schedule;
    this.stats.totalGames = schedule.length;
  }

  /**
   * Start the season
   */
  startSeason(): void {
    this.season.status = 'active';
    this.season.currentDay = 1;
    console.log(`🎊 Season ${this.season.year} has started!`);
    this.updateStandings();
  }

  /**
   * Simulate one day of games
   */
  simulateDay(): GameResult[] {
    if (this.season.status !== 'active') {
      throw new Error('Season is not active');
    }

    const currentDay = this.season.currentDay;
    const todaysGames = this.season.schedule.filter(
      g => g.gameDay === currentDay && g.status === 'scheduled'
    );

    const results: GameResult[] = [];

    for (const game of todaysGames) {
      const homeTeam = this.season.teams.find(t => t.id === game.homeTeamId)!;
      const awayTeam = this.season.teams.find(t => t.id === game.awayTeamId)!;

      // Simulate the game
      const result = GameSimulator.simulateGame(homeTeam, awayTeam);
      
      // Update game record
      game.status = 'completed';
      game.result = result;

      // Update team records
      this.updateTeamRecord(homeTeam.id, result.winner === 'home', result, true);
      this.updateTeamRecord(awayTeam.id, result.winner === 'away', result, false);

      // Update season stats
      this.stats.gamesCompleted++;
      this.stats.totalRevenue += result.revenue;
      this.stats.averageAttendance = 
        (this.stats.averageAttendance * (this.stats.gamesCompleted - 1) + result.attendance) / 
        this.stats.gamesCompleted;

      results.push(result);
    }

    // Move to next day
    this.season.currentDay++;

    // Check if season is complete
    if (this.season.currentDay > this.season.totalDays) {
      this.completeSeason();
    }

    // Update standings
    this.updateStandings();

    return results;
  }

  /**
   * Simulate multiple days at once (fast-forward)
   */
  simulateDays(numDays: number): GameResult[] {
    const allResults: GameResult[] = [];
    
    for (let i = 0; i < numDays && this.season.status === 'active'; i++) {
      const dayResults = this.simulateDay();
      allResults.push(...dayResults);
    }

    return allResults;
  }

  /**
   * Simulate the entire season at once
   */
  simulateFullSeason(): GameResult[] {
    this.startSeason();
    return this.simulateDays(this.season.totalDays);
  }

  /**
   * Update team record after a game
   */
  private updateTeamRecord(
    teamId: string, 
    won: boolean, 
    result: GameResult,
    isHome: boolean
  ): void {
    const stats = this.stats.teamStats.get(teamId)!;
    const team = this.season.teams.find(t => t.id === teamId)!;

    if (won) {
      stats.wins++;
      team.record.wins++;
      if (isHome) stats.homeRecord.wins++;
      else stats.awayRecord.wins++;
      stats.currentStreak = stats.currentStreak.startsWith('W') 
        ? `W${parseInt(stats.currentStreak.slice(1)) + 1}`
        : 'W1';
    } else {
      stats.losses++;
      team.record.losses++;
      if (isHome) stats.homeRecord.losses++;
      else stats.awayRecord.losses++;
      stats.currentStreak = stats.currentStreak.startsWith('L')
        ? `L${parseInt(stats.currentStreak.slice(1)) + 1}`
        : 'L1';
    }

    const teamScore = isHome ? result.homeTeam.score : result.awayTeam.score;
    const opponentScore = isHome ? result.awayTeam.score : result.homeTeam.score;
    
    stats.runsScored += teamScore;
    stats.runsAllowed += opponentScore;
    
    if (isHome) {
      stats.totalRevenue += result.revenue;
      stats.totalAttendance += result.attendance;
    }
  }

  /**
   * Update league standings
   */
  private updateStandings(): void {
    const standings: LeagueStanding[] = [];

    this.season.teams.forEach(team => {
      const stats = this.stats.teamStats.get(team.id)!;
      const gamesPlayed = stats.wins + stats.losses;
      const winPct = gamesPlayed > 0 ? stats.wins / gamesPlayed : 0;

      standings.push({
        rank: 0, // Will be set after sorting
        team: {
          id: team.id,
          name: team.name,
          logo: team.logo,
          record: { wins: stats.wins, losses: stats.losses }
        },
        gamesPlayed,
        wins: stats.wins,
        losses: stats.losses,
        winPct,
        streak: stats.currentStreak
      });
    });

    // Sort by win percentage, then by wins
    standings.sort((a, b) => {
      if (b.winPct !== a.winPct) return b.winPct - a.winPct;
      return b.wins - a.wins;
    });

    // Assign ranks
    standings.forEach((standing, index) => {
      standing.rank = index + 1;
    });

    this.season.standings = standings;
  }

  /**
   * Complete the season and calculate final payouts
   */
  private completeSeason(): void {
    this.season.status = 'completed';
    console.log(`🏆 Season ${this.season.year} has completed!`);
    
    // Calculate final payouts for stakers
    this.calculateStakerPayouts();
  }

  /**
   * Calculate and distribute payouts to stakers
   */
  private calculateStakerPayouts(): Map<string, number> {
    const payouts = new Map<string, number>();

    this.season.teams.forEach(team => {
      const stats = this.stats.teamStats.get(team.id)!;
      const totalRevenue = stats.totalRevenue;
      
      // 70% of revenue goes to stakers (from our docs)
      const stakerPool = totalRevenue * 0.70;
      
      // Store payout amount for this team
      payouts.set(team.id, stakerPool);
    });

    return payouts;
  }

  /**
   * Get upcoming games (next N days)
   */
  getUpcomingGames(numDays: number = 3): ScheduledGame[] {
    return this.season.schedule
      .filter(g => 
        g.gameDay >= this.season.currentDay && 
        g.gameDay < this.season.currentDay + numDays &&
        g.status === 'scheduled'
      )
      .sort((a, b) => a.gameDay - b.gameDay);
  }

  /**
   * Get recent completed games
   */
  getRecentGames(numGames: number = 10): ScheduledGame[] {
    return this.season.schedule
      .filter(g => g.status === 'completed')
      .sort((a, b) => b.gameDay - a.gameDay)
      .slice(0, numGames);
  }

  /**
   * Get current standings
   */
  getStandings(): LeagueStanding[] {
    return this.season.standings;
  }

  /**
   * Get season stats
   */
  getStats(): SeasonStats {
    return this.stats;
  }

  /**
   * Get team-specific stats
   */
  getTeamStats(teamId: string): TeamSeasonStats | undefined {
    return this.stats.teamStats.get(teamId);
  }

  /**
   * Get current season info
   */
  getSeason(): Season {
    return this.season;
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    return Math.min((this.season.currentDay / this.season.totalDays) * 100, 100);
  }
}
