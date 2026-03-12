import { Router, Request, Response } from 'express';
import { pool } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all contract offers for user's players
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    
    const result = await pool.query(
      `SELECT co.*, p.first_name, p.last_name, p.position as player_position, p.attributes,
              t.name as team_name, t.tier
       FROM contract_offers co
       JOIN players p ON co.player_id = p.id
       JOIN teams t ON co.team_id = t.id
       WHERE p.user_id = $1 AND co.status = 'pending'
       ORDER BY co.salary DESC`,
      [userId]
    );
    
    res.json({ offers: result.rows });
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({ error: 'Failed to get offers' });
  }
});

// Accept offer
router.post('/:id/accept', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    
    // Verify the offer belongs to user's player
    const offerResult = await pool.query(
      `SELECT co.*, p.user_id 
       FROM contract_offers co
       JOIN players p ON co.player_id = p.id
       WHERE co.id = $1 AND p.user_id = $2`,
      [id, userId]
    );
    
    if (offerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    
    // Accept this offer, reject all others for this player
    await pool.query('BEGIN');
    
    await pool.query(
      "UPDATE contract_offers SET status = 'accepted' WHERE id = $1",
      [id]
    );
    
    await pool.query(
      "UPDATE contract_offers SET status = 'rejected' WHERE player_id = $2 AND id != $1",
      [id, offerResult.rows[0].player_id]
    );
    
    await pool.query(
      "UPDATE players SET status = 'contracted' WHERE id = $1",
      [offerResult.rows[0].player_id]
    );
    
    await pool.query('COMMIT');
    
    res.json({ message: 'Offer accepted!' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Accept offer error:', error);
    res.status(500).json({ error: 'Failed to accept offer' });
  }
});

// Reject offer
router.post('/:id/reject', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    
    // Verify ownership
    const offerResult = await pool.query(
      `SELECT co.*, p.user_id 
       FROM contract_offers co
       JOIN players p ON co.player_id = p.id
       WHERE co.id = $1 AND p.user_id = $2`,
      [id, userId]
    );
    
    if (offerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    
    await pool.query(
      "UPDATE contract_offers SET status = 'rejected' WHERE id = $1",
      [id]
    );
    
    res.json({ message: 'Offer rejected' });
  } catch (error) {
    console.error('Reject offer error:', error);
    res.status(500).json({ error: 'Failed to reject offer' });
  }
});

export default router;
