
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
      {/* LEFT SIDE — PREMIUM HERO */}
      <section className="login-art">
        <div className="login-glow login-glow-one" />
        <div className="login-glow login-glow-two" />

        <div className="login-brand">
          <span className="login-brand-icon">✦</span>
          <span>CampusCare</span>
          <span className="login-brand-tag">SMART CAMPUS</span>
        </div>

        <div className="login-hero-content">
          <div className="login-eyebrow">
            <span className="login-eyebrow-dot" />
            YOUR VOICE. YOUR CAMPUS.
          </div>

          <h1>
            Small voices.
            <br />
            <span>Meaningful change.</span>
          </h1>

          <p className="login-hero-description">
            A better campus begins when someone speaks up.
            Share concerns, track every update, and help create
            a place where everyone belongs.
          </p>

          <div className="login-features">
            <div className="login-feature">
              <span className="login-feature-icon">↗</span>
              <div>
                <strong>Speak up with ease</strong>
                <small>
                  Report campus concerns in a few simple steps
                </small>
              </div>
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">◎</span>
              <div>
                <strong>Know what’s happening</strong>
                <small>
                  Follow your complaint from start to finish
                </small>
              </div>
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">✳</span>
              <div>
                <strong>Make change together</strong>
                <small>
                  Help build a safer, better campus for everyone
                </small>
              </div>
            </div>
          </div>

          <div className="login-art-footer">
            <span className="login-footer-line" />
            A campus that listens is a campus that grows.
          </div>
        </div>
      </section>

      {/* RIGHT SIDE — LOGIN FORM */}
      <section className="login-form-side">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-heading">
            <span className="login-form-kicker">WELCOME TO CAMPUSCARE</span>
            <h2>Welcome back</h2>
            <p>
              Enter your details to access the campus grievance portal.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (error) setError('')
              }}
              placeholder="Enter your full name"
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

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button className="primary-btn" type="submit">
            Enter CampusCare <span aria-hidden="true">→</span>
          </button>

          <div className="demo-note">
            <strong>
              <span aria-hidden="true">✦ </span>
              Prototype access
            </strong>
            <br />
            This is a frontend demonstration. No password or real account
            verification is used yet.
          </div>

          <div className="login-security-note">
            Designed for a campus where every voice matters.
          </div>
        </form>
      </section>
    </div>
  )
}
