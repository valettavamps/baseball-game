import React, { useState } from 'react';
import './CreatePlayerPage.css';
import { PlayerCreationData } from '../types/user';
import { Position } from '../types';
import PlayerCard from '../components/PlayerCard';
import { createPlayer } from '../services/db';

interface CreatePlayerPageProps {
  onNavigate?: (page: string) => void;
}

// Convert number to letter grade
const getLetterGrade = (value: number): string => {
  if (value >= 95) return 'A+';
  if (value >= 90) return 'A';
  if (value >= 85) return 'A-';
  if (value >= 80) return 'B+';
  if (value >= 75) return 'B';
  if (value >= 70) return 'B-';
  if (value >= 65) return 'C+';
  if (value >= 60) return 'C';
  if (value >= 55) return 'C-';
  if (value >= 50) return 'D+';
  if (value >= 45) return 'D';
  if (value >= 40) return 'D-';
  return 'F';
};

const getGradeColor = (value: number): string => {
  if (value >= 85) return 'var(--accent-primary)';
  if (value >= 70) return 'var(--accent-green)';
  if (value >= 55) return 'var(--accent-gold)';
  if (value >= 40) return 'var(--accent-red)';
  return 'var(--text-muted)';
};

// Randomize a stat within a range
const randomStat = (min: number, max: number): number => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

// Generate randomized starting attributes based on position (FREE - no points needed)
const generateAttributes = (position: string) => {
  switch (position) {
    case 'P':
      return {
        power: randomStat(20, 40), contact: randomStat(20, 40),
        speed: randomStat(30, 55), fielding: randomStat(40, 60),
        arm: randomStat(55, 75), discipline: randomStat(35, 55),
        stamina: randomStat(55, 75),
        velocity: randomStat(55, 75), control: randomStat(45, 65), movement: randomStat(45, 65)
      };
    case 'C':
      return {
        power: randomStat(35, 55), contact: randomStat(40, 60),
        speed: randomStat(25, 45), fielding: randomStat(50, 70),
        arm: randomStat(55, 75), discipline: randomStat(40, 60),
        stamina: randomStat(50, 70)
      };
    case '1B': case 'DH':
      return {
        power: randomStat(55, 75), contact: randomStat(45, 65),
        speed: randomStat(25, 45), fielding: randomStat(35, 55),
        arm: randomStat(30, 50), discipline: randomStat(40, 60),
        stamina: randomStat(45, 65)
      };
    case '2B': case 'SS':
      return {
        power: randomStat(30, 50), contact: randomStat(50, 70),
        speed: randomStat(50, 70), fielding: randomStat(55, 75),
        arm: randomStat(40, 60), discipline: randomStat(45, 65),
        stamina: randomStat(50, 70)
      };
    case '3B':
      return {
        power: randomStat(50, 70), contact: randomStat(40, 60),
        speed: randomStat(30, 50), fielding: randomStat(45, 65),
        arm: randomStat(50, 70), discipline: randomStat(40, 60),
        stamina: randomStat(45, 65)
      };
    case 'CF':
      return {
        power: randomStat(35, 55), contact: randomStat(45, 65),
        speed: randomStat(60, 80), fielding: randomStat(55, 75),
        arm: randomStat(40, 60), discipline: randomStat(40, 60),
        stamina: randomStat(55, 75)
      };
    case 'LF': case 'RF':
      return {
        power: randomStat(45, 65), contact: randomStat(40, 60),
        speed: randomStat(40, 60), fielding: randomStat(40, 60),
        arm: randomStat(45, 65), discipline: randomStat(40, 60),
        stamina: randomStat(45, 65)
      };
    default:
      return {
        power: randomStat(35, 55), contact: randomStat(35, 55),
        speed: randomStat(35, 55), fielding: randomStat(35, 55),
        arm: randomStat(35, 55), discipline: randomStat(35, 55),
        stamina: randomStat(35, 55)
      };
  }
};

const CreatePlayerPage: React.FC<CreatePlayerPageProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<number>(1);
  const [playerCreated, setPlayerCreated] = useState<boolean>(false);
  const [baseAttributes, setBaseAttributes] = useState<Record<string, number>>({});
  const [attributePoints, setAttributePoints] = useState<number>(30);
  const [playerData, setPlayerData] = useState<Partial<PlayerCreationData>>({
    throwingHand: 'right',
    battingHand: 'right',
    height: 72,
    weight: 200,
    age: 22,
    attributes: {
      power: 45,
      contact: 45,
      speed: 45,
      fielding: 45,
      arm: 45,
      discipline: 45,
      stamina: 45
    }
  });

  const getStepDescription = () => {
    if (step === 3 && playerData.firstName && playerData.position) {
      const positionName = positions.find(p => p.id === playerData.position)?.name || 'Player';
      return `These are ${playerData.firstName}'s randomized attributes for the ${positionName} position. They look good!`;
    }
    if (step === 1) return 'Enter your player\'s name';
    if (step === 2) return 'Choose your position on the field';
    if (step === 3) return 'Review your randomized attributes (free for now)';
    if (step === 4) return 'Set physical attributes';
    if (step === 5) return 'Confirm and create your player';
    return '';
  };

  const positions = [
    { id: 'P', name: 'Pitcher', icon: '⚾', description: 'Control the game from the mound' },
    { id: 'C', name: 'Catcher', icon: '🧤', description: 'Command the defense behind the plate' },
    { id: '1B', name: 'First Base', icon: '1️⃣', description: 'Power hitter, solid defense' },
    { id: '2B', name: 'Second Base', icon: '2️⃣', description: 'Quick hands, turn double plays' },
    { id: '3B', name: 'Third Base', icon: '3️⃣', description: 'Hot corner, strong arm' },
    { id: 'SS', name: 'Shortstop', icon: '⚡', description: 'Athletic, rangey defender' },
    { id: 'LF', name: 'Left Field', icon: '⬅️', description: 'Corner outfield spot' },
    { id: 'CF', name: 'Center Field', icon: '🎯', description: 'Speed and range, patrol the gaps' },
    { id: 'RF', name: 'Right Field', icon: '➡️', description: 'Strong arm, power bat' },
    { id: 'DH', name: 'Designated Hitter', icon: '💪', description: 'Pure hitting, no defense' }
  ];

  const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
    setPlayerData({ ...playerData, [field]: value });
  };

  const handlePositionSelect = (position: Position) => {
    // Generate randomized base attributes for this position
    const newBase = generateAttributes(position) as any;
    setBaseAttributes(newBase);
    
    // Set player attributes to the base (user can add points on top)
    setPlayerData({ ...playerData, position, attributes: newBase });
    
    // Reset bonus points
    setAttributePoints(30);
  };

  const handleAttributeChange = (attr: string, direction: 'up' | 'down') => {
    const currentValue = (playerData.attributes as any)[attr] || 45;
    const floorValue = (baseAttributes as any)[attr] || 30;
    
    if (direction === 'up') {
      // Can't go above 99 or use more points than available
      if (currentValue >= 99 || attributePoints < 3) return;
      const newValue = Math.min(99, currentValue + 3);
      setPlayerData({
        ...playerData,
        attributes: { ...playerData.attributes!, [attr]: newValue }
      });
      setAttributePoints(attributePoints - 3);
    } else {
      // Can't go below the base/floor value
      if (currentValue <= floorValue) return;
      const newValue = Math.max(floorValue, currentValue - 3);
      setPlayerData({
        ...playerData,
        attributes: { ...playerData.attributes!, [attr]: newValue }
      });
      setAttributePoints(attributePoints + 3);
    }
  };

  const handlePhysicalChange = (field: string, value: number) => {
    setPlayerData({ ...playerData, [field]: value });
  };

  const getTotalRating = (): number => {
    const attrs = playerData.attributes!;
    const isPitcher = playerData.position === 'P';
    
    if (isPitcher) {
      return Math.round(
        ((attrs.velocity || 0) * 0.35 + 
         (attrs.control || 0) * 0.30 + 
         (attrs.movement || 0) * 0.20 + 
         attrs.stamina * 0.15)
      );
    } else {
      return Math.round(
        (attrs.contact * 0.25 + 
         attrs.power * 0.25 + 
         attrs.speed * 0.15 + 
         attrs.fielding * 0.15 + 
         attrs.arm * 0.10 + 
         attrs.discipline * 0.10)
      );
    }
  };

  const getHeightDisplay = (): string => {
    const feet = Math.floor(playerData.height! / 12);
    const inches = playerData.height! % 12;
    return `${feet}'${inches}"`;
  };

  const renderStep1 = () => (
    <div className="creation-step">
      <h2>Choose Your Name</h2>
      <p className="step-description">What will the announcers call you?</p>
      
      <div className="name-inputs">
        <div className="input-group">
          <label>First Name</label>
          <input
            type="text"
            value={playerData.firstName || ''}
            onChange={(e) => handleNameChange('firstName', e.target.value)}
            placeholder="Mike"
            maxLength={20}
          />
        </div>
        
        <div className="input-group">
          <label>Last Name</label>
          <input
            type="text"
            value={playerData.lastName || ''}
            onChange={(e) => handleNameChange('lastName', e.target.value)}
            placeholder="Trout"
            maxLength={20}
          />
        </div>
      </div>

      <button 
        className="next-btn"
        onClick={() => setStep(2)}
        disabled={!playerData.firstName || !playerData.lastName}
      >
        Next: Choose Position →
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="creation-step">
      <h2>Choose Your Position</h2>
      <p className="step-description">Where will you dominate?</p>
      
      <div className="positions-grid">
        {positions.map(pos => (
          <button
            key={pos.id}
            className={`position-card ${playerData.position === pos.id ? 'selected' : ''}`}
            onClick={() => handlePositionSelect(pos.id as Position)}
          >
            <span className="position-icon">{pos.icon}</span>
            <span className="position-name">{pos.name}</span>
            <span className="position-description">{pos.description}</span>
          </button>
        ))}
      </div>

      <div className="step-nav">
        <button className="back-btn" onClick={() => setStep(1)}>
          ← Back
        </button>
        <button 
          className="next-btn"
          onClick={() => setStep(3)}
          disabled={!playerData.position}
        >
          Next: Attributes →
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const attrs = playerData.attributes!;
    const isPitcher = playerData.position === 'P';
    
    const attributesList = isPitcher
      ? [
          { key: 'velocity', label: 'Velocity', description: 'Fastball speed' },
          { key: 'control', label: 'Control', description: 'Command & accuracy' },
          { key: 'movement', label: 'Movement', description: 'Pitch break & deception' },
          { key: 'stamina', label: 'Stamina', description: 'Endurance & recovery' }
        ]
      : [
          { key: 'power', label: 'Power', description: 'Hit for distance' },
          { key: 'contact', label: 'Contact', description: 'Bat-to-ball skills' },
          { key: 'speed', label: 'Speed', description: 'Running & stealing' },
          { key: 'fielding', label: 'Fielding', description: 'Defensive range' },
          { key: 'arm', label: 'Arm', description: 'Throw strength' },
          { key: 'discipline', label: 'Discipline', description: 'Plate patience' }
        ];

    return (
      <div className="creation-step">
        <h2>Distribute Attributes</h2>
        <p className="step-description">
          Bonus points remaining: <span className="points-remaining">{attributePoints}</span>
        </p>
        
        <div className="attributes-list">
          {attributesList.map(attr => {
            const value = (attrs as any)[attr.key] || 45;
            const floor = (baseAttributes as any)[attr.key] || 30;
            const grade = getLetterGrade(value);
            const gradeColor = getGradeColor(value);
            const isAtFloor = value <= floor;
            
            return (
              <div key={attr.key} className="attribute-row">
                <div className="attribute-info">
                  <span className="attribute-label">{attr.label}</span>
                  <span className="attribute-description">{attr.description}</span>
                </div>
                <div className="attribute-control">
                  <button 
                    className="attr-btn"
                    onClick={() => handleAttributeChange(attr.key, 'down')}
                    disabled={isAtFloor}
                  >
                    -
                  </button>
                  <span className="attribute-grade" style={{ color: gradeColor }}>
                    {grade}
                  </span>
                  <button 
                    className="attr-btn"
                    onClick={() => handleAttributeChange(attr.key, 'up')}
                    disabled={attributePoints < 3 || value >= 99}
                  >
                    +
                  </button>
                </div>
                <div className="attribute-bar">
                  <div 
                    className="attribute-fill-base"
                    style={{ width: `${floor}%` }}
                  />
                  <div 
                    className="attribute-fill-bonus"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="overall-rating">
          <span className="rating-label">Overall:</span>
          <span className="rating-grade" style={{ color: getGradeColor(getTotalRating()) }}>
            {getLetterGrade(getTotalRating())}
          </span>
        </div>

        <div className="step-nav">
          <button className="back-btn" onClick={() => setStep(2)}>
            ← Back
          </button>
          <button className="next-btn" onClick={() => setStep(4)}>
            Next: Physical →
          </button>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="creation-step">
      <h2>Physical Attributes</h2>
      <p className="step-description">Define your player's build</p>
      
      <div className="physical-controls">
        <div className="physical-group">
          <label>Height: {getHeightDisplay()}</label>
          <input
            type="range"
            min="66"
            max="84"
            value={playerData.height}
            onChange={(e) => handlePhysicalChange('height', parseInt(e.target.value))}
          />
          <span className="range-labels">
            <span>5'6"</span>
            <span>7'0"</span>
          </span>
        </div>

        <div className="physical-group">
          <label>Weight: {playerData.weight} lbs</label>
          <input
            type="range"
            min="160"
            max="280"
            value={playerData.weight}
            onChange={(e) => handlePhysicalChange('weight', parseInt(e.target.value))}
          />
          <span className="range-labels">
            <span>160</span>
            <span>280</span>
          </span>
        </div>

        <div className="physical-group">
          <label>Age: {playerData.age}</label>
          <input
            type="range"
            min="18"
            max="40"
            value={playerData.age}
            onChange={(e) => handlePhysicalChange('age', parseInt(e.target.value))}
          />
          <span className="range-labels">
            <span>18</span>
            <span>40</span>
          </span>
        </div>

        <div className="hand-selectors">
          <div className="hand-group">
            <label>Throws</label>
            <div className="hand-buttons">
              <button
                className={`hand-btn ${playerData.throwingHand === 'left' ? 'selected' : ''}`}
                onClick={() => setPlayerData({ ...playerData, throwingHand: 'left' })}
              >
                Left
              </button>
              <button
                className={`hand-btn ${playerData.throwingHand === 'right' ? 'selected' : ''}`}
                onClick={() => setPlayerData({ ...playerData, throwingHand: 'right' })}
              >
                Right
              </button>
            </div>
          </div>

          <div className="hand-group">
            <label>Bats</label>
            <div className="hand-buttons">
              <button
                className={`hand-btn ${playerData.battingHand === 'left' ? 'selected' : ''}`}
                onClick={() => setPlayerData({ ...playerData, battingHand: 'left' })}
              >
                Left
              </button>
              <button
                className={`hand-btn ${playerData.battingHand === 'switch' ? 'selected' : ''}`}
                onClick={() => setPlayerData({ ...playerData, battingHand: 'switch' })}
              >
                Switch
              </button>
              <button
                className={`hand-btn ${playerData.battingHand === 'right' ? 'selected' : ''}`}
                onClick={() => setPlayerData({ ...playerData, battingHand: 'right' })}
              >
                Right
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="step-nav">
        <button className="back-btn" onClick={() => setStep(3)}>
          ← Back
        </button>
        <button className="next-btn create-final-btn" onClick={() => setStep(5)}>
          Review & Create →
        </button>
      </div>
    </div>
  );

  const handleCreatePlayer = async () => {
    // Get userId from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please sign in first');
      return;
    }

    // Save player to database (Supabase or localStorage)
    const player = await createPlayer({
      userId,
      firstName: playerData.firstName!,
      lastName: playerData.lastName!,
      position: playerData.position!,
      throwingHand: playerData.throwingHand!,
      battingHand: playerData.battingHand!,
      height: playerData.height!,
      weight: playerData.weight!,
      age: playerData.age!,
      overall: getTotalRating(),
      attributes: playerData.attributes!
    });

    // Store current player ID
    localStorage.setItem('currentPlayerId', player.id);

    setPlayerCreated(true);
  };

  const handleViewOffers = () => {
    if (onNavigate) {
      onNavigate('my-offers');
    }
  };

  const renderStep5 = () => (
    <div className="creation-step">
      <h2>Confirm Your Player</h2>
      <p className="step-description">Ready to enter the league?</p>
      
      <div className="player-summary">
        <div className="summary-card">
          <h3>{playerData.firstName} {playerData.lastName}</h3>
          <div className="summary-position">
            {positions.find(p => p.id === playerData.position)?.icon} {positions.find(p => p.id === playerData.position)?.name}
          </div>
          
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-label">Overall</span>
              <span className="stat-value" style={{ color: getGradeColor(getTotalRating()) }}>{getLetterGrade(getTotalRating())}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Height</span>
              <span className="stat-value">{getHeightDisplay()}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Weight</span>
              <span className="stat-value">{playerData.weight} lbs</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Age</span>
              <span className="stat-value">{playerData.age}</span>
            </div>
          </div>

          <div className="summary-hands">
            Throws: {playerData.throwingHand === 'left' ? 'L' : 'R'} • 
            Bats: {playerData.battingHand === 'left' ? 'L' : playerData.battingHand === 'right' ? 'R' : 'S'}
          </div>
        </div>

        <div className="next-steps-info">
          <h4>What happens next?</h4>
          <ul>
            <li>🔍 AI scouts will evaluate your player</li>
            <li>📬 Teams will send contract offers</li>
            <li>✍️ Choose your team and sign your first contract</li>
            <li>⚾ Start your career in the Bronze League</li>
          </ul>
        </div>
      </div>

      <div className="step-nav">
        <button className="back-btn" onClick={() => setStep(4)}>
          ← Back
        </button>
        <button className="next-btn create-final-btn" onClick={handleCreatePlayer}>
          Create Player 🎉
        </button>
      </div>
    </div>
  );

  const renderPlayerCreated = () => (
    <div className="creation-step">
      <div className="player-created-success">
        <div className="success-icon">🎉</div>
        <h2>Player Created Successfully!</h2>
        <p className="success-message">
          Teams are reviewing your profile. You should receive contract offers soon!
        </p>

        <PlayerCard
          playerName={`${playerData.firstName} ${playerData.lastName}`}
          position={positions.find(p => p.id === playerData.position)?.name || playerData.position!}
          overall={getTotalRating()}
          pendingContracts={5}
          onViewContracts={handleViewOffers}
        />

        <div className="created-actions">
          <button className="secondary-btn" onClick={() => {
            setPlayerCreated(false);
            setStep(1);
            setBaseAttributes({});
            setPlayerData({
              throwingHand: 'right',
              battingHand: 'right',
              height: 72,
              weight: 200,
              age: 22,
              attributes: {
                power: 45,
                contact: 45,
                speed: 45,
                fielding: 45,
                arm: 45,
                discipline: 45,
                stamina: 45
              }
            });
            setAttributePoints(30);
          }}>
            Create Another Player
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="create-player-page">
      <div className="creation-container">
        {!playerCreated && (
          <div className="creation-header">
            <h1>
              <span className="gradient-text">Create</span> Your Player
            </h1>
            <div className="progress-dots">
              {[1, 2, 3, 4, 5].map(s => (
                <div 
                  key={s} 
                  className={`dot ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}
                />
              ))}
            </div>
          </div>
        )}

        {playerCreated ? renderPlayerCreated() : (
          <>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </>
        )}
      </div>
    </div>
  );
};

export default CreatePlayerPage;
