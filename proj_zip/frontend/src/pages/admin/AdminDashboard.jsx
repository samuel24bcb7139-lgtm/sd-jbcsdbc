import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './AdminDashboard.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [healthLogs, setHealthLogs] = useState([]);
  const [hostelAnalytics, setHostelAnalytics] = useState({});
  const [diseaseAnalytics, setDiseaseAnalytics] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notificationForm, setNotificationForm] = useState({
    hostel: '',
    message: '',
    severity: 'info',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchHealthLogs();
    fetchAnalytics();
    fetchAlerts();
    fetchAppointments();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await adminAPI.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchHealthLogs = async () => {
    try {
      const { data } = await adminAPI.getHealthLogs();
      setHealthLogs(data);
    } catch (error) {
      console.error('Error fetching health logs:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const [hostelData, diseaseData] = await Promise.all([
        adminAPI.getHostelAnalytics(),
        adminAPI.getDiseaseAnalytics(),
      ]);
      setHostelAnalytics(hostelData.data);
      setDiseaseAnalytics(diseaseData.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const { data } = await adminAPI.getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await adminAPI.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.sendNotification(notificationForm);
      setNotificationForm({ hostel: '', message: '', severity: 'info' });
      alert('Notification sent successfully!');
    } catch (error) {
      alert('Error sending notification');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const hostelChartData = Object.keys(hostelAnalytics).map(hostel => ({
    name: hostel,
    cases: hostelAnalytics[hostel].total,
  }));

  const diseaseChartData = Object.keys(diseaseAnalytics)
    .sort((a, b) => diseaseAnalytics[b].count - diseaseAnalytics[a].count)
    .slice(0, 10)
    .map(disease => ({
      name: disease,
      count: diseaseAnalytics[disease].count,
    }));

  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-header">
        <h1>Administrator Dashboard</h1>
        {profile && (
          <div className="profile-card">
            <h3>👤 {profile.name}</h3>
            <p>Administrator</p>
          </div>
        )}
      </div>

      {alerts.length > 0 && (
        <div className="alerts-banner">
          <h3>🚨 Active Alerts</h3>
          {alerts.map((alert, idx) => (
            <div key={idx} className="alert-item">
              <strong>{alert.hostel}:</strong> {alert.message}
              <span className="alert-percentage">{alert.percentage}%</span>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={activeTab === 'hostel' ? 'active' : ''}
          onClick={() => setActiveTab('hostel')}
        >
          🏠 Hostel Analytics
        </button>
        <button
          className={activeTab === 'disease' ? 'active' : ''}
          onClick={() => setActiveTab('disease')}
        >
          🦠 Disease Analytics
        </button>
        <button
          className={activeTab === 'logs' ? 'active' : ''}
          onClick={() => setActiveTab('logs')}
        >
          📋 Health Logs
        </button>
        <button
          className={activeTab === 'appointments' ? 'active' : ''}
          onClick={() => setActiveTab('appointments')}
        >
          🏥 Appointments
        </button>
        <button
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          📢 Send Notification
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <h3>{healthLogs.length}</h3>
                  <p>Total Health Logs</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏥</div>
                <div className="stat-info">
                  <h3>{appointments.length}</h3>
                  <p>Total Appointments</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏠</div>
                <div className="stat-info">
                  <h3>{Object.keys(hostelAnalytics).length}</h3>
                  <p>Active Hostels</p>
                </div>
              </div>
              <div className="stat-card alert">
                <div className="stat-icon">🚨</div>
                <div className="stat-info">
                  <h3>{alerts.length}</h3>
                  <p>Active Alerts</p>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h2>Cases by Hostel</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hostelChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cases" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'hostel' && (
          <div className="hostel-section">
            <div className="section-card">
              <h2>Hostel-wise Analytics</h2>
              <div className="hostel-cards-grid">
                {Object.keys(hostelAnalytics).map(hostel => (
                  <div key={hostel} className="hostel-card">
                    <h3>{hostel}</h3>
                    <div className="hostel-stat">
                      <span className="stat-label">Total Cases:</span>
                      <span className="stat-value">{hostelAnalytics[hostel].total}</span>
                    </div>
                    <div className="symptoms-breakdown">
                      <strong>Top Symptoms:</strong>
                      {Object.entries(hostelAnalytics[hostel].symptoms)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([symptom, count]) => (
                          <div key={symptom} className="symptom-row">
                            <span>{symptom}</span>
                            <span className="symptom-count">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'disease' && (
          <div className="disease-section">
            <div className="section-card">
              <h2>Disease/Symptom Analytics</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={diseaseChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#764ba2" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="section-card">
              <h2>Symptom Details</h2>
              <div className="disease-list">
                {Object.entries(diseaseAnalytics)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([symptom, data]) => (
                    <div key={symptom} className="disease-item">
                      <div className="disease-header">
                        <h4>{symptom}</h4>
                        <span className="disease-count">{data.count} cases</span>
                      </div>
                      <div className="disease-hostels">
                        <strong>Affected Hostels:</strong>
                        <div className="hostel-tags">
                          {Object.entries(data.hostels).map(([hostel, count]) => (
                            <span key={hostel} className="hostel-tag">
                              {hostel}: {count}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="logs-section">
            <div className="section-card">
              <h2>Recent Health Logs</h2>
              <div className="logs-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Student</th>
                      <th>Hostel</th>
                      <th>Feeling</th>
                      <th>Symptoms</th>
                      <th>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthLogs.slice(0, 50).map(log => (
                      <tr key={log.id}>
                        <td>{new Date(log.created_at).toLocaleDateString()}</td>
                        <td>{log.students?.name || 'Unknown'}</td>
                        <td>{log.hostel}</td>
                        <td className="capitalize">{log.feeling}</td>
                        <td>{log.symptoms?.join(', ') || 'None'}</td>
                        <td>
                          <span className={`severity-badge ${log.severity}`}>
                            {log.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="appointments-section">
            <div className="section-card">
              <h2>All Appointments</h2>
              <div className="logs-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Student</th>
                      <th>Hostel</th>
                      <th>Symptoms</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(apt => (
                      <tr key={apt.id}>
                        <td>{new Date(apt.preferred_date).toLocaleDateString()}</td>
                        <td>{apt.preferred_time}</td>
                        <td>{apt.students?.name || 'Unknown'}</td>
                        <td>{apt.hostel}</td>
                        <td>{apt.symptoms?.join(', ') || 'None'}</td>
                        <td>
                          <span className={`status-badge ${apt.status}`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications-section">
            <div className="section-card">
              <h2>Send Notification to Students</h2>
              <form onSubmit={handleSendNotification}>
                <div className="form-group">
                  <label>Target Hostel</label>
                  <input
                    type="text"
                    value={notificationForm.hostel}
                    onChange={(e) =>
                      setNotificationForm({ ...notificationForm, hostel: e.target.value })
                    }
                    placeholder="Leave empty for all hostels"
                  />
                </div>

                <div className="form-group">
                  <label>Severity</label>
                  <select
                    value={notificationForm.severity}
                    onChange={(e) =>
                      setNotificationForm({ ...notificationForm, severity: e.target.value })
                    }
                    required
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) =>
                      setNotificationForm({ ...notificationForm, message: e.target.value })
                    }
                    rows="5"
                    placeholder="Enter notification message..."
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Notification'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
