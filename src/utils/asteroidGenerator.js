import * as THREE from 'three'

// Fast, self-contained 3D Simplex-like Perlin noise implementation
class SimplexNoise3D {
  constructor(seed = 1337) {
    this.p = new Uint8Array(512)
    const perm = new Uint8Array(256)
    for (let i = 0; i < 256; i++) perm[i] = i
    // Shuffle with simple LCG
    let s = seed
    for (let i = 255; i > 0; i--) {
      s = (s * 1664525 + 1013904223) & 0xffffffff
      const j = Math.abs(s) % (i + 1)
      const tmp = perm[i]
      perm[i] = perm[j]
      perm[j] = tmp
    }
    for (let i = 0; i < 512; i++) {
      this.p[i] = perm[i & 255]
    }
  }

  dot(g, x, y, z) {
    return g[0] * x + g[1] * y + g[2] * z
  }

  noise(x, y, z) {
    const p = this.p
    const grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ]

    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    const Z = Math.floor(z) & 255

    x -= Math.floor(x)
    y -= Math.floor(y)
    z -= Math.floor(z)

    const u = x * x * x * (x * (x * 6 - 15) + 10)
    const v = y * y * y * (y * (y * 6 - 15) + 10)
    const w = z * z * z * (z * (z * 6 - 15) + 10)

    const A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z
    const B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z

    const g000 = grad3[p[AA] % 12]
    const g100 = grad3[p[BA] % 12]
    const g010 = grad3[p[AB] % 12]
    const g110 = grad3[p[BB] % 12]
    const g001 = grad3[p[AA + 1] % 12]
    const g101 = grad3[p[BA + 1] % 12]
    const g011 = grad3[p[AB + 1] % 12]
    const g111 = grad3[p[BB + 1] % 12]

    const lerp = (a, b, t) => a + t * (b - a)

    const x1 = lerp(this.dot(g000, x, y, z), this.dot(g100, x - 1, y, z), u)
    const x2 = lerp(this.dot(g010, x, y - 1, z), this.dot(g110, x - 1, y - 1, z), u)
    const y1 = lerp(x1, x2, v)

    const x3 = lerp(this.dot(g001, x, y, z - 1), this.dot(g101, x - 1, y, z - 1), u)
    const x4 = lerp(this.dot(g011, x, y - 1, z - 1), this.dot(g111, x - 1, y - 1, z - 1), u)
    const y2 = lerp(x3, x4, v)

    return lerp(y1, y2, w)
  }

  fbm(x, y, z, octaves = 4) {
    let total = 0
    let frequency = 1
    let amplitude = 1
    let maxValue = 0
    for (let i = 0; i < octaves; i++) {
      total += this.noise(x * frequency, y * frequency, z * frequency) * amplitude
      maxValue += amplitude
      amplitude *= 0.5
      frequency *= 2.05
    }
    return total / maxValue
  }
}

// Generate realistic rocky texture & bump map for asteroids
export function generateAsteroidTextures() {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = size
  bumpCanvas.height = size
  const bCtx = bumpCanvas.getContext('2d')

  // Base stone tone
  ctx.fillStyle = '#1c1e22'
  ctx.fillRect(0, 0, size, size)

  bCtx.fillStyle = '#808080'
  bCtx.fillRect(0, 0, size, size)

  const imgData = ctx.getImageData(0, 0, size, size)
  const bumpData = bCtx.getImageData(0, 0, size, size)
  const noiseGen = new SimplexNoise3D(42)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const nx = x / size
      const ny = y / size

      // Multiple noise layers
      const n1 = noiseGen.fbm(nx * 4, ny * 4, 1.2, 4)
      const n2 = noiseGen.fbm(nx * 16, ny * 16, 2.5, 3)
      const n3 = noiseGen.fbm(nx * 40, ny * 40, 5.0, 2)

      const combined = n1 * 0.6 + n2 * 0.3 + n3 * 0.1

      // Carbonaceous chondrite rock coloring (slate grey with iron/silicate mineral variations)
      let r = 38 + combined * 45
      let g = 39 + combined * 42
      let b = 43 + combined * 48

      // Occasional chondrule / metallic fleck
      if (Math.sin(nx * 120 + ny * 130) > 0.96 && n2 > 0.2) {
        r += 50
        g += 45
        b += 30
      }

      // Dark dust / regolith pockets
      if (n1 < -0.2) {
        r *= 0.65
        g *= 0.65
        b *= 0.65
      }

      imgData.data[idx] = Math.min(255, Math.max(0, r))
      imgData.data[idx + 1] = Math.min(255, Math.max(0, g))
      imgData.data[idx + 2] = Math.min(255, Math.max(0, b))
      imgData.data[idx + 3] = 255

      // Bump height (0-255)
      const bumpVal = Math.min(255, Math.max(0, 128 + combined * 110))
      bumpData.data[idx] = bumpVal
      bumpData.data[idx + 1] = bumpVal
      bumpData.data[idx + 2] = bumpVal
      bumpData.data[idx + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  bCtx.putImageData(bumpData, 0, 0)

  // Stamp realistic crater circles with raised rims on both maps
  const craters = [
    { x: 320, y: 400, r: 80, depth: 40 },
    { x: 740, y: 280, r: 65, depth: 35 },
    { x: 520, y: 700, r: 95, depth: 50 },
    { x: 200, y: 750, r: 45, depth: 25 },
    { x: 800, y: 650, r: 50, depth: 28 },
    { x: 450, y: 200, r: 40, depth: 20 },
    { x: 650, y: 450, r: 35, depth: 18 }
  ]

  craters.forEach(c => {
    // Crater shadow and rim
    const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r)
    grad.addColorStop(0, 'rgba(12, 13, 16, 0.85)')
    grad.addColorStop(0.7, 'rgba(25, 27, 32, 0.6)')
    grad.addColorStop(0.9, 'rgba(75, 80, 88, 0.75)') // raised rim
    grad.addColorStop(1, 'rgba(30, 32, 36, 0)')

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
    ctx.fill()

    // Bump crater
    const bGrad = bCtx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r)
    bGrad.addColorStop(0, 'rgba(40, 40, 40, 0.9)')
    bGrad.addColorStop(0.75, 'rgba(80, 80, 80, 0.7)')
    bGrad.addColorStop(0.92, 'rgba(220, 220, 220, 0.9)') // high rim
    bGrad.addColorStop(1, 'rgba(128, 128, 128, 0)')

    bCtx.fillStyle = bGrad
    bCtx.beginPath()
    bCtx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
    bCtx.fill()
  })

  const diffuseMap = new THREE.CanvasTexture(canvas)
  diffuseMap.wrapS = THREE.RepeatWrapping
  diffuseMap.wrapT = THREE.RepeatWrapping

  const bumpMap = new THREE.CanvasTexture(bumpCanvas)
  bumpMap.wrapS = THREE.RepeatWrapping
  bumpMap.wrapT = THREE.RepeatWrapping

  return { diffuseMap, bumpMap }
}

// Generate realistic cratered, irregular asteroid 3D geometry
export function createRealisticAsteroidGeometry(radius = 1, detail = 4, seed = 100) {
  const geometry = new THREE.IcosahedronGeometry(radius, detail)
  const pos = geometry.attributes.position
  const vertex = new THREE.Vector3()
  const noise = new SimplexNoise3D(seed)

  // Generate 8-12 crater centers distributed randomly on unit sphere
  const craters = []
  const craterCount = 10
  for (let i = 0; i < craterCount; i++) {
    const phi = Math.random() * Math.PI * 2
    const theta = Math.acos(Math.random() * 2 - 1)
    craters.push({
      center: new THREE.Vector3(
        Math.sin(theta) * Math.cos(phi),
        Math.sin(theta) * Math.sin(phi),
        Math.cos(theta)
      ),
      radius: 0.25 + Math.random() * 0.45,
      depth: 0.15 + Math.random() * 0.2
    })
  }

  // Elongation factors to make it non-spherical (boulder / potato shape like Asteroid Bennu/Eros)
  const stretchX = 1.15 + (Math.sin(seed) * 0.15)
  const stretchY = 0.88 + (Math.cos(seed) * 0.12)
  const stretchZ = 1.02 + (Math.sin(seed * 2) * 0.1)

  for (let i = 0; i < pos.count; i++) {
    vertex.fromBufferAttribute(pos, i)

    // Normalize to get spherical direction
    const unit = vertex.clone().normalize()

    // 1. Broad lumpy irregular shape with low-frequency noise
    const lowNoise = noise.fbm(unit.x * 1.2, unit.y * 1.2, unit.z * 1.2, 3) * 0.35

    // 2. Medium frequency rocky facets and ridges
    const midNoise = noise.fbm(unit.x * 3.5, unit.y * 3.5, unit.z * 3.5, 3) * 0.14

    // 3. High frequency micro rock roughness
    const highNoise = noise.fbm(unit.x * 9.0, unit.y * 9.0, unit.z * 9.0, 2) * 0.05

    let displacement = 1 + lowNoise + midNoise + highNoise

    // 4. Crater depressions with raised rim walls
    for (let c = 0; c < craters.length; c++) {
      const cr = craters[c]
      const dist = unit.distanceTo(cr.center)
      if (dist < cr.radius) {
        const factor = dist / cr.radius
        // Bowl shape depression
        const depression = -cr.depth * Math.cos(factor * Math.PI * 0.5)
        // Raised circular rim
        const rim = Math.sin(factor * Math.PI) * (cr.depth * 0.4)
        displacement += (depression + rim) * (1 - factor * 0.3)
      }
    }

    // Apply asymmetric boulder stretch
    vertex.x = unit.x * radius * displacement * stretchX
    vertex.y = unit.y * radius * displacement * stretchY
    vertex.z = unit.z * radius * displacement * stretchZ

    pos.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }

  geometry.computeVertexNormals()
  return geometry
}
