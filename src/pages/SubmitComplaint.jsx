
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const categories = ['Infrastructure', 'Wi-Fi / Internet', 'Cleanliness', 'Transport', 'Electrical', 'Water Supply', 'Other']

export default function SubmitComplaint({ onSubmit, user }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Infrastructure')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [error, setError] = useState('')

  function handleImage(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('Please choose an image smaller than 2 MB.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result || ''))
    reader.readAsDataURL(file)
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim() || !location.trim() || !description.trim()) {
      setError('Please complete all required fields.')
      return
    }

    const complaint = {
      id: `CMP-${Date.now().toString().slice(-8)}`,
      title: title.trim(),
      category,
      location: location.trim(),
      description: description.trim(),
      image,
      priority,
      status: 'Submitted',
      department: category === 'Wi-Fi / Internet'
        ? 'IT Department'
        : category === 'Cleanliness'
          ? 'Housekeeping'
          : category === 'Transport'
            ? 'Transport Department'
            : 'Facilities Department',
      createdBy: user.name,
      createdAt: new Date().toISOString(),
      feedback: '',
      rating: 0,
    }

    try {
      onSubmit(complaint)
      navigate('/complaints')
    } catch {
      setError('Could not save the complaint. Try removing the attached image.')
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Submit a Complaint</h1>
          <p>Tell us about the issue so the right campus team can address it.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="panel-header">
          <div>
            <h2>Complaint Details</h2>
            <p>Fields marked with * are required.</p>
          </div>
          <span className="status-badge status-submitted">New Ticket</span>
        </div>

        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="title">Complaint title *</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wi-Fi not working in the library"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="location">Location *</label>
            <input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Block B, 2nd floor"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Describe the issue *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what happened and when you noticed it..."
              maxLength={2000}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="image">Attach an image (optional, max 2 MB)</label>
            <input id="image" type="file" accept="image/*" onChange={handleImage} />
            {image && <img src={image} alt="Complaint preview" style={{ maxWidth: 220, maxHeight: 160, objectFit: 'cover', borderRadius: 10 }} />}
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button className="secondary-btn" type="button" onClick={() => navigate('/')}>Cancel</button>
          <button className="primary-btn" type="submit">Submit Complaint →</button>
        </div>
      </form>
    </>
  )
}
