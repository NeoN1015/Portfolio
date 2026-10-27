import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
//import CursorGlow from './components/CursorGlow'
// import ChibiCharacter from './components/ChibiCharacter'


function App() {
  return (
    <BrowserRouter>
     {/*<CursorGlow />*/}
     {/* <ChibiCharacter /> */}
      <ScrollProgress />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App