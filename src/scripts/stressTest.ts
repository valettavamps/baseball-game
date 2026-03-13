/**
 * Game Stress Test
 * Simulates hundreds of games to test engine produces realistic MLB stats
 * Run: npx ts-node src/scripts/stressTest.ts
 */

import { GameSimulator } from '../engine/GameSimulator';
import { Team, Player, PlayerAttributes, PlayerStats, ContractInfo, Game } from '../types';

// Generate a realistic MLB-style roster
function generateTeam(teamId: string, teamName: string, seed: number): Team {
  const positions = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];
  const roster: Player[] = [];

  // Starting pitcher
  roster.push(generatePitcher(`${teamId}-P1`, 'Ace Starter', 85 + (seed % 15), 70 + (seed % 25)));
  roster.push(generatePitcher(`${teamId}-P2`, 'Number 2', 75 + (seed % 10), 65 + (seed % 20)));
  roster.push(generatePitcher(`${teamId}-P3`, 'Number 3', 70 + (seed % 10), 60 + (seed % 20)));
  roster.push(generatePitcher(`${teamId}-P4`, 'Number 4', 65 + (seed % 10), 55 + (seed % 20)));
  roster.push(generatePitcher(`${teamId}-P5`, 'Number 5', 60 + (seed % 10), 50 + (seed % 20)));

  // Position players
  const namePool = [
    'Mike', 'Chris', 'Carlos', 'Juan', 'Alex', 'David', 'Jose', 'Anthony',
    'Jacob', 'Nick', 'Matt', 'Ryan', 'Steve', 'Paul', 'Mark', 'Tom'
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez'
  ];

  for (let i = 0; i < 9; i++) {
    const firstName = namePool[(seed + i) % namePool.length];
    const lastName = lastNames[(seed * (i + 1)) % lastNames.length];
    
    // Generate realistic stat distributions
    const overall = 50 + Math.floor(Math.random() * 50); // 50-99 overall
    const isPowerHitter = Math.random() > 0.5;
    
    const attrs: PlayerAttributes = {
      contact: 50 + Math.floor(Math.random() * 45),
      power: isPowerHitter ? 70 + Math.floor(Math.random() * 30) : 40 + Math.floor(Math.random() * 30),
      speed: 40 + Math.floor(Math.random() * 50),
      discipline: 50 + Math.floor(Math.random() * 40),
      fielding: 50 + Math.floor(Math.random() * 40),
      arm: 50 + Math.floor(Math.random() * 40),
      stamina: 70 + Math.floor(Math.random() * 30),
      velocity: isPowerHitter ? 50 + Math.floor(Math.random() * 30) : 30 + Math.floor(Math.random() * 20),
      control: 50 + Math.floor(Math.random() * 30),
      movement: 40 + Math.floor(Math.random() * 40)
    };

    const stats: PlayerStats = {
      gamesPlayed: 0,
      atBats: 0,
      hits: 0,
      homeRuns: 0,
      rbi: 0,
      battingAvg: 0,
      ops: 0,
      stolenBases: 0
    };

    const contract: ContractInfo = {
      status: 'signed',
      teamId,
      teamName,
      salary: overall * 1000,
      duration: 3,
      seasonsRemaining: 3
    };

    roster.push({
      id: `${teamId}-${i + 1}`,
      name: `${firstName} ${lastName}`,
      position: positions[i] as any,
      teamId,
      overall,
      attributes: attrs,
      stats,
      contract,
      upcomingGames: []
    });
  }

  return {
    id: teamId,
    name: teamName,
    owner: 'system',
    roster,
    record: { wins: 0, losses: 0 },
    league: 'American',
    division: 'West',
    currentTier: 1,
    tierHistory: [],
    overallRating: 75,
    crownStaked: 0,
    treasury: 0
  };
}

function generatePitcher(id: string, name: string, velocity: number, control: number): Player {
  const attrs: PlayerAttributes = {
    contact: 30 + Math.floor(Math.random() * 30),
    power: 30 + Math.floor(Math.random() * 30),
    speed: 20 + Math.floor(Math.random() * 40),
    discipline: 40 + Math.floor(Math.random() * 40),
    fielding: 40 + Math.floor(Math.random() * 40),
    arm: 50 + Math.floor(Math.random() * 40),
    stamina: 60 + Math.floor(Math.random() * 40),
    velocity,
    control,
    movement: 40 + Math.floor(Math.random() * 40)
  };

  const stats: PlayerStats = {
    gamesPlayed: 0,
    atBats: 0,
    hits: 0,
    homeRuns: 0,
    rbi: 0,
    battingAvg: 0,
    ops: 0,
    stolenBases: 0,
    wins: 0,
    losses: 0,
    era: 0,
    strikeouts: 0,
    innings: 0
  };

  const contract: ContractInfo = {
    status: 'signed',
    salary: Math.floor((velocity + control) / 2) * 1000,
    duration: 3,
    seasonsRemaining: 3
  };

  return {
    id,
    name,
    position: 'P',
    teamId: '',
    overall: Math.floor((velocity + control) / 2),
    attributes: attrs,
    stats,
    contract,
    upcomingGames: []
  };
}

// Run stress test
async function runStressTest(gamesToSimulate: number = 500) {
  console.log(`\n🏟️  DIAMONDCHAIN STRESS TEST`);
  console.log(`============================`);
  console.log(`Simulating ${gamesToSimulate} games...\n`);

  // Create two teams
  const teamA = generateTeam('team-a', 'Brooklyn Bombers', 1);
  const teamB = generateTeam('team-b', 'Queens Queens', 2);

  // Track stats
  const totalStats = {
    runs: 0,
    hits: 0,
    errors: 0,
    homeRuns: 0,
    doubles: 0,
    triples: 0,
    walks: 0,
    strikeouts: 0,
    singles: 0,
    outs: 0,
    games: 0,
    extraInnings: 0,
    teamAWins: 0,
    teamBWins: 0,
    totalPitches: 0
  };

  const startTime = Date.now();

  for (let i = 0; i < gamesToSimulate; i++) {
    // Alternate home/away
    const homeTeam = i % 2 === 0 ? teamA : teamB;
    const awayTeam = i % 2 === 0 ? teamB : teamA;

    const result = GameSimulator.simulateGame(homeTeam, awayTeam);

    // Aggregate stats
    const totalRuns = result.homeTeam.score + result.awayTeam.score;
    const totalHits = result.homeTeam.hits + result.awayTeam.hits;
    const totalErrors = result.homeTeam.errors + result.awayTeam.errors;

    totalStats.runs += totalRuns;
    totalStats.hits += totalHits;
    totalStats.errors += totalErrors;
    totalStats.games++;

    if (result.winner === 'home') {
      if (i % 2 === 0) totalStats.teamAWins++;
      else totalStats.teamBWins++;
    } else {
      if (i % 2 === 0) totalStats.teamBWins++;
      else totalStats.teamAWins++;
    }

    // Count events from innings
    for (const inning of result.innings) {
      for (const event of inning.events) {
        switch (event.type) {
          case 'homerun': totalStats.homeRuns++; break;
          case 'double': totalStats.doubles++; break;
          case 'triple': totalStats.triples++; break;
          case 'walk': totalStats.walks++; break;
          case 'strikeout': totalStats.strikeouts++; break;
          case 'single': totalStats.singles++; break;
          case 'out': totalStats.outs++; break;
        }
        totalStats.totalPitches++;
      }
    }

    if (result.innings.length > 9) {
      totalStats.extraInnings++;
    }

    // Progress every 50 games
    if ((i + 1) % 50 === 0) {
      console.log(`  ✓ Completed ${i + 1}/${gamesToSimulate} games`);
    }
  }

  const elapsed = Date.now() - startTime;

  // Calculate per-game averages
  const perGame = {
    runs: (totalStats.runs / totalStats.games).toFixed(2),
    hits: (totalStats.hits / totalStats.games).toFixed(2),
    errors: (totalStats.errors / totalStats.games).toFixed(2),
    homeRuns: (totalStats.homeRuns / totalStats.games).toFixed(2),
    strikeouts: (totalStats.strikeouts / totalStats.games).toFixed(2),
    walks: (totalStats.walks / totalStats.games).toFixed(2),
    pitches: (totalStats.totalPitches / totalStats.games).toFixed(0)
  };

  // Calculate rates
  const totalAtBats = totalStats.outs + totalStats.hits + totalStats.strikeouts;
  const battingAvg = totalStats.outs > 0 ? (totalStats.hits / totalStats.outs).toFixed(3) : '.000';
  const hrRate = totalAtBats > 0 ? ((totalStats.homeRuns / totalAtBats) * 100).toFixed(2) : '0.00';
  const kRate = totalAtBats > 0 ? ((totalStats.strikeouts / totalAtBats) * 100).toFixed(2) : '0.00';
  const bbRate = totalAtBats > 0 ? ((totalStats.walks / totalAtBats) * 100).toFixed(2) : '0.00';

  console.log(`\n📊 RESULTS (${gamesToSimulate} games)`);
  console.log(`============================`);
  console.log(`Time elapsed: ${(elapsed / 1000).toFixed(1)}s`);
  console.log(`\n🏏 PER-GAME AVERAGES:`);
  console.log(`  Runs:        ${perGame.runs} (MLB avg: ~4.3)`);
  console.log(`  Hits:        ${perGame.hits} (MLB avg: ~8.5)`);
  console.log(`  Home Runs:   ${perGame.homeRuns} (MLB avg: ~1.1)`);
  console.log(`  Strikeouts:  ${perGame.strikeouts} (MLB avg: ~8.8)`);
  console.log(`  Walks:       ${perGame.walks} (MLB avg: ~3.1)`);
  console.log(`  Errors:      ${perGame.errors} (MLB avg: ~0.5)`);
  console.log(`  Pitches/Game:${perGame.pitches} (MLB avg: ~290)`);

  console.log(`\n📈 RATES:`);
  console.log(`  Batting Avg: .${battingAvg} (MLB: ~.250)`);
  console.log(`  K Rate:      ${kRate}% (MLB: ~23%)`);
  console.log(`  BB Rate:     ${bbRate}% (MLB: ~8%)`);
  console.log(`  HR Rate:     ${hrRate}% (MLB: ~3.5%)`);

  console.log(`\n📋 OTHER:`);
  console.log(`  Team A Wins: ${totalStats.teamAWins} (${((totalStats.teamAWins / gamesToSimulate) * 100).toFixed(1)}%)`);
  console.log(`  Extra Innings: ${totalStats.extraInnings} (${((totalStats.extraInnings / gamesToSimulate) * 100).toFixed(1)}%)`);

  // MLB comparison
  console.log(`\n🎯 MLB COMPARISON:`);
  const runsDiff = Math.abs(parseFloat(perGame.runs) - 4.3);
  const hrDiff = Math.abs(parseFloat(perGame.homeRuns) - 1.1);
  const kDiff = Math.abs(parseFloat(perGame.strikeouts) - 8.8);
  
  console.log(`  Runs:   ${runsDiff < 0.5 ? '✅' : '⚠️'} ${runsDiff < 0.5 ? 'GOOD' : 'NEEDS TUNING'} (${perGame.runs} vs 4.3 target)`);
  console.log(`  HRs:    ${hrDiff < 0.3 ? '✅' : '⚠️'} ${hrDiff < 0.3 ? 'GOOD' : 'NEEDS TUNING'} (${perGame.homeRuns} vs 1.1 target)`);
  console.log(`  Ks:     ${kDiff < 2.0 ? '✅' : '⚠️'} ${kDiff < 2.0 ? 'GOOD' : 'NEEDS TUNING'} (${perGame.strikeouts} vs 8.8 target)`);

  console.log(`\n✅ Stress test complete!\n`);
}

// Run if called directly
runStressTest(500).catch(console.error);
