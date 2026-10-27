import { useEffect, useState } from 'react'

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const current = window.scrollY
      setProgress((current / total) * 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '3px',
      width: `${progress}%`,
      background: 'linear-gradient(90deg, #1a6fd4, #0a2a6e)',
      zIndex: 200,
      transition: 'width 0.1s ease'
    }} />
  )
}

export default ScrollProgress