import { v4 as uuidv4 } from 'uuid';

// ============ TYPES ============

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  attributes: {
    power: number;
    contact: number;
    speed: number;
    fielding: number;
    arm: number;
    discipline: number;
    stamina: number;
    velocity?: number;
    control?: number;
    movement?: number;
  };
  throwingHand: 'left' | 'right';
  battingHand: 'left' | 'right' | 'switch';
  height: number;
  weight: number;
  age: number;
  overall: number;
  teamId?: string;
  contract?: {
    salary: number;
    duration: number;
    bonuses: number;
  };
}

export interface Team {
  id: string;
  name: string;
  city: string;
  tier: 1 | 2 | 3 | 4 | 5;
  rating: number;
  wins: number;
  losses: number;
  runsScored: number;
  runsAllowed: number;
  streak: 'W' | 'L' | null;
  players: string[];
  ownerId?: string;
  treasury: number;
  tierHistory: { tier: number; season: number }[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  twoFactorSecret?: string;
  players: string[];
  walletAddress?: string;
  createdAt: number;
}

export interface Season {
  id: string;
  year: number;
  status: 'upcoming' | 'active' | 'completed';
  currentDay: number;
  totalDays: number;
  startDate: number;
  endDate?: number;
  schedules: { [tier: number]: Game[] };
  standings: { [tier: number]: TeamStanding[] };
}

export interface Game {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'in_progress' | 'completed';
  day: number;
  innings?: { home: number[]; away: number[] };
  highlights?: string[];
}

export interface TeamStanding {
  teamId: string;
  wins: number;
  losses: number;
  runsScored: number;
  runsAllowed: number;
  streak: 'W' | 'L' | null;
}

export interface Stake {
  id: string;
  userId: string;
  teamId: string;
  amount: number;
  seasonId: string;
  createdAt: number;
}

// ============ DATA STORE ============

class DataStore {
  users: Map<string, User> = new Map();
  players: Map<string, Player> = new Map();
  teams: Map<string, Team> = new Map();
  seasons: Map<string, Season> = new Map();
  stakes: Map<string, Stake> = new Map();

  generateId(): string {
    return uuidv4();
  }

  // ============ USER METHODS ============

  createUser(username: string, email: string, passwordHash: string): User {
    const user: User = {
      id: this.generateId(),
      username, email, passwordHash,
      players: [],
      createdAt: Date.now()
    };
    this.users.set(user.id, user);
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  // ============ PLAYER METHODS ============

  createPlayer(playerData: Omit<Player, 'id'>): Player {
    const player: Player = { ...playerData, id: this.generateId() };
    this.players.set(player.id, player);
    return player;
  }

  getPlayerById(id: string): Player | undefined {
    return this.players.get(id);
  }

  getPlayersByUser(userId: string): Player[] {
    const user = this.users.get(userId);
    if (!user) return [];
    return user.players.map(id => this.players.get(id)).filter(Boolean) as Player[];
  }

  updatePlayer(id: string, updates: Partial<Player>): Player | undefined {
    const player = this.players.get(id);
    if (!player) return undefined;
    const updated = { ...player, ...updates };
    this.players.set(id, updated);
    return updated;
  }

  // ============ TEAM METHODS ============

  createTeam(teamData: Omit<Team, 'id'>): Team {
    const team: Team = { ...teamData, id: this.generateId() };
    this.teams.set(team.id, team);
    return team;
  }

  getTeamById(id: string): Team | undefined {
    return this.teams.get(id);
  }

  getAllTeams(): Team[] {
    return Array.from(this.teams.values());
  }

  getTeamsByTier(tier: number): Team[] {
    return Array.from(this.teams.values()).filter(t => t.tier === tier);
  }

  updateTeam(id: string, updates: Partial<Team>): Team | undefined {
    const team = this.teams.get(id);
    if (!team) return undefined;
    const updated = { ...team, ...updates };
    this.teams.set(id, updated);
    return updated;
  }

  // ============ SEASON METHODS ============

  createSeason(year: number): Season {
    const season: Season = {
      id: this.generateId(),
      year, status: 'upcoming',
      currentDay: 0, totalDays: 162,
      startDate: Date.now(),
      schedules: {}, standings: {}
    };
    this.seasons.set(season.id, season);
    return season;
  }

  getSeasonById(id: string): Season | undefined {
    return this.seasons.get(id);
  }

  getCurrentSeason(): Season | undefined {
    return Array.from(this.seasons.values()).find(s => s.status === 'active');
  }

  updateSeason(id: string, updates: Partial<Season>): Season | undefined {
    const season = this.seasons.get(id);
    if (!season) return undefined;
    const updated = { ...season, ...updates };
    this.seasons.set(id, updated);
    return updated;
  }

  // ============ STAKE METHODS ============

  createStake(userId: string, teamId: string, amount: number, seasonId: string): Stake {
    const stake: Stake = {
      id: this.generateId(),
      userId, teamId, amount, seasonId,
      createdAt: Date.now()
    };
    this.stakes.set(stake.id, stake);
    return stake;
  }

  getStakesByUser(userId: string): Stake[] {
    return Array.from(this.stakes.values()).filter(s => s.userId === userId);
  }

  getStakesByTeam(teamId: string): Stake[] {
    return Array.from(this.stakes.values()).filter(s => s.teamId === teamId);
  }
}

export const dataStore = new DataStore();
