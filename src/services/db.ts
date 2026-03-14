// Unified database service
// Uses Supabase when configured, falls back to localStorage

import { supabase, isSupabaseConfigured } from './supabase';
import { 
  getItem, setItem, 
  StoredUser, StoredPlayer, StoredTeam, 
  StoredContractOffer, StoredSeason, StoredGameResult, StoredStake 
} from './localStorage';

// ============ USERS ============

export async function createUser(username: string, email: string): Promise<StoredUser> {
  const user: StoredUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    email,
    players: [],
    createdAt: Date.now()
  };

  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('users').insert({
      username: user.username,
      email: user.email
    });
    if (error) console.error('Supabase insert error:', error);
  }

  // Also save to localStorage
  const users = getItem<StoredUser[]>('users') || [];
  users.push(user);
  setItem('users', users);

  return user;
}

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (!error && data) {
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        players: data.players || [],
        createdAt: new Date(data.created_at).getTime()
      };
    }
  }

  const users = getItem<StoredUser[]>('users') || [];
  return users.find(u => u.email === email) || null;
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!error && data) {
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        players: data.players || [],
        createdAt: new Date(data.created_at).getTime()
      };
    }
  }

  const users = getItem<StoredUser[]>('users') || [];
  return users.find(u => u.id === id) || null;
}

// ============ PLAYERS ============

export async function createPlayer(player: Omit<StoredPlayer, 'id' | 'createdAt'>): Promise<StoredPlayer> {
  const newPlayer: StoredPlayer = {
    ...player,
    id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now()
  };

  if (isSupabaseConfigured() && supabase) {
    await supabase.from('players').insert({
      user_id: newPlayer.userId,
      first_name: newPlayer.firstName,
      last_name: newPlayer.lastName,
      position: newPlayer.position,
      throwing_hand: newPlayer.throwingHand,
      batting_hand: newPlayer.battingHand,
      height: newPlayer.height,
      weight: newPlayer.weight,
      age: newPlayer.age,
      overall: newPlayer.overall,
      attributes: newPlayer.attributes
    });
  }

  // Also localStorage
  const players = getItem<StoredPlayer[]>('players') || [];
  players.push(newPlayer);
  setItem('players', players);

  // Update user's player list
  const users = getItem<StoredUser[]>('users') || [];
  const userIdx = users.findIndex(u => u.id === player.userId);
  if (userIdx >= 0) {
    users[userIdx].players.push(newPlayer.id);
    setItem('users', users);
  }

  return newPlayer;
}

export async function getPlayersByUser(userId: string): Promise<StoredPlayer[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', userId);
    
    if (!error && data) {
      return data.map(p => ({
        id: p.id,
        userId: p.user_id,
        firstName: p.first_name,
        lastName: p.last_name,
        position: p.position,
        throwingHand: p.throwing_hand,
        battingHand: p.batting_hand,
        height: p.height,
        weight: p.weight,
        age: p.age,
        overall: p.overall,
        attributes: p.attributes,
        createdAt: p.created_at ? new Date(p.created_at).getTime() : Date.now()
      }));
    }
  }

  const players = getItem<StoredPlayer[]>('players') || [];
  return players.filter(p => p.userId === userId);
}

export async function getPlayerById(playerId: string): Promise<StoredPlayer | null> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single();
    
    if (!error && data) {
      return {
        id: data.id,
        userId: data.user_id,
        firstName: data.first_name,
        lastName: data.last_name,
        position: data.position,
        throwingHand: data.throwing_hand,
        battingHand: data.batting_hand,
        height: data.height,
        weight: data.weight,
        age: data.age,
        overall: data.overall,
        attributes: data.attributes,
        createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now()
      };
    }
  }

  const players = getItem<StoredPlayer[]>('players') || [];
  return players.find(p => p.id === playerId) || null;
}

// ============ CONTRACT OFFERS ============

const TIER_NAMES = ['', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];

export async function saveContractOffers(playerId: string, offers: StoredContractOffer[]): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('contract_offers').delete().eq('player_id', playerId);
    
    const toInsert = offers.map(offer => ({
      player_id: offer.playerId,
      player_position: offer.playerPosition,
      team_id: offer.teamId,
      team_name: offer.teamName,
      team_city: offer.teamCity,
      tier: offer.tier,
      tier_name: offer.tierName,
      salary: offer.salary,
      duration: offer.duration,
      bonuses: offer.bonuses,
      scout_report: offer.scoutReport,
      status: offer.status,
      expires_at: new Date(offer.expiresAt).toISOString()
    }));
    
    await supabase.from('contract_offers').insert(toInsert);
  }

  const allOffers = getItem<StoredContractOffer[]>('contractOffers') || [];
  const filtered = allOffers.filter(o => o.playerId !== playerId);
  setItem('contractOffers', [...filtered, ...offers]);
}

export async function getContractOffersFromDb(playerId: string): Promise<StoredContractOffer[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('contract_offers')
      .select('*')
      .eq('player_id', playerId);
    
    if (!error && data) {
      return data.map(o => ({
        id: o.id,
        playerId: o.player_id,
        playerPosition: o.player_position,
        teamId: o.team_id,
        teamName: o.team_name,
        teamCity: o.team_city,
        tier: o.tier,
        tierName: o.tier_name || TIER_NAMES[o.tier] || 'Bronze',
        salary: o.salary,
        duration: o.duration,
        bonuses: o.bonuses,
        scoutReport: o.scout_report,
        status: o.status,
        createdAt: new Date(o.created_at).getTime(),
        expiresAt: new Date(o.expires_at).getTime()
      }));
    }
  }

  const allOffers = getItem<StoredContractOffer[]>('contractOffers') || [];
  return allOffers.filter(o => o.playerId === playerId);
}

export async function updateOfferStatus(offerId: string, status: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('contract_offers').update({ status }).eq('id', offerId);
  }

  const allOffers = getItem<StoredContractOffer[]>('contractOffers') || [];
  const updated = allOffers.map(o => o.id === offerId ? { ...o, status: status as any } : o);
  setItem('contractOffers', updated);
}

// ============ TEAMS ============

export async function getAllTeamsFromDb(): Promise<StoredTeam[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('tier', { ascending: true })
      .order('rating', { ascending: false });
    
    if (!error && data && data.length > 0) {
      return data.map(t => ({
        id: t.id,
        name: t.name,
        city: t.city,
        abbreviation: t.abbreviation,
        tier: t.tier,
        tierName: t.tier_name,
        rating: t.rating,
        wins: t.wins,
        losses: t.losses,
        runsScored: t.runs_scored,
        runsAllowed: t.runs_allowed,
        streak: t.streak || '',
        streakCount: t.streak_count || 0,
        revenue: t.revenue || 0,
        attendance: t.attendance || 0,
        ownerId: t.owner_id,
        stakers: t.stakers || []
      }));
    }
  }

  // Fallback to localStorage
  const localTeams = getItem<StoredTeam[]>('teams');
  if (localTeams && localTeams.length > 0) return localTeams;
  
  // Generate teams if none exist
  const { generateAllTeams } = await import('./localStorage');
  return generateAllTeams();
}

export async function getTeamByIdDb(teamId: string): Promise<StoredTeam | null> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();
    
    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        city: data.city,
        abbreviation: data.abbreviation,
        tier: data.tier,
        tierName: data.tier_name,
        rating: data.rating,
        wins: data.wins,
        losses: data.losses,
        runsScored: data.runs_scored,
        runsAllowed: data.runs_allowed,
        streak: data.streak || '',
        streakCount: data.streak_count || 0,
        revenue: data.revenue || 0,
        attendance: data.attendance || 0,
        ownerId: data.owner_id,
        stakers: data.stakers || []
      };
    }
  }

  const teams = getItem<StoredTeam[]>('teams') || [];
  return teams.find(t => t.id === teamId) || null;
}

export async function updateTeamDb(teamId: string, updates: Partial<StoredTeam>): Promise<StoredTeam | null> {
  if (isSupabaseConfigured() && supabase) {
    const dbUpdates: Record<string, any> = {};
    if (updates.wins !== undefined) dbUpdates.wins = updates.wins;
    if (updates.losses !== undefined) dbUpdates.losses = updates.losses;
    if (updates.runsScored !== undefined) dbUpdates.runs_scored = updates.runsScored;
    if (updates.runsAllowed !== undefined) dbUpdates.runs_allowed = updates.runsAllowed;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.revenue !== undefined) dbUpdates.revenue = updates.revenue;
    if (updates.attendance !== undefined) dbUpdates.attendance = updates.attendance;
    if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
    if (updates.streakCount !== undefined) dbUpdates.streak_count = updates.streakCount;
    if (updates.ownerId !== undefined) dbUpdates.owner_id = updates.ownerId;
    
    await supabase.from('teams').update(dbUpdates).eq('id', teamId);
  }

  // Also update localStorage
  const teams = getItem<StoredTeam[]>('teams') || [];
  const index = teams.findIndex(t => t.id === teamId);
  if (index === -1) return null;
  teams[index] = { ...teams[index], ...updates };
  setItem('teams', teams);
  return teams[index];
}
