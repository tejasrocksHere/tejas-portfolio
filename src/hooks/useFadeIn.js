import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Fades an element to opacity 1 the first time it scrolls into view.
export function useFadeIn(ref, { start = 'top 88%', delay = 0 } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => gsap.to(el, { opacity: 1, duration: 0.6, ease: 'power1.out', delay })
    })
    return () => st.kill()
  }, [ref, start, delay])
}
