import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get doctor profile
router.get('/profile', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('doctors')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update doctor profile
router.put('/profile', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { name, phone_number, qualification, available_timings } = req.body;

    const { data, error } = await supabaseAdmin
      .from('doctors')
      .update({ name, phone_number, qualification, available_timings })
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get all appointments (for nurses/doctors)
router.get('/appointments', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        students (
          name,
          registration_number,
          hostel,
          phone_number
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Update appointment status
router.put('/appointments/:id', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .update({ status, nurse_notes: notes })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

export default router;
