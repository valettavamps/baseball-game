// Supabase database service
// Uses Supabase when configured, falls back to localStorage otherwise

import { supabase, isSupabaseConfigured } from './supabase';
import { getItem, setItem, removeItem, StoredUser, StoredPlayer, StoredTeam, StoredContractOffer } from './localStorage';

const STORAGE_PREFIX = 'diamondchain_';

// ============ HELPERS ============

function localGet<T>(key: string): T | null {
  return getItem<T>(key);
}

function localSet<T>(key: string, value: T): void {
  setItem(key, value);
}

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
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: new Date(user.createdAt).toISOString()
    });
    if (error) {
      console.error('Supabase insert error:', error);
      // Fall through to localStorage
    }
  }

  // Also save to localStorage as backup
  const users = localGet<StoredUser[]>('users') || [];
  users.push(user);
  localSet('users', users);

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
        players: [],
        createdAt: new Date(data.created_at).getTime()
      };
    }
  }

  // Fallback to localStorage
  const users = localGet<StoredUser[]>('users') || [];
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
        players: [],
        createdAt: new Date(data.created_at).getTime()
      };
    }
  }

  const users = localGet<StoredUser[]>('users') || [];
  return users.find(u => u.id === id) || null;
}

// ============ PLAYERS ============

export async function createPlayer(player: Omit<StoredPlayer, 'id'>): Promise<StoredPlayer> {
  const newPlayer: StoredPlayer = {
    ...player,
    id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };

  if (isSupabaseConfigured() && supabase) {
    await supabase.from('players').insert({
      id: newPlayer.id,
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
  const players = localGet<StoredPlayer[]>('players') || [];
  players.push(newPlayer);
  localSet('players', players);

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

  const players = localGet<StoredPlayer[]>('players') || [];
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

  const players = localGet<StoredPlayer[]>('players') || [];
  return players.find(p => p.id === playerId) || null;
}

// ============ CONTRACT OFFERS ============

export async function saveContractOffers(playerId: string, offers: StoredContractOffer[]): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    // Delete old offers for this player
    await supabase.from('contract_offers').delete().eq('player_id', playerId);
    
    // Insert new offers
    const toInsert = offers.map(offer => ({
      id: offer.id,
      player_id: offer.playerId,
      player_position: offer.playerPosition,
      team_id: offer.teamId,
      team_name: offer.teamName,
      team_city: offer.teamCity,
      tier: offer.tier,
      salary: offer.salary,
      duration: offer.duration,
      bonuses: offer.bonuses,
      scout_report: offer.scoutReport,
      status: offer.status,
      expires_at: new Date(offer.expiresAt).toISOString(),
      created_at: new Date(offer.createdAt).toISOString()
    }));
    
    await supabase.from('contract_offers').insert(toInsert);
  }

  // Also save to localStorage
  const allOffers = localGet<StoredContractOffer[]>('contractOffers') || [];
  const filtered = allOffers.filter(o => o.playerId !== playerId);
  localSet('contractOffers', [...filtered, ...offers]);
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
        tierName: o.tier_name || getTierName(o.tier),
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

  // Fallback
  const allOffers = localGet<StoredContractOffer[]>('contractOffers') || [];
  return allOffers.filter(o => o.playerId === playerId);
}

function getTierName(tier: number): string {
  const names = ['', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];
  return names[tier] || 'Bronze';
}

export async function updateOfferStatus(offerId: string, status: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('contract_offers').update({ status }).eq('id', offerId);
  }

  const allOffers = localGet<StoredContractOffer[]>('contractOffers') || [];
  const updated = allOffers.map(o => o.id === offerId ? { ...o, status: status as any } : o);
  localSet('contractOffers', updated);
}

// ============ PLAYER EXTENDED DATA ============

// Player Ratings
export async function savePlayerRatings(playerId: string, ratings: any, potential: any): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('player_ratings').upsert({
      player_id: playerId,
      discipline: ratings.discipline,
      contact: ratings.contact,
      power: ratings.power,
      speed: ratings.speed,
      run_accuracy: ratings.runAccuracy,
      glove: ratings.glove,
      arm: ratings.arm,
      endurance: ratings.endurance,
      potential_discipline: potential?.discipline,
      potential_contact: potential?.contact,
      potential_power: potential?.power,
      potential_speed: potential?.speed,
      potential_run_accuracy: potential?.runAccuracy,
      potential_glove: potential?.glove,
      potential_arm: potential?.arm,
      potential_endurance: potential?.endurance,
      updated_at: new Date().toISOString()
    }, { onConflict: 'player_id' });
  }
}

export async function getPlayerRatings(playerId: string): Promise<{ ratings: any; potential: any } | null> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('player_ratings')
      .select('*')
      .eq('player_id', playerId)
      .single();
    
    if (!error && data) {
      return {
        ratings: {
          discipline: data.discipline,
          contact: data.contact,
          power: data.power,
          speed: data.speed,
          runAccuracy: data.run_accuracy,
          glove: data.glove,
          arm: data.arm,
          endurance: data.endurance
        },
        potential: {
          discipline: data.potential_discipline,
          contact: data.potential_contact,
          power: data.potential_power,
          speed: data.potential_speed,
          runAccuracy: data.potential_run_accuracy,
          glove: data.potential_glove,
          arm: data.potential_arm,
          endurance: data.potential_endurance
        }
      };
    }
  }
  return null;
}

// Player Info (height, weight, draft info, etc.)
export async function savePlayerInfo(playerId: string, info: any): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('player_info').upsert({
      player_id: playerId,
      experience_years: info.experience,
      debut_date: info.debutDate,
      last_game_date: info.lastGameDate,
      salary: info.salary,
      acquired: info.acquired,
      draft_year: info.draftYear,
      draft_round: info.draftRound,
      draft_pick: info.draftPick,
      drafted_by: info.draftedBy,
      height_inches: info.height,
      weight_lbs: info.weight,
      throwing_hand: info.throwingHand,
      batting_hand: info.battingHand,
      updated_at: new Date().toISOString()
    }, { onConflict: 'player_id' });
  }
}

export async function getPlayerInfo(playerId: string): Promise<any | null> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('player_info')
      .select('*')
      .eq('player_id', playerId)
      .single();
    
    if (!error && data) {
      return {
        experience: data.experience_years,
        debutDate: data.debut_date,
        lastGameDate: data.last_game_date,
        salary: data.salary,
        acquired: data.acquired,
        draftYear: data.draft_year,
        draftRound: data.draft_round,
        draftPick: data.draft_pick,
        draftedBy: data.drafted_by,
        height: data.height_inches,
        weight: data.weight_lbs,
        throwingHand: data.throwing_hand,
        battingHand: data.batting_hand
      };
    }
  }
  return null;
}

// Season Batting Stats
export async function saveSeasonBatting(playerId: string, year: number, stats: any): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('player_season_batting').upsert({
      player_id: playerId,
      year,
      team_id: stats.teamId,
      team_name: stats.teamName,
      games_played: stats.gamesPlayed,
      pa: stats.pa,
      ab: stats.ab,
      runs: stats.runs,
      hits: stats.hits,
      doubles: stats.doubles,
      triples: stats.triples,
      home_runs: stats.homeRuns,
      rbi: stats.rbi,
      walks: stats.walks,
      strikeouts: stats.strikeouts,
      stolen_bases: stats.stolenBases,
      caught_stealing: stats.caughtStealing,
      avg: stats.avg,
      obp: stats.obp,
      slg: stats.slg,
      ops: stats.ops,
      tb: stats.tb,
      gbfb: stats.gbFb,
      sf: stats.sf,
      hbp: stats.hbp,
      gdp: stats.gdp,
      roe: stats.roe,
      xb: stats.xb,
      bro: stats.bro,
      sa: stats.sa,
      rc: stats.rc,
      lWts: stats.lWts,
      abHr: stats.abHr,
      tbpa: stats.tbpa
    }, { onConflict: 'player_id, year' });
  }
}

export async function getSeasonBatting(playerId: string, year?: number): Promise<any[]> {
  if (isSupabaseConfigured() && supabase) {
    let query = supabase.from('player_season_batting').select('*').eq('player_id', playerId);
    if (year) query = query.eq('year', year);
    const { data, error } = await query.order('year', { ascending: false });
    
    if (!error && data) {
      return data.map(d => ({
        year: d.year,
        teamId: d.team_id,
        teamName: d.team_name,
        gamesPlayed: d.games_played,
        pa: d.pa,
        ab: d.ab,
        runs: d.runs,
        hits: d.hits,
        doubles: d.doubles,
        triples: d.triples,
        homeRuns: d.home_runs,
        rbi: d.rbi,
        walks: d.walks,
        strikeouts: d.strikeouts,
        stolenBases: d.stolen_bases,
        caughtStealing: d.caught_stealing,
        avg: d.avg,
        obp: d.obp,
        slg: d.slg,
        ops: d.ops,
        tb: d.tb,
        gbFb: d.gbfb,
        sf: d.sf,
        hbp: d.hbp,
        gdp: d.gdp,
        roe: d.roe,
        xb: d.xb,
        bro: d.bro,
        sa: d.sa,
        rc: d.rc,
        lWts: d.lWts,
        abHr: d.abHr,
        tbpa: d.tbpa
      }));
    }
  }
  return [];
}

// Career Batting Stats
export async function saveCareerBatting(playerId: string, stats: any): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('player_career_batting').upsert({
      player_id: playerId,
      games_played: stats.gamesPlayed,
      pa: stats.pa,
      ab: stats.ab,
      runs: stats.runs,
      hits: stats.hits,
      doubles: stats.doubles,
      triples: stats.triples,
      home_runs: stats.homeRuns,
      rbi: stats.rbi,
      walks: stats.walks,
      strikeouts: stats.strikeouts,
      stolen_bases: stats.stolenBases,
      caught_stealing: stats.caughtStealing,
      avg: stats.avg,
      obp: stats.obp,
      slg: stats.slg,
      ops: stats.ops,
      updated_at: new Date().toISOString()
    }, { onConflict: 'player_id' });
  }
}

// Fielding Stats
export async function saveFieldingStats(playerId: string, position: string, stats: any, year?: number): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('player_fielding').upsert({
      player_id: playerId,
      position,
      games_played: stats.gamesPlayed,
      po: stats.po,
      a: stats.a,
      e: stats.e,
      tc: stats.tc,
      dp: stats.dp,
      sb: stats.sb,
      cs: stats.cs,
      cs_pct: stats.csPct,
      pct: stats.pct,
      rng: stats.rng,
      year
    }, { onConflict: 'player_id, position, year' });
  }
}

export async function getFieldingStats(playerId: string): Promise<any[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('player_fielding')
      .select('*')
      .eq('player_id', playerId);
    
    if (!error && data) {
      return data.map(d => ({
        position: d.position,
        gamesPlayed: d.games_played,
        po: d.po,
        a: d.a,
        e: d.e,
        tc: d.tc,
        dp: d.dp,
        sb: d.sb,
        cs: d.cs,
        csPct: d.cs_pct,
        pct: d.pct,
        rng: d.rng
      }));
    }
  }
  return [];
}

// Season Pitching Stats
export async function saveSeasonPitching(playerId: string, year: number, stats: any): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('player_season_pitching').upsert({
      player_id: playerId,
      year,
      team_id: stats.teamId,
      team_name: stats.teamName,
      games_played: stats.gamesPlayed,
      games_started: stats.gamesStarted,
      wins: stats.wins,
      losses: stats.losses,
      era: stats.era,
      innings: stats.innings,
      hits: stats.hits,
      runs: stats.runs,
      earned_runs: stats.earnedRuns,
      walks: stats.walks,
      strikeouts: stats.strikeouts,
      hr: stats.hr,
      so9: stats.so9,
      bb9: stats.bb9,
      soBb: stats.soBb,
      go: stats.go,
      fo: stats.fo,
      ffo: stats.ffo,
      ir: stats.ir,
      irs: stats.irs,
      oavg: stats.oavg,
      oobp: stats.oobp,
      oslg: stats.oslg,
      oops: stats.oops,
      lWts: stats.lWts,
      babip: stats.babip
    }, { onConflict: 'player_id, year' });
  }
}

export async function getSeasonPitching(playerId: string, year?: number): Promise<any[]> {
  if (isSupabaseConfigured() && supabase) {
    let query = supabase.from('player_season_pitching').select('*').eq('player_id', playerId);
    if (year) query = query.eq('year', year);
    const { data, error } = await query.order('year', { ascending: false });
    
    if (!error && data) {
      return data.map(d => ({
        year: d.year,
        teamId: d.team_id,
        teamName: d.team_name,
        gamesPlayed: d.games_played,
        gamesStarted: d.games_started,
        wins: d.wins,
        losses: d.losses,
        era: d.era,
        innings: d.innings,
        hits: d.hits,
        runs: d.runs,
        earnedRuns: d.earned_runs,
        walks: d.walks,
        strikeouts: d.strikeouts,
        hr: d.hr,
        so9: d.so9,
        bb9: d.bb9,
        soBb: d.soBb,
        go: d.go,
        fo: d.fo,
        ffo: d.ffo,
        ir: d.ir,
        irs: d.irs,
        oavg: d.oavg,
        oobp: d.oobp,
        oslg: d.oslg,
        oops: d.oops,
        lWts: d.lWts,
        babip: d.babip
      }));
    }
  }
  return [];
}

// Player Awards
export async function savePlayerAwards(playerId: string, awards: any): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('player_awards').upsert({
      player_id: playerId,
      mvp: awards.mvp || 0,
      all_star: awards.allStar || 0,
      gold_glove: awards.goldGlove || 0,
      silver_slugger: awards.silverSlugger || 0,
      cy_young: awards.cyYoung || 0,
      roty: awards.roty || 0,
      player_of_game: awards.playerOfGame || 0,
      world_series_rings: awards.worldSeriesRings || 0,
      hall_of_fame_score: awards.hallOfFameScore || 0,
      hall_of_fame_inducted: awards.hallOfFameInducted || false,
      hall_of_fame_year: awards.hallOfFameYear,
      updated_at: new Date().toISOString()
    }, { onConflict: 'player_id' });
  }
}

export async function getPlayerAwards(playerId: string): Promise<any | null> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('player_awards')
      .select('*')
      .eq('player_id', playerId)
      .single();
    
    if (!error && data) {
      return {
        mvp: data.mvp,
        allStar: data.all_star,
        goldGlove: data.gold_glove,
        silverSlugger: data.silver_slugger,
        cyYoung: data.cy_young,
        roty: data.roty,
        playerOfGame: data.player_of_game,
        worldSeriesRings: data.world_series_rings,
        hallOfFameScore: data.hall_of_fame_score,
        hallOfFameInducted: data.hall_of_fame_inducted,
        hallOfFameYear: data.hall_of_fame_year
      };
    }
  }
  return null;
}

// Player Achievements
export async function savePlayerAchievement(playerId: string, achievement: any): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('player_achievements').insert({
      player_id: playerId,
      date: achievement.date,
      achievement: achievement.achievement,
      opponent: achievement.opponent,
      opponent_id: achievement.opponentId,
      result: achievement.result,
      game_id: achievement.gameId
    });
  }
}

export async function getPlayerAchievements(playerId: string): Promise<any[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('player_achievements')
      .select('*')
      .eq('player_id', playerId)
      .order('date', { ascending: false });
    
    if (!error && data) {
      return data.map(d => ({
        date: d.date,
        achievement: d.achievement,
        opponent: d.opponent,
        opponentId: d.opponent_id,
        result: d.result,
        gameId: d.game_id
      }));
    }
  }
  return [];
}

// Season History
export async function saveSeasonHistory(playerId: string, entry: any): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('player_season_history').upsert({
      player_id: playerId,
      year: entry.year,
      team_id: entry.teamId,
      team_name: entry.teamName,
      position: entry.position,
      games_played: entry.gamesPlayed,
      avg: entry.avg,
      hr: entry.hr,
      rbi: entry.rbi,
      wins: entry.wins,
      losses: entry.losses,
      era: entry.era
    }, { onConflict: 'player_id, year' });
  }
}

export async function getSeasonHistory(playerId: string): Promise<any[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('player_season_history')
      .select('*')
      .eq('player_id', playerId)
      .order('year', { ascending: false });
    
    if (!error && data) {
      return data.map(d => ({
        year: d.year,
        teamId: d.team_id,
        teamName: d.team_name,
        position: d.position,
        gamesPlayed: d.games_played,
        avg: d.avg,
        hr: d.hr,
        rbi: d.rbi,
        wins: d.wins,
        losses: d.losses,
        era: d.era
      }));
    }
  }
  return [];
}

// Get all extended data for a player
export async function getPlayerFullData(playerId: string): Promise<{
  ratings: any;
  potential: any;
  info: any;
  seasonBatting: any[];
  seasonPitching: any[];
  fielding: any[];
  awards: any;
  achievements: any[];
  seasonHistory: any[];
}> {
  const [ratings, info, seasonBatting, seasonPitching, fielding, awards, achievements, seasonHistory] = await Promise.all([
    getPlayerRatings(playerId),
    getPlayerInfo(playerId),
    getSeasonBatting(playerId),
    getSeasonPitching(playerId),
    getFieldingStats(playerId),
    getPlayerAwards(playerId),
    getPlayerAchievements(playerId),
    getSeasonHistory(playerId)
  ]);

  return {
    ratings: ratings?.ratings || null,
    potential: ratings?.potential || null,
    info,
    seasonBatting,
    seasonPitching,
    fielding,
    awards,
    achievements,
    seasonHistory
  };
}
