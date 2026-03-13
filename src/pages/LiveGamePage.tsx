/**
 * Sample Live Game Page
 * Demonstrates the dot baseball visualizer
 */

import React, { useState } from 'react';
import LiveGameVisualizer, { PlayByPlay } from '../components/LiveGameVisualizer';
import { GameState } from '../components/BaseballField';

// Mock roster data for realistic game
const homeTeamRoster = {
  pitcher: 'Marcus Webb',
  catcher: 'Jake Torres',
  firstBase: 'Carlos Mendez',
  secondBase: 'Tony Russo',
  thirdBase: 'Derek Kim',
  shortstop: 'Mike Santos',
  leftField: 'Tyler Blake',
  centerField: 'Chris Park',
  rightField: 'Danny O\'Brien'
};

const awayTeamRoster = {
  pitcher: 'Kevin Hart',
  catcher: 'Rob Martinez',
  firstBase: 'Steve Williams',
  secondBase: 'Pat O\'Neil',
  thirdBase: 'Andy Chen',
  shortstop: 'James Turner',
  leftField: 'Sam Miller',
  centerField: 'Ryan Foster',
  rightField: 'Ben Clark'
};

// Sample game state with real names
const sampleGameState: GameState = {
  inning: 4,
  topBottom: 'bottom',
  outs: 1,
  balls: 2,
  strikes: 1,
  homeScore: 3,
  awayScore: 2,
  runners: [true, false, true], // First and third
  battingOrder: [],
  fielders: {
    pitcher: homeTeamRoster.pitcher,
    catcher: homeTeamRoster.catcher,
    firstBase: homeTeamRoster.firstBase,
    secondBase: homeTeamRoster.secondBase,
    thirdBase: homeTeamRoster.thirdBase,
    shortstop: homeTeamRoster.shortstop,
    leftField: homeTeamRoster.leftField,
    centerField: homeTeamRoster.centerField,
    rightField: homeTeamRoster.rightField
  },
  batterId: 'Chen',
  pitcherId: awayTeamRoster.pitcher,
  fieldConfig: 'standard'
};

// Generate realistic play-by-play
const generatePlayByPlay = (): PlayByPlay[] => [
  { inning: 1, topBottom: 'top', description: `${awayTeamRoster.pitcher} strikes out ${homeTeamRoster.catcher} looking`, runsThisPlay: 0 },
  { inning: 1, topBottom: 'top', description: `Single by ${homeTeamRoster.firstBase}`, runsThisPlay: 0 },
  { inning: 1, topBottom: 'top', description: `${homeTeamRoster.secondBase} homers! 2 runs score`, runsThisPlay: 2 },
  { inning: 2, topBottom: 'bottom', description: `${homeTeamRoster.pitcher} walks ${awayTeamRoster.firstBase}`, runsThisPlay: 0 },
  { inning: 2, topBottom: 'bottom', description: `${awayTeamRoster.secondBase} doubles, ${awayTeamRoster.firstBase} scores`, runsThisPlay: 1 },
  { inning: 3, topBottom: 'top', description: `${homeTeamRoster.centerField} hits sacrifice fly to center`, runsThisPlay: 1 },
  { inning: 4, topBottom: 'bottom', description: `${awayTeamRoster.shortstop} reaches on fielding error`, runsThisPlay: 0 },
  { inning: 4, topBottom: 'bottom', description: `Now batting: ${homeTeamRoster.thirdBase}, 2-1 count`, runsThisPlay: 0 }
];

const LiveGamePage: React.FC = () => {
  const [gameState] = useState<GameState>(sampleGameState);
  const [playByPlay] = useState<PlayByPlay[]>(generatePlayByPlay());
  const [isLive] = useState<boolean>(true);

  return (
    <div className="live-game-page" style={{ 
      padding: '20px', 
      maxWidth: '700px', 
      margin: '0 auto',
      background: '#0f0f1a',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#fff',
        marginBottom: '20px',
        fontFamily: 'system-ui'
      }}>
        ⚾ DiamondChain Baseball
      </h1>
      
      <LiveGameVisualizer
        homeTeamName="New York Eagles"
        awayTeamName="Boston Wolves"
        homeTeamColor="#4ecca3"
        awayTeamColor="#e94560"
        gameState={gameState}
        playByPlay={playByPlay}
        isLive={isLive}
      />
      
      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        color: '#666',
        fontSize: '12px'
      }}>
        <p>Sample game visualization - Real implementation coming soon!</p>
      </div>
    </div>
  );
};

export default LiveGamePage;
