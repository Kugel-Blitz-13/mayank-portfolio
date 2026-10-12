// Shared look and maths for the glyph objects (the idle cube and the
// floating polyhedra). Everything is drawn by hand on a 2D canvas.

export type Vec = number[]
export type Mat = number[]

export const GLYPHS = ['circle', 'ring', 'triangle', 'square', 'hollowSquare'] as const
export type Glyph = (typeof GLYPHS)[number]

// Hue-ordered loop built from the site palette: teal and sky are the
// accents, the rest walk the wheel so neighbouring hues blend cleanly.
export const PALETTE = [
  '#2dd4bf', // teal (accent)
  '#38bdf8', // cyan
  '#60a5fa', // sky (accent2)
  '#818cf8', // indigo
  '#a78bfa', // violet
  '#e879f9', // fuchsia
  '#fb7185', // rose
  '#fbbf24', // amber
  '#a3e635', // lime
  '#34d399' // emerald
]

export function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const hexToRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
export const rgba = (hex: string, a: number) => {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}
export const mix = (a: number[], b: number[], t: number) => {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return `rgb(${c[0]},${c[1]},${c[2]})`
}

// Pick two neighbouring hues so a gradient never passes through grey.
export function pickPair(rand: () => number, spread = 2): [number[], number[]] {
  const i0 = Math.floor(rand() * PALETTE.length)
  const step = (1 + Math.floor(rand() * spread)) * (rand() < 0.5 ? 1 : -1)
  const i1 = (((i0 + step) % PALETTE.length) + PALETTE.length) % PALETTE.length
  return [hexToRgb(PALETTE[i0]), hexToRgb(PALETTE[i1])]
}

// Symmetric power ease: gradual start, fastest mid-way, gradual stop.
export const easePow = (t: number, p = 3) => {
  if (t <= 0) return 0
  if (t >= 1) return 1
  return t < 0.5 ? 0.5 * Math.pow(2 * t, p) : 1 - 0.5 * Math.pow(2 * (1 - t), p)
}
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

export const I3: Mat = [1, 0, 0, 0, 1, 0, 0, 0, 1]
export const mulMV = (m: Mat, v: Vec): Vec => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
]
export const mulMM = (a: Mat, b: Mat): Mat => {
  const r = new Array<number>(9)
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j]
  return r
}
export const dot3 = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
]
export const normalize = (v: Vec): Vec => {
  const l = Math.hypot(v[0], v[1], v[2])
  return v.map((x) => x / l)
}
export const transpose = (m: Mat): Mat => [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]
export function rotAxis(axis: number, a: number): Mat {
  const c = Math.cos(a)
  const s = Math.sin(a)
  if (axis === 0) return [1, 0, 0, 0, c, -s, 0, s, c]
  if (axis === 1) return [c, 0, s, 0, 1, 0, -s, 0, c]
  return [c, -s, 0, s, c, 0, 0, 0, 1]
}
// Rodrigues rotation about an arbitrary unit axis.
export function rotAbout(k: Vec, a: number): Mat {
  const c = Math.cos(a)
  const s = Math.sin(a)
  const t = 1 - c
  const [x, y, z] = k
  return [
    t * x * x + c, t * x * y - s * z, t * x * z + s * y,
    t * x * y + s * z, t * y * y + c, t * y * z - s * x,
    t * x * z - s * y, t * y * z + s * x, t * z * z + c
  ]
}
export const roundM = (m: number[]) => m.map((v) => Math.round(v))

// Re-orthonormalise a rotation matrix that has drifted after many
// incremental multiplications (Gram-Schmidt on the rows).
export function orthonormalize(m: Mat): Mat {
  const x = normalize([m[0], m[1], m[2]])
  let y = [m[3], m[4], m[5]]
  const d = dot3(x, y)
  y = normalize([y[0] - d * x[0], y[1] - d * x[1], y[2] - d * x[2]])
  const z = cross(x, y)
  return [...x, ...y, ...z]
}

// Glyphs are drawn in screen space so they always face the viewer.
export function drawGlyph(
  ctx: CanvasRenderingContext2D,
  kind: Glyph,
  x: number,
  y: number,
  size: number,
  color: string
) {
  const r = size / 2
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.beginPath()
  switch (kind) {
    case 'circle':
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'ring':
      ctx.arc(x, y, Math.max(0.1, r - ctx.lineWidth / 2), 0, Math.PI * 2)
      ctx.stroke()
      break
    case 'triangle': {
      const R = r * 1.18
      const h = R * Math.sin((2 * Math.PI) / 3)
      const w = -R * Math.cos((2 * Math.PI) / 3)
      ctx.moveTo(x, y - R)
      ctx.lineTo(x + h, y + w)
      ctx.lineTo(x - h, y + w)
      ctx.closePath()
      ctx.fill()
      break
    }
    case 'square': {
      const s = r * 1.76
      ctx.rect(x - s / 2, y - s / 2, s, s)
      ctx.fill()
      break
    }
    case 'hollowSquare': {
      const s = Math.max(0.2, r * 1.76 - ctx.lineWidth)
      ctx.rect(x - s / 2, y - s / 2, s, s)
      ctx.stroke()
      break
    }
  }
}

// Shared reduced-motion query. Objects keep moving under it, just calmly:
// slower turns, longer rests, no swirls or springy bobbing.
export function reducedMotionQuery() {
  return window.matchMedia('(prefers-reduced-motion: reduce)')
}
