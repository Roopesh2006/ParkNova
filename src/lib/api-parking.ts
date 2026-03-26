import express from 'express';
import { supabaseAdmin } from '../lib/supabase-admin';

const router = express.Router();

// Get active parking sessions
router.get('/sessions/active', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { data, error } = await (supabaseAdmin as any)
    .from('parking_sessions')
    .select('*, vehicle_categories(type), parking_slots(name)')
    .eq('client_id', clientId)
    .eq('status', 'active')
    .order('in_time', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Get ended parking sessions
router.get('/sessions/ended', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { data, error } = await (supabaseAdmin as any)
    .from('parking_sessions')
    .select('*, vehicle_categories(type), parking_slots(name)')
    .eq('client_id', clientId)
    .eq('status', 'ended')
    .order('out_time', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Get single parking session
router.get('/sessions/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { id } = req.params;

  const { data, error } = await (supabaseAdmin as any)
    .from('parking_sessions')
    .select('*, vehicle_categories(type), parking_slots(name), floors(name)')
    .eq('client_id', clientId)
    .eq('id', id)
    .single();

  if (error) return res.status(400).json({ error: error.message || 'Session not found' });
  res.json(data);
});

// Create parking session (Check-in)
router.post('/sessions/check-in', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { place_id, slot_id, category_id, vehicle_no, driver_name, driver_mobile, checked_in_by } = req.body;
  
  // 1. Generate barcode (simple simulation)
  const barcode = 'PN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  // 2. Create session
  const { data: session, error: sessionError } = await (supabaseAdmin as any)
    .from('parking_sessions')
    .insert([{ 
      client_id: clientId,
      barcode,
      place_id, 
      slot_id, 
      category_id, 
      vehicle_no, 
      driver_name, 
      driver_mobile, 
      checked_in_by,
      in_time: new Date().toISOString(),
      status: 'active'
    }])
    .select()
    .single();

  if (sessionError) return res.status(400).json({ error: sessionError.message });

  // 3. Update slot status
  if (slot_id) {
    await (supabaseAdmin as any)
      .from('parking_slots')
      .update({ is_occupied: true })
      .eq('id', slot_id)
      .eq('client_id', clientId);
  }

  res.json(session);
});

// End parking session (Check-out)
router.post('/sessions/:id/check-out', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { id } = req.params;
  const { receive_amount, paid_amount, return_amount, checked_out_by, exit_floor_id } = req.body;

  // 1. Get session details
  const { data: session, error: getError } = await (supabaseAdmin as any)
    .from('parking_sessions')
    .select('*')
    .eq('id', id)
    .eq('client_id', clientId)
    .single();

  if (getError || !session) return res.status(400).json({ error: getError?.message || 'Session not found' });

  // 2. Calculate duration and amount (simplified)
  const outTime = new Date().toISOString();
  const inTime = new Date(session.in_time);
  const durationMs = new Date(outTime).getTime() - inTime.getTime();
  const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));

  // 3. Update session
  const { data: updatedSession, error: updateError } = await (supabaseAdmin as any)
    .from('parking_sessions')
    .update({ 
      out_time: outTime,
      duration_hours: durationHours,
      receive_amount,
      paid_amount,
      return_amount,
      checked_out_by,
      exit_floor_id,
      status: 'ended'
    })
    .eq('id', id)
    .eq('client_id', clientId)
    .select()
    .single();

  if (updateError) return res.status(400).json({ error: updateError.message });

  // 4. Free up slot
  if (session.slot_id) {
    await (supabaseAdmin as any)
      .from('parking_slots')
      .update({ is_occupied: false })
      .eq('id', session.slot_id)
      .eq('client_id', clientId);
  }

  res.json(updatedSession);
});

// Get slots
router.get('/slots', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  if (!clientId) return res.status(400).json({ error: 'Client ID is required' });

  const { data, error } = await (supabaseAdmin as any)
    .from('parking_slots')
    .select('*, floors(name), vehicle_categories(type)')
    .eq('client_id', clientId)
    .order('name', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
