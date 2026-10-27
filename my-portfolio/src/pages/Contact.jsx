import { useRef, useState } from 'react'
import './Contact.css'

const initialForm = { name: '', email: '', message: '' }

function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const timerRef = useRef(null)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setStatus('idle')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    const name = form.name.trim()
    const email = form.email.trim()
    const message = form.message.trim()

    if (name.length < 2 || name.length > 80) nextErrors.name = 'Name must be 2–80 characters.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (message.length < 10 || message.length > 2000) {
      nextErrors.message = 'Message must be 10–2,000 characters.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setStatus('preparing')
    const subject = encodeURIComponent(`Portfolio message from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    const mailto = `mailto:geraldesplana42@gmail.com?subject=${subject}&body=${body}`

    timerRef.current = window.setTimeout(() => {
      window.location.href = mailto
      setStatus('ready')
    }, 250)
  }

  function resetForm() {
    window.clearTimeout(timerRef.current)
    setForm(initialForm)
    setErrors({})
    setStatus('idle')
  }

  return (
    <main className="contact">
      <section className="contact-layout" aria-labelledby="contact-title">
        <div className="contact-copy">
          <p className="contact-kicker"><span /> CONNECTION PORT / OPEN</p>
          <h1 className="contact-title" id="contact-title">Let’s work<br /><span>together.</span></h1>
          <p className="contact-sub">
            Have a project, opportunity, or just want to connect? Drop me a message
            and I’ll get back to you.
          </p>
          <div className="contact-direct">
            <span className="direct-label">DIRECT LINE</span>
            <a href="mailto:geraldesplana42@gmail.com">
              <span className="direct-led" /> geraldesplana42@gmail.com
            </a>
          </div>
          <div className="contact-socials" aria-label="Social links">
            <a href="https://github.com/NeoN1015" target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://www.linkedin.com/in/gerald-esplana-8023943b8/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <section className="contact-terminal" aria-label="Send a message">
          <div className="terminal-header">
            <div className="terminal-window-dots" aria-hidden="true"><i /><i /><i /></div>
            <span>MESSAGE_TERMINAL</span>
            <span className="terminal-status"><i /> READY</span>
          </div>

          {status === 'ready' ? (
            <div className="contact-status" role="status">
              <span className="contact-status-icon" aria-hidden="true">✓</span>
              <p className="terminal-prompt">&gt; email_draft_prepared</p>
              <h2>Your email app should open with your message ready.</h2>
              <p>If it didn’t open, use the direct email link on this page to reach me.</p>
              <button className="contact-submit contact-submit--secondary" type="button" onClick={resetForm}>
                Write another message <span aria-hidden="true">↺</span>
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <p className="terminal-prompt">&gt; compose --to=gerald</p>
              <label className="contact-field">
                <span><i>01</i> NAME</span>
                <input
                  autoComplete="name"
                  maxLength={80}
                  name="name"
                  placeholder="How should I address you?"
                  value={form.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                />
                {errors.name && <small className="contact-error" id="contact-name-error">{errors.name}</small>}
              </label>
              <label className="contact-field">
                <span><i>02</i> EMAIL</span>
                <input
                  autoComplete="email"
                  maxLength={120}
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                />
                {errors.email && <small className="contact-error" id="contact-email-error">{errors.email}</small>}
              </label>
              <label className="contact-field">
                <span><i>03</i> MESSAGE</span>
                <textarea
                  maxLength={2000}
                  name="message"
                  placeholder="Tell me a little about it..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-count'}
                />
                <small
                  className={errors.message ? 'contact-error' : 'contact-field-meta'}
                  id={errors.message ? 'contact-message-error' : 'contact-message-count'}
                  aria-live="polite"
                >
                  {errors.message || `${form.message.length} / 2,000`}
                </small>
              </label>
              <button className="contact-submit" type="submit" disabled={status === 'preparing'}>
                {status === 'preparing' ? 'Preparing email…' : 'Prepare email'}
                <span aria-hidden="true">{status === 'preparing' ? '…' : '↗'}</span>
              </button>
              <p className="contact-form-note">
                This form opens your email app to send the message; it is not sent by this website.
              </p>
            </form>
          )}
        </section>
      </section>
      <footer className="contact-footer">
        <span><i /> STATUS / AVAILABLE FOR A CONVERSATION</span>
        <span>REPLY CHANNEL / EMAIL</span>
      </footer>
    </main>
  )
}

export default Contact
