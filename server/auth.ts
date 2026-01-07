import { createClient, User } from '@supabase/supabase-js';
import type { Request, Response, NextFunction } from 'express';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://soxgqyjaeouwdyykoueq.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNveGdxeWphZW91d2R5eWtvdWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI4OTA4NDUsImV4cCI6MjAxODQ2Njg0NX0.CbgxIgxRJXFKOJ2ssZ3PpHeG-3KOgsocGh6SMtKyfOw';

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function verifyAuth(token: string): Promise<User | null> {
  if (!token) {
    console.log('[Auth] No token provided');
    return null;
  }
  
  try {
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    
    if (error) {
      console.log('[Auth] Token verification error:', error.message);
      return null;
    }
    
    if (!user) {
      console.log('[Auth] No user found for token');
      return null;
    }
    
    console.log('[Auth] User verified:', user.email);
    return user;
  } catch (err) {
    console.error('[Auth] Unexpected error verifying token:', err);
    return null;
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }
  
  const token = authHeader.substring(7);
  const user = await verifyAuth(token);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  req.user = user;
  next();
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = await verifyAuth(token);
    if (user) {
      req.user = user;
    }
  }
  
  next();
}
