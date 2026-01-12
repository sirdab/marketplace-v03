import { createClient, User } from '@supabase/supabase-js';
import type { Request, Response, NextFunction } from 'express';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Auth] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY not set. Auth will be disabled.');
}

export const supabaseServer = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function verifyAuth(token: string): Promise<User | null> {
  if (!supabaseServer) {
    console.log('[Auth] Supabase not configured');
    return null;
  }

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
