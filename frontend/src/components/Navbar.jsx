import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">EduConnect</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <span>📊</span> Dashboard
          </Link>
          <Link
            to="/students"
            className={`nav-link ${isActive('/students') ? 'active' : ''}`}
          >
            <span>👥</span> Students
          </Link>
          <Link
            to="/courses"
            className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
          >
            <span>📖</span> Courses
          </Link>
          <Link
            to="/enrollments"
            className={`nav-link ${isActive('/enrollments') ? 'active' : ''}`}
          >
            <span>✅</span> Enrollments
          </Link>
        </div>

        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
