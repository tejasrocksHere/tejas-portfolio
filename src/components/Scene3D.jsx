import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Persistent 3D background: starfield, deep black hole with accretion disk,
// and solar system attached to camera drifting as a constant backdrop.
export default function Scene3D({ ready }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a121e, 0.05)
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 7

    const ACC = 0xe7a23d, DIM = 0x8b99aa
    const wireMesh = (geo, color, opacity) =>
      new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color, transparent: true, opacity }))

    function glowSprite(hex, size, opacity) {
      const cv = document.createElement('canvas')
      cv.width = cv.height = 128
      const ctx = cv.getContext('2d')
      const c = '#' + hex.toString(16).padStart(6, '0')
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      g.addColorStop(0, c + 'ff')
      g.addColorStop(0.35, c + '88')
      g.addColorStop(1, c + '00')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 128, 128)
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(cv), transparent: true, opacity,
        blending: THREE.AdditiveBlending, depthWrite: false
      }))
      spr.scale.set(size, size, 1)
      return spr
    }

    // Starfield spanning scroll depth
    const starCount = 300
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 18
      starPos[i * 3 + 1] = Math.random() * -32 + 4
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: DIM, size: 0.045, transparent: true, opacity: 0.65 })))

    // Black Hole — event horizon + accretion disk with Keplerian differential rotation
    const holeGroup = new THREE.Group()
    holeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0x000000 })))
    holeGroup.add(glowSprite(ACC, 7, 0.5))
    holeGroup.add(glowSprite(0xffefd1, 3.2, 0.8))

    const diskCount = 500
    const diskR = new Float32Array(diskCount)
    const diskA = new Float32Array(diskCount)
    const diskY = new Float32Array(diskCount)
    const diskGeo = new THREE.BufferGeometry()
    const diskPos = new Float32Array(diskCount * 3)
    const diskCol = new Float32Array(diskCount * 3)
    const hot = new THREE.Color(0xffefd1), mid = new THREE.Color(ACC), cool = new THREE.Color(DIM)
    for (let i = 0; i < diskCount; i++) {
      const r = 1.45 + Math.pow(Math.random(), 1.6) * 2.6
      diskR[i] = r
      diskA[i] = Math.random() * Math.PI * 2
      diskY[i] = (Math.random() - 0.5) * 0.1
      const t = THREE.MathUtils.clamp((r - 1.45) / 2.6, 0, 1)
      const c = t < 0.35 ? hot.clone().lerp(mid, t / 0.35) : mid.clone().lerp(cool, (t - 0.35) / 0.65)
      diskCol[i * 3] = c.r
      diskCol[i * 3 + 1] = c.g
      diskCol[i * 3 + 2] = c.b
    }
    diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPos, 3))
    diskGeo.setAttribute('color', new THREE.BufferAttribute(diskCol, 3))
    holeGroup.add(new THREE.Points(diskGeo, new THREE.PointsMaterial({
      size: 0.055, vertexColors: true, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false
    })))
    const ringPts = new THREE.EllipseCurve(0, 0, 2.7, 2.7 * 0.38).getPoints(80).map(p => new THREE.Vector3(p.x, 0, p.y))
    holeGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(ringPts), new THREE.LineBasicMaterial({ color: ACC, transparent: true, opacity: 0.25 })))
    holeGroup.rotation.x = 0.35
    holeGroup.position.set(1.5, -19, -1)
    scene.add(holeGroup)

    function updateDisk() {
      const pos = diskGeo.attributes.position.array
      for (let i = 0; i < diskCount; i++) {
        diskA[i] += 0.75 / Math.pow(diskR[i], 1.5)
        pos[i * 3] = Math.cos(diskA[i]) * diskR[i]
        pos[i * 3 + 1] = diskY[i]
        pos[i * 3 + 2] = Math.sin(diskA[i]) * diskR[i] * 0.38
      }
      diskGeo.attributes.position.needsUpdate = true
    }

    // Solar system — attached to camera as constant backdrop
    const solarGroup = new THREE.Group()
    solarGroup.add(wireMesh(new THREE.IcosahedronGeometry(0.85, 1), ACC, 0.6))
    solarGroup.add(glowSprite(ACC, 3.6, 0.55))
    const planetSpecs = [
      { r: 1.6, size: 0.08, speed: 0.006, color: DIM },
      { r: 2.3, size: 0.12, speed: 0.004, color: ACC },
      { r: 3.0, size: 0.06, speed: 0.003, color: DIM },
      { r: 3.8, size: 0.15, speed: 0.0022, color: DIM },
      { r: 4.6, size: 0.05, speed: 0.0017, color: ACC }
    ]
    const planets = planetSpecs.map(d => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.size, 10, 10), new THREE.MeshBasicMaterial({ color: d.color }))
      const orbitPts = new THREE.EllipseCurve(0, 0, d.r, d.r * 0.88).getPoints(64).map(p => new THREE.Vector3(p.x, 0, p.y))
      solarGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(orbitPts), new THREE.LineBasicMaterial({ color: DIM, transparent: true, opacity: 0.16 })))
      solarGroup.add(mesh)
      return { mesh, r: d.r, speed: d.speed, angle: Math.random() * Math.PI * 2 }
    })
    solarGroup.rotation.x = 0.55
    solarGroup.position.set(-1.5, 0.8, -14)
    camera.add(solarGroup)
    scene.add(camera)

    let mx = 0, my = 0
    const onMouseMove = e => {
      mx = e.clientX / window.innerWidth - 0.5
      my = e.clientY / window.innerHeight - 0.5
    }
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)

    let frameId
    function animate() {
      frameId = requestAnimationFrame(animate)
      if (!reduced) {
        updateDisk()
        holeGroup.rotation.y += 0.0006
        solarGroup.rotation.y += 0.0006
        planets.forEach(p => {
          p.angle += p.speed
          p.mesh.position.set(Math.cos(p.angle) * p.r, 0, Math.sin(p.angle) * p.r * 0.88)
        })
        scene.rotation.y += (mx * 0.12 - scene.rotation.y) * 0.02
        scene.rotation.x += (-my * 0.08 - scene.rotation.x) * 0.02
      }
      renderer.render(scene, camera)
    }
    animate()

    const depth = -24
    const scrollTrig = ScrollTrigger.create({
      trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.6,
      onUpdate: self => { camera.position.y = self.progress * depth }
    })

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      scrollTrig.kill()
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    gsap.to(canvasRef.current, { opacity: 1, duration: 1.4, ease: 'power2.out' })
  }, [ready])

  return <canvas id="bg-canvas" ref={canvasRef} />
}
