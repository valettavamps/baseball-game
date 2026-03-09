// API Service for connecting to backend
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const userId = localStorage.getItem('userId');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(userId && { 'x-user-id': userId }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Request failed' };
    }

    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

// ============ AUTH ============

export interface User {
  id: string;
  username: string;
  email: string;
  players?: string[];
  walletAddress?: string;
}

export async function register(username: string, email: string, password: string) {
  const result = await request<{ user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });

  if (result.data?.user) {
    localStorage.setItem('userId', result.data.user.id);
  }
  
  return result;
}

export async function login(email: string, password: string) {
  const result = await request<{ user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (result.data?.user) {
    localStorage.setItem('userId', result.data.user.id);
  }
  
  return result;
}

export async function getCurrentUser() {
  return request<{ user: User }>('/auth/me');
}

export function logout() {
  localStorage.removeItem('userId');
}

// ============ PLAYERS ============

export interface Player {
  id: string;
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
    salary: number;
    duration: number;
    bonuses: number;
  };
}

export async function createPlayer(playerData: Omit<Player, 'id'>) {
  return request<{ player: Player }>('/players', {
    method: 'POST',
    body: JSON.stringify(playerData)
  });
}

export async function getMyPlayers() {
  return request<{ players: Player[] }>('/players');
}

export async function getPlayer(id: string) {
  return request<{ player: Player }>(`/players/${id}`);
}

// ============ TEAMS ============

export interface Team {
  id: string;
  name: string;
  city: string;
  tier: number;
  rating: number;
  wins: number;
  losses: number;
  runsScored: number;
  runsAllowed: number;
  streak: string | null;
  players: string[];
  ownerId?: string;
  treasury: number;
}

export async function getAllTeams() {
  return request<{ teams: Team[] }>('/teams');
}

export async function getTeamsByTier(tier: number) {
  return request<{ teams: Team[] }>(`/teams/tier/${tier}`);
}

export async function getTeam(id: string) {
  return request<{ team: Team }>(`/teams/${id}`);
}

// ============ SEASONS ============

export interface Season {
  id: string;
  year: number;
  status: 'upcoming' | 'active' | 'completed';
  currentDay: number;
  totalDays: number;
}

export async function getCurrentSeason() {
  return request<{ season: Season }>('/seasons/current');
}

export async function startSeason() {
  return request<{ season: Season; teams: Team[] }>('/seasons/start', {
    method: 'POST'
  });
}

export async function simulateDay(seasonId: string) {
  return request<{ season: Season }>(`/seasons/${seasonId}/simulate-day`, {
    method: 'POST'
  });
}

// ============ STAKES ============

export interface Stake {
  id: string;
  userId: string;
  teamId: string;
  amount: number;
  seasonId: string;
  createdAt: number;
  team?: Team;
}

export async function createStake(teamId: string, amount: number, seasonId: string) {
  return request<{ stake: Stake }>('/stakes', {
    method: 'POST',
    body: JSON.stringify({ teamId, amount, seasonId })
  });
}

export async function getMyStakes() {
  return request<{ stakes: Stake[] }>('/stakes');
}

// ============ CONTRACTS ============

export interface ContractOffer {
  id: string;
  teamId: string;
  teamName: string;
  tier: number;
  salary: number;
  duration: number;
  bonuses: number;
  expiresAt: number;
}

export async function getContractOffers() {
  return request<{ offers: ContractOffer[] }>('/contracts/offers');
}
