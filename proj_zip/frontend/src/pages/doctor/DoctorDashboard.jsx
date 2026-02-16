import { useState, useEffect } from 'react';
import { doctorAPI } from '../../utils/api';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await doctorAPI.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await doctorAPI.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleStatusUpdate = async (appointmentId, status, notes) => {
    setLoading(true);
    try {
      await doctorAPI.updateAppointment(appointmentId, { status, notes });
      fetchAppointments();
      alert('Appointment updated successfully!');
    } catch (error) {
      alert('Error updating appointment');
    } finally {
      setLoading(false);
    }
  };

  const groupedAppointments = {
    pending: appointments.filter(a => a.status === 'pending'),
    confirmed: appointments.filter(a => a.status === 'confirmed'),
    completed: appointments.filter(a => a.status === 'completed'),
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Doctor/Nurse Dashboard</h1>
        {profile && (
          <div className="profile-card">
            <h3>👨‍⚕️ {profile.name}</h3>
            <p>{profile.qualification}</p>
            <p>Phone: {profile.phone_number}</p>
            {profile.available_timings && profile.available_timings.length > 0 && (
              <p>Available: {profile.available_timings.join(', ')}</p>
            )}
          </div>
        )}
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'appointments' ? 'active' : ''}
          onClick={() => setActiveTab('appointments')}
        >
          🏥 Appointments ({appointments.length})
        </button>
        <button
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending ({groupedAppointments.pending.length})
        </button>
        <button
          className={activeTab === 'confirmed' ? 'active' : ''}
          onClick={() => setActiveTab('confirmed')}
        >
          ✅ Confirmed ({groupedAppointments.confirmed.length})
        </button>
      </div>

      <div className="dashboard-content">
        <div className="section-card">
          <h2>
            {activeTab === 'appointments' && 'All Appointments'}
            {activeTab === 'pending' && 'Pending Appointments'}
            {activeTab === 'confirmed' && 'Confirmed Appointments'}
          </h2>
          
          <div className="appointments-grid">
            {(activeTab === 'appointments' ? appointments : groupedAppointments[activeTab])
              .length === 0 ? (
              <p className="empty-state">No appointments found</p>
            ) : (
              (activeTab === 'appointments' ? appointments : groupedAppointments[activeTab])
                .map(apt => (
                  <div key={apt.id} className="appointment-card">
                    <div className="appointment-header">
                      <div>
                        <h3>{apt.students?.name || 'Unknown Student'}</h3>
                        <p className="student-info">
                          {apt.students?.registration_number} | {apt.students?.hostel}
                        </p>
                        <p className="student-info">📞 {apt.students?.phone_number}</p>
                      </div>
                      <span className={`status-badge ${apt.status}`}>
                        {apt.status}
                      </span>
                    </div>

                    <div className="appointment-body">
                      <div className="info-row">
                        <span className="label">📅 Date:</span>
                        <span>{new Date(apt.preferred_date).toLocaleDateString()}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">🕐 Time:</span>
                        <span>{apt.preferred_time}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">📋 Symptoms:</span>
                        <span>{apt.symptoms?.join(', ') || 'None specified'}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">⚠️ Severity:</span>
                        <span className={`severity-badge ${apt.severity}`}>
                          {apt.severity}
                        </span>
                      </div>
                      {apt.notes && (
                        <div className="notes-section">
                          <strong>Student Notes:</strong>
                          <p>{apt.notes}</p>
                        </div>
                      )}
                      {apt.nurse_notes && (
                        <div className="notes-section nurse-notes">
                          <strong>Your Notes:</strong>
                          <p>{apt.nurse_notes}</p>
                        </div>
                      )}
                    </div>

                    {apt.status === 'pending' && (
                      <div className="appointment-actions">
                        <button
                          className="btn-confirm"
                          onClick={() => {
                            const notes = prompt('Add notes (optional):');
                            handleStatusUpdate(apt.id, 'confirmed', notes || '');
                          }}
                          disabled={loading}
                        >
                          ✅ Confirm
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => {
                            if (confirm('Cancel this appointment?')) {
                              handleStatusUpdate(apt.id, 'cancelled', 'Cancelled by nurse');
                            }
                          }}
                          disabled={loading}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    )}

                    {apt.status === 'confirmed' && (
                      <div className="appointment-actions">
                        <button
                          className="btn-complete"
                          onClick={() => {
                            const notes = prompt('Add completion notes:');
                            if (notes) {
                              handleStatusUpdate(apt.id, 'completed', notes);
                            }
                          }}
                          disabled={loading}
                        >
                          ✓ Mark Complete
                        </button>
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
