
import { Navigate, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SubmitComplaint from './pages/SubmitComplaint'
import MyComplaints from './pages/MyComplaints'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import './App.css'

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('campusUser')) || null
    } catch {
      return null
    }
  })

  const [complaints, setComplaints] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('campusComplaints')) || []
    } catch {
      return []
    }
  })

  function login(userData) {
    localStorage.setItem('campusUser', JSON.stringify(userData))
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('campusUser')
    setUser(null)
  }

  function addComplaint(complaint) {
    const updated = [complaint, ...complaints]
    setComplaints(updated)
    localStorage.setItem('campusComplaints', JSON.stringify(updated))
  }

  function updateComplaint(id, changes) {
    const updated = complaints.map((item) =>
      item.id === id ? { ...item, ...changes } : item
    )
    setComplaints(updated)
    localStorage.setItem('campusComplaints', JSON.stringify(updated))
  }

  if (!user) {
    return <Login onLogin={login} />
  }

  return (
    <div className="app-shell">
      <Sidebar user={user} onLogout={logout} />

      <div className="main-area">
        <Navbar user={user} />

        <main className="page-content">
          <Routes>
            <Route
              path="/"
              element={<Dashboard user={user} complaints={complaints} />}
            />
            <Route
              path="/submit"
              element={<SubmitComplaint onSubmit={addComplaint} user={user} />}
            />
            <Route
              path="/complaints"
              element={<MyComplaints complaints={complaints} user={user} />}
            />
            <Route
              path="/admin"
              element={
                user.role === 'Admin' ? (
                  <AdminDashboard
                    complaints={complaints}
                    onUpdate={updateComplaint}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
