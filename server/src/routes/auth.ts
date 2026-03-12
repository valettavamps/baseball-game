import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { pool } from '../index';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(50)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Generate tokens
function generateTokens(userId: string, email: string) {
  const accessToken = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [data.email, data.username]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);
    
    // Create user
    const userId = uuidv4();
    await pool.query(
      'INSERT INTO users (id, email, password_hash, username, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
      [userId, data.email, passwordHash, data.username]
    );
    
    // Generate tokens
    const tokens = generateTokens(userId, data.email);
    
    res.status(201).json({ 
      message: 'User created',
      user: { id: userId, email: data.email, username: data.username },
      ...tokens
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    
    // Find user
    const result = await pool.query(
      'SELECT id, email, username, password_hash FROM users WHERE email = $1',
      [data.email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const validPassword = await bcrypt.compare(data.password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate tokens
    const tokens = generateTokens(user.id, user.email);
    
    res.json({ 
      user: { id: user.id, email: user.email, username: user.username },
      ...tokens
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'
    ) as { userId: string };
    
    // Get user
    const result = await pool.query(
      'SELECT id, email, username FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    const tokens = generateTokens(user.id, user.email);
    
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'dev-secret'
    ) as { userId: string };
    
    const result = await pool.query(
      'SELECT id, email, username, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
