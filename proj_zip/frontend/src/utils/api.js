import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

// Student APIs
export const studentAPI = {
  getProfile: () => api.get('/student/profile'),
  createHealthLog: (data) => api.post('/student/health-log', data),
  getHealthLogs: () => api.get('/student/health-logs'),
  bookAppointment: (data) => api.post('/student/appointments', data),
  getAppointments: () => api.get('/student/appointments'),
  getDoctors: () => api.get('/student/doctors'),
};

// Doctor APIs
export const doctorAPI = {
  getProfile: () => api.get('/doctor/profile'),
  updateProfile: (data) => api.put('/doctor/profile', data),
  getAppointments: () => api.get('/doctor/appointments'),
  updateAppointment: (id, data) => api.put(`/doctor/appointments/${id}`, data),
};

// Admin APIs
export const adminAPI = {
  getProfile: () => api.get('/admin/profile'),
  getHealthLogs: () => api.get('/admin/health-logs'),
  getHostelAnalytics: () => api.get('/admin/analytics/hostel'),
  getDiseaseAnalytics: () => api.get('/admin/analytics/disease'),
  getAlerts: () => api.get('/admin/alerts'),
  getAppointments: () => api.get('/admin/appointments'),
  sendNotification: (data) => api.post('/admin/notifications', data),
};

// Chat APIs
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/messages', data),
  getMessages: (doctorId, studentId) => 
    api.get(`/chat/messages/${doctorId}`, { params: { studentId } }),
  getConversations: () => api.get('/chat/conversations'),
};

export default api;
