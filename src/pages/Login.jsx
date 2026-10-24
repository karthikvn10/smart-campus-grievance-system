
import { useState } from 'react'

export default function Login({ onLogin }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('Student')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }

    onLogin({
      name: name.trim(),
      role,
      email: `${name.trim().toLowerCase().replace(/\s+/g, '.')}@campus.demo`,
    })
  }

  return (
    <div className="login-page">
      <section className="login-art">
        <div className="login-brand">✦ CampusCare</div>
        <h1>A better campus starts with being heard.</h1>
        <p>
          One simple platform to report campus issues, follow their progress,
          and help make your campus a better place for everyone.
        </p>
        <div className="login-features">
          ✓ &nbsp; Easy complaint submission<br />
          ✓ &nbsp; Transparent status tracking<br />
          ✓ &nbsp; Better campus services
        </div>
      </section>

      <section className="login-form-side">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p>Enter your details to access the campus grievance portal.</p>

          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Login as</label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="Student">Student / Staff</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="primary-btn" type="submit">
            Enter CampusCare →
          </button>

          <div className="demo-note">
            <strong>Prototype access</strong><br />
            This is a frontend demonstration. No password or real account
            verification is used yet.
          </div>
        </form>
      </section>
    </div>
  )
}
