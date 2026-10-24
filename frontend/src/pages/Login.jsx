
import { useState } from 'react'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('existing')
  const [role, setRole] = useState('Student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    const accounts = JSON.parse(
      localStorage.getItem('campusCareAccounts') || '[]'
    )

    // Student registration
    if (mode === 'new') {
      if (role === 'Admin') {
        setMessage('Administrator accounts cannot be registered here.')
        return
      }

      if (!name.trim() || !email.trim() || !password) {
        setMessage('Please fill in all fields.')
        return
      }

      if (password.length < 6) {
        setMessage('Password must contain at least 6 characters.')
        return
      }

      const normalizedEmail = email.trim().toLowerCase()

      const existingAccount = accounts.find(
        (account) => account.email.toLowerCase() === normalizedEmail
      )

      if (existingAccount) {
        setMessage('An account with this email already exists.')
        return
      }

      const newAccount = {
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: 'Student',
      }

      localStorage.setItem(
        'campusCareAccounts',
        JSON.stringify([...accounts, newAccount])
      )

      setMode('existing')
      setRole('Student')
      setPassword('')
      setMessage('Account created! Please log in.')
      return
    }

    // Administrator login for project demonstration
    if (role === 'Admin') {
      const adminEmail = 'admin@campuscare.com'
      const adminPassword = 'Admin@123'

      if (
        email.trim().toLowerCase() !== adminEmail ||
        password !== adminPassword
      ) {
        setMessage('Invalid administrator email or password.')
        return
      }

      onLogin({
        name: 'CampusCare Administrator',
        email: adminEmail,
        role: 'Admin',
      })

      return
    }

    // Existing student login
    const account = accounts.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password &&
        item.role === 'Student'
    )

    if (!account) {
      setMessage('Invalid email or password. Please try again.')
      return
    }

    onLogin({
      name: account.name,
      email: account.email,
      role: 'Student',
    })
  }

  return (
    <div className="login-page">
      <div className="login-art">
        <div className="login-brand">
          <span className="login-brand-icon">✦</span>
          <span>CampusCare</span>
          <span className="login-brand-tag">SMART CAMPUS</span>
        </div>

        <div className="login-art-content">
          <h1>A better campus starts with being heard.</h1>
          <p>
            Share your concerns, track complaints and help make
            your campus a better place for everyone.
          </p>
        </div>
      </div>

      <div className="login-form-side">
        <form className="login-form" onSubmit={handleSubmit}>
          <p className="login-eyebrow">WELCOME TO CAMPUSCARE</p>

          <h2>
            {mode === 'existing'
              ? 'Welcome back'
              : 'Create your account'}
          </h2>

          <p className="login-subtitle">
            {mode === 'existing'
              ? 'Log in to continue to your campus workspace.'
              : 'Join CampusCare and make your voice heard.'}
          </p>

          <div className="login-tabs">
            <button
              type="button"
              className={
                mode === 'existing'
                  ? 'login-tab active'
                  : 'login-tab'
              }
              onClick={() => {
                setMode('existing')
                setMessage('')
              }}
            >
              Existing User
            </button>

            <button
              type="button"
              className={
                mode === 'new' ? 'login-tab active' : 'login-tab'
              }
              onClick={() => {
                setMode('new')
                setRole('Student')
                setMessage('')
              }}
            >
              New User
            </button>
          </div>

          <label>
            Login as
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value)
                setMessage('')
              }}
            >
              <option value="Student">Student</option>
              <option value="Admin">Administrator</option>
            </select>
          </label>

          {mode === 'new' && (
            <label>
              Full name
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              placeholder={
                role === 'Admin'
                  ? 'admin@campuscare.com'
                  : 'you@college.edu'
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder={
                mode === 'new'
                  ? 'At least 6 characters'
                  : 'Enter your password'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={mode === 'new' ? 6 : undefined}
              required
            />
          </label>

          {role === 'Admin' && mode === 'existing' && (
            <p className="demo-note">
              Administrator demo login selected.
            </p>
          )}

          {message && (
            <p className="login-message" role="status">
              {message}
            </p>
          )}

          <button type="submit" className="primary-btn">
            {mode === 'new'
              ? 'Create Account →'
              : role === 'Admin'
                ? 'Admin Login →'
                : 'Log In →'}
          </button>

          <p className="login-switch">
            {mode === 'existing'
              ? "Don't have an account? "
              : 'Already have an account? '}

            <button
              type="button"
              onClick={() => {
                setMode(
                  mode === 'existing' ? 'new' : 'existing'
                )
                setRole('Student')
                setMessage('')
              }}
            >
              {mode === 'existing' ? 'Sign up' : 'Log in'}
            </button>
          </p>

          <p className="demo-note">
            CampusCare · Smart Campus Grievance Portal
          </p>
        </form>
      </div>
    </div>
  )
}
