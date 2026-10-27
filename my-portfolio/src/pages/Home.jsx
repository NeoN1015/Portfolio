import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const buildLines = ['I build systems.', 'I build prototypes.']

const featuredProjects = [
  { num: '01', name: 'PsycheScan', type: 'Research / AI' },
  { num: '02', name: 'SmartPOS', type: 'Web Development' },
  { num: '03', name: 'ProtectTag', type: 'Software / App' },
  { num: '04', name: 'Hand-Gesture Rover', type: 'Hardware / Robotics' },
  { num: '05', name: 'Smart Irrigation System', type: 'Hardware / Electronics' },
  { num: '06', name: 'Contactless Hand Sanitizer', type: 'Hardware / Embedded' },
]

function RevealText({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (!('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'revealed' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}s` }}
    >
      {children}
    </div>
  )
}

function Home() {
  const [lineIndex, setLineIndex] = useState(0)
  const [lineVisible, setLineVisible] = useState(true)
  const [easterEgg, setEasterEgg] = useState(false)
  const canvasRef = useRef(null)
  const typedKeysRef = useRef('')

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLineVisible(false)
      window.setTimeout(() => {
        setLineIndex((current) => (current + 1) % buildLines.length)
        setLineVisible(true)
      }, 180)
    }, 2800)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    function detectEasterEgg(event) {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.key.length !== 1 ||
        ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      ) return

      typedKeysRef.current = `${typedKeysRef.current}${event.key.toLowerCase()}`.slice(-12)
      if (typedKeysRef.current.includes('sudo hire me')) {
        typedKeysRef.current = ''
        setEasterEgg(true)
        window.setTimeout(() => setEasterEgg(false), 5000)
      }
    }
    window.addEventListener('keydown', detectEasterEgg)
    return () => window.removeEventListener('keydown', detectEasterEgg)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent')
      .trim() || '#70f0d0'
    const particles = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.4 + 0.4,
      dx: (Math.random() - 0.5) * 0.00012,
      dy: (Math.random() - 0.5) * 0.00012,
      opacity: Math.random() * 0.38 + 0.14,
    }))
    let animationFrame = 0

    function resizeCanvas() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * pixelRatio)
      canvas.height = Math.round(window.innerHeight * pixelRatio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      if (reducedMotion) draw()
    }

    function draw() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      particles.forEach((particle) => {
        particle.x = (particle.x + particle.dx + 1) % 1
        particle.y = (particle.y + particle.dy + 1) % 1
        context.beginPath()
        context.arc(
          particle.x * window.innerWidth,
          particle.y * window.innerHeight,
          particle.radius,
          0,
          Math.PI * 2,
        )
        context.fillStyle = accent
        context.globalAlpha = particle.opacity
        context.fill()
      })
      context.globalAlpha = 1
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    if (!reducedMotion) draw()
    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <main className="home">
      <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />

      <section className="hero-section" aria-labelledby="hero-name">
        <div className="hero-copy">
          <div className="hero-label">
            <span className="hero-label-mark" aria-hidden="true">01</span>
            <span>Computer engineering · software × hardware</span>
          </div>
          <h1 className="hero-name" id="hero-name">
            Gerald C.<br />
            <span>Esplana</span>
          </h1>
          <p className="hero-role">Computer Engineering Student <i /> Developer &amp; Maker</p>
          <p className={`hero-build-line ${lineVisible ? 'is-visible' : ''}`} aria-live="polite">
            <span className="build-prompt" aria-hidden="true">&gt;_</span>
            {buildLines[lineIndex]}
            <span className="build-cursor" aria-hidden="true" />
          </p>
          <p className="hero-desc">
            I build practical systems across software and hardware—from full-stack tools
            to embedded prototypes—turning ideas into real, working solutions.
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="hero-button hero-button--primary">
              Explore my work <span aria-hidden="true">↘</span>
            </Link>
            <Link to="/contact" className="hero-button hero-button--secondary">
              Get in touch <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="hero-readout" aria-label="Focus areas">
            <span><i className="readout-led readout-led--software" /> SOFTWARE</span>
            <span><i className="readout-led readout-led--hardware" /> HARDWARE / IOT</span>
            <span className="readout-code">SYS.01 — READY</span>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="visual-orbit visual-orbit--outer" />
          <div className="visual-orbit visual-orbit--inner" />
          <div className="visual-crosshair visual-crosshair--top" />
          <div className="visual-crosshair visual-crosshair--bottom" />
          <div className="visual-core" aria-hidden="true">
            <span className="visual-core-ring" />
            <span className="visual-core-dot" />
          </div>
        </div>

        <a className="hero-scroll" href="#featured-work">
          <span className="scroll-line" aria-hidden="true" />
          <span>SCROLL TO EXPLORE</span>
        </a>
        <span className="hero-index" aria-hidden="true">PORTFOLIO / 2025—26</span>
      </section>

      <section className="strip-section" aria-label="Disciplines">
        <RevealText>
          <div className="strip-code">CAPABILITIES / 01—03</div>
          <p className="strip-text">
            Web development<span>.</span> Hardware systems<span>.</span> Embedded circuits<span>.</span>
          </p>
          <p className="strip-subtext">Designed in logic. Built in the real world.</p>
        </RevealText>
      </section>

      <section className="featured-section" id="featured-work">
        <RevealText>
          <div className="section-heading">
            <div>
              <div className="section-label"><span /> SELECTED BUILDS / 06</div>
              <h2 className="section-title">Projects &amp; Works</h2>
            </div>
            <Link to="/projects" className="section-link">
              Browse all projects <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </RevealText>

        <div className="project-list">
          {featuredProjects.map((project, index) => (
            <RevealText key={project.num} delay={index * 0.06}>
              <Link to="/projects" className="project-row">
                <span className="project-num">PRJ-{project.num}</span>
                <span className="project-name">{project.name}</span>
                <span className={`project-type ${project.type.includes('Hardware') || project.type === 'Pure Circuit' ? 'is-hardware' : ''}`}>
                  {project.type}
                </span>
                <span className="project-arrow" aria-hidden="true">↗</span>
              </Link>
            </RevealText>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <RevealText className="cta-panel">
          <div className="cta-copy">
            <p className="cta-label"><span /> NEXT CONNECTION / OPEN</p>
            <h2 className="cta-title">Have a system<br />to bring to life?</h2>
            <p className="cta-desc">Let’s turn a good idea into something that works.</p>
          </div>
          <Link to="/contact" className="cta-btn">
            Start a conversation <span aria-hidden="true">↗</span>
          </Link>
        </RevealText>
      </section>

      {easterEgg && (
        <div className="hire-easter-egg" role="status">
          <span className="status-led" />
          Permission granted. Let’s build something — <Link to="/contact">contact me ↗</Link>
        </div>
      )}
    </main>
  )
}

export default Home
