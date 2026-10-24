
function statusClass(status) {
  return `status-${status.toLowerCase().replace(/\s+/g, '-')}`
}

const departments = [
  'Facilities Department',
  'IT Department',
  'Housekeeping',
  'Transport Department',
  'Electrical Department',
  'Administration',
]

export default function AdminDashboard({ complaints, onUpdate }) {
  const resolved = complaints.filter((c) => c.status === 'Resolved').length
  const pending = complaints.filter((c) => c.status === 'Submitted').length
  const progress = complaints.filter((c) => c.status === 'In Progress').length

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Complaint Management</h1>
          <p>Review reports, assign departments, and update resolution status.</p>
        </div>
      </div>

      <div className="stats-grid">
        {[
          ['Total Reports', complaints.length],
          ['Awaiting Review', pending],
          ['In Progress', progress],
          ['Resolved', resolved],
        ].map(([label, value]) => (
          <div className="stat-card" key={label}>
            <div className="stat-top">{label}</div>
            <strong className="stat-number">{value}</strong>
            <span className="stat-note">All campus reports</span>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Manage tickets</h2>
            <p>Changes are saved in this browser's prototype data.</p>
          </div>
        </div>

        {complaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h3>No tickets to manage</h3>
            <p>Submitted complaints will appear here.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Issue</th>
                  <th>Reported by</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Update status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((item) => (
                  <tr key={item.id}>
                    <td className="ticket-id">{item.id}</td>
                    <td>
                      <strong>{item.title}</strong>
                      <div className="feedback-text">{item.category} · {item.priority} priority</div>
                    </td>
                    <td>{item.createdBy}</td>
                    <td>
                      <select
                        className="filter-select"
                        value={item.department}
                        onChange={(e) => onUpdate(item.id, { department: e.target.value })}
                      >
                        {departments.map((department) => <option key={department}>{department}</option>)}
                      </select>
                    </td>
                    <td><span className={`status-badge ${statusClass(item.status)}`}>{item.status}</span></td>
                    <td>
                      <select
                        className="filter-select"
                        value={item.status}
                        onChange={(e) => onUpdate(item.id, { status: e.target.value })}
                      >
                        <option>Submitted</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                        <option>Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Resolution overview</h2>
            <p>Summary based on currently saved complaints.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div>
            <strong className="stat-number">
              {complaints.length ? Math.round(resolved / complaints.length * 100) : 0}%
            </strong>
            <span className="stat-note">Resolution rate</span>
          </div>
          <div>
            <strong className="stat-number">{pending}</strong>
            <span className="stat-note">Need initial review</span>
          </div>
          <div>
            <strong className="stat-number">{progress}</strong>
            <span className="stat-note">Being addressed</span>
          </div>
          <div>
            <strong className="stat-number">{resolved}</strong>
            <span className="stat-note">Completed tickets</span>
          </div>
        </div>
      </section>
    </>
  )
}
