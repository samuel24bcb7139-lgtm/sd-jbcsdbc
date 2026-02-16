# Quick Setup Guide

Follow these steps to get your Healthcare Management System up and running:

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Setup Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready (takes ~2 minutes)
4. Go to **Settings** → **API** in your Supabase dashboard
5. Copy these three values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)
   - **service_role key** (another long string)

## Step 3: Configure Environment Variables

1. In the `backend` folder, create a file named `.env`
2. Copy the content from `.env.example` and fill in your Supabase credentials:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
PORT=5000
JWT_SECRET=your_random_secret_key_here_change_this
JWT_EXPIRES_IN=7d
OUTBREAK_THRESHOLD=20
```

**Important**: Change `JWT_SECRET` to your own random string (at least 32 characters)

## Step 4: Create Database Schema

1. Open your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Open `backend/SUPABASE_SCHEMA.md` in a text editor
4. Copy the entire SQL code (everything inside the ```sql``` block)
5. Paste it into the Supabase SQL Editor
6. Click **Run** button
7. Wait for success message

## Step 5: Run the Application

Open TWO terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
You should see: `Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5173`

## Step 6: Access the Application

Open your browser and go to: **http://localhost:5173**

## Step 7: Create Test Accounts

### Create a Student Account:
1. Click "Register"
2. Select Role: Student
3. Fill in:
   - Email: student@test.com
   - Password: student123
   - Name: John Doe
   - Registration Number: REG001
   - Hostel: Hostel A
   - Phone: 1234567890
4. Click Register

### Create a Doctor Account:
1. Logout and click "Register" again
2. Select Role: Doctor/Nurse
3. Fill in:
   - Email: doctor@test.com
   - Password: doctor123
   - Name: Dr. Smith
   - Phone: 9876543210
   - Qualification: MBBS, MD
   - Available Timings: Mon 9-12, Wed 2-5
4. Click Register

### Create an Admin Account:
1. Logout and click "Register" again
2. Select Role: Administrator
3. Fill in:
   - Email: admin@test.com
   - Password: admin123
   - Name: Admin User
4. Click Register

## Step 8: Test the Features

### As Student:
1. Login with student@test.com / student123
2. Go to "Daily Health Log" tab
3. Log how you're feeling today
4. Try booking an appointment

### As Doctor:
1. Logout and login with doctor@test.com / doctor123
2. View pending appointments
3. Confirm or update appointment status

### As Admin:
1. Logout and login with admin@test.com / admin123
2. View analytics dashboard
3. Check hostel and disease statistics
4. Try sending a notification

## Troubleshooting

### Backend won't start?
- Check if port 5000 is already in use
- Verify your `.env` file has correct Supabase credentials
- Make sure you ran `npm install` in the backend folder

### Frontend shows errors?
- Check if backend is running on port 5000
- Verify you ran `npm install` in the frontend folder
- Clear browser cache and reload

### Database errors?
- Verify you ran the SQL schema in Supabase
- Check if your SUPABASE_SERVICE_KEY is correct
- Go to Supabase dashboard → SQL Editor and verify tables exist

### Login not working?
- Check browser console for errors
- Verify backend is running
- Check if .env JWT_SECRET is set

## Features Overview

✅ **Student Features:**
- Daily health logging with symptoms
- Appointment booking
- View health history
- Chat with doctors (UI ready)

✅ **Doctor Features:**
- View all appointments
- Confirm/complete appointments
- Add notes to cases
- Track patient history

✅ **Admin Features:**
- Visual analytics dashboard
- Hostel-wise health statistics
- Disease/symptom tracking
- Outbreak alerts (>20% threshold)
- Send notifications to students

## Need Help?

Check the main README.md file for detailed documentation or create an issue if you encounter problems.

Enjoy your Healthcare Management System! 🏥
