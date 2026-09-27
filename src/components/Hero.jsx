import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { contact } from '../data/content.js'

export default function Hero({ ready }) {
  const headlineRef = useRef(null)
  const tagRef = useRef(null)
  const metaRef = useRef(null)
  const ctaRef = useRef(null)
  const statusRef = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!ready) return
    const spans = headlineRef.current.querySelectorAll('span')
    const fadeEls = [statusRef.current, tagRef.current, metaRef.current, ctaRef.current]
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from(spans, { yPercent: 115, duration: 1, stagger: 0.08, ease: 'power4.out' })
      .to(fadeEls, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=0.5')
  }, [ready])

  const magnetic = e => {
    if (window.innerWidth < 768) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    e.currentTarget.style.transform = `translate3d(${x * 0.2}px, ${y * 0.25}px, 0)`
  }
  const resetMagnetic = e => { e.currentTarget.style.transform = 'translate3d(0,0,0)' }

  const handleCopyEmail = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText(contact.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2600)
  }

  return (
    <section className="hero">
      <div className="hero-inner">
        {/* Live Status Pill */}
        <div className="" ref={statusRef} style={{ opacity: 0 }}>

          {/* <span className="status-label">Shipping Production Systems @ SBI General</span> */}
        </div>

        <h1 id="headline" ref={headlineRef}>
          <span>Tejas</span> <span>Mundhe.</span>
        </h1>

        <p className="hero-subheading">
          Software Developer <span className="sep">/</span> Thane, India
        </p>

        <p className="tag fade" ref={tagRef} style={{ opacity: 0 }}>
          I architect fault-tolerant full-stack applications and high-throughput microservices that won't buckle under traffic spikes. Day-to-day, that means zero-downtime releases, sub-millisecond database queries, strict Information Security compliance, and intuitive, fluid client UIs.
        </p>

        {/* Tactile Metric Stat Cards */}
        <div className="meta-stats fade" ref={metaRef} style={{ opacity: 0 }}>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-num">1,500+</span>
              <span className="stat-glyph">⌘</span>
            </div>
            <span className="stat-text">DSA Problems Solved</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-num">7</span>
              <span className="stat-glyph">◈</span>
            </div>
            <span className="stat-text">Self Made CI/CD Tool</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-num">HLD & LLD</span>
              <span className="stat-glyph">⚡</span>
            </div>
            <span className="stat-text">System Architecture</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-num">99.9%</span>
              <span className="stat-glyph">▲</span>
            </div>
            <span className="stat-text">Production Uptime</span>
          </div>
        </div>

        {/* Prominent Action Cluster: Explore, Resume & Email */}
        <div className="cta-group fade" ref={ctaRef} style={{ opacity: 0 }}>
          {/* Primary: Explore builds */}
          <a
            className="btn btn-obsidian-primary"
            href="#builds"
            onMouseMove={magnetic}
            onMouseLeave={resetMagnetic}
          >
            <span>Explore Systems</span>
            <span className="btn-arrow">↓</span>
          </a>

          {/* Prominent Resume Button */}
          <a
            className="btn btn-obsidian-sub"
            href="/Tejas_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={magnetic}
            onMouseLeave={resetMagnetic}
            title="Open Resume PDF in new tab"
          >
            <span>📄 Resume</span>
            <span className="sub-arrow">↗</span>
          </a>

          {/* Direct Copy Email Button */}
          <button
            type="button"
            className={`btn btn-obsidian-sub email-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyEmail}
            onMouseMove={magnetic}
            onMouseLeave={resetMagnetic}
            title="Click to copy email address"
          >
            <span>{copied ? '✓ Email Copied!' : `✉️ ${contact.email}`}</span>
          </button>

          {/* Series Link */}
          <a
            className="btn btn-obsidian-sub"
            href="#series"
            onMouseMove={magnetic}
            onMouseLeave={resetMagnetic}
            title="Read Backend Engineering Series"
          >
            <span>✍️ Series</span>
            <span className="sub-arrow">↗</span>
          </a>
        </div>

      </div>
    </section>
  )
}