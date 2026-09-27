import { useRef } from 'react'
import { useFadeIn } from '../hooks/useFadeIn.js'

export default function ProjectCard(props) {
  const ref = useRef(null)
  useFadeIn(ref)

  // Robust fallback: supports both { project } and direct props
  const project = props?.project || props

  if (!project || !project.name) {
    return null
  }

  // Obsidian UI Spotlight Tracker
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--spotlight-x', `${x}px`)
    e.currentTarget.style.setProperty('--spotlight-y', `${y}px`)
  }

  return (
    <div
      className="card obsidian-card fade"
      ref={ref}
      onMouseMove={handleMouseMove}
      style={{ opacity: 0 }}
    >
      <div className="card-spotlight" />

      <div className="card-header">
        <h3>{project.name}</h3>
        {project.link && (
          <a className="live-pill" href={project.link} target="_blank" rel="noopener noreferrer">
            <span className="pill-dot" /> Live System ↗
          </a>
        )}
      </div>

      <div className="stack">{project.stack}</div>
      <p>{project.desc}</p>
    </div>
  )
}