/**
 * demo.ts
 * Quick demo/test of the game engine
 */

import { MockDataGenerator } from './MockDataGenerator';
import { SeasonManager } from './SeasonManager';
import { AIManager } from './AIManager';

console.log('🦞⚾ Baseball Game Engine Demo\n');

// Generate a league
console.log('📊 Generating league with 30 teams...');
const teams = MockDataGenerator.generateLeague(30);
console.log(`✅ Generated ${teams.length} teams\n`);

// Show first few teams
console.log('Sample teams:');
teams.slice(0, 5).forEach(team => {
  console.log(`  - ${team.name} (${team.roster.length} players, Treasury: ${team.treasury} DERBY)`);
});

console.log('\n🏟️ Creating season manager...');
const season = new SeasonManager(teams, 2026);

console.log(`✅ Season created: ${season.getSeason().name}`);
console.log(`   Total games scheduled: ${season.getSeason().schedule.length}`);
console.log(`   Season duration: ${season.getSeason().totalDays} days\n`);

// Start season
console.log('🎊 Starting season...');
season.startSeason();

// Simulate a few days
console.log('\n⚡ Simulating first 3 days of games...');
const results = season.simulateDays(3);

console.log(`\n📈 Results after ${results.length} games:`);

// Show standings
const standings = season.getStandings();
console.log('\n🏆 Current Standings (Top 10):');
standings.slice(0, 10).forEach(standing => {
  console.log(
    `  ${standing.rank}. ${standing.team.name.padEnd(25)} ` +
    `${standing.wins}-${standing.losses} (.${(standing.winPct * 1000).toFixed(0).padStart(3, '0')}) ` +
    `[${standing.streak}]`
  );
});

// Show some recent game highlights
console.log('\n🎮 Recent Game Highlights:');
const recentGames = season.getRecentGames(3);
recentGames.forEach(game => {
  if (game.result) {
    const { homeTeam, awayTeam, highlights } = game.result;
    console.log(`\n  ${awayTeam.name} @ ${homeTeam.name}`);
    console.log(`  Final: ${awayTeam.name} ${awayTeam.score}, ${homeTeam.name} ${homeTeam.score}`);
    console.log(`  Attendance: ${game.result.attendance.toLocaleString()}`);
    console.log(`  Revenue: $${game.result.revenue.toLocaleString()}`);
    
    if (highlights.length > 0) {
      console.log(`  Highlights:`);
      highlights.slice(0, 2).forEach(h => {
        console.log(`    - Inning ${h.inning}: ${h.description}`);
      });
    }
  }
});

// Test AI Manager
console.log('\n🤖 Testing AI Manager for', teams[0].name);
const aiManager = new AIManager(teams[0]);
const lineup = aiManager.setLineup();

console.log('\n  Optimal Lineup:');
lineup.slice(0, 5).forEach(decision => {
  console.log(`    ${decision.position}. ${decision.playerName} - ${decision.reasoning}`);
});

// Season stats
console.log('\n📊 Season Statistics:');
const stats = season.getStats();
console.log(`  Games completed: ${stats.gamesCompleted} / ${stats.totalGames}`);
console.log(`  Total revenue: $${stats.totalRevenue.toLocaleString()}`);
console.log(`  Average attendance: ${Math.floor(stats.averageAttendance).toLocaleString()}`);
console.log(`  Progress: ${season.getProgress().toFixed(1)}%`);

// Show team-specific stats
const topTeam = standings[0];
const topTeamStats = season.getTeamStats(topTeam.team.id);
if (topTeamStats) {
  console.log(`\n🔥 Top Team Stats (${topTeam.team.name}):`);
  console.log(`  Record: ${topTeamStats.wins}-${topTeamStats.losses}`);
  console.log(`  Home: ${topTeamStats.homeRecord.wins}-${topTeamStats.homeRecord.losses}`);
  console.log(`  Away: ${topTeamStats.awayRecord.wins}-${topTeamStats.awayRecord.losses}`);
  console.log(`  Runs Scored: ${topTeamStats.runsScored}`);
  console.log(`  Runs Allowed: ${topTeamStats.runsAllowed}`);
  console.log(`  Total Revenue: $${topTeamStats.totalRevenue.toLocaleString()}`);
  console.log(`  Avg Attendance: ${Math.floor(topTeamStats.totalAttendance / (topTeamStats.wins + topTeamStats.losses)).toLocaleString()}`);
}

console.log('\n✅ Demo complete! The engine is working! 🦞⚾\n');
