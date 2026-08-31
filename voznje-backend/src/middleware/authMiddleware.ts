import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tajni_kljuc_promeni_ovo';

export interface AuthRequest extends Request {
  korisnik?: {
    id: number;
    uloga: string;
  };
}

export const proveriToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token nije prosleđen' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; uloga: string };
    req.korisnik = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Nevažeći ili istekao token' });
  }
};