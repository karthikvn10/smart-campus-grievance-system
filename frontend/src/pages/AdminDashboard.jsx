
import { useMemo, useState } from 'react'
import './AdminDashboard.css'

const STATUSES = ['Submitted', 'In Progress', 'Resolved']

const DEPARTMENTS = [
  'Maintenance',
  'IT Department',
  'Housekeeping',
  'Electrical',
  'Transport',
  'Administration',
]

function StatusBadge({ status }) {
  const currentStatus = status || 'Submitted'

  const statusClass = currentStatus
    .toLowerCase()
    .replace(/\s+/g, '-')

  return (
    <span className={`admin-status status-${statusClass}`}>
      <span className="status-dot" />
      {currentStatus}
    </span>
  )
}

function StatCard({ title, value, description, icon, color }) {
  return (
    <article className={`admin-stat-card ${color}`}>
      <div className="admin-stat-top">
        <span className="admin-stat-title">{title}</span>
        <span className="admin-stat-icon">{icon}</span>
      </div>

      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-description">{description}</div>
    </article>
  )
}

export default function AdminDashboard({
  complaints = [],
  onUpdate,
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [message, setMessage] = useState('')

  const safeComplaints = Array.isArray(complaints)
    ? complaints
    : []

  const categories = useMemo(
    () => [
      ...new Set(
        safeComplaints
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ],
    [safeComplaints]
  )

  const priorities = useMemo(
    () => [
      ...new Set(
        safeComplaints
          .map((item) => item.priority)
          .filter(Boolean)
      ),
    ],
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
      categoryFilter === 'All' ||
      item.category === categoryFilter

    const matchesPriority =
      priorityFilter === 'All' ||
      item.priority === priorityFilter

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesPriority
    )
  })

  function updateComplaint(item, changes) {
    if (typeof onUpdate !== 'function') {
      setMessage('Unable to update. Please try again.')
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
      setMessage('Something went wrong while updating.')
    }
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('All')
    setCategoryFilter('All')
    setPriorityFilter('All')
    setMessage('')
  }

  return (
    <div className="admin-dashboard-gold">

      <header className="admin-welcome">
        <div className="admin-welcome-content">
          <span className="admin-eyebrow">
            CAMPUSCARE ADMINISTRATION
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Manage campus complaints, assign departments,
            and keep every issue moving towards resolution.
          </p>
        </div>

        <div className="admin-welcome-decoration" aria-hidden="true">
          ✦
        </div>
      </header>

      <section className="admin-section-heading">
        <div>
          <h2>Overview</h2>
          <p>Here is the latest complaint activity.</p>
        </div>

        <span className="admin-total-pill">
          {total} {total === 1 ? 'Complaint' : 'Complaints'}
        </span>
      </section>

      <section className="admin-stats-grid">
        <StatCard
          title="Total Complaints"
          value={total}
          description="All reported issues"
          icon="▤"
          color="stat-gold"
        />

        <StatCard
          title="Pending"
          value={pending}
          description="Awaiting initial action"
          icon="◷"
          color="stat-amber"
        />

        <StatCard
          title="In Progress"
          value={inProgress}
          description="Currently being handled"
          icon="↻"
          color="stat-blue"
        />

        <StatCard
          title="Resolved"
          value={resolved}
          description={`${resolutionRate}% resolution rate`}
          icon="✓"
          color="stat-green"
        />
      </section>

      <section className="admin-manage-panel">

        <div className="admin-panel-heading">
          <div>
            <span className="admin-panel-kicker">
              COMPLAINT MANAGEMENT
            </span>

            <h2>Manage Complaints</h2>

            <p>
              Search, filter, assign departments, and update
              reported campus issues.
            </p>
          </div>

          <div className="admin-panel-icon" aria-hidden="true">
            ⚙
          </div>
        </div>

        <div className="admin-filters">

          <div className="admin-search">
            <span aria-hidden="true">⌕</span>

            <input
              type="search"
              placeholder="Search title, ticket ID, reporter..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search complaints"
            />
          </div>

          <select
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
            className="admin-clear-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>

        <div className="admin-results-bar">
          <span>
            Showing <strong>{filteredComplaints.length}</strong>
            {' '}of <strong>{total}</strong> complaints
          </span>

          {(search || statusFilter !== 'All' ||
            categoryFilter !== 'All' ||
            priorityFilter !== 'All') && (
            <button
              type="button"
              onClick={clearFilters}
              className="admin-reset-link"
            >
              Reset filters
            </button>
          )}
        </div>

        {message && (
          <div className="admin-feedback" role="status">
            <span>✓</span>
            {message}
          </div>
        )}

        {filteredComplaints.length === 0 ? (

          <div className="admin-empty-state">
            <div className="admin-empty-icon">▤</div>
            <h3>No complaints found</h3>

            <p>
              {total === 0
                ? 'New complaints will appear here when students submit them.'
                : 'Try changing your search or filters.'}
            </p>

            {total > 0 && (
              <button
                type="button"
                className="admin-gold-button"
                onClick={clearFilters}
              >
                Clear all filters
              </button>
            )}
          </div>

        ) : (

          <div className="admin-table-scroll">
            <table className="admin-gold-table">

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

                    <td className="admin-complaint-cell">
                      <strong>
                        {item.title || 'Untitled complaint'}
                      </strong>

                      <span>
                        {item.id || 'No ticket ID'}
                        {item.category
                          ? ` · ${item.category}`
                          : ''}
                      </span>
                    </td>

                    <td>
                      <span className="admin-reporter">
                        <span className="admin-avatar">
                          {(item.createdBy || 'U')
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        {item.createdBy || 'Unknown'}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-priority priority-${String(
                          item.priority || 'Normal'
                        ).toLowerCase()}`}
                      >
                        {item.priority || 'Normal'}
                      </span>
                    </td>

                    <td>
                      <select
                        className="admin-table-select"
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
                      <StatusBadge status={item.status} />
                    </td>

                    <td>
                      <select
                        className="admin-table-select"
                        value={
                          STATUSES.includes(item.status)
                            ? item.status
                            : 'Submitted'
                        }
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

        <footer className="admin-panel-footer">
          <span>CampusCare · Complaint Management System</span>
          <span>Made for a better campus ✦</span>
        </footer>

      </section>
    </div>
  )
}
