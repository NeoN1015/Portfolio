import { useEffect, useState } from 'react'
import './CursorGlow.css'

function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 })
  const [trail, setTrail] = useState([])

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      setTrail(prev => [...prev.slice(-12), { x: e.clientX, y: e.clientY, id: Date.now() }])
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      {trail.map((point, i) => (
        <div
          key={point.id}
          className="cursor-trail"
          style={{
            left: point.x,
            top: point.y,
            opacity: (i / trail.length) * 0.4,
            transform: `translate(-50%, -50%) scale(${0.3 + (i / trail.length) * 0.7})`,
          }}
        />
      ))}
      <div
        className="cursor-glow"
        style={{ left: pos.x, top: pos.y }}
      />
    </>
  )
}

export default CursorGlow