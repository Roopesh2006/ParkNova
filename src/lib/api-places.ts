import express from 'express';
import { supabaseAdmin } from '../lib/supabase-admin';

const router = express.Router();

// Get all places
router.get('/', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { data, error } = await (supabaseAdmin as any)
    .from('places')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Create place
router.post('/', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { name, description, status } = req.body;
  
  const { data, error } = await (supabaseAdmin as any)
    .from('places')
    .insert([{ client_id: clientId, name, description, status }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Update place
router.put('/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await (supabaseAdmin as any)
    .from('places')
    .update(updates)
    .eq('id', id)
    .eq('client_id', clientId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete place
router.delete('/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { id } = req.params;

  const { error } = await (supabaseAdmin as any)
    .from('places')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

export default router;
