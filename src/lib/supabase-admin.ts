import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

/**
 * Supabase Admin client using the Service Role Key.
 * This client bypasses Row Level Security (RLS).
 * 
 * CRITICAL: This client MUST NEVER be used in the browser.
 * It should only be used in server-side code (API routes, server actions, etc.).
 */
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  if (typeof window === 'undefined') {
    console.warn('Supabase Admin credentials not found in environment variables.');
  }
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl || '',
  supabaseServiceRoleKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
