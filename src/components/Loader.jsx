import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Loader({ onDone }) {
  const rootRef = useRef(null)
  const fillRef = useRef(null)
  const dotsRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dots = 0
    const dotTimer = setInterval(() => {
      dots = (dots + 1) % 4
      if (dotsRef.current) dotsRef.current.textContent = '.'.repeat(dots)
    }, 220)

    const tl = gsap.timeline({
      onComplete: () => {
        clearInterval(dotTimer)
        onDone()
      }
    })
    tl.to(fillRef.current, { width: '100%', duration: reduced ? 0.2 : 1.1, ease: 'power1.inOut' })
      .to(rootRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.1')

    return () => {
      clearInterval(dotTimer)
      tl.kill()
    }
  }, [onDone])

  return (
    <div id="loader" ref={rootRef}>
      <div className="loader-label">
        <span className="p1">tejas@systems</span>:~$ initializing universe<span ref={dotsRef}></span>
      </div>
      <div className="loader-bar"><div className="loader-fill" ref={fillRef}></div></div>
    </div>
  )
}
