import { useEffect, useRef, useState } from 'react'
import './Skills.css'

const skillGroups = [
  {
    id: 'software',
    title: 'Software & systems',
    code: 'STACK / SW-01',
    accent: 'software',
    groups: [
      {
        label: 'Languages',
        skills: [
          { name: 'C', note: 'Low-level logic and embedded programming fundamentals.', project: 'Smart Irrigation System' },
          { name: 'C++', note: 'Firmware and microcontroller-based system implementations.', project: 'Contactless Hand Sanitizer' },
          { name: 'Java', note: 'Object-oriented programming and problem solving.', project: 'Coursework / software foundations' },
          { name: 'JavaScript', note: 'Interactive interfaces and front-end logic.', project: 'SmartPOS' },
          { name: 'HTML & CSS', note: 'Responsive layout and accessible UI design.', project: 'Colegio de Muntinlupa Website' },
          { name: 'PHP', note: 'Server-side development and full-stack web workflows.', project: 'Colegio de Muntinlupa Website' },
          { name: 'Assembly', note: 'Understanding machine-level execution and system behavior.', project: 'Computer engineering coursework' },
          { name: 'Python', note: 'Research, prototyping, and data-driven experimentation.', project: 'PsycheScan' },
        ],
      },
      {
        label: 'Frameworks & tools',
        skills: [
          { name: 'React', note: 'Component-driven interfaces for web applications.', project: 'SmartPOS' },
          { name: 'Tailwind CSS', note: 'Fast UI styling for responsive applications.', project: 'SmartPOS' },
          { name: 'Node.js', note: 'JavaScript tooling and development environment support.', project: 'Web projects' },
          { name: 'SQLite', note: 'Lightweight database management for app data.', project: 'SmartPOS' },
          { name: 'Git & GitHub', note: 'Version control and collaboration workflows.', project: 'All projects' },
          { name: 'VS Code', note: 'Daily editor for coding, debugging, and project setup.', project: 'All projects' },
          { name: 'Docker', note: 'Environment configuration and workflow integration.', project: 'BioSentinel ASF / KE TEXH Solutions' },
          { name: 'Figma', note: 'Interface planning and design exploration.', project: 'Portfolio / UI work' },
        ],
      },
    ],
  },
  {
    id: 'hardware',
    title: 'Hardware & embedded',
    code: 'STACK / HW-02',
    accent: 'hardware',
    groups: [
      {
        label: 'Embedded & circuits',
        skills: [
          { name: 'Arduino', note: 'Rapid prototyping for sensors, actuators, and automation.', project: 'Contactless Hand Sanitizer' },
          { name: 'ESP32', note: 'Wireless and embedded system development for connected devices.', project: 'ProtectTag' },
          { name: 'Circuit Design', note: 'Designing and integrating hardware to create working systems.', project: 'Smart Irrigation System' },
          { name: 'Sensor Integration', note: 'Reading real-world signals and using them in responsive systems.', project: 'ProtectTag' },
          { name: 'Embedded Systems', note: 'Combining microcontrollers, hardware, and software into functional solutions.', project: 'PsycheScan / ProtectTag' },
          { name: 'GPS & MPU6050', note: 'Location and movement sensing for safety and tracking systems.', project: 'ProtectTag' },
          { name: 'Firebase', note: 'Cloud backend support for telemetry and real-time configuration.', project: 'ProtectTag' },
        ],
      },
    ],
  },
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
      className={`skills-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function SkillChip({ skill, index, accent }) {
  return (
    <article
      className={`skill-chip skill-chip--${accent}`}
      tabIndex={0}
      aria-label={`${skill.name}. ${skill.note}${skill.project ? ` Related project: ${skill.project}.` : ''}`}
      style={{ '--chip-delay': `${index * 35}ms` }}
    >
      <div className="skill-chip-top">
        <span className="skill-chip-led" aria-hidden="true" />
        <span className="skill-chip-name">{skill.name}</span>
        <span className="skill-chip-mark" aria-hidden="true">↗</span>
      </div>
      <div className="skill-chip-detail">
        <p>{skill.note}</p>
        {skill.project && <span>PROJECT / {skill.project}</span>}
      </div>
    </article>
  )
}

function Skills() {
  return (
    <main className="skills">
      <section className="skills-header" aria-labelledby="skills-title">
        <RevealText>
          <p className="skills-kicker"><span /> CAPABILITY MAP / SK-02</p>
          <h1 className="skills-title" id="skills-title">Tools for both<br /><span>sides of the signal.</span></h1>
          <p className="skills-sub">
            A mix of software and embedded engineering skills built through projects,
            coursework, and research. Focus a component to see where it fits.
          </p>
        </RevealText>
        <div className="skills-header-status" aria-label="Software and hardware disciplines">
          <span><i className="skill-status-led skill-status-led--software" /> SOFTWARE</span>
          <span><i className="skill-status-led skill-status-led--hardware" /> HARDWARE / IOT</span>
        </div>
      </section>

      <section className="skills-body" aria-label="Skills">
        <div className="skills-grid">
          {skillGroups.map((category, categoryIndex) => (
            <RevealText
              key={category.id}
              delay={categoryIndex * 90}
              className={`skill-category skill-category--${category.accent}`}
            >
              <div className="skill-category-heading">
                <div>
                  <p className="category-code">{category.code}</p>
                  <h2>{category.title}</h2>
                </div>
                <span className="category-indicator" aria-hidden="true" />
              </div>
              {category.groups.map((group) => (
                <section className="skill-subgroup" key={group.label} aria-label={group.label}>
                  <h3 className="category-label">{group.label}</h3>
                  <div className="skill-chip-grid">
                    {group.skills.map((skill, index) => (
                      <SkillChip
                        key={skill.name}
                        skill={skill}
                        index={index}
                        accent={category.accent}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </RevealText>
          ))}
        </div>
      </section>

      <footer className="skills-footer">
        <p><span /> ALWAYS LEARNING</p>
        <span>Currently exploring cybersecurity, embedded systems, and applied AI research.</span>
      </footer>
    </main>
  )
}

export default Skills
