import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get admin profile
router.get('/profile', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('admins')
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

// Get all health logs with analytics
router.get('/health-logs', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('health_logs')
      .select(`
        *,
        students (
          name,
          registration_number,
          hostel
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching health logs:', error);
    res.status(500).json({ error: 'Failed to fetch health logs' });
  }
});

// Get analytics by hostel
router.get('/analytics/hostel', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { data: logs, error } = await supabaseAdmin
      .from('health_logs')
      .select('hostel, symptoms, severity, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    // Group by hostel
    const hostelStats = {};
    logs.forEach(log => {
      if (!hostelStats[log.hostel]) {
        hostelStats[log.hostel] = { total: 0, symptoms: {} };
      }
      hostelStats[log.hostel].total++;
      
      log.symptoms.forEach(symptom => {
        if (!hostelStats[log.hostel].symptoms[symptom]) {
          hostelStats[log.hostel].symptoms[symptom] = 0;
        }
        hostelStats[log.hostel].symptoms[symptom]++;
      });
    });

    res.json(hostelStats);
  } catch (error) {
    console.error('Error fetching hostel analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get analytics by disease/symptom
router.get('/analytics/disease', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { data: logs, error } = await supabaseAdmin
      .from('health_logs')
      .select('symptoms, severity, hostel, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    // Count symptoms
    const symptomStats = {};
    logs.forEach(log => {
      log.symptoms.forEach(symptom => {
        if (!symptomStats[symptom]) {
          symptomStats[symptom] = { count: 0, hostels: {} };
        }
        symptomStats[symptom].count++;
        
        if (!symptomStats[symptom].hostels[log.hostel]) {
          symptomStats[symptom].hostels[log.hostel] = 0;
        }
        symptomStats[symptom].hostels[log.hostel]++;
      });
    });

    res.json(symptomStats);
  } catch (error) {
    console.error('Error fetching disease analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Check for outbreak alerts
router.get('/alerts', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const threshold = parseFloat(process.env.OUTBREAK_THRESHOLD) || 20;
    
    // Get all students count by hostel
    const { data: students, error: studentsError } = await supabaseAdmin
      .from('students')
      .select('hostel');

    if (studentsError) throw studentsError;

    const hostelCounts = {};
    students.forEach(s => {
      hostelCounts[s.hostel] = (hostelCounts[s.hostel] || 0) + 1;
    });

    // Get recent health logs (last 7 days)
    const { data: logs, error: logsError } = await supabaseAdmin
      .from('health_logs')
      .select('hostel, symptoms')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (logsError) throw logsError;

    // Count cases by hostel
    const caseCounts = {};
    logs.forEach(log => {
      caseCounts[log.hostel] = (caseCounts[log.hostel] || 0) + 1;
    });

    // Check for outbreaks
    const alerts = [];
    Object.keys(caseCounts).forEach(hostel => {
      const percentage = (caseCounts[hostel] / hostelCounts[hostel]) * 100;
      if (percentage > threshold) {
        alerts.push({
          hostel,
          cases: caseCounts[hostel],
          total: hostelCounts[hostel],
          percentage: percentage.toFixed(2),
          severity: 'high',
          message: `Outbreak alert: ${percentage.toFixed(1)}% of ${hostel} students reported health issues in the last 7 days`,
        });
      }
    });

    res.json(alerts);
  } catch (error) {
    console.error('Error checking alerts:', error);
    res.status(500).json({ error: 'Failed to check alerts' });
  }
});

// Get all appointments
router.get('/appointments', authenticateToken, authorize('admin'), async (req, res) => {
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

// Send notification to students in a hostel
router.post('/notifications', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { hostel, message, severity } = req.body;

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert([{
        hostel,
        message,
        severity,
        sent_by: req.user.id,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

export default router;
