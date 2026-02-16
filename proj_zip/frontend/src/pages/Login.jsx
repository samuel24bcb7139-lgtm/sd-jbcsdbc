import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    // Profile data
    name: '',
    registrationNumber: '',
    hostel: '',
    phoneNumber: '',
    qualification: '',
    availableTimings: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data } = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
        login(data.token, data.user);
        
        // Navigate based on role
        switch (data.user.role) {
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        // Registration
        const profileData = {};
        if (formData.role === 'student') {
          profileData.registrationNumber = formData.registrationNumber;
          profileData.name = formData.name;
          profileData.hostel = formData.hostel;
          profileData.phoneNumber = formData.phoneNumber;
        } else if (formData.role === 'doctor') {
          profileData.name = formData.name;
          profileData.phoneNumber = formData.phoneNumber;
          profileData.qualification = formData.qualification;
          profileData.availableTimings = formData.availableTimings;
        } else if (formData.role === 'admin') {
          profileData.name = formData.name;
        }

        const { data } = await authAPI.register({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          profileData,
        });

        login(data.token, data.user);
        
        switch (data.user.role) {
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🏥 Healthcare Management System</h1>
        <div className="toggle-buttons">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="doctor">Doctor/Nurse</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {formData.role === 'student' && (
                <>
                  <div className="form-group">
                    <label>Registration Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hostel</label>
                    <input
                      type="text"
                      name="hostel"
                      value={formData.hostel}
                      onChange={handleChange}
                      placeholder="e.g., Hostel A"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              {formData.role === 'doctor' && (
                <>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Qualification</label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Available Timings (comma separated)</label>
                    <input
                      type="text"
                      name="availableTimings"
                      placeholder="e.g., Mon 9-12, Tue 2-5"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availableTimings: e.target.value.split(',').map(t => t.trim()),
                        })
                      }
                    />
                  </div>
                </>
              )}
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
