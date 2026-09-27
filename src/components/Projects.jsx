import { projects } from '../data/content.js'
import ProjectCard from './ProjectCard.jsx'

export default function Projects() {
  // Safety filter to ensure no empty or undefined items are mapped
  const validProjects = Array.isArray(projects)
    ? projects.filter(p => p && typeof p === 'object' && p.name)
    : []

  return (
    <section id="builds">
      <div className="wrap">
        <div className="sec-head">
          <h2>Selected builds</h2>
          <span className="idx">{String(validProjects.length).padStart(2, '0')} systems</span>
        </div>
        <div className="grid">
          {validProjects.map(p => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}