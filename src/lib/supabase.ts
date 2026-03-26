import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found in environment variables.');
}

/**
 * Browser-safe Supabase client
 */
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      fetch: (...args) => {
        // Increase timeout to 30 seconds for better reliability
        return Promise.race([
          fetch(...args),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 30000)
          ),
        ]);
      },
    },
  }
);

/**
 * Server-safe Supabase client (can be used in SSR or API routes)
 * Note: In standard Vite apps, this is the same as the browser client
 * unless you are using a custom server.
 */
export const createServerSupabaseClient = () => {
  return createClient<Database>(
    supabaseUrl || '',
    supabaseAnonKey || ''
  );
};
