import React, { useState } from 'react';
import './CreatePlayerPage.css';
import { PlayerCreationData } from '../types/user';
import { Position } from '../types';
import PlayerCard from '../components/PlayerCard';

interface CreatePlayerPageProps {
  onNavigate?: (page: string) => void;
}

const CreatePlayerPage: React.FC<CreatePlayerPageProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<number>(1);
  const [playerCreated, setPlayerCreated] = useState<boolean>(false);
  const [playerData, setPlayerData] = useState<Partial<PlayerCreationData>>({
    throwingHand: 'right',
    battingHand: 'right',
    height: 72, // 6'0"
    weight: 200,
    age: 22,
    attributes: {
      power: 50,
      contact: 50,
      speed: 50,
      fielding: 50,
      arm: 50,
      discipline: 50,
      stamina: 50
    }
  });

  const [attributePoints, setAttributePoints] = useState<number>(50);

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
    setPlayerData({ ...playerData, position });
    
    // Auto-adjust attributes based on position
    const newAttributes = { ...playerData.attributes! };
    
    if (position === 'P') {
      newAttributes.velocity = 60;
      newAttributes.control = 55;
      newAttributes.movement = 55;
      newAttributes.power = 30;
      newAttributes.contact = 30;
    } else if (position === 'C') {
      newAttributes.arm = 65;
      newAttributes.fielding = 60;
      newAttributes.speed = 40;
    } else if (['CF', 'SS'].includes(position)) {
      newAttributes.speed = 65;
      newAttributes.fielding = 60;
    } else if (['1B', '3B', 'DH'].includes(position)) {
      newAttributes.power = 65;
      newAttributes.contact = 60;
    }
    
    setPlayerData({ ...playerData, position, attributes: newAttributes });
  };

  const handleAttributeChange = (attr: string, value: number) => {
    const currentValue = (playerData.attributes as any)[attr] || 50;
    const diff = value - currentValue;
    
    if (attributePoints - diff >= 0) {
      setPlayerData({
        ...playerData,
        attributes: { 
          power: 50,
          contact: 50,
          speed: 50,
          fielding: 50,
          arm: 50,
          discipline: 50,
          stamina: 50,
          ...playerData.attributes,
          [attr]: value 
        }
      });
      setAttributePoints(attributePoints - diff);
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
          Points remaining: <span className="points-remaining">{attributePoints}</span>
        </p>
        
        <div className="attributes-list">
          {attributesList.map(attr => (
            <div key={attr.key} className="attribute-row">
              <div className="attribute-info">
                <span className="attribute-label">{attr.label}</span>
                <span className="attribute-description">{attr.description}</span>
              </div>
              <div className="attribute-control">
                <button 
                  className="attr-btn"
                  onClick={() => handleAttributeChange(attr.key, Math.max(1, (attrs as any)[attr.key] - 5))}
                >
                  -
                </button>
                <span className="attribute-value">{(attrs as any)[attr.key]}</span>
                <button 
                  className="attr-btn"
                  onClick={() => handleAttributeChange(attr.key, Math.min(99, (attrs as any)[attr.key] + 5))}
                  disabled={attributePoints < 5}
                >
                  +
                </button>
              </div>
              <div className="attribute-bar">
                <div 
                  className="attribute-fill"
                  style={{ width: `${(attrs as any)[attr.key]}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="overall-rating">
          <span className="rating-label">Overall Rating:</span>
          <span className="rating-value">{getTotalRating()}</span>
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

  const handleCreatePlayer = () => {
    // TODO: Backend integration
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
              <span className="stat-value">{getTotalRating()}</span>
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
            setPlayerData({
              throwingHand: 'right',
              battingHand: 'right',
              height: 72,
              weight: 200,
              age: 22,
              attributes: {
                power: 50,
                contact: 50,
                speed: 50,
                fielding: 50,
                arm: 50,
                discipline: 50,
                stamina: 50
              }
            });
            setAttributePoints(50);
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
