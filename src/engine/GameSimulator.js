/**
 * GameSimulator.js
 * Core game simulation engine - stats-based baseball game outcomes
 * CommonJS version for stress testing
 */

class GameSimulator {
  static simulateGame(homeTeam, awayTeam) {
    const gameId = `${homeTeam.id}-vs-${awayTeam.id}-${Date.now()}`;
    const innings = [];
    let homeScore = 0;
    let awayScore = 0;
    let homeHits = 0;
    let awayHits = 0;
    let homeErrors = 0;
    let awayErrors = 0;
    const highlights = [];

    const homePitcher = this.getStartingPitcher(homeTeam);
    const awayPitcher = this.getStartingPitcher(awayTeam);

    for (let inning = 1; inning <= 9; inning++) {
      const inningResult = this.simulateInning(
        inning, awayTeam, homeTeam, homePitcher, awayPitcher, 'top'
      );
      
      awayScore += inningResult.runs;
      awayHits += inningResult.hits;
      homeErrors += inningResult.errors;

      const bottomInning = this.simulateInning(
        inning, homeTeam, awayTeam, awayPitcher, homePitcher, 'bottom'
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

  static simulateInning(inning, battingTeam, fieldingTeam, pitcher, opposingPitcher, half) {
    let runs = 0;
    let hits = 0;
    let errors = 0;
    let outs = 0;
    const events = [];
    let baseRunners = { first: false, second: false, third: false };

    const lineup = this.getLineup(battingTeam);
    let batterIndex = (inning - 1) % lineup.length;

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

      switch (result.outcome) {
        case 'homerun':
          runs += 1 + this.countBaseRunners(baseRunners);
          hits++;
          baseRunners = { first: false, second: false, third: false };
          break;
        case 'triple':
          runs += this.countBaseRunners(baseRunners);
          hits++;
          baseRunners = { first: false, second: false, third: true };
          break;
        case 'double':
          runs += baseRunners.third ? 1 : 0;
          hits++;
          baseRunners = { first: false, second: true, third: baseRunners.first };
          break;
        case 'single':
          runs += baseRunners.third ? 1 : 0;
          hits++;
          baseRunners = { first: true, second: baseRunners.third, third: baseRunners.second };
          break;
        case 'walk':
          if (baseRunners.first && baseRunners.second && baseRunners.third) runs++;
          baseRunners.third = baseRunners.second;
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

  static simulateAtBat(batter, pitcher, fieldingTeam) {
    const batterPower = batter.attributes.power;
    const batterContact = batter.attributes.contact;
    const batterDiscipline = batter.attributes.discipline;
    const pitcherControl = pitcher.attributes.control || 50;
    const pitcherVelocity = pitcher.attributes.velocity || 50;

    const pitcherAdvantage = (pitcherVelocity / 100) * 0.5;
    const contactChance = Math.min(0.22, (batterContact / 100) * 0.28 - pitcherAdvantage * 0.1);
    const powerChance = Math.min(0.04, (batterPower / 100) * 0.05);
    const walkChance = Math.min(0.09, Math.max(0.05, (batterDiscipline / 100) * 0.10));
    const errorChance = 0.008;

    const roll = Math.random();

    if (roll < walkChance) {
      return { outcome: 'walk', rbi: 0, batterName: batter.name, pitcherName: pitcher.name };
    }

    if (roll < contactChance + walkChance) {
      const hitQuality = Math.random();
      
      if (hitQuality < errorChance) {
        return { outcome: 'error', rbi: 0, batterName: batter.name, pitcherName: pitcher.name };
      }

      if (hitQuality < 0.03) {
        return { outcome: 'homerun', rbi: 1, batterName: batter.name, pitcherName: pitcher.name };
      }

      if (hitQuality < 0.04) {
        return { outcome: 'triple', rbi: 0, batterName: batter.name, pitcherName: pitcher.name };
      }

      if (hitQuality < 0.24) {
        return { outcome: 'double', rbi: 0, batterName: batter.name, pitcherName: pitcher.name };
      }

      return { outcome: 'single', rbi: 0, batterName: batter.name, pitcherName: pitcher.name };
    }

    const strikeoutChance = Math.min(0.28, (pitcherVelocity / 100) * 0.32);
    if (Math.random() < strikeoutChance) {
      return { outcome: 'strikeout', rbi: 0, batterName: batter.name, pitcherName: pitcher.name };
    }

    return { outcome: 'out', rbi: 0, batterName: batter.name, pitcherName: pitcher.name };
  }

  static getStartingPitcher(team) {
    const pitchers = team.roster.filter(p => p.position === 'P');
    return pitchers[0] || team.roster[0];
  }

  static getLineup(team) {
    return team.roster
      .filter(p => p.position !== 'P')
      .sort((a, b) => b.overall - a.overall)
      .slice(0, 9);
  }

  static countBaseRunners(baseRunners) {
    return (baseRunners.first ? 1 : 0) + (baseRunners.second ? 1 : 0) + (baseRunners.third ? 1 : 0);
  }

  static describeAtBat(result) {
    const { outcome, batterName, pitcherName } = result;
    switch (outcome) {
      case 'homerun': return `💥 ${batterName} crushes a home run off ${pitcherName}!`;
      case 'triple': return `${batterName} rips a triple to the gap!`;
      case 'double': return `${batterName} drives a double into the outfield!`;
      case 'single': return `${batterName} singles up the middle.`;
      case 'walk': return `${batterName} draws a walk from ${pitcherName}.`;
      case 'strikeout': return `${pitcherName} strikes out ${batterName} swinging!`;
      case 'error': return `${batterName} reaches on an error!`;
      case 'out': return `${batterName} grounds out.`;
      default: return `${batterName} at bat.`;
    }
  }

  static generateInningHighlight(topInning, bottomInning, homeName, awayName) {
    if (topInning.runs > 2) return `Big inning for ${awayName}! They score ${topInning.runs} runs!`;
    if (bottomInning.runs > 2) return `${homeName} responds with ${bottomInning.runs} runs!`;
    return `Exciting inning with runs scored on both sides!`;
  }

  static calculateAttendance(homeTeam, awayTeam) {
    const baseAttendance = 15000;
    const homeWinPct = homeTeam.record.wins / (homeTeam.record.wins + homeTeam.record.losses || 1);
    const awayWinPct = awayTeam.record.wins / (awayTeam.record.wins + awayTeam.record.losses || 1);
    const qualityMultiplier = 1 + (homeWinPct * 0.5) + (awayWinPct * 0.3);
    const attendance = Math.floor(baseAttendance * qualityMultiplier * (0.8 + Math.random() * 0.4));
    return Math.min(attendance, 45000);
  }

  static calculateGameRevenue(attendance, homeWin) {
    const ticketRevenue = attendance * 35;
    const concessionRevenue = attendance * 15;
    const winBonus = homeWin ? 5000 : 0;
    return ticketRevenue + concessionRevenue + winBonus;
  }
}

module.exports = { GameSimulator };
