import express from 'express';
import { supabaseAdmin } from '../lib/supabase-admin';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { data, error } = await (supabaseAdmin as any)
    .from('users')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Create user (Service Role bypass)
router.post('/', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { name, email, password, role, status, language } = req.body;

  try {
    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await (supabaseAdmin as any).auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) return res.status(400).json({ error: authError.message });
    
    // Step 2: Insert into users table with auth UUID
    const { data, error } = await (supabaseAdmin as any)
      .from('users')
      .insert([{ 
        id: authData.user.id,
        client_id: clientId,
        name, 
        email, 
        role, 
        status: status?.toLowerCase() || 'active',
        language: language || 'en'
      }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { id } = req.params;
  const updates = { ...req.body };

  const { data, error } = await (supabaseAdmin as any)
    .from('users')
    .update(updates)
    .eq('id', id)
    .eq('client_id', clientId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete user
router.delete('/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { id } = req.params;

  const { error } = await (supabaseAdmin as any)
    .from('users')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

export default router;
