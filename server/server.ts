import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { dataStore } from './dataStore';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now(), version: '1.0.0' });
});

// ============ AUTH ROUTES ============

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (dataStore.getUserByEmail(email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  // TODO: real bcrypt hashing
  const passwordHash = `hashed_${password}`;
  const user = dataStore.createUser(username, email, passwordHash);

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const user = dataStore.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // TODO: verify password with bcrypt
  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = dataStore.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      players: user.players,
      walletAddress: user.walletAddress
    }
  });
});

// ============ PLAYER ROUTES ============

app.post('/api/players', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { firstName, lastName, position, attributes, throwingHand, battingHand, height, weight, age } = req.body;

  if (!firstName || !lastName || !position) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isPitcher = position === 'P';
  let overall: number;
  if (isPitcher) {
    overall = Math.round(
      ((attributes.velocity || 50) * 0.35 +
       (attributes.control || 50) * 0.30 +
       (attributes.movement || 50) * 0.20 +
       (attributes.stamina || 50) * 0.15)
    );
  } else {
    overall = Math.round(
      ((attributes.contact || 50) * 0.25 +
       (attributes.power || 50) * 0.25 +
       (attributes.speed || 50) * 0.15 +
       (attributes.fielding || 50) * 0.15 +
       (attributes.arm || 50) * 0.10 +
       (attributes.discipline || 50) * 0.10)
    );
  }

  const player = dataStore.createPlayer({
    firstName, lastName, position, attributes,
    throwingHand: throwingHand || 'right',
    battingHand: battingHand || 'right',
    height: height || 72,
    weight: weight || 200,
    age: age || 22,
    overall
  });

  const user = dataStore.getUserById(userId);
  if (user) {
    user.players.push(player.id);
  }

  res.json({ player });
});

app.get('/api/players', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const players = dataStore.getPlayersByUser(userId);
  res.json({ players });
});

app.get('/api/players/:id', (req: Request, res: Response) => {
  const player = dataStore.getPlayerById(req.params.id);
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  res.json({ player });
});

// ============ TEAM ROUTES ============

app.get('/api/teams', (req: Request, res: Response) => {
  const teams = dataStore.getAllTeams();
  res.json({ teams });
});

app.get('/api/teams/tier/:tier', (req: Request, res: Response) => {
  const tier = parseInt(req.params.tier);
  const teams = dataStore.getTeamsByTier(tier);
  res.json({ teams });
});

app.get('/api/teams/:id', (req: Request, res: Response) => {
  const team = dataStore.getTeamById(req.params.id);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  res.json({ team });
});

// ============ SEASON ROUTES ============

app.get('/api/seasons/current', (req: Request, res: Response) => {
  const season = dataStore.getCurrentSeason();
  if (!season) {
    return res.status(404).json({ error: 'No active season' });
  }
  res.json({ season });
});

app.post('/api/seasons/start', (req: Request, res: Response) => {
  // Generate 100 teams across 5 tiers if none exist
  if (dataStore.getAllTeams().length === 0) {
    const TIER_CONFIG = [
      { tier: 1 as const, name: 'Diamond', count: 10, ratingMin: 85, ratingMax: 95 },
      { tier: 2 as const, name: 'Platinum', count: 16, ratingMin: 75, ratingMax: 85 },
      { tier: 3 as const, name: 'Gold', count: 20, ratingMin: 65, ratingMax: 75 },
      { tier: 4 as const, name: 'Silver', count: 24, ratingMin: 55, ratingMax: 65 },
      { tier: 5 as const, name: 'Bronze', count: 30, ratingMin: 45, ratingMax: 55 },
    ];

    let teamNum = 1;
    for (const config of TIER_CONFIG) {
      for (let i = 0; i < config.count; i++) {
        dataStore.createTeam({
          name: `Team ${teamNum}`,
          city: `City ${teamNum}`,
          tier: config.tier,
          rating: Math.floor(config.ratingMin + Math.random() * (config.ratingMax - config.ratingMin)),
          wins: 0, losses: 0, runsScored: 0, runsAllowed: 0,
          streak: null, players: [], treasury: 100000,
          tierHistory: [{ tier: config.tier, season: 2026 }]
        });
        teamNum++;
      }
    }
  }

  const season = dataStore.createSeason(2026);
  season.status = 'active';
  season.startDate = Date.now();
  dataStore.updateSeason(season.id, season);

  res.json({ season, teams: dataStore.getAllTeams() });
});

app.post('/api/seasons/:id/simulate-day', (req: Request, res: Response) => {
  const season = dataStore.getSeasonById(req.params.id);
  if (!season) {
    return res.status(404).json({ error: 'Season not found' });
  }

  season.currentDay += 1;

  if (season.currentDay >= season.totalDays) {
    season.status = 'completed';
    season.endDate = Date.now();
  }

  dataStore.updateSeason(season.id, season);
  res.json({ season });
});

// ============ STAKING ROUTES ============

app.post('/api/stakes', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { teamId, amount, seasonId } = req.body;
  if (!teamId || !amount || !seasonId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stake = dataStore.createStake(userId, teamId, amount, seasonId);
  res.json({ stake });
});

app.get('/api/stakes', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const stakes = dataStore.getStakesByUser(userId);
  const enrichedStakes = stakes.map(stake => ({
    ...stake,
    team: dataStore.getTeamById(stake.teamId)
  }));

  res.json({ stakes: enrichedStakes });
});

// ============ CONTRACT ROUTES ============

app.get('/api/contracts/offers', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const teams = dataStore.getAllTeams();
  const offers = [];

  for (let i = 0; i < 5; i++) {
    const team = teams[Math.floor(Math.random() * teams.length)];
    if (!team) continue;
    offers.push({
      id: `offer_${i}`,
      teamId: team.id,
      teamName: `${team.city} ${team.name}`,
      tier: team.tier,
      salary: Math.floor(50000 + Math.random() * 50000),
      duration: Math.floor(1 + Math.random() * 3),
      bonuses: Math.floor(5000 + Math.random() * 20000),
      expiresAt: Date.now() + 86400000 * 3
    });
  }

  res.json({ offers });
});

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log(`🏟️  DiamondChain API running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});

export default app;
