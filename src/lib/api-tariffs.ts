import express from 'express';
import { supabaseAdmin } from '../lib/supabase-admin';

const router = express.Router();

// Get all tariffs
router.get('/', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { data, error } = await (supabaseAdmin as any)
    .from('tariffs')
    .select('*, vehicle_categories(type), places(name)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Create tariff
router.post('/', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { place_id, category_id, name, start_date, end_date, min_amount, par_hour, status } = req.body;
  
  const { data, error } = await (supabaseAdmin as any)
    .from('tariffs')
    .insert([{ client_id: clientId, place_id, category_id, name, start_date, end_date, min_amount, par_hour, status }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Update tariff
router.put('/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await (supabaseAdmin as any)
    .from('tariffs')
    .update(updates)
    .eq('id', id)
    .eq('client_id', clientId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete tariff
router.delete('/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { id } = req.params;

  const { error } = await (supabaseAdmin as any)
    .from('tariffs')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

export default router;
