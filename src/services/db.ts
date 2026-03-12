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
