import { useEffect, useRef } from 'react'
import './ChibiCharacter.css'

function ChibiCharacter() {
  const leftEyeRef = useRef(null)
  const rightEyeRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const moveEyes = (e) => {
      const eyes = [leftEyeRef.current, rightEyeRef.current]
      eyes.forEach(eye => {
        if (!eye) return
        const rect = eye.getBoundingClientRect()
        const eyeCenterX = rect.left + rect.width / 2
        const eyeCenterY = rect.top + rect.height / 2
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX)
        const dist = 3
        const x = Math.cos(angle) * dist
        const y = Math.sin(angle) * dist
        eye.style.transform = `translate(${x}px, ${y}px)`
      })
    }
    window.addEventListener('mousemove', moveEyes)
    return () => window.removeEventListener('mousemove', moveEyes)
  }, [])

  return (
    <div className="chibi-wrapper" ref={containerRef}>
      <div className="chibi">

        {/* HAIR */}
        <div className="chibi-hair">
          <div className="hair-top" />
          <div className="hair-left" />
          <div className="hair-right" />
        </div>

        {/* HEAD */}
        <div className="chibi-head">
          {/* EYES */}
          <div className="chibi-eyes">
            <div className="eye-socket">
              <div className="pupil" ref={leftEyeRef} />
            </div>
            <div className="eye-socket">
              <div className="pupil" ref={rightEyeRef} />
            </div>
          </div>
          {/* BLUSH */}
          <div className="chibi-blush">
            <div className="blush" />
            <div className="blush" />
          </div>
          {/* MOUTH */}
          <div className="chibi-mouth" />
        </div>

        {/* BODY */}
        <div className="chibi-body">
          <div className="chibi-shirt">
            {/* ARMS */}
            <div className="arm left-arm" />
            <div className="arm right-arm" />
          </div>
          {/* PANTS */}
          <div className="chibi-pants">
            <div className="leg left-leg" />
            <div className="leg right-leg" />
          </div>
        </div>

      </div>
    </div>
  )
}

export default ChibiCharacter