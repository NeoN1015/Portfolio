import { useEffect, useRef, useState } from 'react'
import './About.css'

const specs = [
  ['DISCIPLINE', 'Computer Engineering'],
  ['INTERESTS', 'Cybersecurity · Embedded Systems · Web Development'],
  ['DIRECTION', 'Research · Systems · Real-world problem solving'],
]

const history = [
  {
    version: 'V1.0',
    date: 'FOUNDATION',
    title: 'Curiosity switched on',
    description: 'Started exploring how code, electronics, and practical systems fit together through school projects and personal builds.',
  },
  {
    version: 'V1.1',
    date: 'BUILD MODE',
    title: 'From idea to working system',
    description: 'Built school websites, embedded prototypes, and automation systems, including smart irrigation and touchless hardware projects.',
  },
  {
    version: 'V1.2',
    date: 'IN PROGRESS',
    title: 'Working toward what’s next',
    description: 'Continuing to develop in cybersecurity, web systems, embedded engineering, and research-driven projects like PsycheScan.',
  },
]

const stats = [
  { num: '8+', label: 'Projects built' },
  { num: '3+', label: 'Years building' },
  { num: '15+', label: 'Technologies used' },
  { num: '3', label: 'Core focus areas' },
]

const hobbies = [
  { icon: '🛡️', label: 'Cybersecurity', desc: 'Security concepts, systems thinking, and attack-surface analysis' },
  { icon: '🔌', label: 'Electronics', desc: 'Circuit design, sensors, and practical hardware prototyping' },
  { icon: '📺', label: 'Anime', desc: 'Creative inspiration and downtime entertainment' },
  { icon: '🧠', label: 'Research', desc: 'Exploring how systems solve real-world problems' },
]

function RevealText({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const element = ref.current
    if (!element || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`about-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function About() {
  return (
    <main className="about">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <RevealText>
            <p className="about-kicker"><span /> PROFILE / DEVICE SPEC</p>
            <h1 className="about-title" id="about-title">A curious mind.<br /><span>A builder’s hands.</span></h1>
            <p className="about-bio">
              I'm Gerald C. Esplana, a Computer Engineering student from Muntinlupa with a strong
              interest in cybersecurity, embedded systems, and software-driven problem solving.
              I enjoy building systems that connect hardware, data, and human needs in practical ways.
            </p>
            <p className="about-bio">
              From school websites to automation projects and research prototypes, I bring a hands-on
              mindset to every build — whether I’m developing a full-stack application, designing a
              sensor-based system, or exploring how AI and embedded tools can support real-world use cases.
            </p>
          </RevealText>
        </div>
        <RevealText className="about-spec-card" delay={100}>
          <div className="spec-card-top">
            <span>UNIT PROFILE</span>
            <span className="spec-led"><i /> ACTIVE</span>
          </div>
          <p className="spec-device-name">GERALD C. ESPLANA</p>
          <p className="spec-device-id">ID / CE-001 · REV 1.2</p>
          <dl className="spec-list">
            {specs.map(([label, value]) => (
              <div className="spec-row" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="spec-status">
            <span className="spec-status-track"><i /></span>
            <span>STATUS: BUILDING / RESEARCHING</span>
          </div>
        </RevealText>
      </section>

      <section className="about-stats" aria-label="Profile metrics">
        {stats.map((stat, index) => (
          <RevealText key={stat.label} delay={index * 55} className="about-stat">
            <span className="stat-code">METRIC / 0{index + 1}</span>
            <span className="stat-num">{stat.num}</span>
            <span className="stat-label">{stat.label}</span>
          </RevealText>
        ))}
      </section>

      <section className="about-history" aria-labelledby="history-title">
        <RevealText>
          <p className="about-kicker"><span /> CHANGELOG / FIELD NOTES</p>
          <h2 className="about-section-title" id="history-title">Built one version at a time.</h2>
        </RevealText>
        <div className="history-list">
          {history.map((item, index) => (
            <RevealText key={item.version} delay={index * 70}>
              <article className="history-row">
                <div className="history-version">
                  <span className="history-node" />
                  <span>{item.version}</span>
                </div>
                <div className="history-main">
                  <div className="history-meta">
                    <h3>{item.title}</h3>
                    <span>{item.date}</span>
                  </div>
                  <p>{item.description}</p>
                </div>
              </article>
            </RevealText>
          ))}
        </div>
      </section>

      <section className="about-hobbies" aria-labelledby="hobbies-title">
        <RevealText>
          <p className="about-kicker"><span /> OFFLINE INTERESTS</p>
          <h2 className="about-section-title" id="hobbies-title">Beyond the code.</h2>
        </RevealText>
        <div className="hobbies-grid">
          {hobbies.map((hobby, index) => (
            <RevealText key={hobby.label} delay={index * 55}>
              <article className="hobby-card">
                <span className="hobby-icon" aria-hidden="true">{hobby.icon}</span>
                <span className="hobby-index">INTEREST / 0{index + 1}</span>
                <h3>{hobby.label}</h3>
                <p>{hobby.desc}</p>
              </article>
            </RevealText>
          ))}
        </div>
      </section>

      <section className="about-goal">
        <RevealText>
          <p className="about-kicker"><span /> LONG-TERM DIRECTION</p>
          <h2 className="about-goal-text">
            “Building systems that matter<br />across hardware, software, and security.”
          </h2>
          <p className="about-goal-note">FOCUS / CYBERSECURITY + EMBEDDED SYSTEMS + WEB DEVELOPMENT</p>
        </RevealText>
      </section>
    </main>
  )
}

export default About
