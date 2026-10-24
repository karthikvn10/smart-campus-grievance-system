
import { Link } from 'react-router-dom'

function getStatusClass(status) {
  return `status-${status.toLowerCase().replace(/\s+/g, '-')}`
}

export default function Dashboard({ user, complaints }) {
  const visible = user.role === 'Admin'
    ? complaints
    : complaints.filter((item) => item.createdBy === user.name)

  const stats = [
    { label: 'Total Complaints', value: visible.length, icon: '▤', color: '#eeedff' },
    { label: 'Submitted', value: visible.filter((c) => c.status === 'Submitted').length, icon: '◷', color: '#fff3d7' },
    { label: 'In Progress', value: visible.filter((c) => c.status === 'In Progress').length, icon: '↻', color: '#e3efff' },
    { label: 'Resolved', value: visible.filter((c) => c.status === 'Resolved').length, icon: '✓', color: '#d9f8e9' },
  ]

  const recent = [...visible].slice(0, 5)

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>{user.role === 'Admin' ? 'Admin Dashboard' : 'Dashboard'}</h1>
          <p>
            Welcome, {user.name}! Here is the latest overview of campus complaints.
          </p>
        </div>
        <Link className="primary-btn" to="/submit">＋ New Complaint</Link>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-top">
              {stat.label}
              <span className="stat-icon" style={{ background: stat.color }}>
                {stat.icon}
              </span>
            </div>
            <strong className="stat-number">{stat.value}</strong>
            <span className="stat-note">Current complaint records</span>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Recent Complaints</h2>
            <p>Track the latest reported campus issues.</p>
          </div>
          <Link className="secondary-btn" to="/complaints">View all →</Link>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▤</div>
            <h3>No complaints yet</h3>
            <p>When you report an issue, it will appear here.</p>
            <Link className="primary-btn" to="/submit">Submit your first complaint</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Complaint</th>
                  <th>Category</th>
                  {user.role === 'Admin' && <th>Reported by</th>}
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={item.id}>
                    <td className="ticket-id">{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    {user.role === 'Admin' && <td>{item.createdBy}</td>}
                    <td><span className={`status-badge ${getStatusClass(item.status)}`}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="notice">
        <strong>Prototype note:</strong> Complaints are currently saved in this browser.
        Backend integration is required for shared data across users and devices.
      </div>
    </>
  )
}
