
export default function Navbar({ user }) {
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <header className="topbar">
      <div>
        <h2>Campus Services</h2>
        <p>Home / {user.role === 'Admin' ? 'Administration' : 'Student Portal'}</p>
      </div>

      <div className="topbar-right">
        <div className="today-date">▦ &nbsp; {today}</div>
        <div className="user-chip">
          <div className="avatar">
            {(user.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
