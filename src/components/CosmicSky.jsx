import { useEffect, useRef } from 'react'

export default function CosmicSky() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let animationFrameId
        let width = (canvas.width = window.innerWidth)
        let height = (canvas.height = window.innerHeight)
        let dpr = Math.min(window.devicePixelRatio || 1, 2)

        const setCanvasSize = () => {
            width = window.innerWidth
            height = window.innerHeight
            dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.scale(dpr, dpr)
        }
        setCanvasSize()

        // -------------------------------------------------------------------------
        // 1. 2D Twinkling Stars (Atmospheric Scintillation)
        // -------------------------------------------------------------------------
        const starCount = Math.floor((width * height) / 10000)
        const stars = Array.from({ length: starCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 0.95 + 0.35,
            baseAlpha: Math.random() * 0.35 + 0.15,
            twinkleSpeed: Math.random() * 0.025 + 0.008,
            phase: Math.random() * Math.PI * 2,
            isDiffractionStar: Math.random() > 0.91 // Occasional 4-point flare star
        }))

        // -------------------------------------------------------------------------
        // 2. High-Frequency, Multi-Directional Breaking Asteroids
        // -------------------------------------------------------------------------
        const asteroids = []
        const sparks = []
        let lastSpawnTime = 0
        // Increased frequency: spawns every ~0.9s to 2.2s
        let nextSpawnDelay = 900 + Math.random() * 1300

        class Asteroid {
            constructor() {
                // Random entry edge: 'top', 'left', or 'right'
                const sideRand = Math.random()
                const side = sideRand < 0.45 ? 'top' : sideRand < 0.72 ? 'left' : 'right'

                if (side === 'top') {
                    this.x = Math.random() * width
                    this.y = -35
                    // Random direction: downward-left or downward-right (35° to 145°)
                    this.angle = (Math.PI / 180) * (35 + Math.random() * 110)
                } else if (side === 'left') {
                    this.x = -35
                    this.y = Math.random() * (height * 0.7)
                    // Random direction: shallow or steep down-right (15° to 68°)
                    this.angle = (Math.PI / 180) * (15 + Math.random() * 53)
                } else {
                    // right
                    this.x = width + 35
                    this.y = Math.random() * (height * 0.7)
                    // Random direction: shallow or steep down-left (112° to 165°)
                    this.angle = (Math.PI / 180) * (112 + Math.random() * 53)
                }

                this.speed = Math.random() * 5.5 + 6.5
                this.length = Math.random() * 65 + 85
                this.radius = Math.random() * 0.7 + 1.1
                this.life = 0
                this.maxLife = Math.random() * 60 + 60
                this.decay = 0.016
                this.alpha = 1
                this.active = true
            }

            update() {
                this.life++
                this.x += Math.cos(this.angle) * this.speed
                this.y += Math.sin(this.angle) * this.speed

                // Smooth dissolution of head & tail
                if (this.life > this.maxLife * 0.55) {
                    this.alpha = Math.max(0, this.alpha - this.decay)
                }

                // Out-of-bounds boundary cleanup
                if (
                    this.alpha <= 0 ||
                    this.x < -140 ||
                    this.x > width + 140 ||
                    this.y > height + 140 ||
                    this.y < -140
                ) {
                    this.active = false
                }

                // Shed glitter fragments in real time
                if (this.life % 2 === 0 && Math.random() > 0.22) {
                    sparks.push(new FragmentSpark(this.x, this.y, this.angle, this.speed))
                }
            }

            draw(c) {
                if (!this.active) return
                const tailX = this.x - Math.cos(this.angle) * this.length
                const tailY = this.y - Math.sin(this.angle) * this.length

                // Atmospheric ablation gradient tail
                const gradient = c.createLinearGradient(this.x, this.y, tailX, tailY)
                gradient.addColorStop(0, `rgba(255, 250, 240, ${this.alpha * 0.95})`)
                gradient.addColorStop(0.18, `rgba(232, 168, 56, ${this.alpha * 0.75})`)
                gradient.addColorStop(0.65, `rgba(232, 168, 56, ${this.alpha * 0.22})`)
                gradient.addColorStop(1, 'rgba(232, 168, 56, 0)')

                c.beginPath()
                c.moveTo(this.x, this.y)
                c.lineTo(tailX, tailY)
                c.strokeStyle = gradient
                c.lineWidth = this.radius * 1.5
                c.lineCap = 'round'
                c.stroke()

                // Luminous nucleus core
                c.beginPath()
                c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
                c.fillStyle = `rgba(255, 255, 255, ${this.alpha})`
                c.shadowColor = '#e8a838'
                c.shadowBlur = 9
                c.fill()
                c.shadowBlur = 0
            }
        }

        // Micro-fragments crumbling from the breaking asteroid
        class FragmentSpark {
            constructor(x, y, parentAngle, parentSpeed) {
                this.x = x + (Math.random() - 0.5) * 3
                this.y = y + (Math.random() - 0.5) * 3
                // Drifts backward along opposite trajectory vector with randomized drift
                const dispersionAngle = parentAngle + Math.PI + (Math.random() - 0.5) * 0.75
                const driftSpeed = Math.random() * (parentSpeed * 0.28)
                this.vx = Math.cos(dispersionAngle) * driftSpeed
                this.vy = Math.sin(dispersionAngle) * driftSpeed
                this.alpha = Math.random() * 0.75 + 0.35
                this.decay = Math.random() * 0.028 + 0.016
                this.size = Math.random() * 1.1 + 0.4
            }

            update() {
                this.x += this.vx
                this.y += this.vy
                this.alpha -= this.decay
            }

            draw(c) {
                if (this.alpha <= 0) return
                c.beginPath()
                c.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                c.fillStyle = `rgba(255, 238, 200, ${this.alpha})`
                c.fill()
            }
        }

        // -------------------------------------------------------------------------
        // Main Render Loop
        // -------------------------------------------------------------------------
        const render = (time) => {
            ctx.clearRect(0, 0, width, height)

            // 1. Draw Twinkling 2D Stars
            stars.forEach((star) => {
                star.phase += star.twinkleSpeed
                const twinkle = Math.sin(star.phase)
                const currentAlpha = Math.max(0.08, star.baseAlpha + twinkle * 0.35)

                ctx.fillStyle = `rgba(215, 228, 245, ${currentAlpha})`
                ctx.beginPath()
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
                ctx.fill()

                // 4-point flare on brightest magnitude stars
                if (star.isDiffractionStar && currentAlpha > 0.54) {
                    ctx.strokeStyle = `rgba(232, 168, 56, ${(currentAlpha - 0.54) * 0.85})`
                    ctx.lineWidth = 0.5
                    ctx.beginPath()
                    ctx.moveTo(star.x - 3.5, star.y)
                    ctx.lineTo(star.x + 3.5, star.y)
                    ctx.moveTo(star.x, star.y - 3.5)
                    ctx.lineTo(star.x, star.y + 3.5)
                    ctx.stroke()
                }
            })

            // 2. Spawn Asteroids with high frequency
            if (!reduced && time - lastSpawnTime > nextSpawnDelay) {
                asteroids.push(new Asteroid())
                lastSpawnTime = time
                // Random intervals between ~0.9s and ~2.2s
                nextSpawnDelay = 900 + Math.random() * 1300
            }

            // Update & draw active asteroids
            for (let i = asteroids.length - 1; i >= 0; i--) {
                const a = asteroids[i]
                a.update()
                a.draw(ctx)
                if (!a.active) asteroids.splice(i, 1)
            }

            // Update & draw glittering fragment sparks
            for (let i = sparks.length - 1; i >= 0; i--) {
                const s = sparks[i]
                s.update()
                s.draw(ctx)
                if (s.alpha <= 0) sparks.splice(i, 1)
            }

            animationFrameId = requestAnimationFrame(render)
        }

        animationFrameId = requestAnimationFrame(render)

        const handleResize = () => setCanvasSize()
        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    )
}