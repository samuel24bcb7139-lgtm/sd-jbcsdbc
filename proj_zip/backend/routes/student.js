import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get student profile
router.get('/profile', authenticateToken, authorize('student'), async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('students')
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

// Create health log entry
router.post('/health-log', authenticateToken, authorize('student'), async (req, res) => {
  try {
    const { feeling, symptoms, severity, notes } = req.body;

    const { data: student } = await supabaseAdmin
      .from('students')
      .select('id, hostel')
      .eq('user_id', req.user.id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('health_logs')
      .insert([{
        student_id: student.id,
        feeling,
        symptoms: symptoms || [],
        severity,
        notes,
        hostel: student.hostel,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating health log:', error);
    res.status(500).json({ error: 'Failed to create health log' });
  }
});

// Get student's health logs
router.get('/health-logs', authenticateToken, authorize('student'), async (req, res) => {
  try {
    const { data: student } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('health_logs')
      .select('*')
      .eq('student_id', student.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching health logs:', error);
    res.status(500).json({ error: 'Failed to fetch health logs' });
  }
});

// Book appointment
router.post('/appointments', authenticateToken, authorize('student'), async (req, res) => {
  try {
    const { preferred_date, preferred_time, symptoms, severity, notes } = req.body;

    const { data: student } = await supabaseAdmin
      .from('students')
      .select('id, hostel')
      .eq('user_id', req.user.id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert([{
        student_id: student.id,
        preferred_date,
        preferred_time,
        symptoms: symptoms || [],
        severity,
        notes,
        hostel: student.hostel,
        status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// Get student's appointments
router.get('/appointments', authenticateToken, authorize('student'), async (req, res) => {
  try {
    const { data: student } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('student_id', student.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get available doctors for chat
router.get('/doctors', authenticateToken, authorize('student'), async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('doctors')
      .select('id, name, qualification, available_timings');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

export default router;
