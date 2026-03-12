/**
 * Sample Live Game Page
 * Demonstrates the dot baseball visualizer
 */

import React, { useState } from 'react';
import LiveGameVisualizer from '../components/LiveGameVisualizer';
import { GameState, PlayByPlay } from '../components/BaseballField';

// Sample game state
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
    pitcher: 'p1',
    catcher: 'c1',
    firstBase: '1b1',
    secondBase: '2b1',
    thirdBase: '3b1',
    shortstop: 'ss1',
    leftField: 'lf1',
    centerField: 'cf1',
    rightField: 'rf1'
  },
  batterId: 'batter1',
  pitcherId: 'pitcher1'
};

const samplePlayByPlay: PlayByPlay[] = [
  { inning: 1, topBottom: 'top', description: 'Mike Johnson strikes out looking', runsThisPlay: 0 },
  { inning: 1, topBottom: 'top', description: 'Single by Smith', runsThisPlay: 0 },
  { inning: 1, topBottom: 'top', description: 'Williams homers!', runsThisPlay: 2 },
  { inning: 2, topBottom: 'bottom', description: 'Garcia walks', runsThisPlay: 0 },
  { inning: 2, topBottom: 'bottom', description: 'Rodriguez doubles, Garcia scores', runsThisPlay: 1 },
  { inning: 3, topBottom: 'top', description: 'Brown hits sacrifice fly', runsThisPlay: 1 },
  { inning: 4, topBottom: 'bottom', description: 'Lee reaches on error', runsThisPlay: 0 },
  { inning: 4, topBottom: 'bottom', description: 'Current: Chen at bat, 2-1 count', runsThisPlay: 0 }
];

const LiveGamePage: React.FC = () => {
  const [gameState] = useState<GameState>(sampleGameState);
  const [playByPlay] = useState<PlayByPlay[]>(samplePlayByPlay);
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
