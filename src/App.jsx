import { useState } from 'react'
import Loader from './components/Loader.jsx'
import Nav from './components/Nav.jsx'
import Scene3D from './components/Scene3D.jsx'
import Hero from './components/Hero.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Writing from './components/Writing.jsx'
import Skills from './components/Skills.jsx'
import Education from './components/Education.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [ready, setReady] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  const handleLoaderDone = () => {
    setReady(true)
    setShowLoader(false)
  }

  return (
    <>
      {showLoader && <Loader onDone={handleLoaderDone} />}
      <Scene3D ready={ready} />
      <Nav />
      <Hero ready={ready} />
      <Experience />
      <Projects />
      <Writing />
      <Skills />
      <Education />
      <Contact />
      <Footer />
    </>
  )
}