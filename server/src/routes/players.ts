import { Router, Request, Response } from 'express';
import { pool } from '../index';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Player schema
const playerSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  position: z.enum(['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH']),
  battingGrade: z.string().regex(/^[A-F][+-]?$/),
  pitchingGrade: z.string().regex(/^[A-F][+-]?$/),
  fieldingGrade: z.string().regex(/^[A-F][+-]?$/),
  speedGrade: z.string().regex(/^[A-F][+-]?$/),
  armGrade: z.string().regex(/^[A-F][+-]?$/),
  throwHand: z.enum(['L', 'R']),
  batHand: z.enum(['L', 'R', 'S'])
});

// Get all players for user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    
    const result = await pool.query(
      'SELECT * FROM players WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({ players: result.rows });
  } catch (error) {
    console.error('Get players error:', error);
    res.status(500).json({ error: 'Failed to get players' });
  }
});

// Create player
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const data = playerSchema.parse(req.body);
    
    const playerId = uuidv4();
    
    const attributes = {
      batting: data.battingGrade,
      pitching: data.pitchingGrade,
      fielding: data.fieldingGrade,
      speed: data.speedGrade,
      arm: data.armGrade
    };
    
    await pool.query(
      `INSERT INTO players 
       (id, user_id, first_name, last_name, position, throw_hand, bat_hand, attributes, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
      [playerId, userId, data.firstName, data.lastName, data.position, 
       data.throwHand, data.batHand, JSON.stringify(attributes), 'available']
    );
    
    // Generate contract offers for the player
    await generateContractOffers(playerId, data.position);
    
    res.status(201).json({ 
      message: 'Player created',
      player: { id: playerId, ...data }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create player error:', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

// Get single player
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM players WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json({ player: result.rows[0] });
  } catch (error) {
    console.error('Get player error:', error);
    res.status(500).json({ error: 'Failed to get player' });
  }
});

// Helper: Generate contract offers
async function generateContractOffers(playerId: string, position: string) {
  const teams = await pool.query(
    'SELECT id, name, tier FROM teams ORDER BY tier ASC LIMIT 5'
  );
  
  const reports: Record<string, string[]> = {
    'P': ['Looking for a pitcher to anchor our rotation.', 'Our scouts rate your stuff highly.'],
    'C': ['We need a catcher to lead our defense.', 'Your receiving skills impressed our scouts.'],
    '1B': ['Looking for power at first base.', 'Your bat could be a big upgrade.'],
    '2B': ['Need a versatile second baseman.', 'Your range and hands impressed us.'],
    '3B': ['Hot corner specialist needed.', 'Your arm would play well at third.'],
    'SS': ['Elite shortstop to anchor our infield.', 'Your defensive metrics are off the charts.'],
    'LF': ['Corner outfield power needed.', 'Your power would play well in left field.'],
    'CF': ['Center field coverage is a priority.', 'Your speed would anchor our outfield.'],
    'RF': ['Right field arm strength is key.', 'Your combination of power and defense is rare.'],
    'DH': ['Designated hitter spot available.', 'Your bat would play well in the DH role.']
  };
  
  const defaultReports = [
    'Our scouts love the raw potential. Could be a day-one starter.',
    'Great fit for our system. We see big things ahead.'
  ];
  
  const positionReports = reports[position] || defaultReports;
  
  for (let i = 0; i < teams.rows.length; i++) {
    const team = teams.rows[i];
    const tierMultiplier = [1.5, 1.3, 1.1, 1.0, 0.8][team.tier - 1] || 1;
    
    await pool.query(
      `INSERT INTO contract_offers 
       (id, player_id, team_id, salary, duration, bonuses, scout_report, status, expires_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() + INTERVAL '3 days')`,
      [
        uuidv4(),
        playerId,
        team.id,
        Math.floor((40000 + Math.random() * 60000) * tierMultiplier),
        Math.floor(1 + Math.random() * 3),
        JSON.stringify([]),
        positionReports[i % positionReports.length],
        'pending'
      ]
    );
  }
}

export default router;
