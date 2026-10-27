import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

const links = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/skills', label: 'Skills' },
  { path: '/projects', label: 'Projects' },
  { path: '/contact', label: 'Contact' },
]

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navRef = useRef(null)
  const linksRef = useRef(null)
  const indicatorRef = useRef(null)
  const paletteInputRef = useRef(null)

  useEffect(() => {
    const activeLink = linksRef.current?.querySelector('[aria-current="page"]')
    const list = linksRef.current
    const indicator = indicatorRef.current
    if (!activeLink || !list || !indicator) return undefined

    const measureIndicator = () => {
      const linkRect = activeLink.getBoundingClientRect()
      const listRect = list.getBoundingClientRect()
      indicator.style.width = `${linkRect.width}px`
      indicator.style.transform = `translateX(${linkRect.left - listRect.left}px)`
    }

    measureIndicator()
    window.addEventListener('resize', measureIndicator)
    return () => window.removeEventListener('resize', measureIndicator)
  }, [location.pathname])

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setQuery('')
        setPaletteOpen((open) => !open)
        setMenuOpen(false)
      } else if (event.key === 'Escape') {
        setPaletteOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    function closeOutside(event) {
      if (!navRef.current?.contains(event.target)) setMenuOpen(false)
    }
    window.addEventListener('pointerdown', closeOutside)
    return () => window.removeEventListener('pointerdown', closeOutside)
  }, [menuOpen])

  useEffect(() => {
    if (paletteOpen) {
      window.requestAnimationFrame(() => paletteInputRef.current?.focus())
    }
  }, [paletteOpen])

  const commands = links.filter((link) =>
    link.label.toLowerCase().includes(query.trim().toLowerCase()),
  )

  function runCommand(path) {
    setPaletteOpen(false)
    setQuery('')
    navigate(path)
  }

  return (
    <>
      <header className="navbar" ref={navRef}>
        <Link className="navbar-logo" to="/" aria-label="NeoN home">
          <span className="navbar-logo-mark" aria-hidden="true">
            <span className="navbar-logo-placeholder" />
          </span>
          <span>NEON<span className="navbar-logo-dot">.</span></span>
        </Link>

        <div className="navbar-status" aria-label="All systems online">
          <span className="status-led" aria-hidden="true" />
          <span className="status-copy">ALL SYSTEMS ONLINE</span>
          <span className="status-divider" aria-hidden="true" />
          <span className="status-version">PORTFOLIO / 01</span>
        </div>

        <button
          className="navbar-command-trigger"
          type="button"
          onClick={() => {
            setQuery('')
            setPaletteOpen(true)
          }}
          aria-label="Open command palette"
        >
          <span aria-hidden="true">⌕</span>
          <span className="command-trigger-label">Quick jump</span>
          <kbd>Ctrl K</kbd>
        </button>

        <button
          className={`navbar-menu-toggle ${menuOpen ? 'is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav
          className={`navbar-navigation ${menuOpen ? 'is-open' : ''}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          <ul className="navbar-links" ref={linksRef}>
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? 'active' : ''}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <span className="navbar-active-indicator" ref={indicatorRef} aria-hidden="true" />
        </nav>
      </header>

      {paletteOpen && (
        <div
          className="command-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPaletteOpen(false)
          }}
        >
          <section
            className="command-palette"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-title"
          >
            <h2 className="command-title" id="command-title">Navigate system</h2>
            <label className="command-search">
              <span aria-hidden="true">⌕</span>
              <input
                ref={paletteInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages..."
                aria-label="Search pages"
              />
              <kbd>ESC</kbd>
            </label>
            <div className="command-results" role="list">
              {commands.length ? commands.map((command) => (
                <button
                  className="command-result"
                  type="button"
                  role="listitem"
                  key={command.path}
                  onClick={() => runCommand(command.path)}
                >
                  <span className="command-result-icon" aria-hidden="true">↗</span>
                  <span>{command.label}</span>
                  <span className="command-result-path">{command.path}</span>
                </button>
              )) : (
                <p className="command-empty">No matching page.</p>
              )}
            </div>
            <p className="command-hint">QUICK NAVIGATION <span>·</span> ESC TO CLOSE</p>
          </section>
        </div>
      )}
    </>
  )
}

export default Navbar
