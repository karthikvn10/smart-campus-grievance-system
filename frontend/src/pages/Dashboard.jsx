
import { Link } from 'react-router-dom'

function getStatusClass(status) {
  return `status-${String(status || 'Submitted')
    .toLowerCase()
    .replace(/\s+/g, '-')}`
}

function StatCard({ label, value, icon, color, description }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon" style={{ background: color }}>
          {icon}
        </span>
      </div>

      <strong className="stat-number">{value}</strong>
      <span className="stat-note">{description}</span>
    </div>
  )
}

export default function Dashboard({ user, complaints = [] }) {
  const allComplaints = Array.isArray(complaints) ? complaints : []

  const visible =
    user?.role === 'Admin'
      ? allComplaints
      : allComplaints.filter(
          (item) => item.createdBy === user?.name
        )

  const total = visible.length
  const submitted = visible.filter(
    (item) => !item.status || item.status === 'Submitted'
  ).length
  const inProgress = visible.filter(
    (item) => item.status === 'In Progress'
  ).length
  const resolved = visible.filter(
    (item) => item.status === 'Resolved'
  ).length

  const resolutionRate = total
    ? Math.round((resolved / total) * 100)
    : 0

  const recent = [...visible]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return dateB - dateA
    })
    .slice(0, 5)

  const stats = [
    {
      label: 'Total Complaints',
      value: total,
      icon: '▤',
      color: '#e9e7ff',
      description: 'All reported issues',
    },
    {
      label: 'Submitted',
      value: submitted,
      icon: '◷',
      color: '#fff0cf',
      description: 'Awaiting action',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: '↻',
      color: '#dcecff',
      description: 'Currently being handled',
    },
    {
      label: 'Resolved',
      value: resolved,
      icon: '✓',
      color: '#d8f8e8',
      description: 'Successfully completed',
    },
  ]

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div className="welcome-content">
          <span className="welcome-label">
            {user?.role === 'Admin' ? 'ADMINISTRATION' : 'STUDENT PORTAL'}
          </span>

          <h1>
            Welcome back, {user?.name || 'User'} <span>✦</span>
          </h1>

          <p>
            {user?.role === 'Admin'
              ? 'Monitor campus issues, manage complaints, and help keep your campus running smoothly.'
              : 'Your campus, your voice. Report issues and track their progress from one place.'}
          </p>

          <div className="welcome-actions">
            <Link className="primary-btn" to="/submit">
              <span>＋</span> Submit a Complaint
            </Link>

            <Link className="welcome-secondary-btn" to="/complaints">
              View My Complaints <span>→</span>
            </Link>
          </div>
        </div>

        <div className="welcome-decoration" aria-hidden="true">
          <div className="decoration-circle circle-one" />
          <div className="decoration-circle circle-two" />
          <div className="decoration-icon">✦</div>
          <div className="decoration-caption">
            <span className="online-dot" />
            Campus support at your service
          </div>
        </div>
      </section>

      <div className="dashboard-section-heading">
        <div>
          <h2>Overview</h2>
          <p>Here's what's happening with campus complaints.</p>
        </div>

        <Link className="dashboard-view-link" to="/complaints">
          View all complaints →
        </Link>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="dashboard-lower-grid">
        <section className="panel dashboard-recent-panel">
          <div className="panel-header">
            <div>
              <h2>Recent Complaints</h2>
              <p>Your latest reported campus issues.</p>
            </div>

            <Link className="secondary-btn" to="/complaints">
              View all →
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▤</div>
              <h3>No complaints yet</h3>
              <p>
                Your complaint activity will appear here once an issue
                is reported.
              </p>

              <Link className="primary-btn" to="/submit">
                Submit your first complaint
              </Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Complaint</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recent.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="ticket-id">
                        {item.id || '—'}
                      </td>

                      <td>
                        <div className="dashboard-complaint-title">
                          {item.title || 'Untitled complaint'}
                        </div>
                        <div className="dashboard-complaint-category">
                          {item.category || 'General'}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(item.status)}`}
                        >
                          {item.status || 'Submitted'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="dashboard-side-column">
          <section className="panel resolution-panel">
            <div className="side-panel-heading">
              <div>
                <h2>Resolution Rate</h2>
                <p>Complaints completed</p>
              </div>
              <span className="resolution-icon">✓</span>
            </div>

            <div className="resolution-number">
              {resolutionRate}<span>%</span>
            </div>

            <div
              className="resolution-progress-track"
              role="progressbar"
              aria-label="Resolution rate"
              aria-valuenow={resolutionRate}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="resolution-progress-fill"
                style={{ width: `${resolutionRate}%` }}
              />
            </div>

            <p className="resolution-description">
              {resolved} of {total} complaints resolved
            </p>
          </section>

          <section className="panel quick-actions-panel">
            <div className="side-panel-heading">
              <div>
                <h2>Quick Actions</h2>
                <p>What would you like to do?</p>
              </div>
            </div>

            <Link className="quick-action-item" to="/submit">
              <span className="quick-action-icon quick-icon-purple">＋</span>
              <span className="quick-action-text">
                <strong>Report an Issue</strong>
                <small>Tell us about a campus problem</small>
              </span>
              <span className="quick-action-arrow">→</span>
            </Link>

            <Link className="quick-action-item" to="/complaints">
              <span className="quick-action-icon quick-icon-blue">▤</span>
              <span className="quick-action-text">
                <strong>Track Complaints</strong>
                <small>Check your complaint status</small>
              </span>
              <span className="quick-action-arrow">→</span>
            </Link>

            <Link className="quick-action-item" to="/profile">
              <span className="quick-action-icon quick-icon-green">♙</span>
              <span className="quick-action-text">
                <strong>My Profile</strong>
                <small>View your account information</small>
              </span>
              <span className="quick-action-arrow">→</span>
            </Link>
          </section>
        </aside>
      </div>

      <div className="dashboard-notice">
        <span className="notice-symbol">ⓘ</span>
        <div>
          <strong>Campus support information</strong>
          <p>
            {user?.role === 'Admin'
              ? 'Complaint records currently come from this browser. Shared management requires backend integration.'
              : 'Your complaints are currently saved in this browser. Backend integration is needed to share records across devices.'}
          </p>
        </div>
      </div>
    </div>
  )
}
