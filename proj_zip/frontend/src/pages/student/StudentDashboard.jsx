import { useState, useEffect } from 'react';
import { studentAPI } from '../../utils/api';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('health-log');
  const [profile, setProfile] = useState(null);
  const [healthLogs, setHealthLogs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Health log form
  const [healthForm, setHealthForm] = useState({
    feeling: 'good',
    symptoms: [],
    severity: 'mild',
    notes: '',
  });

  // Appointment form
  const [appointmentForm, setAppointmentForm] = useState({
    preferred_date: '',
    preferred_time: '',
    symptoms: [],
    severity: 'mild',
    notes: '',
  });

  const commonSymptoms = [
    'Fever', 'Cough', 'Cold', 'Headache', 'Sore Throat',
    'Stomach Pain', 'Nausea', 'Fatigue', 'Body Ache', 'Dizziness'
  ];

  useEffect(() => {
    fetchProfile();
    fetchHealthLogs();
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await studentAPI.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchHealthLogs = async () => {
    try {
      const { data } = await studentAPI.getHealthLogs();
      setHealthLogs(data);
    } catch (error) {
      console.error('Error fetching health logs:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await studentAPI.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await studentAPI.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleHealthLogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentAPI.createHealthLog(healthForm);
      setHealthForm({
        feeling: 'good',
        symptoms: [],
        severity: 'mild',
        notes: '',
      });
      fetchHealthLogs();
      alert('Health log saved successfully!');
    } catch (error) {
      alert('Error saving health log');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentAPI.bookAppointment(appointmentForm);
      setAppointmentForm({
        preferred_date: '',
        preferred_time: '',
        symptoms: [],
        severity: 'mild',
        notes: '',
      });
      fetchAppointments();
      alert('Appointment booked successfully!');
    } catch (error) {
      alert('Error booking appointment');
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptom, formType) => {
    if (formType === 'health') {
      const symptoms = healthForm.symptoms.includes(symptom)
        ? healthForm.symptoms.filter(s => s !== symptom)
        : [...healthForm.symptoms, symptom];
      setHealthForm({ ...healthForm, symptoms });
    } else {
      const symptoms = appointmentForm.symptoms.includes(symptom)
        ? appointmentForm.symptoms.filter(s => s !== symptom)
        : [...appointmentForm.symptoms, symptom];
      setAppointmentForm({ ...appointmentForm, symptoms });
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        {profile && (
          <div className="profile-card">
            <h3>{profile.name}</h3>
            <p>Registration: {profile.registration_number}</p>
            <p>Hostel: {profile.hostel}</p>
            <p>Phone: {profile.phone_number}</p>
          </div>
        )}
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'health-log' ? 'active' : ''}
          onClick={() => setActiveTab('health-log')}
        >
          📝 Daily Health Log
        </button>
        <button
          className={activeTab === 'appointments' ? 'active' : ''}
          onClick={() => setActiveTab('appointments')}
        >
          🏥 Appointments
        </button>
        <button
          className={activeTab === 'doctors' ? 'active' : ''}
          onClick={() => setActiveTab('doctors')}
        >
          👨‍⚕️ Doctors
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'health-log' && (
          <div className="health-log-section">
            <div className="section-card">
              <h2>How are you feeling today?</h2>
              <form onSubmit={handleHealthLogSubmit}>
                <div className="form-group">
                  <label>Overall Feeling</label>
                  <select
                    value={healthForm.feeling}
                    onChange={(e) => setHealthForm({ ...healthForm, feeling: e.target.value })}
                    required
                  >
                    <option value="good">😊 Feeling Good</option>
                    <option value="okay">😐 Okay</option>
                    <option value="unwell">😷 Not Feeling Well</option>
                    <option value="sick">🤒 Sick</option>
                  </select>
                </div>

                {healthForm.feeling !== 'good' && (
                  <>
                    <div className="form-group">
                      <label>Select Symptoms</label>
                      <div className="symptoms-grid">
                        {commonSymptoms.map(symptom => (
                          <button
                            key={symptom}
                            type="button"
                            className={`symptom-btn ${healthForm.symptoms.includes(symptom) ? 'selected' : ''}`}
                            onClick={() => toggleSymptom(symptom, 'health')}
                          >
                            {symptom}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Severity</label>
                      <select
                        value={healthForm.severity}
                        onChange={(e) => setHealthForm({ ...healthForm, severity: e.target.value })}
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea
                    value={healthForm.notes}
                    onChange={(e) => setHealthForm({ ...healthForm, notes: e.target.value })}
                    rows="3"
                    placeholder="Any other symptoms or information..."
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Health Log'}
                </button>
              </form>
            </div>

            <div className="section-card">
              <h2>Your Health History</h2>
              <div className="logs-list">
                {healthLogs.length === 0 ? (
                  <p className="empty-state">No health logs yet</p>
                ) : (
                  healthLogs.map(log => (
                    <div key={log.id} className="log-item">
                      <div className="log-date">
                        {new Date(log.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="log-details">
                        <span className="log-feeling">{log.feeling}</span>
                        {log.symptoms.length > 0 && (
                          <span className="log-symptoms">
                            {log.symptoms.join(', ')}
                          </span>
                        )}
                        {log.notes && <p className="log-notes">{log.notes}</p>}
                      </div>
                      <span className={`severity-badge ${log.severity}`}>
                        {log.severity}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="appointments-section">
            <div className="section-card">
              <h2>Book an Appointment</h2>
              <form onSubmit={handleAppointmentSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date</label>
                    <input
                      type="date"
                      value={appointmentForm.preferred_date}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, preferred_date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Time</label>
                    <input
                      type="time"
                      value={appointmentForm.preferred_time}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, preferred_time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Symptoms</label>
                  <div className="symptoms-grid">
                    {commonSymptoms.map(symptom => (
                      <button
                        key={symptom}
                        type="button"
                        className={`symptom-btn ${appointmentForm.symptoms.includes(symptom) ? 'selected' : ''}`}
                        onClick={() => toggleSymptom(symptom, 'appointment')}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Severity</label>
                  <select
                    value={appointmentForm.severity}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, severity: e.target.value })}
                    required
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                    rows="3"
                    placeholder="Describe your condition..."
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
              </form>
            </div>

            <div className="section-card">
              <h2>Your Appointments</h2>
              <div className="appointments-list">
                {appointments.length === 0 ? (
                  <p className="empty-state">No appointments booked</p>
                ) : (
                  appointments.map(apt => (
                    <div key={apt.id} className="appointment-item">
                      <div className="appointment-date">
                        📅 {new Date(apt.preferred_date).toLocaleDateString()}
                        <br />
                        🕐 {apt.preferred_time}
                      </div>
                      <div className="appointment-details">
                        {apt.symptoms.length > 0 && (
                          <p><strong>Symptoms:</strong> {apt.symptoms.join(', ')}</p>
                        )}
                        {apt.notes && <p><strong>Notes:</strong> {apt.notes}</p>}
                        {apt.nurse_notes && (
                          <p className="nurse-notes">
                            <strong>Nurse Notes:</strong> {apt.nurse_notes}
                          </p>
                        )}
                      </div>
                      <span className={`status-badge ${apt.status}`}>
                        {apt.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="doctors-section">
            <div className="section-card">
              <h2>Available Doctors</h2>
              <div className="doctors-grid">
                {doctors.map(doctor => (
                  <div key={doctor.id} className="doctor-card">
                    <div className="doctor-icon">👨‍⚕️</div>
                    <h3>{doctor.name}</h3>
                    <p className="doctor-qualification">{doctor.qualification}</p>
                    {doctor.available_timings && doctor.available_timings.length > 0 && (
                      <div className="doctor-timings">
                        <strong>Available:</strong>
                        <ul>
                          {doctor.available_timings.map((time, idx) => (
                            <li key={idx}>{time}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button
                      className="btn-secondary"
                      onClick={() => alert('Chat feature coming soon!')}
                    >
                      💬 Start Chat
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
