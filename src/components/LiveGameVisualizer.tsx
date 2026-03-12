/**
 * Live Game Visualizer
 * Real-time dot baseball game display with play-by-play
 */

import React, { useState, useEffect } from 'react';
import BaseballField, { GameState } from './BaseballField';
import './LiveGameVisualizer.css';

interface PlayByPlay {
  inning: number;
  topBottom: 'top' | 'bottom';
  description: string;
  runsThisPlay: number;
}

interface LiveGameVisualizerProps {
  homeTeamName: string;
  awayTeamName: string;
  homeTeamColor: string;
  awayTeamColor: string;
  gameState: GameState;
  playByPlay: PlayByPlay[];
  isLive: boolean;
  onPlayComplete?: () => void;
}

const LiveGameVisualizer: React.FC<LiveGameVisualizerProps> = ({
  homeTeamName,
  awayTeamName,
  homeTeamColor,
  awayTeamColor,
  gameState,
  playByPlay,
  isLive,
  onPlayComplete
}) => {
  const [currentPlay, setCurrentPlay] = useState<string>('');
  
  // Show latest play
  useEffect(() => {
    if (playByPlay.length > 0) {
      const latest = playByPlay[playByPlay.length - 1];
      setCurrentPlay(latest.description);
    }
  }, [playByPlay]);
  
  const getInningDisplay = () => {
    const ordinal = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
    const suffix = gameState.inning <= 9 ? ordinal[gameState.inning - 1] : `${gameState.inning}th`;
    return gameState.topBottom === 'top' ? `${suffix} Inning` : `Bottom ${suffix}`;
  };
  
  return (
    <div className="live-game-visualizer">
      {/* Scoreboard */}
      <div className="scoreboard">
        <div className="team-score away">
          <div className="team-name">{awayTeamName}</div>
          <div className="team-abbrev">AWAY</div>
          <div className="score">{gameState.awayScore}</div>
        </div>
        
        <div className="game-info">
          <div className="inning">{getInningDisplay()}</div>
          <div className="status">
            {isLive ? (
              <span className="live-indicator">● LIVE</span>
            ) : (
              <span>Final</span>
            )}
          </div>
        </div>
        
        <div className="team-score home">
          <div className="team-name">{homeTeamName}</div>
          <div className="team-abbrev">HOME</div>
          <div className="score">{gameState.homeScore}</div>
        </div>
      </div>
      
      {/* Count display */}
      <div className="count-display">
        <div className="balls">
          <span className="label">Balls</span>
          <div className="dots">
            {[0, 1, 2, 3].map(i => (
              <span 
                key={i} 
                className={`ball-dot ${i < gameState.balls ? 'filled' : ''}`}
              />
            ))}
          </div>
        </div>
        
        <div className="outs">
          <span className="label">Outs</span>
          <div className="dots">
            {[0, 1, 2].map(i => (
              <span 
                key={i} 
                className={`out-dot ${i < gameState.outs ? 'filled' : ''}`}
              />
            ))}
          </div>
        </div>
        
        <div className="strikes">
          <span className="label">Strikes</span>
          <div className="dots">
            {[0, 1, 2].map(i => (
              <span 
                key={i} 
                className={`strike-dot ${i < gameState.strikes ? 'filled' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Baseball field */}
      <div className="field-container">
        <BaseballField 
          gameState={gameState}
          homeTeamColor={homeTeamColor}
          awayTeamColor={awayTeamColor}
        />
      </div>
      
      {/* Current play display */}
      <div className="current-play">
        {currentPlay || 'Waiting for pitch...'}
      </div>
      
      {/* Play-by-play feed */}
      <div className="play-by-play">
        <h4>Play-by-Play</h4>
        <div className="play-list">
          {playByPlay.slice(-5).reverse().map((play, index) => (
            <div 
              key={`${play.inning}-${play.topBottom}-${index}`} 
              className="play-item"
            >
              <span className="play-inning">
                {play.topBottom === 'top' ? '▲' : '▼'} {play.inning}
              </span>
              <span className="play-desc">{play.description}</span>
              {play.runsThisPlay > 0 && (
                <span className="play-runs">+{play.runsThisPlay} run{play.runsThisPlay > 1 ? 's' : ''}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveGameVisualizer;
