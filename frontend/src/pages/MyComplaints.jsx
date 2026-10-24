
import { useState } from 'react'

function statusClass(status) {
  return `status-${status.toLowerCase().replace(/\s+/g, '-')}`
}

export default function MyComplaints({ complaints, user }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [feedbackId, setFeedbackId] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState('5')

  const visible = complaints.filter((item) => {
    const isOwner = item.createdBy === user.name
    const matchesUser = user.role === 'Admin' || isOwner
    const matchesStatus = filter === 'All' || item.status === filter
    const term = search.toLowerCase()
    const matchesSearch =
      item.title.toLowerCase().includes(term) ||
      item.id.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)

    return matchesUser && matchesStatus && matchesSearch
  })

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>{user.role === 'Admin' ? 'All Complaints' : 'My Complaints'}</h1>
          <p>Search tickets and follow their latest status.</p>
        </div>
      </div>

      <section className="panel">
        <div className="toolbar">
          <input
            className="search-input"
            placeholder="Search by title, ticket ID, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Submitted</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Rejected</option>
          </select>
        </div>

        {visible.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⌕</div>
            <h3>No matching complaints</h3>
            <p>Try a different search or status filter.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td className="ticket-id">{item.id}</td>
                    <td>
                      <strong>{item.title}</strong>
                      <div className="feedback-text">{item.location}</div>
                    </td>
                    <td>{item.category}</td>
                    <td>{item.department}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><span className={`status-badge ${statusClass(item.status)}`}>{item.status}</span></td>
                    <td>
                      {item.status === 'Resolved' && user.role !== 'Admin'
                        ? <button className="secondary-btn" onClick={() => { setFeedbackId(item.id); setFeedback(item.feedback || ''); setRating(String(item.rating || 5)) }}>Rate</button>
                        : item.feedback
                          ? 'Submitted'
                          : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {feedbackId && (
          <div className="feedback-box">
            <h3>Share your feedback</h3>
            <p className="feedback-text">Ticket: {feedbackId}</p>
            <label htmlFor="rating">Rating</label>
            <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Very poor</option>
            </select>
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Tell us about your experience..." rows="3" />
            <div className="form-actions">
              <button className="secondary-btn" onClick={() => setFeedbackId(null)}>Cancel</button>
              <button
                className="primary-btn"
                onClick={() => {
                  const saved = JSON.parse(localStorage.getItem('campusComplaints') || '[]')
                  const updated = saved.map((item) =>
                    item.id === feedbackId
                      ? { ...item, feedback, rating: Number(rating) }
                      : item
                  )
                  localStorage.setItem('campusComplaints', JSON.stringify(updated))
                  window.location.reload()
                }}
              >
                Save Feedback
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
