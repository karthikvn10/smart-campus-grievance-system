import { useState } from 'react'

const initialMessages = [
  {
    from: 'bot',
    text: "Hi! 👋 Welcome to CampusCare. I'm your campus help assistant. What can I help you with today?",
  },
]

const suggestions = [
  'How do I submit a complaint?',
  'How can I track my complaint?',
  'What does Pending mean?',
  'How do I use the dashboard?',
]

function getReply(message) {
  const text = message.toLowerCase()

  if (
    text.includes('submit') ||
    text.includes('create complaint') ||
    text.includes('raise complaint') ||
    text.includes('report')
  ) {
    return 'To submit a complaint:\n\n1. Open Submit Complaint from the sidebar.\n2. Enter a clear title and describe your problem.\n3. Choose the appropriate category.\n4. Add any required details.\n5. Click Submit to register your complaint.\n\nYou can check its progress later under My Complaints.'
  }

  if (
    text.includes('track') ||
    text.includes('my complaint') ||
    text.includes('find complaint')
  ) {
    return 'You can track your complaints from the My Complaints section in the sidebar. Open it to see the complaints associated with your account and check their current status.'
  }

  if (
    text.includes('pending') ||
    text.includes('in progress') ||
    text.includes('resolved') ||
    text.includes('status')
  ) {
    return 'Here is what the complaint statuses usually mean:\n\n🟡 Pending: Your complaint is waiting for review.\n\n🔵 In Progress: The responsible team is working on it.\n\n🟢 Resolved: The complaint has been marked as addressed.\n\nCheck My Complaints for the status of your own complaint.'
  }

  if (
    text.includes('dashboard') ||
    text.includes('navigate') ||
    text.includes('where')
  ) {
    return 'Here is a quick guide to your dashboard:\n\n• Dashboard: View your overview and complaint statistics.\n• Submit Complaint: Report a new campus issue.\n• My Complaints: Review your submitted complaints.\n• Manage Complaints: Administrators can use this section to manage complaints.'
  }

  if (
    text.includes('login') ||
    text.includes('sign in') ||
    text.includes('account')
  ) {
    return 'If you have trouble accessing CampusCare, check that you have entered the required login details and selected the correct role. If the problem continues, contact your campus administrator.'
  }

  if (
    text.includes('hello') ||
    text.includes('hi ') ||
    text === 'hi' ||
    text.includes('hey')
  ) {
    return 'Hello! 😊 I can help you submit complaints, understand complaint statuses, track issues, and use your dashboard. Type a question or choose one of the suggested topics.'
  }

  if (
    text.includes('thank')
  ) {
    return "You're welcome! 😊 I'm here whenever you need help using CampusCare."
  }

  return "I'm sorry, I don't have a specific answer for that question yet. I can help with submitting complaints, tracking complaints, understanding statuses, and navigating the dashboard. Try asking about one of those topics."
}

export default function HelpChatbot({ onClose }) {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')

  function sendMessage(message) {
    const question = message.trim()
    if (!question) return

    const reply = getReply(question)

    setMessages((previous) => [
      ...previous,
      { from: 'user', text: question },
      { from: 'bot', text: reply },
    ])

    setInput('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    sendMessage(input)
  }

  return (
    <section className="chatbot-window" aria-label="CampusCare help chatbot">
      <header className="chatbot-header">
        <div className="chatbot-avatar">✦</div>

        <div className="chatbot-heading">
          <strong>CampusCare Assistant</strong>
          <span>
            <span className="chatbot-online-dot" />
            Online · Help and guidance
          </span>
        </div>

        <button
          type="button"
          className="chatbot-close"
          onClick={onClose}
          aria-label="Close chatbot"
        >
          ×
        </button>
      </header>

      <div className="chatbot-messages" aria-live="polite">
        <div className="chatbot-date">CAMPUSCARE SUPPORT</div>

        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.from === 'user' ? 'chat-user' : 'chat-bot'}`}
          >
            {message.text}
          </div>
        ))}

        {messages.length === 1 && (
          <div className="chatbot-suggestions">
            <span>QUICK QUESTIONS</span>

            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
              >
                {suggestion}
                <span>→</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <form className="chatbot-input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask me anything..."
          aria-label="Type your question"
        />

        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send message"
        >
          ↑
        </button>
      </form>

      <footer className="chatbot-footer">
        CampusCare · Here to help you
      </footer>
    </section>
  )
}