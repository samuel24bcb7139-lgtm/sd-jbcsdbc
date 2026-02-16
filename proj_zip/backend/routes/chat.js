import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Send a message
router.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { doctor_id, message } = req.body;

    // Get student ID
    const { data: student } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([{
        student_id: student.id,
        doctor_id,
        message,
        sender_type: req.user.role,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get chat history between student and doctor
router.get('/messages/:doctorId', authenticateToken, async (req, res) => {
  try {
    const { doctorId } = req.params;

    let studentId;
    if (req.user.role === 'student') {
      const { data: student } = await supabaseAdmin
        .from('students')
        .select('id')
        .eq('user_id', req.user.id)
        .single();
      studentId = student.id;
    } else if (req.user.role === 'doctor') {
      // For now, we'll need student_id in query params for doctor
      studentId = req.query.studentId;
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .select(`
        *,
        students (name),
        doctors (name)
      `)
      .eq('student_id', studentId)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get all conversations for a doctor
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'doctor') {
      const { data: doctor } = await supabaseAdmin
        .from('doctors')
        .select('id')
        .eq('user_id', req.user.id)
        .single();

      const { data, error } = await supabaseAdmin
        .from('messages')
        .select(`
          student_id,
          students (name, registration_number)
        `)
        .eq('doctor_id', doctor.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get unique students
      const uniqueStudents = [...new Map(data.map(item => 
        [item.student_id, item.students]
      )).values()];

      res.json(uniqueStudents);
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

export default router;
