import React, { useState, useEffect } from 'react';
import './MyOffersPage.css';
import { TeamOffer } from '../types/user';
import { getContractOffersFromDb } from '../services/db';

// Mock data generator - will be replaced with real API calls
const generateMockOffers = (): TeamOffer[] => {
  const teams = [
    { name: 'Raydium Rockets', tier: 5, emoji: '🚀' },
    { name: 'Serum Strikers', tier: 5, emoji: '⚡' },
    { name: 'Mango Mavericks', tier: 4, emoji: '🥭' },
    { name: 'Port Finance Pirates', tier: 5, emoji: '🏴‍☠️' },
    { name: 'Francium Falcons', tier: 4, emoji: '🦅' }
  ];

  return teams.map((team, idx) => ({
    id: `offer-${idx}`,
    teamId: `team-${idx}`,
    teamName: team.name,
    tier: team.tier,
    position: 'CF',
    salary: 50000 + (Math.random() * 30000),
    duration: Math.floor(1 + Math.random() * 3),
    bonuses: [
      {
        type: 'performance',
        description: 'Hit 20+ HRs',
        amount: 10000,
        achieved: false
      },
      {
        type: 'team_success',
        description: 'Team promotes to higher tier',
        amount: 25000,
        achieved: false
      }
    ],
    expiresAt: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)), // 3 days
    status: 'pending',
    scoutingReport: generateScoutingReport(team.name)
  }));
};

const generateScoutingReport = (teamName: string): string => {
  const reports = [
    `${teamName} sees you as a potential franchise player. Your speed and contact skills are exactly what we need in center field.`,
    `Our scouting department is impressed by your versatility. ${teamName} wants to build around young talent like you.`,
    `${teamName} believes you can be a cornerstone of our rebuild. Your work ethic and raw tools stand out.`,
    `We love your potential. ${teamName} is ready to give you playing time immediately to develop your skills.`,
    `Your athleticism caught our eye. ${teamName} thinks you're one season away from being elite.`
  ];
  return reports[Math.floor(Math.random() * reports.length)];
};

const MyOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<TeamOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<TeamOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load offers from database (Supabase or localStorage)
    const loadOffers = async () => {
      const playerId = localStorage.getItem('currentPlayerId');
      if (playerId) {
        const realOffers = await getContractOffersFromDb(playerId);
        if (realOffers.length > 0) {
          // Map to TeamOffer format
          const mappedOffers: TeamOffer[] = realOffers.map(offer => ({
            id: offer.id,
            teamId: offer.teamId,
            teamName: offer.teamName,
            tier: offer.tier,
            position: offer.playerPosition,
            salary: offer.salary,
            duration: offer.duration,
            bonuses: [],
            expiresAt: new Date(offer.expiresAt),
            status: offer.status,
            scoutingReport: offer.scoutReport
          }));
          setOffers(mappedOffers);
          setIsLoading(false);
          return;
        }
      }
      // Fallback to mock if no real offers
      setOffers(generateMockOffers());
      setIsLoading(false);
    };

    loadOffers();
  }, []);

  const handleAcceptOffer = (offer: TeamOffer) => {
    // TODO: Backend integration
    alert(`Congratulations! You've signed with ${offer.teamName}!\n\nContract Details:\n- Salary: ${(offer.salary / 1000).toFixed(0)}K DERBY/season\n- Duration: ${offer.duration} season(s)\n\n Your professional career begins now! 🎉`);
    
    // Mark offer as accepted
    setOffers(offers.map(o => 
      o.id === offer.id 
        ? { ...o, status: 'accepted' } 
        : { ...o, status: 'rejected' }
    ));
  };

  const handleRejectOffer = (offer: TeamOffer) => {
    setOffers(offers.map(o => 
      o.id === offer.id ? { ...o, status: 'rejected' } : o
    ));
    setSelectedOffer(null);
  };

  const getTierBadge = (tier: number) => {
    const badges = ['💎', '🏆', '🥇', '🥈', '🥉'];
    const names = ['Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];
    return { emoji: badges[tier - 1], name: names[tier - 1] };
  };

  const getTimeRemaining = (expiresAt: Date): string => {
    const diff = expiresAt.getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const pendingOffers = offers.filter(o => o.status === 'pending');
  const acceptedOffer = offers.find(o => o.status === 'accepted');

  if (isLoading) {
    return (
      <div className="my-offers-page">
        <div className="loading-container">
          <div className="spinner" />
          <p>Teams are reviewing your profile...</p>
        </div>
      </div>
    );
  }

  if (acceptedOffer) {
    return (
      <div className="my-offers-page">
        <div className="signed-container">
          <div className="signed-card">
            <div className="signed-icon">🎉</div>
            <h1>Contract Signed!</h1>
            <h2>{acceptedOffer.teamName}</h2>
            <div className="signed-tier">
              {getTierBadge(acceptedOffer.tier).emoji} {getTierBadge(acceptedOffer.tier).name} League
            </div>
            <div className="signed-details">
              <div className="signed-detail">
                <span className="detail-label">Salary</span>
                <span className="detail-value">{(acceptedOffer.salary / 1000).toFixed(0)}K DERBY</span>
              </div>
              <div className="signed-detail">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{acceptedOffer.duration} Season{acceptedOffer.duration > 1 ? 's' : ''}</span>
              </div>
              <div className="signed-detail">
                <span className="detail-label">Position</span>
                <span className="detail-value">{acceptedOffer.position}</span>
              </div>
            </div>
            <p className="signed-message">
              Your professional career starts now! Head to your team page to meet your teammates.
            </p>
            <button className="view-team-btn">
              View My Team →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-offers-page">
      <div className="offers-container">
        <div className="page-header">
          <h1>
            <span className="gradient-text">Contract</span> Offers
          </h1>
          <p className="page-subtitle">
            {pendingOffers.length} team{pendingOffers.length !== 1 ? 's' : ''} interested in signing you
          </p>
        </div>

        {pendingOffers.length === 0 ? (
          <div className="no-offers">
            <div className="no-offers-icon">📭</div>
            <h3>No active offers</h3>
            <p>Improve your skills and teams will start scouting you!</p>
          </div>
        ) : (
          <>
            <div className="offers-grid">
              {pendingOffers.map(offer => {
                const tierBadge = getTierBadge(offer.tier);
                return (
                  <div 
                    key={offer.id}
                    className={`offer-card ${selectedOffer?.id === offer.id ? 'selected' : ''}`}
                    onClick={() => setSelectedOffer(offer)}
                  >
                    <div className="offer-header">
                      <div className="team-info">
                        <h3>{offer.teamName}</h3>
                        <div className="tier-badge">
                          <span className="tier-emoji">{tierBadge.emoji}</span>
                          <span className="tier-name">{tierBadge.name}</span>
                        </div>
                      </div>
                      <div className="offer-expires">
                        ⏰ Expires in {getTimeRemaining(offer.expiresAt)}
                      </div>
                    </div>

                    <div className="offer-salary">
                      <span className="salary-label">Annual Salary</span>
                      <span className="salary-value">{(offer.salary / 1000).toFixed(0)}K DERBY</span>
                    </div>

                    <div className="offer-details">
                      <div className="offer-detail">
                        <span className="detail-icon">📝</span>
                        <span>{offer.duration} season contract</span>
                      </div>
                      <div className="offer-detail">
                        <span className="detail-icon">⚾</span>
                        <span>Position: {offer.position}</span>
                      </div>
                      <div className="offer-detail">
                        <span className="detail-icon">💰</span>
                        <span>{offer.bonuses.length} performance bonuses</span>
                      </div>
                    </div>

                    <div className="offer-actions">
                      <button 
                        className="review-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOffer(offer);
                        }}
                      >
                        Review Offer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Offer Detail Modal */}
            {selectedOffer && (
              <div className="offer-modal" onClick={() => setSelectedOffer(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close" onClick={() => setSelectedOffer(null)}>
                    ×
                  </button>

                  <div className="modal-header">
                    <h2>{selectedOffer.teamName}</h2>
                    <div className="tier-badge large">
                      <span className="tier-emoji">{getTierBadge(selectedOffer.tier).emoji}</span>
                      <span className="tier-name">{getTierBadge(selectedOffer.tier).name} League</span>
                    </div>
                  </div>

                  <div className="modal-body">
                    <div className="contract-section">
                      <h3>Contract Terms</h3>
                      <div className="contract-terms">
                        <div className="term">
                          <span className="term-label">Base Salary</span>
                          <span className="term-value">{(selectedOffer.salary / 1000).toFixed(0)}K DERBY/season</span>
                        </div>
                        <div className="term">
                          <span className="term-label">Contract Length</span>
                          <span className="term-value">{selectedOffer.duration} season{selectedOffer.duration > 1 ? 's' : ''}</span>
                        </div>
                        <div className="term">
                          <span className="term-label">Position</span>
                          <span className="term-value">{selectedOffer.position}</span>
                        </div>
                        <div className="term">
                          <span className="term-label">Total Value</span>
                          <span className="term-value highlight">
                            {((selectedOffer.salary * selectedOffer.duration) / 1000).toFixed(0)}K DERBY
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bonuses-section">
                      <h3>Performance Bonuses</h3>
                      {selectedOffer.bonuses.map((bonus, idx) => (
                        <div key={idx} className="bonus-item">
                          <div className="bonus-description">
                            <span className="bonus-type">{bonus.type.replace('_', ' ')}</span>
                            <span className="bonus-text">{bonus.description}</span>
                          </div>
                          <span className="bonus-amount">+{(bonus.amount / 1000).toFixed(0)}K</span>
                        </div>
                      ))}
                    </div>

                    <div className="scouting-section">
                      <h3>Scouting Report</h3>
                      <p className="scouting-text">{selectedOffer.scoutingReport}</p>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button 
                      className="reject-btn"
                      onClick={() => handleRejectOffer(selectedOffer)}
                    >
                      Decline Offer
                    </button>
                    <button 
                      className="accept-btn"
                      onClick={() => handleAcceptOffer(selectedOffer)}
                    >
                      Sign Contract ✍️
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyOffersPage;
