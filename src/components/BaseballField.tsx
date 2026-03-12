/**
 * Baseball Field Component
 * Visual dot-based baseball game display
 */

import React, { useState, useEffect, useRef } from 'react';

// Field dimensions (relative units)
const FIELD = {
  width: 600,
  height: 500,
  infieldSize: 150,
  moundDistance: 60,
  baseDistance: 40,
};

// Position coordinates (relative to center)
const POSITIONS = {
  // Bases
  home: { x: 300, y: 400 },
  first: { x: 340, y: 360 },
  second: { x: 300, y: 320 },
  third: { x: 260, y: 360 },
  
  // Infield
  pitcher: { x: 300, y: 340 },
  catcher: { x: 300, y: 390 },
  firstBase: { x: 340, y: 360 },
  secondBase: { x: 300, y: 320 },
  thirdBase: { x: 260, y: 360 },
  shortstop: { x: 260, y: 340 },
  secondBaseman: { x: 340, y: 340 },
  
  // Outfield
  leftField: { x: 180, y: 250 },
  centerField: { x: 300, y: 180 },
  rightField: { x: 420, y: 250 },
};

export interface GameState {
  inning: number;
  topBottom: 'top' | 'bottom';
  outs: number;
  balls: number;
  strikes: number;
  homeScore: number;
  awayScore: number;
  
  // Runners on base (0 = first, 1 = second, 2 = third)
  runners: [boolean, boolean, boolean]; // [first, second, third]
  
  // Player positions
  battingOrder: string[];
  fielders: {
    pitcher: string;
    catcher: string;
    firstBase: string;
    secondBase: string;
    thirdBase: string;
    shortstop: string;
    leftField: string;
    centerField: string;
    rightField: string;
  };
  
  // Current batter/pitcher
  batterId: string;
  pitcherId: string;
}

export interface AnimationState {
  ball: { x: number; y: number } | null;
  ballInFlight: boolean;
  swingAnimation: boolean;
  runnerAnimations: { base: number; progress: number }[];
  lastPlay: string;
}

interface BaseballFieldProps {
  gameState: GameState;
  homeTeamColor: string;
  awayTeamColor: string;
  onAnimationComplete?: () => void;
}

const BaseballField: React.FC<BaseballFieldProps> = ({
  gameState,
  homeTeamColor,
  awayTeamColor,
  onAnimationComplete
}) => {
  const [animation, setAnimation] = useState<AnimationState>({
    ball: null,
    ballInFlight: false,
    swingAnimation: false,
    runnerAnimations: [],
    lastPlay: ''
  });
  
  // Get team color for batting team
  const battingTeam = gameState.topBottom === 'top' ? awayTeamColor : homeTeamColor;
  const fieldingTeam = gameState.topBottom === 'top' ? homeTeamColor : awayTeamColor;
  
  return (
    <div className="baseball-field" style={{
      width: FIELD.width,
      height: FIELD.height,
      background: '#2d5a27',
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '3px solid #fff'
    }}>
      {/* Outfield grass */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        background: 'linear-gradient(180deg, #3d7a37 0%, #2d5a27 100%)'
      }} />
      
      {/* Foul lines */}
      <div style={{
        position: 'absolute',
        top: 200,
        left: 300,
        width: 2,
        height: 300,
        background: '#fff',
        transform: 'rotate(0deg)',
        transformOrigin: 'top'
      }} />
      <svg style={{ position: 'absolute', top: 200, left: 0, width: 600, height: 300 }}>
        <line x1="300" y1="200" x2="50" y2="400" stroke="white" strokeWidth="2" />
        <line x1="300" y1="200" x2="550" y2="400" stroke="white" strokeWidth="2" />
      </svg>
      
      {/* Infield dirt */}
      <div style={{
        position: 'absolute',
        top: 280,
        left: 200,
        width: 200,
        height: 200,
        background: '#8b6914',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        left: 300,
        top: 340
      }} />
      
      {/* Bases */}
      {['first', 'second', 'third'].map((base, i) => (
        <div
          key={base}
          className="base"
          style={{
            position: 'absolute',
            width: 15,
            height: 15,
            background: '#fff',
            transform: 'translate(-50%, -50%)',
            left: POSITIONS[base as keyof typeof POSITIONS].x,
            top: POSITIONS[base as keyof typeof POSITIONS].y,
            borderRadius: 2
          }}
        />
      ))}
      
      {/* Home plate */}
      <div style={{
        position: 'absolute',
        width: 20,
        height: 20,
        background: '#fff',
        transform: 'translate(-50%, -50%) rotate(45deg)',
        left: POSITIONS.home.x,
        top: POSITIONS.home.y,
      }} />
      
      {/* Pitcher's mound */}
      <div style={{
        position: 'absolute',
        width: 30,
        height: 30,
        background: '#8b6914',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        left: POSITIONS.pitcher.x,
        top: POSITIONS.pitcher.y,
      }} />
      
      {/* Fielder positions */}
      {Object.entries(gameState.fielders).map(([position, playerId]) => {
        const pos = position as keyof typeof POSITIONS;
        const coords = POSITIONS[pos as keyof typeof POSITIONS] || POSITIONS.pitcher;
        
        return (
          <div
            key={position}
            className="fielder"
            style={{
              position: 'absolute',
              width: 18,
              height: 18,
              background: fieldingTeam,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              left: coords.x,
              top: coords.y,
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            {position.charAt(0).toUpperCase()}
          </div>
        );
      })}
      
      {/* Runners on bases */}
      {gameState.runners[0] && (
        <div className="runner" style={{
          position: 'absolute',
          width: 14,
          height: 14,
          background: battingTeam,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          left: POSITIONS.first.x,
          top: POSITIONS.first.y,
          border: '2px solid #fff'
        }} />
      )}
      {gameState.runners[1] && (
        <div className="runner" style={{
          position: 'absolute',
          width: 14,
          height: 14,
          background: battingTeam,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          left: POSITIONS.second.x,
          top: POSITIONS.second.y,
          border: '2px solid #fff'
        }} />
      )}
      {gameState.runners[2] && (
        <div className="runner" style={{
          position: 'absolute',
          width: 14,
          height: 14,
          background: battingTeam,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          left: POSITIONS.third.x,
          top: POSITIONS.third.y,
          border: '2px solid #fff'
        }} />
      )}
      
      {/* Batter */}
      <div className="batter" style={{
        position: 'absolute',
        width: 16,
        height: 16,
        background: battingTeam,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        left: 300,
        top: 410,
        border: '2px solid #fff'
      }} />
      
      {/* Ball animation */}
      {animation.ballInFlight && animation.ball && (
        <div className="ball" style={{
          position: 'absolute',
          width: 8,
          height: 8,
          background: '#fff',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          left: animation.ball.x,
          top: animation.ball.y,
          boxShadow: '0 0 5px rgba(255,255,255,0.8)'
        }} />
      )}
    </div>
  );
};

export default BaseballField;
