'use client'

import { useEffect, useRef } from 'react'
import {
  GLYPHS,
  I3,
  clamp01,
  cross,
  dot3,
  drawGlyph,
  easePow,
  mix,
  mulMM,
  mulMV,
  mulberry32,
  normalize,
  orthonormalize,
  pickPair,
  reducedMotionQuery,
  rotAbout,
  type Glyph,
  type Mat,
  type Vec
} from '@/lib/glyph'

// Floating polyhedra in the same glyph patchwork as the idle cube. Each one
// rests, then snaps through one of its own symmetry rotations with the
// cube's ease, so it lands looking identical but with its stickers moved.
// On top of that sits a little physics: a spring holds each shape at home,
// the cursor pushes it around, and you can grab, fling and spin it.

export type ShapeKind = 'tetra' | 'octa' | 'icosa'

const TIMING = {
  turn: 820, // ms for a quarter-turn-sized move
  rest: 1100, // ms between moves (plus jitter)
  easePower: 3
}
const CALM = { turn: 1600, rest: 3200, easePower: 3 }

const LOOK = {
  radius: 0.27, // shape radius as a fraction of the box
  pitchPx: 6.2, // target spacing between glyph centres, in CSS px
  dotSize: 0.78, // glyph size as a fraction of that spacing
  ringHole: 0.4,
  filmPeak: 0.3,
  filmWidth: 0.55,
  maxDpr: 2
}

const PHYS = {
  spring: 55, // pull back to home (1/s^2)
  damping: 6.5, // < 2*sqrt(spring), so it overshoots and wobbles
  repelRadius: 1.15, // cursor influence, in shape radii
  repel: 2600, // px/s^2 at point blank
  spinFriction: 1.4, // 1/s
  bob: 5, // px of idle floating
  dragSpin: 0.011 // rad per px of drag
}

// --------------------------------------------------------------------
//  Geometry
// --------------------------------------------------------------------
type Sym = { axis: Vec; angle: number }
type Dot = { p: Vec; glyph: Glyph; color: string }
type Face = { verts: Vec[]; n: Vec; dots: Dot[] }
type Model = { faces: Face[]; syms: Sym[] }

const PHI = (1 + Math.sqrt(5)) / 2

function rawGeometry(kind: ShapeKind): { verts: Vec[]; faces: number[][]; vertexOrder: number } {
  if (kind === 'tetra') {
    const verts = [
      [1, 1, 1],
      [1, -1, -1],
      [-1, 1, -1],
      [-1, -1, 1]
    ]
    return { verts, faces: [[0, 1, 2], [0, 3, 1], [0, 2, 3], [1, 3, 2]], vertexOrder: 3 }
  }
  if (kind === 'octa') {
    const verts = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1]
    ]
    const faces: number[][] = []
    for (const x of [0, 1]) for (const y of [2, 3]) for (const z of [4, 5]) faces.push([x, y, z])
    return { verts, faces, vertexOrder: 4 }
  }
  const verts: Vec[] = []
  for (const a of [-1, 1])
    for (const b of [-PHI, PHI]) {
      verts.push([0, a, b], [a, b, 0], [b, 0, a])
    }
  // Faces are the triples whose pairwise distances all equal the edge (2).
  const faces: number[][] = []
  const d = (i: number, j: number) => Math.hypot(...verts[i].map((v, k) => v - verts[j][k]))
  for (let i = 0; i < 12; i++)
    for (let j = i + 1; j < 12; j++)
      for (let k = j + 1; k < 12; k++)
        if (Math.abs(d(i, j) - 2) < 1e-6 && Math.abs(d(j, k) - 2) < 1e-6 && Math.abs(d(i, k) - 2) < 1e-6)
          faces.push([i, j, k])
  return { verts, faces, vertexOrder: 5 }
}

const lerp3 = (a: Vec, b: Vec, t: number) => a.map((v, i) => v + (b[i] - v) * t)
const centroid = (ps: Vec[]) => [0, 1, 2].map((k) => ps.reduce((s, p) => s + p[k], 0) / ps.length)

function buildModel(kind: ShapeKind, radiusPx: number, seed: number): Model {
  const rand = mulberry32(seed)
  const geo = rawGeometry(kind)
  const verts = geo.verts.map(normalize)

  const faces: Face[] = geo.faces.map((idx) => {
    let [a, b, c] = idx.map((i) => verts[i])
    // Wind every face outward.
    const n0 = cross(
      b.map((v, k) => v - a[k]),
      c.map((v, k) => v - a[k])
    )
    if (dot3(n0, centroid([a, b, c])) < 0) [b, c] = [c, b]
    const n = normalize(
      cross(
        b.map((v, k) => v - a[k]),
        c.map((v, k) => v - a[k])
      )
    )

    // Big faces get four stickers (midpoint split), like the cube's 3x3.
    // The icosahedron's twenty faces are small already, so each face is one
    // sticker; splitting them turns the whole thing into confetti.
    const ab = lerp3(a, b, 0.5)
    const bc = lerp3(b, c, 0.5)
    const ca = lerp3(c, a, 0.5)
    const stickers =
      kind === 'icosa'
        ? [[a, b, c]]
        : [
            [a, ab, ca],
            [ab, b, bc],
            [ca, bc, c],
            [bc, ca, ab]
          ]
    const stickerEdge = Math.hypot(...stickers[0][1].map((v, k) => v - stickers[0][0][k]))
    // Lattice density so glyph spacing lands near LOOK.pitchPx on screen.
    const lattice = Math.max(2, Math.min(8, Math.round((0.577 * stickerEdge * radiusPx) / LOOK.pitchPx)))

    const dots: Dot[] = []
    for (const [p0, p1, p2] of stickers) {
      const glyph = GLYPHS[Math.floor(rand() * GLYPHS.length)]
      const [c0, c1] = pickPair(rand, kind === 'icosa' ? 1 : 2)
      // Gradient direction in the sticker's plane.
      const e1 = normalize(p1.map((v, k) => v - p0[k]))
      const e2 = normalize(cross(n, e1))
      const ang = rand() * Math.PI * 2
      const dir = e1.map((v, k) => v * Math.cos(ang) + e2[k] * Math.sin(ang))
      const mid = centroid([p0, p1, p2])
      const ext = Math.max(...[p0, p1, p2].map((p) => Math.abs(dot3(p.map((v, k) => v - mid[k]), dir)))) || 1
      const at = (u: number, v: number) =>
        p0.map((x, k) => x + ((p1[k] - x) * u + (p2[k] - x) * v) / lattice)
      const push = (p: Vec) => {
        const t = 0.5 + (0.5 * dot3(p.map((v, k) => v - mid[k]), dir)) / ext
        dots.push({ p, glyph, color: mix(c0, c1, clamp01(t)) })
      }
      // Centroids of the small triangles: n^2 evenly spaced points, none on
      // an edge, so neighbouring stickers keep a clean seam.
      for (let i = 0; i < lattice; i++)
        for (let j = 0; i + j < lattice; j++) {
          push(at(i + 1 / 3, j + 1 / 3))
          if (i + j < lattice - 1) push(at(i + 2 / 3, j + 2 / 3))
        }
    }
    return { verts: [a, b, c], n, dots }
  })

  // Symmetry rotations: through vertices, face centres and edge midpoints.
  const syms: Sym[] = []
  for (const v of verts) syms.push({ axis: v, angle: (2 * Math.PI) / geo.vertexOrder })
  for (const f of faces) syms.push({ axis: normalize(centroid(f.verts)), angle: (2 * Math.PI) / 3 })
  for (const f of faces)
    for (let i = 0; i < 3; i++)
      syms.push({ axis: normalize(lerp3(f.verts[i], f.verts[(i + 1) % 3], 0.5)), angle: Math.PI })

  return { faces, syms }
}

// A pleasant resting pose: tipped toward the viewer, not edge-on.
const START_POSE: Record<ShapeKind, Mat> = {
  tetra: mulMM(rotAbout([1, 0, 0], -0.5), rotAbout([0, 1, 0], 0.35)),
  octa: mulMM(rotAbout([1, 0, 0], 0.42), rotAbout([0, 1, 0], 0.62)),
  icosa: mulMM(rotAbout([1, 0, 0], 0.3), rotAbout([0, 1, 0], 0.2))
}

// --------------------------------------------------------------------
//  Component
// --------------------------------------------------------------------
export function GlyphShape({
  kind,
  className,
  seed = 1
}: {
  kind: ShapeKind
  className?: string
  seed?: number
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = boxRef.current
    const canvas = canvasRef.current
    const hit = hitRef.current
    if (!box || !canvas || !hit) return
    const ctx = canvas.getContext('2d')!

    const motion = reducedMotionQuery()
    let reduced = motion.matches
    const timing = () => (reduced ? CALM : TIMING)
    const ease = (t: number) => easePow(t, timing().easePower)

    // --- sizing -------------------------------------------------------
    let B = 0 // box size in CSS px
    let R = 0 // shape radius in CSS px
    let dpr = 1
    let model: Model | null = null
    let glyphSize = 3
    function resize() {
      const rect = box!.getBoundingClientRect()
      const nb = Math.round(rect.width)
      dpr = Math.min(LOOK.maxDpr, window.devicePixelRatio || 1)
      canvas!.width = Math.round(nb * dpr)
      canvas!.height = Math.round(nb * dpr)
      if (nb !== B || !model) {
        B = nb
        R = B * LOOK.radius
        model = buildModel(kind, R, seed)
        hit!.style.width = hit!.style.height = `${R * 2}px`
      }
      glyphSize = LOOK.pitchPx * LOOK.dotSize
      dirty = true
    }

    // --- state --------------------------------------------------------
    let rot: Mat = START_POSE[kind]
    let spin: Vec = [0, 0, 0] // angular velocity, rad/s, world frame
    let ox = 0
    let oy = 0
    let vx = 0
    let vy = 0
    const phase = seed * 1.7
    let turn: { sym: Sym; dir: number; start: number; dur: number } | null = null
    let nextTurnAt = performance.now() + 600 + ((seed * 977) % 1400)
    let pointer: { x: number; y: number } | null = null
    let drag: {
      id: number
      sx: number
      sy: number
      lx: number
      ly: number
      lt: number
      t0: number
      moved: number
      bx: number
      by: number
    } | null = null
    let dirty = true
    let frames = 0

    function startTurn(now: number) {
      const syms = model!.syms
      const sym = syms[Math.floor(Math.random() * syms.length)]
      const scale = 0.7 + 0.3 * (sym.angle / (Math.PI / 2))
      turn = { sym, dir: Math.random() < 0.5 ? 1 : -1, start: now, dur: timing().turn * scale }
    }
    function turnMatrix(now: number): Mat {
      if (!turn) return I3
      const p = ease(clamp01((now - turn.start) / turn.dur))
      return rotAbout(turn.sym.axis, turn.dir * turn.sym.angle * p)
    }

    // --- physics ------------------------------------------------------
    const maxOffset = () => B / 2 - R - 2
    function step(now: number, dt: number) {
      // Position: spring to home (plus a gentle bob), cursor pushes away.
      const bob = reduced ? 0 : PHYS.bob * Math.sin(now / 1000 / 2.6 + phase)
      if (drag) {
        // Rubber band: the further you pull, the harder it resists.
        const m = maxOffset()
        const dx = drag.bx + (drag.lx - drag.sx)
        const dy = drag.by + (drag.ly - drag.sy)
        const d = Math.hypot(dx, dy) || 1
        const k = (m * Math.tanh(d / m)) / d
        const nx = dx * k
        const ny = dy * k
        vx = (nx - ox) / Math.max(dt, 1 / 120)
        vy = (ny - oy) / Math.max(dt, 1 / 120)
        ox = nx
        oy = ny
      } else {
        let ax = -PHYS.spring * ox - PHYS.damping * vx
        let ay = -PHYS.spring * (oy - bob) - PHYS.damping * vy
        if (pointer) {
          const r = box!.getBoundingClientRect()
          const cx = r.left + r.width / 2 + ox
          const cy = r.top + r.height / 2 + oy
          const dx = cx - pointer.x
          const dy = cy - pointer.y
          const dist = Math.hypot(dx, dy)
          const reach = R * (1 + PHYS.repelRadius)
          if (dist < reach && dist > 0.5) {
            const f = PHYS.repel * Math.pow(1 - dist / reach, 2)
            ax += (dx / dist) * f
            ay += (dy / dist) * f
            // Being shoved also sets it spinning along the shove.
            const ux = dx / dist
            const uy = dy / dist
            spin = spin.map((w, k) => w + [uy, ux, 0][k] * f * 0.0016 * dt)
          }
        }
        vx += ax * dt
        vy += ay * dt
        ox += vx * dt
        oy += vy * dt
        const m = maxOffset()
        const d = Math.hypot(ox, oy)
        if (d > m) {
          ox *= m / d
          oy *= m / d
          vx *= 0.5
          vy *= 0.5
        }
      }

      // Rotation: free spin with friction.
      const w = Math.hypot(spin[0], spin[1], spin[2])
      if (w > 1e-3) {
        rot = mulMM(rotAbout(spin.map((x) => x / w), w * dt), rot)
        const f = Math.exp(-PHYS.spinFriction * dt)
        spin = spin.map((x) => x * f)
        if (++frames % 90 === 0) rot = orthonormalize(rot)
        dirty = true
      } else spin = [0, 0, 0]

      // Symmetry snaps happen when the shape is left alone.
      if (turn && now >= turn.start + turn.dur) {
        rot = orthonormalize(mulMM(rot, rotAbout(turn.sym.axis, turn.dir * turn.sym.angle)))
        turn = null
        nextTurnAt = now + timing().rest + Math.random() * 700
        dirty = true
      }
      if (!turn && !drag && w < 0.8 && now >= nextTurnAt) startTurn(now)
      if (turn) dirty = true
      if (Math.abs(vx) + Math.abs(vy) > 0.05 || Math.abs(ox) + Math.abs(oy - bob) > 0.05) dirty = true
    }

    // --- drawing ------------------------------------------------------
    function draw(now: number) {
      const M = mulMM(rot, turnMatrix(now))
      const cx = B / 2 + ox
      const cy = B / 2 + oy
      const D = 5 // eye distance in radii: a long lens, like the cube's
      const proj = (p: Vec): [number, number] => {
        const w = mulMV(M, p)
        const k = (R * D) / (D - w[2])
        return [cx + w[0] * k, cy - w[1] * k]
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalAlpha = 1
      ctx.clearRect(0, 0, B, B)
      ctx.lineWidth = Math.max(1, (glyphSize * (1 - LOOK.ringHole)) / 2)

      const prog = turn ? clamp01((now - turn.start) / turn.dur) : 0
      const film = turn ? LOOK.filmPeak * Math.sin(Math.PI * prog) : 0
      let grad: CanvasGradient | null = null
      if (film > 0.003 && turn) {
        // A bright band sweeps across, perpendicular to the turn axis.
        const a = mulMV(rot, turn.sym.axis)
        let px = a[1]
        let py = a[0]
        const l = Math.hypot(px, py)
        if (l < 0.2) {
          px = 1
          py = 0
        } else {
          px /= l
          py /= l
        }
        if (turn.dir < 0) {
          px = -px
          py = -py
        }
        const fw = LOOK.filmWidth
        const sweep = -fw + (1 + 2 * fw) * ease(prog)
        grad = ctx.createLinearGradient(cx - px * R, cy - py * R, cx + px * R, cy + py * R)
        const band = (s: number) => Math.max(0, 1 - Math.abs(s - sweep) / fw)
        for (const s of [0, sweep - fw, sweep, sweep + fw, 1].filter((s) => s >= 0 && s <= 1).sort((x, y) => x - y))
          grad.addColorStop(s, `rgba(255,255,255,${band(s)})`)
      }

      for (const f of model!.faces) {
        const nz = mulMV(M, f.n)[2]
        if (nz <= 0.02) continue
        // Faces turned away from the viewer read dimmer, for depth.
        ctx.globalAlpha = 0.4 + 0.6 * nz
        for (const d of f.dots) {
          const [x, y] = proj(d.p)
          drawGlyph(ctx, d.glyph, x, y, glyphSize, d.color)
        }
        if (grad) {
          ctx.globalAlpha = film
          ctx.fillStyle = grad
          ctx.beginPath()
          f.verts.forEach((v, i) => {
            const [x, y] = proj(v)
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          })
          ctx.closePath()
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      hit!.style.transform = `translate(${cx - R}px, ${cy - R}px)`
      dirty = false
    }

    // --- loop ---------------------------------------------------------
    let raf = 0
    let last = 0
    let onScreen = false
    function frame(t: number) {
      raf = requestAnimationFrame(frame)
      if (B === 0) resize()
      if (B === 0) return
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 1 / 60)
      last = t
      step(t, dt)
      if (dirty) draw(t)
    }
    function sync() {
      const on = onScreen && !document.hidden
      if (on && !raf) {
        last = 0
        // Don't fire a backlog of moves the moment it comes back.
        nextTurnAt = Math.max(nextTurnAt, performance.now() + 400)
        raf = requestAnimationFrame(frame)
      } else if (!on && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    // --- input --------------------------------------------------------
    const onWindowPointer = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      pointer = { x: e.clientX, y: e.clientY }
    }
    const onWindowLeave = () => {
      pointer = null
    }
    const onDown = (e: PointerEvent) => {
      e.preventDefault()
      hit.setPointerCapture(e.pointerId)
      const now = performance.now()
      drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, lx: e.clientX, ly: e.clientY, lt: now, t0: now, moved: 0, bx: ox, by: oy }
      hit.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const now = performance.now()
      const dx = e.clientX - drag.lx
      const dy = e.clientY - drag.ly
      const dt = Math.max(0.008, (now - drag.lt) / 1000)
      // Trackball: dragging right spins about +y, dragging down about +x.
      const target = [dy, dx, 0].map((v) => (v * PHYS.dragSpin) / dt)
      spin = spin.map((w, k) => w * 0.4 + target[k] * 0.6)
      drag.moved += Math.hypot(dx, dy)
      drag.lx = e.clientX
      drag.ly = e.clientY
      drag.lt = now
    }
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const now = performance.now()
      // A held-still release should not keep the last flick's speed.
      if (now - drag.lt > 90) spin = spin.map((w) => w * 0.15)
      const tap = drag.moved < 6 && now - drag.t0 < 350
      drag = null
      hit.style.cursor = ''
      if (tap) {
        // Tap: a little hop and an immediate symmetry snap.
        vy -= 260
        if (!turn) startTurn(now)
      }
    }
    const onMotion = (e: MediaQueryListEvent) => {
      reduced = e.matches
      dirty = true
    }

    window.addEventListener('pointermove', onWindowPointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', onWindowLeave)
    hit.addEventListener('pointerdown', onDown)
    hit.addEventListener('pointermove', onMove)
    hit.addEventListener('pointerup', onUp)
    hit.addEventListener('pointercancel', onUp)
    motion.addEventListener('change', onMotion)
    const onVisibility = () => sync()
    document.addEventListener('visibilitychange', onVisibility)

    const ro = new ResizeObserver(() => resize())
    ro.observe(box)
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1]?.isIntersecting ?? false
        sync()
      },
      { rootMargin: '60px' }
    )
    io.observe(box)

    resize()
    draw(performance.now())

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onWindowPointer)
      document.documentElement.removeEventListener('pointerleave', onWindowLeave)
      hit.removeEventListener('pointerdown', onDown)
      hit.removeEventListener('pointermove', onMove)
      hit.removeEventListener('pointerup', onUp)
      hit.removeEventListener('pointercancel', onUp)
      motion.removeEventListener('change', onMotion)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [kind, seed])

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 -translate-x-1/2 ${className ?? ''}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
      <div
        ref={hitRef}
        className="pointer-events-auto absolute left-0 top-0 cursor-grab touch-none rounded-full"
      />
    </div>
  )
}

// The shapes around the home hero, placed in its empty space. Wide screens:
// the photo's top corner plus one shape in each side gutter. Narrower
// screens: the photo corner plus a pair flanking the scroll arrow.
// Classes position each shape's centre.
export function HeroShapes() {
  return (
    <>
      <GlyphShape
        kind="icosa"
        seed={11}
        className="-translate-y-1/2 left-[calc(100%-46px)] top-[30px] h-[128px] w-[128px] lg:left-[min(calc(50%+544px),calc(100%-40px))] lg:top-[86px] lg:h-[210px] lg:w-[210px]"
      />
      <GlyphShape
        kind="octa"
        seed={5}
        className="hidden -translate-y-1/2 left-[calc(50%-600px)] top-[300px] h-[160px] w-[160px] min-[1360px]:block"
      />
      <GlyphShape
        kind="octa"
        seed={5}
        className="bottom-[22px] translate-y-1/2 left-[calc(50%+118px)] h-[112px] w-[112px] min-[1360px]:hidden"
      />
      <GlyphShape
        kind="tetra"
        seed={3}
        className="bottom-[22px] translate-y-1/2 left-[calc(50%-118px)] h-[120px] w-[120px] lg:left-[calc(50%-150px)] lg:h-[140px] lg:w-[140px] min-[1360px]:hidden"
      />
      <GlyphShape
        kind="tetra"
        seed={3}
        className="hidden -translate-y-1/2 left-[calc(50%+604px)] top-[640px] h-[160px] w-[160px] min-[1360px]:block"
      />
    </>
  )
}
