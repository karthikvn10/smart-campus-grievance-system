import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import HelpChatbot from './HelpChatbot'

export default function Sidebar({ user, onLogout }) {
  const [chatOpen, setChatOpen] = useState(false)

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
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}

        {user.role === 'Admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">⚙</span>
            Manage Complaints
          </NavLink>
        )}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="help-card"
          onClick={() => setChatOpen(true)}
        >
          <span className="help-symbol">?</span>
          <strong>Need assistance?</strong>
          <span className="help-description">
            Have a question? Our assistant is here to help.
          </span>
          <span className="help-action">Chat with us →</span>
        </button>

        <button className="logout-btn" onClick={onLogout}>
          <span>↪</span> Sign out
        </button>
      </div>

      {chatOpen && (
        <div className="chatbot-container">
          <HelpChatbot onClose={() => setChatOpen(false)} />
        </div>
      )}
    </aside>
  )
}