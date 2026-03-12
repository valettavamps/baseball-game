import { Router, Request, Response } from 'express';
import { pool } from '../index';

const router = Router();

// Get live games
router.get('/live', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT g.*, 
              ht.name as home_team_name, at.name as away_team_name
       FROM games g
       JOIN teams ht ON g.home_team_id = ht.id
       JOIN teams at ON g.away_team_id = at.id
       WHERE g.status = 'in_progress'
       ORDER BY g.scheduled_time DESC
       LIMIT 20`
    );
    
    res.json({ games: result.rows });
  } catch (error) {
    console.error('Get live games error:', error);
    res.status(500).json({ error: 'Failed to get games' });
  }
});

// Get standings
router.get('/standings', async (req: Request, res: Response) => {
  try {
    const { tier } = req.query;
    
    let query = `
      SELECT t.id, t.name, t.tier,
             COALESCE(SUM(gd.wins), 0) as wins,
             COALESCE(SUM(gd.losses), 0) as losses,
             COALESCE(SUM(gd.games_played), 0) as games_played
      FROM teams t
      LEFT JOIN team_game_stats gd ON t.id = gd.team_id
    `;
    
    const params: any[] = [];
    
    if (tier) {
      query += ' WHERE t.tier = $1';
      params.push(tier);
    }
    
    query += ' GROUP BY t.id, t.name, t.tier ORDER BY wins DESC';
    
    const result = await pool.query(query, params);
    
    const standings = result.rows.map((row, index) => ({
      rank: index + 1,
      team: { id: row.id, name: row.name },
      wins: parseInt(row.wins),
      losses: parseInt(row.losses),
      gamesPlayed: parseInt(row.games_played),
      winPct: parseInt(row.games_played) > 0 
        ? parseInt(row.wins) / parseInt(row.games_played) 
        : 0
    }));
    
    res.json({ standings });
  } catch (error) {
    console.error('Get standings error:', error);
    res.status(500).json({ error: 'Failed to get standings' });
  }
});

// Get upcoming games
router.get('/upcoming', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT g.*, 
              ht.name as home_team_name, at.name as away_team_name
       FROM games g
       JOIN teams ht ON g.home_team_id = ht.id
       JOIN teams at ON g.away_team_id = at.id
       WHERE g.status = 'scheduled'
       ORDER BY g.scheduled_time ASC
       LIMIT 20`
    );
    
    res.json({ games: result.rows });
  } catch (error) {
    console.error('Get upcoming games error:', error);
    res.status(500).json({ error: 'Failed to get games' });
  }
});

export default router;
