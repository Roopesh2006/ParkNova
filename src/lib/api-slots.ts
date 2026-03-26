import express from 'express';
import { supabaseAdmin } from '../lib/supabase-admin';

const router = express.Router();

// Get all slots
router.get('/', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { data, error } = await (supabaseAdmin as any)
    .from('parking_slots')
    .select('*, floors(name), vehicle_categories(type), places(name)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Get slots by place
router.get('/place/:placeId', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { placeId } = req.params;

  const { data, error } = await (supabaseAdmin as any)
    .from('parking_slots')
    .select('*')
    .eq('client_id', clientId)
    .eq('place_id', placeId)
    .order('name', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Create slot
router.post('/', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { name, place_id, floor_id, category_id, status, identity } = req.body;
  
  const { data, error } = await (supabaseAdmin as any)
    .from('parking_slots')
    .insert([{ 
      client_id: clientId, 
      name, 
      place_id, 
      floor_id, 
      category_id, 
      status, 
      identity,
      is_occupied: false
    }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Update slot
router.put('/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await (supabaseAdmin as any)
    .from('parking_slots')
    .update(updates)
    .eq('id', id)
    .eq('client_id', clientId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete slot
router.delete('/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { id } = req.params;

  const { error } = await (supabaseAdmin as any)
    .from('parking_slots')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

export default router;
