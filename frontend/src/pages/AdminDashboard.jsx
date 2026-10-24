
import { useMemo, useState } from 'react'

const STATUSES = ['Submitted', 'In Progress', 'Resolved']

const DEPARTMENTS = [
  'Maintenance',
  'IT Department',
  'Housekeeping',
  'Electrical',
  'Transport',
  'Administration',
]

const STATUS_COLORS = {
  Submitted: '#f59e0b',
  'In Progress': '#3b82f6',
  Resolved: '#10b981',
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#64748b'

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '5px 10px',
        borderRadius: '20px',
        background: `${color}18`,
        color,
        fontSize: '12px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {status || 'Submitted'}
    </span>
  )
}

function StatCard({ title, value, description }) {
  return (
    <div className="admin-stat-card">
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{description}</span>
    </div>
  )
}

export default function AdminDashboard({ complaints = [], onUpdate }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [message, setMessage] = useState('')

  const safeComplaints = Array.isArray(complaints) ? complaints : []

  const categories = useMemo(
    () => [...new Set(safeComplaints.map((item) => item.category).filter(Boolean))],
    [safeComplaints]
  )

  const priorities = useMemo(
    () => [...new Set(safeComplaints.map((item) => item.priority).filter(Boolean))],
    [safeComplaints]
  )

  const total = safeComplaints.length
  const pending = safeComplaints.filter(
    (item) => !item.status || item.status === 'Submitted'
  ).length
  const inProgress = safeComplaints.filter(
    (item) => item.status === 'In Progress'
  ).length
  const resolved = safeComplaints.filter(
    (item) => item.status === 'Resolved'
  ).length

  const resolutionRate = total
    ? Math.round((resolved / total) * 100)
    : 0

  const filteredComplaints = safeComplaints.filter((item) => {
    const searchText = search.trim().toLowerCase()

    const matchesSearch = [
      item.title,
      item.id,
      item.createdBy,
      item.description,
    ].some((value) =>
      String(value || '').toLowerCase().includes(searchText)
    )

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Submitted'
        ? !item.status || item.status === 'Submitted'
        : item.status === statusFilter)

    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter

    const matchesPriority =
      priorityFilter === 'All' || item.priority === priorityFilter

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesPriority
    )
  })

  function updateComplaint(item, changes) {
    if (typeof onUpdate !== 'function') {
      setMessage('Unable to update: update handler is unavailable.')
      return
    }

    try {
      const result = onUpdate(item.id, changes)

      if (result === false) {
        setMessage('Update failed. Please try again.')
        return
      }

      setMessage(`Complaint ${item.id} updated successfully.`)
    } catch {
      setMessage('Something went wrong while updating the complaint.')
    }
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('All')
    setCategoryFilter('All')
    setPriorityFilter('All')
  }

  return (
    <div className="stack admin-dashboard">
      <div className="admin-heading">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Manage campus complaints, assign departments, and track
            resolutions.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Complaints"
          value={total}
          description="All reported issues"
        />
        <StatCard
          title="Pending"
          value={pending}
          description="Awaiting initial action"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          description="Currently being handled"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          description={`${resolutionRate}% resolution rate`}
        />
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Manage Complaints</h2>
            <p>Search, filter, assign, and update reported issues.</p>
          </div>
        </div>

        <div className="toolbar admin-toolbar">
          <input
            className="input"
            type="search"
            placeholder="Search by title, ID, or reporter..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search complaints"
          />

          <select
            className="input"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="All">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            aria-label="Filter by priority"
          >
            <option value="All">All priorities</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        <p className="result-count" aria-live="polite">
          Showing {filteredComplaints.length} of {total} complaints
        </p>

        {message && (
          <p className="form-message" role="status">
            {message}
          </p>
        )}

        {filteredComplaints.length === 0 ? (
          <div className="empty-state">
            <h3>No complaints found</h3>
            <p>
              {total === 0
                ? 'New complaints will appear here when submitted.'
                : 'Try changing your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="manage-table">
              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Reporter</th>
                  <th>Priority</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredComplaints.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>
                      <strong>{item.title || 'Untitled complaint'}</strong>
                      <div className="cell-sub">
                        {item.id || 'No ticket ID'}
                        {item.category ? ` · ${item.category}` : ''}
                      </div>
                    </td>

                    <td>{item.createdBy || 'Unknown'}</td>

                    <td>
                      <span className="priority-text">
                        {item.priority || 'Normal'}
                      </span>
                    </td>

                    <td>
                      <select
                        className="input input-sm"
                        value={
                          DEPARTMENTS.includes(item.department)
                            ? item.department
                            : ''
                        }
                        onChange={(event) =>
                          updateComplaint(item, {
                            department: event.target.value,
                          })
                        }
                        aria-label={`Department for ${item.id || 'complaint'}`}
                      >
                        <option value="" disabled>
                          Unassigned
                        </option>
                        {DEPARTMENTS.map((department) => (
                          <option key={department} value={department}>
                            {department}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <StatusBadge status={item.status || 'Submitted'} />
                    </td>

                    <td>
                      <select
                        className="input input-sm"
                        value={STATUSES.includes(item.status) ? item.status : 'Submitted'}
                        onChange={(event) =>
                          updateComplaint(item, {
                            status: event.target.value,
                          })
                        }
                        aria-label={`Status for ${item.id || 'complaint'}`}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
