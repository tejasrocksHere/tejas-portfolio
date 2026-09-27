export default function Nav({ singularityActive, onToggleSingularity }) {
  return (
    <nav>
      <div className="logo">TM</div>
      <div className="navlinks">
        <a href="#work">Work</a>
        <a href="#builds">Builds</a>
        <a href="#series">Blogs</a>
        <a href="#contact">Contact</a>

      </div>
    </nav>
  )
}