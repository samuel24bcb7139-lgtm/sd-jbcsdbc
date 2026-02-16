import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🏥 Healthcare Management</h2>
      </div>
      <div className="navbar-menu">
        {user && (
          <>
            <span className="navbar-user">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}: {user.email}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
