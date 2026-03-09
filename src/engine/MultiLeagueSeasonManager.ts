/**
 * MultiLeagueSeasonManager.ts
 * Manages multiple tiered leagues with promotion/relegation
 */

import { Team, LeagueStanding } from '../types';
import { League, LEAGUE_CONFIGS, TEAMS_PER_TIER, PromotionRelegation } from '../types/league';
import { SeasonManager } from './SeasonManager';
import { GameResult } from './GameSimulator';

export interface MultiLeagueSeason {
  year: number;
  leagues: Map<number, SeasonManager>; // tier -> SeasonManager
  currentDay: number;
  totalDays: number;
  status: 'upcoming' | 'active' | 'completed';
  promotionRelegations: PromotionRelegation[];
}

export class MultiLeagueSeasonManager {
  private season: MultiLeagueSeason;
  private leagueConfigs: Map<number, League>;

  constructor(tieredTeams: Map<number, Team[]>, seasonYear: number) {
    this.leagueConfigs = new Map();
    const leagues = new Map<number, SeasonManager>();

    // Create a SeasonManager for each tier
    LEAGUE_CONFIGS.forEach(config => {
      const teams = tieredTeams.get(config.tier) || [];
      const league: League = {
        ...config,
        id: `league-tier-${config.tier}`,
        teams
      };
      
      this.leagueConfigs.set(config.tier, league);
      
      // Create season manager for this tier
      const seasonManager = new SeasonManager(teams, seasonYear);
      leagues.set(config.tier, seasonManager);
    });

    this.season = {
      year: seasonYear,
      leagues,
      currentDay: 0,
      totalDays: 180,
      status: 'upcoming',
      promotionRelegations: []
    };
  }

  /**
   * Start all leagues
   */
  startSeason(): void {
    this.season.status = 'active';
    this.season.currentDay = 1;
    
    // Start each league's season
    this.season.leagues.forEach(league => {
      league.startSeason();
    });
    
    console.log(`🎊 Multi-League Season ${this.season.year} has started!`);
  }

  /**
   * Simulate one day across all leagues
   */
  simulateDay(): Map<number, GameResult[]> {
    if (this.season.status !== 'active') {
      throw new Error('Season is not active');
    }

    const allResults = new Map<number, GameResult[]>();

    // Simulate each league
    this.season.leagues.forEach((leagueManager, tier) => {
      const results = leagueManager.simulateDay();
      allResults.set(tier, results);
    });

    this.season.currentDay++;

    // Check if season is complete
    if (this.season.currentDay > this.season.totalDays) {
      this.completeSeason();
    }

    return allResults;
  }

  /**
   * Simulate multiple days
   */
  simulateDays(numDays: number): Map<number, GameResult[]> {
    const allResults = new Map<number, GameResult[]>();

    for (let i = 0; i < numDays && this.season.status === 'active'; i++) {
      const dayResults = this.simulateDay();
      
      // Merge results
      dayResults.forEach((results, tier) => {
        const existing = allResults.get(tier) || [];
        allResults.set(tier, [...existing, ...results]);
      });
    }

    return allResults;
  }

  /**
   * Complete season and process promotion/relegation
   */
  private completeSeason(): void {
    this.season.status = 'completed';
    console.log(`🏆 Multi-League Season ${this.season.year} completed!`);
    
    // Process promotion/relegation
    this.processPromotionRelegation();
  }

  /**
   * Process promotion and relegation between tiers
   */
  private processPromotionRelegation(): void {
    const promotions: PromotionRelegation[] = [];

    // Process each league (from top to bottom)
    for (let tier = 1; tier <= 5; tier++) {
      const league = this.leagueConfigs.get(tier);
      const leagueManager = this.season.leagues.get(tier);
      
      if (!league || !leagueManager) continue;

      const standings = leagueManager.getStandings();

      // PROMOTION - top teams move up (except tier 1)
      if (tier > 1 && league.promotionSlots > 0) {
        const promoted = standings.slice(0, league.promotionSlots);
        promoted.forEach(standing => {
          const team = league.teams.find(t => t.id === standing.team.id);
          if (team) {
            promotions.push({
              teamId: team.id,
              teamName: team.name,
              fromTier: tier,
              toTier: tier - 1,
              fromLeague: league.name,
              toLeague: this.leagueConfigs.get(tier - 1)?.name || '',
              reason: 'promotion',
              finalRank: standing.rank,
              record: { wins: standing.wins, losses: standing.losses }
            });

            // Update team tier
            team.currentTier = tier - 1;
            team.league = this.leagueConfigs.get(tier - 1)?.name || team.league;
            team.tierHistory.push({
              season: this.season.year,
              tier,
              leagueName: league.name,
              finalRank: standing.rank,
              record: { wins: standing.wins, losses: standing.losses },
              status: 'promoted'
            });
          }
        });
      }

      // RELEGATION - bottom teams move down (except tier 5)
      if (tier < 5 && league.relegationSlots > 0) {
        const relegated = standings.slice(-league.relegationSlots);
        relegated.forEach(standing => {
          const team = league.teams.find(t => t.id === standing.team.id);
          if (team) {
            promotions.push({
              teamId: team.id,
              teamName: team.name,
              fromTier: tier,
              toTier: tier + 1,
              fromLeague: league.name,
              toLeague: this.leagueConfigs.get(tier + 1)?.name || '',
              reason: 'relegation',
              finalRank: standing.rank,
              record: { wins: standing.wins, losses: standing.losses }
            });

            // Update team tier
            team.currentTier = tier + 1;
            team.league = this.leagueConfigs.get(tier + 1)?.name || team.league;
            team.tierHistory.push({
              season: this.season.year,
              tier,
              leagueName: league.name,
              finalRank: standing.rank,
              record: { wins: standing.wins, losses: standing.losses },
              status: 'relegated'
            });
          }
        });
      }

      // Teams that stayed
      const stayedTeams = tier > 1 && tier < 5 
        ? standings.slice(league.promotionSlots, -league.relegationSlots)
        : tier === 1 
          ? standings.slice(0, -league.relegationSlots)
          : standings.slice(league.promotionSlots);

      stayedTeams.forEach(standing => {
        const team = league.teams.find(t => t.id === standing.team.id);
        if (team) {
          team.tierHistory.push({
            season: this.season.year,
            tier,
            leagueName: league.name,
            finalRank: standing.rank,
            record: { wins: standing.wins, losses: standing.losses },
            status: 'stayed'
          });
        }
      });
    }

    this.season.promotionRelegations = promotions;
    console.log(`📊 Processed ${promotions.length} promotion/relegation movements`);
  }

  /**
   * Get standings for a specific tier
   */
  getStandingsForTier(tier: number): LeagueStanding[] {
    const leagueManager = this.season.leagues.get(tier);
    return leagueManager ? leagueManager.getStandings() : [];
  }

  /**
   * Get all standings across all tiers
   */
  getAllStandings(): Map<number, LeagueStanding[]> {
    const allStandings = new Map<number, LeagueStanding[]>();
    
    this.season.leagues.forEach((leagueManager, tier) => {
      allStandings.set(tier, leagueManager.getStandings());
    });

    return allStandings;
  }

  /**
   * Get league config for a tier
   */
  getLeagueConfig(tier: number): League | undefined {
    return this.leagueConfigs.get(tier);
  }

  /**
   * Get all league configs
   */
  getAllLeagueConfigs(): Map<number, League> {
    return this.leagueConfigs;
  }

  /**
   * Get promotion/relegation results
   */
  getPromotionRelegations(): PromotionRelegation[] {
    return this.season.promotionRelegations;
  }

  /**
   * Get current season info
   */
  getSeason(): MultiLeagueSeason {
    return this.season;
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    return Math.min((this.season.currentDay / this.season.totalDays) * 100, 100);
  }

  /**
   * Get recent games across all tiers
   */
  getRecentGames(numGames: number = 20): Map<number, any[]> {
    const recentGames = new Map<number, any[]>();
    
    this.season.leagues.forEach((leagueManager, tier) => {
      recentGames.set(tier, leagueManager.getRecentGames(numGames));
    });

    return recentGames;
  }
}
