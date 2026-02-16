# Healthcare Management System

A comprehensive healthcare management system built with React (Vite) frontend and Express backend, using Supabase as the database.

## Features

### Three User Roles

#### 1. Student Interface
- **Daily Health Log**: Blog-style interface where students can log their daily health status
- **Symptom Tracking**: Select symptoms and severity levels with intelligent questionnaire
- **Appointment Booking**: Book appointments with nurses/doctors
- **Doctor Chat**: (Coming soon) Direct messaging with available doctors
- **Profile Management**: View personal details including registration number, hostel, phone number

#### 2. Doctor/Nurse Interface
- **Appointment Management**: View all student appointments
- **Status Updates**: Confirm, complete, or cancel appointments
- **Case Logging**: Add notes to appointments and track patient history
- **Student Information**: Access student details including hostel and contact information

#### 3. Administrator Interface
- **Analytics Dashboard**: 
  - Visual representations of health data by hostel
  - Disease/symptom analytics with charts
  - Real-time statistics
- **Outbreak Detection**: Automatic alerts when cases exceed 20% of hostel strength
- **Database Logs**: View all health logs and appointments
- **Notification System**: Send targeted notifications to students by hostel
- **Health Monitoring**: Track trends and patterns across the institution

## Tech Stack

### Frontend
- React 19 with Vite
- React Router for navigation
- Recharts for data visualization
- Axios for API calls
- CSS3 for styling

### Backend
- Node.js with Express
- Supabase (PostgreSQL) database
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Setup Instructions

#### 1. Clone the repository
```bash
cd richiproj
```

#### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory (copy from `.env.example`):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=5000
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
OUTBREAK_THRESHOLD=20
```

#### 3. Setup Supabase Database
- Go to your Supabase project
- Open the SQL Editor
- Run the SQL schema from `backend/SUPABASE_SCHEMA.md`
- This will create all necessary tables, indexes, and relationships

#### 4. Setup Frontend
```bash
cd ../frontend
npm install
```

#### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Usage

### First Time Setup

1. **Register Users**: 
   - Create student accounts with registration number, hostel, etc.
   - Create doctor/nurse accounts with qualifications and timings
   - Create admin account

2. **Student Actions**:
   - Log daily health status
   - Report symptoms when feeling unwell
   - Book appointments for severe cases
   - View appointment status

3. **Doctor Actions**:
   - Review pending appointments
   - Confirm and manage appointments
   - Add medical notes to cases

4. **Admin Actions**:
   - Monitor health trends across hostels
   - Check for outbreak alerts
   - Send notifications to students
   - View comprehensive analytics

## Key Features Explained

### Health Log Questionnaire
Students are asked:
- How are you feeling today? (Good/Okay/Unwell/Sick)
- If not feeling well: Select symptoms from common list
- Rate severity (Mild/Moderate/Severe)
- Add additional notes

### Appointment System
- Students book preferred date and time
- Nurses see all appointments with student details
- Status tracking: Pending → Confirmed → Completed
- Each case logged with hostel, date, time information

### Outbreak Detection
- System automatically monitors health logs
- Calculates percentage of affected students per hostel
- Triggers alert when threshold exceeded (default 20%)
- Admin can send notifications to affected hostels

### Analytics Dashboard
- **Hostel View**: Cases grouped by hostel with symptom breakdown
- **Disease View**: Most common symptoms/diseases across institution
- **Charts**: Bar charts and visualizations for easy understanding
- **Time-based**: Analytics for last 30 days (configurable)

## Database Schema

Key tables:
- `users`: Authentication data
- `students`: Student profiles
- `doctors`: Doctor/nurse profiles
- `admins`: Administrator profiles
- `health_logs`: Daily health entries
- `appointments`: Appointment bookings
- `messages`: Chat messages (for future implementation)
- `notifications`: System notifications

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Supabase Row Level Security (RLS)

## Future Enhancements

- Real-time chat functionality between students and doctors
- Push notifications
- Mobile app version
- Email notifications for alerts
- More detailed analytics and reporting
- Export data functionality
- Integration with wearable devices

## Contributing

This is a project for educational/institutional use. Feel free to fork and customize for your needs.

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
