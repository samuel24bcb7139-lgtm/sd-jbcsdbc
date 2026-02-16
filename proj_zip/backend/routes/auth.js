import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

// Register
router.post('/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['student', 'doctor', 'admin']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, profileData } = req.body;

    try {
      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .insert([{ email, password: hashedPassword, role }])
        .select()
        .single();

      if (userError) throw userError;

      // Insert role-specific profile
      let profileError;
      if (role === 'student') {
        const { error } = await supabaseAdmin.from('students').insert([{
          user_id: user.id,
          registration_number: profileData.registrationNumber,
          name: profileData.name,
          hostel: profileData.hostel,
          phone_number: profileData.phoneNumber,
        }]);
        profileError = error;
      } else if (role === 'doctor') {
        const { error } = await supabaseAdmin.from('doctors').insert([{
          user_id: user.id,
          name: profileData.name,
          phone_number: profileData.phoneNumber,
          qualification: profileData.qualification,
          available_timings: profileData.availableTimings,
        }]);
        profileError = error;
      } else if (role === 'admin') {
        const { error } = await supabaseAdmin.from('admins').insert([{
          user_id: user.id,
          name: profileData.name,
        }]);
        profileError = error;
      }

      if (profileError) throw profileError;

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail(),
    body('password').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Get user
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

export default router;
