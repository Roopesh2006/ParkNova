import express from 'express';
import { supabaseAdmin } from '../lib/supabase-admin';

const router = express.Router();

// Get all floors
router.get('/', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { data, error } = await (supabaseAdmin as any)
    .from('floors')
    .select('*')
    .eq('client_id', clientId)
    .order('sort_order', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Create floor
router.post('/', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { place_id, name, floor_level, remarks, status, sort_order } = req.body;
  
  const { data, error } = await (supabaseAdmin as any)
    .from('floors')
    .insert([{ client_id: clientId, place_id, name, floor_level, remarks, status, sort_order }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Update floor
router.put('/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await (supabaseAdmin as any)
    .from('floors')
    .update(updates)
    .eq('id', id)
    .eq('client_id', clientId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete floor
router.delete('/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { id } = req.params;

  const { error } = await (supabaseAdmin as any)
    .from('floors')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

export default router;
