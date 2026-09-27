export default function Nav({ singularityActive, onToggleSingularity }) {
  return (
    <nav>
      <div className="logo">TM</div>
      <div className="navlinks">
        <a href="#work">Work</a>
        <a href="#builds">Builds</a>
        <a href="#series">Series</a>
        <a href="#contact">Contact</a>
        <button
          className={`nav-singularity-btn ${singularityActive ? 'active' : ''}`}
          onClick={onToggleSingularity}
          title={singularityActive ? 'Click to restore screen' : 'Click to unleash Black Hole'}
        >
          <span className="dot" />
          {singularityActive ? 'Singularity Active' : 'Black Hole'}
        </button>
      </div>
    </nav>
  )
}