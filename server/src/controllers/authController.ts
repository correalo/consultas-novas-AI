import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// Fixed credentials for development
const FIXED_USER = {
  id: '1',
  email: 'correalo@uol.com.br',
  password: 'Anatomia531@',
  name: 'Dr. Correa',
  role: 'admin'
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check against fixed credentials
    if (email !== FIXED_USER.email || password !== FIXED_USER.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: FIXED_USER.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = FIXED_USER;

    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

export const register = async (req: Request, res: Response) => {
  // Disable registration in development
  res.status(403).json({ message: 'Registration is disabled' });
};
