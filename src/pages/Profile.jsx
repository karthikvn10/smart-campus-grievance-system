
export default function Profile({ user }) {
  return (
    <div className="page-container">
      <h1>My Profile</h1>
      <p>View your account information.</p>

      <div className="profile-card">
        <div className="profile-avatar">
          {(user?.name || 'U').charAt(0).toUpperCase()}
        </div>

        <h2>{user?.name || 'User'}</h2>
        <p>Role: {user?.role || 'Student'}</p>
        <p>Email: {user?.email || 'Not provided'}</p>
      </div>
    </div>
  )
}
