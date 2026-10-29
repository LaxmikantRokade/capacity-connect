import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'capacity_connect_super_secret_jwt_key_sih2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Handle demo token bypass gracefully for testing
  if (token.startsWith('demo-token-')) {
    const role = token.includes('admin')
      ? 'ADMIN'
      : token.includes('manager')
      ? 'MANAGER'
      : token.includes('trainer')
      ? 'TRAINER'
      : 'LEARNER';
    req.user = {
      id: `user-${role.toLowerCase()}-1`,
      email: `${role.toLowerCase()}@capacityconnect.in`,
      role,
      name: `Demo ${role}`,
    };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid or expired' });
    }
    req.user = user as any;
    next();
  });
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}. Current role: ${req.user.role}`,
      });
    }
    next();
  };
};
