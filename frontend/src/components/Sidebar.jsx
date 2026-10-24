
import { NavLink } from 'react-router-dom'

export default function Sidebar({ user, onLogout }) {
  const links = [
    { to: '/', icon: '◫', label: 'Dashboard' },
    { to: '/submit', icon: '＋', label: 'Submit Complaint' },
    { to: '/complaints', icon: '▤', label: 'My Complaints' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">SC</div>
        <div>
          <strong>CampusCare</strong>
          <span>GRIEVANCE PORTAL</span>
        </div>
      </div>

      <div className="sidebar-label">WORKSPACE</div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}

        {user.role === 'Admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">⚙</span>
            Manage Complaints
          </NavLink>
        )}
      </nav>

      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-symbol">?</div>
          <strong>Need assistance?</strong>
          <p>Report an issue and track its progress here.</p>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <span>↪</span> Sign out
        </button>
      </div>
    </aside>
  )
}
