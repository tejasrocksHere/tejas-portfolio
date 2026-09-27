import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../data/content.js'

export default function Experience() {
  const tlRef = useRef(null)
  const progRef = useRef(null)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: tlRef.current, start: 'top 70%', end: 'bottom 80%', scrub: 0.4,
      onUpdate: self => { if (progRef.current) progRef.current.style.height = self.progress * 100 + '%' }
    })
    return () => st.kill()
  }, [])

  return (
    <section id="work">
      <div className="wrap">
        <div className="sec-head"><h2>Systems built</h2><span className="idx">2025 — present</span></div>
        <div className="tl" ref={tlRef}>
          <div className="tl-line"></div>
          <div className="tl-progress" ref={progRef}></div>
          {experience.map(role => (
            <div className="role" key={role.title}>
              <h3>{role.title}</h3>
              <div className="co">{role.company}</div>
              <div className="dates">{role.dates}</div>
              <ul>{role.points.map(p => <li key={p}>{p}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
