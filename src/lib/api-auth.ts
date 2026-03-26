import express from 'express';
import { supabaseAdmin } from './supabase-admin.js';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Create a Supabase client for auth (not admin)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
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
});

// Login endpoint - uses Supabase Auth
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Step 1: Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Step 2: Get user profile from custom users table
    const { data: userProfile, error: profileError } = await (supabaseAdmin as any)
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !userProfile) {
      return res.status(401).json({ error: 'User profile not found' });
    }

    // Step 3: Check if user is active
    if (userProfile.status?.toLowerCase() !== 'active') {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    // Step 4: Return user info with auth session
    const responseData = {
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      role: userProfile.role,
      client_id: userProfile.client_id,
      status: userProfile.status,
      language: userProfile.language,
      session: authData.session,
    };

    res.json(responseData);
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
