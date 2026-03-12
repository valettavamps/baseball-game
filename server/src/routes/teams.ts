import { Router, Request, Response } from 'express';
import { pool } from '../index';

const router = Router();

// Get all teams
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tier } = req.query;
    
    let query = 'SELECT * FROM teams';
    const params: any[] = [];
    
    if (tier) {
      query += ' WHERE tier = $1';
      params.push(tier);
    }
    
    query += ' ORDER BY tier ASC, name ASC';
    
    const result = await pool.query(query, params);
    res.json({ teams: result.rows });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ error: 'Failed to get teams' });
  }
});

// Get single team
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM teams WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json({ team: result.rows[0] });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to get team' });
  }
});

// Get team roster (players on team)
router.get('/:id/roster', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT p.* FROM players p
       JOIN contracts c ON p.id = c.player_id
       WHERE c.team_id = $1`,
      [id]
    );
    
    res.json({ roster: result.rows });
  } catch (error) {
    console.error('Get roster error:', error);
    res.status(500).json({ error: 'Failed to get roster' });
  }
});

export default router;
