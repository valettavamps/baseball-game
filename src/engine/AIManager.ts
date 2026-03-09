/**
 * AIManager.ts
 * AI-powered team management for non-owned teams
 */

import { Team, Player, Position } from '../types';

export interface LineupDecision {
  position: number; // 1-9 batting order
  playerId: string;
  playerName: string;
  reasoning: string;
}

export interface RosterDecision {
  type: 'trade' | 'sign' | 'release' | 'promote' | 'demote';
  playerId: string;
  playerName: string;
  reasoning: string;
  targetTeam?: string;
}

export class AIManager {
  private team: Team;
  private aggressiveness: number; // 0-1, how aggressive with trades/moves
  private strategy: 'balanced' | 'offense' | 'defense' | 'speed';

  constructor(team: Team, strategy: 'balanced' | 'offense' | 'defense' | 'speed' = 'balanced') {
    this.team = team;
    this.aggressiveness = 0.3 + Math.random() * 0.4; // 0.3 to 0.7
    this.strategy = strategy;
  }

  /**
   * Set the optimal batting lineup
   */
  setLineup(): LineupDecision[] {
    const lineup: LineupDecision[] = [];
    const position_players = this.team.roster.filter(p => p.position !== 'P');

    // Sort players by overall rating
    const sortedPlayers = [...position_players].sort((a, b) => b.overall - a.overall);

    // Batting order strategy:
    // 1. Fast contact hitter (leadoff)
    // 2. Contact hitter
    // 3-4-5. Power hitters (heart of the order)
    // 6-7. Medium hitters
    // 8-9. Weakest hitters

    const leadoffCandidate = this.findBestLeadoff(position_players);
    const powerHitters = this.findPowerHitters(position_players, 3);
    const contactHitters = this.findContactHitters(position_players, 2);

    // 1st - Leadoff
    lineup.push({
      position: 1,
      playerId: leadoffCandidate.id,
      playerName: leadoffCandidate.name,
      reasoning: `High speed (${leadoffCandidate.attributes.speed}) and contact (${leadoffCandidate.attributes.contact})`
    });

    // 2nd - Contact hitter
    const secondBatter = contactHitters[0] || sortedPlayers[1];
    lineup.push({
      position: 2,
      playerId: secondBatter.id,
      playerName: secondBatter.name,
      reasoning: `Good contact (${secondBatter.attributes.contact}) to move runners`
    });

    // 3-4-5 - Power hitters
    powerHitters.slice(0, 3).forEach((player, idx) => {
      lineup.push({
        position: 3 + idx,
        playerId: player.id,
        playerName: player.name,
        reasoning: `Power bat (${player.attributes.power}) in the heart of the order`
      });
    });

    // 6-9 - Fill remaining spots
    const remainingPlayers = sortedPlayers.filter(
      p => !lineup.find(l => l.playerId === p.id)
    );

    remainingPlayers.slice(0, 4).forEach((player, idx) => {
      lineup.push({
        position: 6 + idx,
        playerId: player.id,
        playerName: player.name,
        reasoning: `Solid contributor (Overall: ${player.overall})`
      });
    });

    return lineup;
  }

  /**
   * Choose starting pitcher for today's game
   */
  chooseStartingPitcher(daysSinceLastStart: Map<string, number>): Player {
    const pitchers = this.team.roster.filter(p => p.position === 'P');
    
    // Find pitchers who are rested (4+ days since last start)
    const restedPitchers = pitchers.filter(p => {
      const daysSince = daysSinceLastStart.get(p.id) || 100;
      return daysSince >= 4;
    });

    // Pick the best rested pitcher
    const bestPitcher = restedPitchers.sort((a, b) => b.overall - a.overall)[0];
    
    return bestPitcher || pitchers[0]; // Fallback to any pitcher
  }

  /**
   * Evaluate if team needs roster moves
   */
  evaluateRoster(): RosterDecision[] {
    const decisions: RosterDecision[] = [];
    
    // Check for underperforming players
    const underperformers = this.team.roster.filter(p => {
      const expectedPerformance = p.overall / 100;
      const actualPerformance = this.calculatePlayerPerformance(p);
      return actualPerformance < expectedPerformance * 0.7; // 30% below expected
    });

    underperformers.forEach(player => {
      if (Math.random() < this.aggressiveness) {
        decisions.push({
          type: 'release',
          playerId: player.id,
          playerName: player.name,
          reasoning: `Underperforming (Expected: ${player.overall}, Actual: ${Math.floor(this.calculatePlayerPerformance(player) * 100)})`
        });
      }
    });

    // Check for injury replacements (future feature)
    // Check for trade opportunities (future feature)

    return decisions;
  }

  /**
   * Decide on in-game strategy
   */
  makeInGameDecision(situation: GameSituation): InGameDecision {
    const { inning, outs, score, baseRunners } = situation;
    const scoreDiff = score.home - score.away;

    // Stealing decision
    if (baseRunners.first && !baseRunners.second && outs < 2) {
      const runner = this.team.roster.find(p => p.id === baseRunners.firstRunnerId);
      if (runner && runner.attributes.speed > 75) {
        if (Math.random() < 0.3) {
          return {
            action: 'steal',
            reasoning: `Fast runner (speed: ${runner.attributes.speed}) on first`
          };
        }
      }
    }

    // Bunting decision (close game, late innings, runner on first)
    if (inning >= 7 && Math.abs(scoreDiff) <= 2 && baseRunners.first && outs < 2) {
      if (Math.random() < 0.2) {
        return {
          action: 'bunt',
          reasoning: 'Sacrifice bunt to advance runner in close game'
        };
      }
    }

    // Pitching change (pitcher fatigued, losing badly)
    if (situation.pitcherStamina < 30 || (scoreDiff < -3 && inning >= 6)) {
      return {
        action: 'pitching_change',
        reasoning: situation.pitcherStamina < 30 
          ? 'Pitcher fatigued' 
          : 'Need fresh arm to stop bleeding'
      };
    }

    return {
      action: 'none',
      reasoning: 'Continue with current strategy'
    };
  }

  /**
   * Find best leadoff hitter (speed + contact)
   */
  private findBestLeadoff(players: Player[]): Player {
    return players.sort((a, b) => {
      const aScore = a.attributes.speed + a.attributes.contact + a.attributes.discipline;
      const bScore = b.attributes.speed + b.attributes.contact + b.attributes.discipline;
      return bScore - aScore;
    })[0];
  }

  /**
   * Find power hitters
   */
  private findPowerHitters(players: Player[], count: number): Player[] {
    return players
      .sort((a, b) => b.attributes.power - a.attributes.power)
      .slice(0, count);
  }

  /**
   * Find contact hitters
   */
  private findContactHitters(players: Player[], count: number): Player[] {
    return players
      .sort((a, b) => b.attributes.contact - a.attributes.contact)
      .slice(0, count);
  }

  /**
   * Calculate player performance rating (0-1)
   */
  private calculatePlayerPerformance(player: Player): number {
    const stats = player.stats;
    
    if (player.position === 'P') {
      // Pitcher performance
      if (!stats.era || stats.innings === 0) return 0.5;
      const eraScore = Math.max(0, 1 - (stats.era! / 5.0));
      const winPct = stats.wins && stats.losses 
        ? stats.wins / (stats.wins + stats.losses) 
        : 0.5;
      return (eraScore + winPct) / 2;
    } else {
      // Hitter performance
      const battingScore = stats.battingAvg || 0;
      const powerScore = (stats.homeRuns / 30) || 0;
      return Math.min((battingScore * 3 + powerScore) / 4, 1);
    }
  }

  /**
   * Get team strategy adjustments based on record
   */
  adjustStrategy(record: { wins: number; losses: number }): void {
    const winPct = record.wins / (record.wins + record.losses || 1);

    if (winPct < 0.4) {
      // Struggling team - get more aggressive
      this.aggressiveness = Math.min(this.aggressiveness + 0.1, 0.9);
      console.log(`📉 ${this.team.name} struggling (${winPct.toFixed(3)}), increasing aggressiveness`);
    } else if (winPct > 0.6) {
      // Winning team - be more conservative
      this.aggressiveness = Math.max(this.aggressiveness - 0.1, 0.2);
      console.log(`📈 ${this.team.name} winning (${winPct.toFixed(3)}), playing it safe`);
    }
  }

  /**
   * Generate scouting report on opponent
   */
  scoutOpponent(opponent: Team): string {
    const oppRecord = opponent.record;
    const winPct = oppRecord.wins / (oppRecord.wins + oppRecord.losses || 1);
    
    const avgPower = this.calculateTeamAverage(opponent.roster, 'power');
    const avgSpeed = this.calculateTeamAverage(opponent.roster, 'speed');
    
    let report = `${opponent.name} (${oppRecord.wins}-${oppRecord.losses}, ${(winPct * 100).toFixed(1)}% win rate)\n`;
    
    if (avgPower > 70) report += `⚠️ Strong power lineup (${avgPower.toFixed(0)} avg power)\n`;
    if (avgSpeed > 70) report += `⚠️ Fast team (${avgSpeed.toFixed(0)} avg speed)\n`;
    if (winPct > 0.6) report += `🔥 Hot team, be careful\n`;
    
    return report;
  }

  /**
   * Calculate team average for an attribute
   */
  private calculateTeamAverage(roster: Player[], attribute: keyof Player['attributes']): number {
    const sum = roster.reduce((acc, p) => acc + (p.attributes[attribute] || 0), 0);
    return sum / roster.length;
  }
}

// Supporting interfaces
interface GameSituation {
  inning: number;
  outs: number;
  score: { home: number; away: number };
  baseRunners: {
    first: boolean;
    second: boolean;
    third: boolean;
    firstRunnerId?: string;
  };
  pitcherStamina: number;
}

interface InGameDecision {
  action: 'steal' | 'bunt' | 'pitching_change' | 'none';
  reasoning: string;
  targetPlayer?: string;
}
