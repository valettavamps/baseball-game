// Client-side persistence layer using localStorage
// Replaces backend API for testing - swap to real API later

const STORAGE_PREFIX = 'diamondchain_';

function getItem<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage full or unavailable', e);
  }
}

function removeItem(key: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

// ============ USER / AUTH ============

export interface StoredUser {
  id: string;
  username: string;
  email: string;
  players: string[];
  createdAt: number;
}

export function registerUser(username: string, email: string, _password: string): StoredUser {
  const users = getItem<StoredUser[]>('users') || [];
  
  // Check duplicate
  if (users.find(u => u.email === email)) {
    throw new Error('Email already registered');
  }

  const user: StoredUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    email,
    players: [],
    createdAt: Date.now()
  };

  users.push(user);
  setItem('users', users);
  setItem('currentUser', user);
  return user;
}

export function loginUser(email: string, _password: string): StoredUser {
  const users = getItem<StoredUser[]>('users') || [];
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // TODO: real password check
  setItem('currentUser', user);
  return user;
}

export function getCurrentUser(): StoredUser | null {
  return getItem<StoredUser>('currentUser');
}

export function logoutUser(): void {
  removeItem('currentUser');
}

// ============ TEAMS ============

export interface StoredTeam {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  tier: number;
  tierName: string;
  rating: number;
  wins: number;
  losses: number;
  runsScored: number;
  runsAllowed: number;
  streak: string;
  streakCount: number;
  revenue: number;
  attendance: number;
  ownerId?: string;
  stakers: { userId: string; amount: number }[];
}

const TEAM_DATA: { city: string; name: string; abbr: string }[] = [
  // Diamond (10)
  { city: 'New York', name: 'Empire', abbr: 'NYE' },
  { city: 'Los Angeles', name: 'Titans', abbr: 'LAT' },
  { city: 'Chicago', name: 'Thunder', abbr: 'CHT' },
  { city: 'Houston', name: 'Rockets', abbr: 'HOU' },
  { city: 'Atlanta', name: 'Blaze', abbr: 'ATB' },
  { city: 'Boston', name: 'Legends', abbr: 'BOS' },
  { city: 'San Francisco', name: 'Giants', abbr: 'SFG' },
  { city: 'Philadelphia', name: 'Liberty', abbr: 'PHI' },
  { city: 'San Diego', name: 'Waves', abbr: 'SDW' },
  { city: 'Seattle', name: 'Storm', abbr: 'SEA' },
  // Platinum (16)
  { city: 'Miami', name: 'Heat', abbr: 'MIA' },
  { city: 'Denver', name: 'Altitude', abbr: 'DEN' },
  { city: 'Detroit', name: 'Steel', abbr: 'DET' },
  { city: 'Minneapolis', name: 'Frost', abbr: 'MIN' },
  { city: 'Tampa', name: 'Rays', abbr: 'TBR' },
  { city: 'Baltimore', name: 'Ravens', abbr: 'BAL' },
  { city: 'Cleveland', name: 'Guardians', abbr: 'CLE' },
  { city: 'Milwaukee', name: 'Brewmasters', abbr: 'MIL' },
  { city: 'Pittsburgh', name: 'Ironworks', abbr: 'PIT' },
  { city: 'Kansas City', name: 'Monarchs', abbr: 'KCM' },
  { city: 'St. Louis', name: 'Arch', abbr: 'STL' },
  { city: 'Cincinnati', name: 'River', abbr: 'CIN' },
  { city: 'Arizona', name: 'Scorpions', abbr: 'ARI' },
  { city: 'Colorado', name: 'Summit', abbr: 'COL' },
  { city: 'Oakland', name: 'Oaks', abbr: 'OAK' },
  { city: 'Washington', name: 'Capitals', abbr: 'WSH' },
  // Gold (20)
  { city: 'Nashville', name: 'Music', abbr: 'NSH' },
  { city: 'Charlotte', name: 'Hornets', abbr: 'CLT' },
  { city: 'Portland', name: 'Timber', abbr: 'POR' },
  { city: 'Sacramento', name: 'Kings', abbr: 'SAC' },
  { city: 'Orlando', name: 'Magic', abbr: 'ORL' },
  { city: 'Salt Lake', name: 'Summit', abbr: 'SLC' },
  { city: 'Jacksonville', name: 'Jaguars', abbr: 'JAX' },
  { city: 'Memphis', name: 'Blues', abbr: 'MEM' },
  { city: 'Austin', name: 'Lone Stars', abbr: 'AUS' },
  { city: 'Las Vegas', name: 'Aces', abbr: 'LVA' },
  { city: 'New Orleans', name: 'Bayou', abbr: 'NOL' },
  { city: 'San Antonio', name: 'Spurs', abbr: 'SAN' },
  { city: 'Raleigh', name: 'Oaks', abbr: 'RAL' },
  { city: 'Indianapolis', name: 'Racers', abbr: 'IND' },
  { city: 'Columbus', name: 'Crew', abbr: 'CMB' },
  { city: 'Louisville', name: 'Sluggers', abbr: 'LOU' },
  { city: 'Hartford', name: 'Whalers', abbr: 'HFD' },
  { city: 'Richmond', name: 'Rebels', abbr: 'RIC' },
  { city: 'Norfolk', name: 'Admirals', abbr: 'NFK' },
  { city: 'Tucson', name: 'Coyotes', abbr: 'TUC' },
  // Silver (24)
  { city: 'Boise', name: 'Hawks', abbr: 'BOI' },
  { city: 'Albuquerque', name: 'Dukes', abbr: 'ABQ' },
  { city: 'El Paso', name: 'Chihuahuas', abbr: 'ELP' },
  { city: 'Omaha', name: 'Stormchasers', abbr: 'OMA' },
  { city: 'Tulsa', name: 'Drillers', abbr: 'TUL' },
  { city: 'Des Moines', name: 'Cubs', abbr: 'DSM' },
  { city: 'Little Rock', name: 'Travelers', abbr: 'LRK' },
  { city: 'Birmingham', name: 'Barons', abbr: 'BHM' },
  { city: 'Wichita', name: 'Wind', abbr: 'WCH' },
  { city: 'Fresno', name: 'Grizzlies', abbr: 'FRS' },
  { city: 'Spokane', name: 'Indians', abbr: 'SPK' },
  { city: 'Knoxville', name: 'Smokies', abbr: 'KNX' },
  { city: 'Lexington', name: 'Legends', abbr: 'LEX' },
  { city: 'Reno', name: 'Aces', abbr: 'RNO' },
  { city: 'Syracuse', name: 'Mets', abbr: 'SYR' },
  { city: 'Rochester', name: 'Wings', abbr: 'ROC' },
  { city: 'Toledo', name: 'Mud Hens', abbr: 'TOL' },
  { city: 'Durham', name: 'Bulls', abbr: 'DUR' },
  { city: 'Scranton', name: 'Railriders', abbr: 'SWB' },
  { city: 'Gwinnett', name: 'Stripers', abbr: 'GWN' },
  { city: 'Buffalo', name: 'Bisons', abbr: 'BUF' },
  { city: 'Lehigh', name: 'Ironpigs', abbr: 'LHV' },
  { city: 'Worcester', name: 'Woo Sox', abbr: 'WOR' },
  { city: 'Tacoma', name: 'Rainiers', abbr: 'TAC' },
  // Bronze (30)
  { city: 'Dayton', name: 'Dragons', abbr: 'DAY' },
  { city: 'Akron', name: 'Rubberducks', abbr: 'AKR' },
  { city: 'Modesto', name: 'Nuts', abbr: 'MOD' },
  { city: 'Cedar Rapids', name: 'Kernels', abbr: 'CRP' },
  { city: 'Peoria', name: 'Chiefs', abbr: 'PEO' },
  { city: 'Fort Wayne', name: 'Tincaps', abbr: 'FTW' },
  { city: 'Lansing', name: 'Lugnuts', abbr: 'LAN' },
  { city: 'South Bend', name: 'Cubs', abbr: 'SBN' },
  { city: 'Great Lakes', name: 'Loons', abbr: 'GRL' },
  { city: 'Quad Cities', name: 'Bandits', abbr: 'QCB' },
  { city: 'Beloit', name: 'Snappers', abbr: 'BEL' },
  { city: 'Wisconsin', name: 'Timber Rattlers', abbr: 'WIS' },
  { city: 'Lake County', name: 'Captains', abbr: 'LKC' },
  { city: 'West Michigan', name: 'Whitecaps', abbr: 'WMI' },
  { city: 'Bowling Green', name: 'Hot Rods', abbr: 'BWG' },
  { city: 'Rome', name: 'Emperors', abbr: 'ROM' },
  { city: 'Augusta', name: 'GreenJackets', abbr: 'AUG' },
  { city: 'Hickory', name: 'Crawdads', abbr: 'HCK' },
  { city: 'Greenville', name: 'Drive', abbr: 'GVL' },
  { city: 'Asheville', name: 'Tourists', abbr: 'ASH' },
  { city: 'Columbia', name: 'Fireflies', abbr: 'COA' },
  { city: 'Charleston', name: 'Riverdogs', abbr: 'CHS' },
  { city: 'Myrtle Beach', name: 'Pelicans', abbr: 'MYR' },
  { city: 'Delmarva', name: 'Shorebirds', abbr: 'DEL' },
  { city: 'Fredericksburg', name: 'Nationals', abbr: 'FBG' },
  { city: 'Salem', name: 'Red Sox', abbr: 'SAL' },
  { city: 'Lynchburg', name: 'Hillcats', abbr: 'LYN' },
  { city: 'Fayetteville', name: 'Woodpeckers', abbr: 'FAY' },
  { city: 'Kannapolis', name: 'Cannon Ballers', abbr: 'KAN' },
  { city: 'Down East', name: 'Wood Ducks', abbr: 'DEW' },
];

const TIER_CONFIG = [
  { tier: 1, name: 'Diamond', count: 10, ratingMin: 85, ratingMax: 95, revenueMultiplier: 1.5 },
  { tier: 2, name: 'Platinum', count: 16, ratingMin: 75, ratingMax: 85, revenueMultiplier: 1.3 },
  { tier: 3, name: 'Gold', count: 20, ratingMin: 65, ratingMax: 75, revenueMultiplier: 1.1 },
  { tier: 4, name: 'Silver', count: 24, ratingMin: 55, ratingMax: 65, revenueMultiplier: 1.0 },
  { tier: 5, name: 'Bronze', count: 30, ratingMin: 45, ratingMax: 55, revenueMultiplier: 0.8 },
];

export function generateAllTeams(): StoredTeam[] {
  const existing = getItem<StoredTeam[]>('teams');
  if (existing && existing.length > 0) return existing;

  const teams: StoredTeam[] = [];
  let teamIndex = 0;

  for (const config of TIER_CONFIG) {
    for (let i = 0; i < config.count; i++) {
      const data = TEAM_DATA[teamIndex];
      if (!data) break;

      teams.push({
        id: `team_${data.abbr}`,
        name: data.name,
        city: data.city,
        abbreviation: data.abbr,
        tier: config.tier,
        tierName: config.name,
        rating: Math.floor(config.ratingMin + Math.random() * (config.ratingMax - config.ratingMin)),
        wins: 0,
        losses: 0,
        runsScored: 0,
        runsAllowed: 0,
        streak: '',
        streakCount: 0,
        revenue: 0,
        attendance: 0,
        stakers: []
      });
      teamIndex++;
    }
  }

  setItem('teams', teams);
  return teams;
}

export function getTeams(): StoredTeam[] {
  return getItem<StoredTeam[]>('teams') || generateAllTeams();
}

export function getTeamsByTier(tier: number): StoredTeam[] {
  return getTeams().filter(t => t.tier === tier);
}

export function getTeamById(id: string): StoredTeam | null {
  return getTeams().find(t => t.id === id) || null;
}

export function updateTeam(id: string, updates: Partial<StoredTeam>): StoredTeam | null {
  const teams = getTeams();
  const index = teams.findIndex(t => t.id === id);
  if (index === -1) return null;
  teams[index] = { ...teams[index], ...updates };
  setItem('teams', teams);
  return teams[index];
}

// ============ PLAYERS ============

export interface StoredPlayer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  position: string;
  attributes: Record<string, number>;
  throwingHand: string;
  battingHand: string;
  height: number;
  weight: number;
  age: number;
  overall: number;
  teamId?: string;
  contract?: {
    teamId: string;
    teamName: string;
    salary: number;
    duration: number;
    bonuses: number;
    signedAt: number;
  };
  createdAt: number;
}

export function createPlayer(player: Omit<StoredPlayer, 'id' | 'createdAt'>): StoredPlayer {
  const players = getItem<StoredPlayer[]>('players') || [];
  const newPlayer: StoredPlayer = {
    ...player,
    id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now()
  };
  players.push(newPlayer);
  setItem('players', players);
  return newPlayer;
}

export function getPlayersByUser(userId: string): StoredPlayer[] {
  const players = getItem<StoredPlayer[]>('players') || [];
  return players.filter(p => p.userId === userId);
}

export function updatePlayer(id: string, updates: Partial<StoredPlayer>): StoredPlayer | null {
  const players = getItem<StoredPlayer[]>('players') || [];
  const index = players.findIndex(p => p.id === id);
  if (index === -1) return null;
  players[index] = { ...players[index], ...updates };
  setItem('players', players);
  return players[index];
}

// ============ SEASON ============

export interface StoredSeason {
  id: string;
  year: number;
  status: 'upcoming' | 'active' | 'completed';
  currentDay: number;
  totalDays: number;
  startedAt?: number;
  completedAt?: number;
}

export function startNewSeason(year: number = 2026): StoredSeason {
  // Ensure teams exist
  generateAllTeams();

  const season: StoredSeason = {
    id: `season_${year}`,
    year,
    status: 'active',
    currentDay: 0,
    totalDays: 162,
    startedAt: Date.now()
  };
  setItem('currentSeason', season);
  return season;
}

export function getCurrentSeason(): StoredSeason | null {
  return getItem<StoredSeason>('currentSeason');
}

export function updateSeason(updates: Partial<StoredSeason>): StoredSeason | null {
  const season = getCurrentSeason();
  if (!season) return null;
  const updated = { ...season, ...updates };
  setItem('currentSeason', updated);
  return updated;
}

// ============ GAME RESULTS ============

export interface StoredGameResult {
  id: string;
  seasonId: string;
  day: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  highlights: string[];
  revenue: number;
  attendance: number;
}

export function saveGameResults(results: StoredGameResult[]): void {
  const allResults = getItem<StoredGameResult[]>('gameResults') || [];
  allResults.push(...results);
  setItem('gameResults', allResults);
}

export function getGameResultsByDay(day: number): StoredGameResult[] {
  const allResults = getItem<StoredGameResult[]>('gameResults') || [];
  return allResults.filter(r => r.day === day);
}

export function getAllGameResults(): StoredGameResult[] {
  return getItem<StoredGameResult[]>('gameResults') || [];
}

// ============ CONTRACT OFFERS ============

export interface StoredContractOffer {
  id: string;
  playerId: string;
  playerPosition: string;
  teamId: string;
  teamName: string;
  teamCity: string;
  tier: number;
  tierName: string;
  salary: number;
  duration: number;
  bonuses: number;
  scoutReport: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: number;
  expiresAt: number;
}

export function generateContractOffers(playerId: string, position: string): StoredContractOffer[] {
  const teams = getTeams();
  const offers: StoredContractOffer[] = [];
  
  // Pick 5 random teams from different tiers
  const shuffled = [...teams].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 5);

  // Position-specific scout reports
  const positionReports: Record<string, string[]> = {
    'P': ['Looking for a pitcher to anchor our rotation.', 'Our scouts rate your stuff highly.', 'Could be a day-one starter in our bullpen.'],
    'C': ['We need a catcher to lead our defense.', 'Your receiving skills impressed our scouts.', 'Would be a great addition behind the plate.'],
    '1B': ['Looking for power at first base.', 'Your bat could be a big upgrade at the corner.', 'We need a consistent bat in the lineup.'],
    '2B': ['Need a versatile second baseman.', 'Your range and hands impressed us.', 'Could be our everyday second baseman.'],
    '3B': ['Hot corner specialist needed.', 'Your arm and reactions would play well at third.', 'Looking for a premium defender at the hot corner.'],
    'SS': ['Elite shortstop to anchor our infield.', 'Your defensive metrics are off the charts.', 'Could be a Gold Glove contender at short.'],
    'LF': ['Corner outfield power needed.', 'Your power would play well in left field.', 'Looking for a run producer in the outfield.'],
    'CF': ['Center field coverage is a priority.', 'Your speed and range would anchor our outfield.', 'We need a true center fielder.'],
    'RF': ['Right field arm strength is key.', 'Your combination of power and defense is rare.', 'Would be a great fit in right field.'],
    'DH': ['Designated hitter spot available.', 'Your bat would play well in the DH role.', 'Looking for consistent production at the plate.']
  };

  const defaultReports = [
    'Our scouts love the raw potential. Could be a day-one starter.',
    'Great fit for our system. We see big things ahead.',
    'The coaching staff is excited about this prospect.',
    'A perfect addition to our roster for the upcoming season.',
    'Our analytics team rates this player highly for our needs.'
  ];

  const reports = positionReports[position] || defaultReports;

  for (let i = 0; i < selected.length; i++) {
    const team = selected[i];
    const tierMultiplier = [1.5, 1.3, 1.1, 1.0, 0.8][team.tier - 1];
    
    offers.push({
      id: `offer_${Date.now()}_${i}`,
      playerId,
      playerPosition: position,
      teamId: team.id,
      teamName: team.name,
      teamCity: team.city,
      tier: team.tier,
      tierName: ['Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'][team.tier - 1],
      salary: Math.floor((40000 + Math.random() * 60000) * tierMultiplier),
      duration: Math.floor(1 + Math.random() * 3),
      bonuses: Math.floor((2000 + Math.random() * 18000) * tierMultiplier),
      scoutReport: reports[i % reports.length],
      status: 'pending',
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000 * 3
    });
  }

  // Sort by salary desc
  offers.sort((a, b) => b.salary - a.salary);

  const allOffers = getItem<StoredContractOffer[]>('contractOffers') || [];
  allOffers.push(...offers);
  setItem('contractOffers', allOffers);
  
  return offers;
}

export function getOffersForPlayer(playerId: string): StoredContractOffer[] {
  const allOffers = getItem<StoredContractOffer[]>('contractOffers') || [];
  return allOffers.filter(o => o.playerId === playerId && o.status === 'pending');
}

export function acceptOffer(offerId: string): StoredContractOffer | null {
  const allOffers = getItem<StoredContractOffer[]>('contractOffers') || [];
  const index = allOffers.findIndex(o => o.id === offerId);
  if (index === -1) return null;
  
  // Accept this one, reject others for same player
  const accepted = allOffers[index];
  accepted.status = 'accepted';
  
  allOffers.forEach(o => {
    if (o.playerId === accepted.playerId && o.id !== offerId) {
      o.status = 'rejected';
    }
  });

  setItem('contractOffers', allOffers);
  return accepted;
}

export function rejectOffer(offerId: string): void {
  const allOffers = getItem<StoredContractOffer[]>('contractOffers') || [];
  const index = allOffers.findIndex(o => o.id === offerId);
  if (index !== -1) {
    allOffers[index].status = 'rejected';
    setItem('contractOffers', allOffers);
  }
}

// ============ STAKES ============

export interface StoredStake {
  id: string;
  userId: string;
  teamId: string;
  amount: number;
  seasonId: string;
  createdAt: number;
}

export function createStake(userId: string, teamId: string, amount: number, seasonId: string): StoredStake {
  const stakes = getItem<StoredStake[]>('stakes') || [];
  const stake: StoredStake = {
    id: `stake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    teamId,
    amount,
    seasonId,
    createdAt: Date.now()
  };
  stakes.push(stake);
  setItem('stakes', stakes);
  return stake;
}

export function getStakesByUser(userId: string): StoredStake[] {
  const stakes = getItem<StoredStake[]>('stakes') || [];
  return stakes.filter(s => s.userId === userId);
}

// ============ RESET ============

export function resetAllData(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
  keys.forEach(k => localStorage.removeItem(k));
}
