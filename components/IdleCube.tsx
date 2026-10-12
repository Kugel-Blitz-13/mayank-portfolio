'use client'

import { useEffect, useRef, useState } from 'react'
import {
  GLYPHS,
  I3,
  PALETTE,
  clamp01,
  cross,
  dot3,
  drawGlyph,
  easePow,
  hexToRgb,
  mix,
  mulMM,
  mulMV,
  mulberry32,
  normalize,
  reducedMotionQuery,
  rgba,
  rotAbout,
  rotAxis,
  roundM,
  transpose,
  type Glyph,
  type Mat,
  type Vec
} from '@/lib/glyph'

// A Rubik's cube that solves nothing. 27 cubies, every sticker a little
// patchwork of glyphs, projected by hand onto a 2D canvas. No WebGL, no
// libraries. Ported from a take-home artifact and restyled for the site.

// =====================================================================
//  Config
// =====================================================================
const CONFIG = {
  dots: 7, // glyphs per sticker edge
  size: 0.74, // resting cube height as a fraction of the canvas height
  dotSize: 0.7, // glyph size as a fraction of the dot spacing
  ringHole: 0.4, // hole in rings / hollow squares, as a fraction of glyph size
  seed: 13, // patchwork seed (glyphs, colours, gradients)

  timing: {
    turn: 760, // ms for one quarter turn
    easePower: 3, // ease exponent: higher = slower start/stop, faster middle
    pause: 380, // ms rest between moves
    swirl: 1500, // ms for a swirl (three counter-rotating hexagon bands)
    swirlEvery: 6, // every Nth movement is a swirl
    doubleChance: 0.3, // chance a turn moves two neighbouring layers
    tripleChance: 0.1, // chance a turn moves all three layers
    layerLag: 110 // ms between successive layers in a multi-layer turn
  },

  colors: {
    // Hue-ordered loop built from the site palette: teal and sky are the
    // accents, the rest walk the wheel so neighbouring hues blend cleanly.
    palette: PALETTE,
    hueSpread: 2, // max palette steps between a sticker's two colours
    inner: 'rgba(255,255,255,0.22)' // dots on inner faces exposed mid-turn
  },

  camera: {
    direction: [1, 1, 1], // eye sits on this body diagonal
    up: [0, 1, 0],
    fov: 12, // degrees; small = long lens, near-flat
    tilt: 0.2 // max pointer tilt in radians
  },

  look: {
    filmPeak: 0.32, // peak opacity of the highlight film on turning faces
    filmWidth: 0.6,
    filmColor: '#ffffff',
    innerSize: 0.5,
    maxDpr: 2,
    glow: true
  },

  glyphs: GLYPHS
}


const N = 3
const HALF = N / 2
const C = CONFIG.colors
const T = CONFIG.timing
// Reduce Motion: keep turning, but slowly, one layer at a time, no swirls.
const CALM: typeof T = {
  turn: 1500,
  easePower: 3,
  pause: 2600,
  swirl: 2400,
  swirlEvery: Infinity,
  doubleChance: 0,
  tripleChance: 0,
  layerLag: 0
}


const easeInOut = (t: number) => easePow(t, T.easePower)

// =====================================================================
//  Model
// =====================================================================
type FaceDef = { id: string; n: Vec; u: Vec; v: Vec }
const FACES: FaceDef[] = [
  { id: 'U', n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  { id: 'D', n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  { id: 'F', n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
  { id: 'B', n: [0, 0, -1], u: [1, 0, 0], v: [0, 1, 0] },
  { id: 'R', n: [1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
  { id: 'L', n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] }
]

type Dot = { local: Vec; glyph: Glyph; color: string }
type Face = { n: Vec; u: Vec; v: Vec; outer: boolean; dots: Dot[]; corners: Vec[] }
type Cubie = { pos: Vec; rot: Mat; faces: Face[] }
type Turn = { axis: number; layers: number[]; dir: number; starts: number[]; start: number; end: number }
type SwirlDot = {
  glyph: Glyph
  color: string
  p0: Vec
  p1: Vec
  h0: number
  phi0: number
  h1: number
  dphi: number
}
type Swirl = { rotFor: (c: Cubie) => Mat; dots: SwirlDot[]; start: number; end: number }

export type CubeMove = { label: string; count: number }

function buildCubies(DOTS: number): Cubie[] {
  const STEP = 1 / DOTS
  const rand = mulberry32(CONFIG.seed)
  const pick = <X,>(arr: readonly X[]) => arr[Math.floor(rand() * arr.length)]

  type Sticker = { glyph: Glyph; c0: number[]; c1: number[]; dir: number[] }
  const stickers = new Map<string, Sticker>()
  for (const f of FACES)
    for (let si = 0; si < N; si++)
      for (let sj = 0; sj < N; sj++) {
        const ang = rand() * Math.PI * 2
        const set = C.palette
        const i0 = Math.floor(rand() * set.length)
        const step = (1 + Math.floor(rand() * C.hueSpread)) * (rand() < 0.5 ? 1 : -1)
        const i1 = (((i0 + step) % set.length) + set.length) % set.length
        stickers.set(`${f.id}:${si}:${sj}`, {
          glyph: pick(CONFIG.glyphs),
          c0: hexToRgb(set[i0]),
          c1: hexToRgb(set[i1]),
          dir: [Math.cos(ang), Math.sin(ang)]
        })
      }

  const cubies: Cubie[] = []
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        const pos = [x, y, z]
        const faces = FACES.map((f): Face => {
          const outer = dot3(pos, f.n) === 1
          const st = outer ? stickers.get(`${f.id}:${dot3(pos, f.u) + 1}:${dot3(pos, f.v) + 1}`)! : null
          const dots: Dot[] = []
          for (let i = 0; i < DOTS; i++)
            for (let j = 0; j < DOTS; j++) {
              const a = -0.5 + (i + 0.5) * STEP
              const b = -0.5 + (j + 0.5) * STEP
              const local = [0, 1, 2].map((k) => f.n[k] * 0.5 + f.u[k] * a + f.v[k] * b)
              if (st) {
                const li = i - (DOTS - 1) / 2
                const lj = j - (DOTS - 1) / 2
                const ext = ((DOTS - 1) / 2) * (Math.abs(st.dir[0]) + Math.abs(st.dir[1]))
                const t = 0.5 + (0.5 * (li * st.dir[0] + lj * st.dir[1])) / ext
                dots.push({ local, glyph: st.glyph, color: mix(st.c0, st.c1, t) })
              } else {
                dots.push({ local, glyph: 'circle', color: C.inner })
              }
            }
          const corners = [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1]
          ].map(([su, sv]) => [0, 1, 2].map((k) => f.n[k] * 0.5 + (f.u[k] * su + f.v[k] * sv) * 0.5))
          return { n: f.n, u: f.u, v: f.v, outer, dots, corners }
        })
        cubies.push({ pos, rot: I3.slice(), faces })
      }
  return cubies
}

// Decorative move notation: single layers use face letters, pairs use wide
// moves, all three layers is a whole-cube rotation.
function notation(t: Turn): string {
  const faces = [
    ['L', 'M', 'R'],
    ['D', 'E', 'U'],
    ['B', 'S', 'F']
  ]
  const wide = [
    ['l', 'r'],
    ['d', 'u'],
    ['b', 'f']
  ]
  const whole = ['x', 'y', 'z']
  const prime = t.dir < 0 ? "'" : ''
  if (t.layers.length === 3) return whole[t.axis] + prime
  if (t.layers.length === 2) return wide[t.axis][t.layers.includes(1) ? 1 : 0] + prime
  return faces[t.axis][t.layers[0] + 1] + prime
}

// =====================================================================
//  Engine
// =====================================================================
type Engine = {
  resize: () => void
  setActive: (on: boolean) => void
  setPointer: (x: number | null, y: number | null) => void
  swirlNow: () => void
  destroy: () => void
}

type EngineOpts = { dots: number; size: number; glow: boolean; tilt: number }

const VARIANTS: Record<'full' | 'mini', EngineOpts> = {
  full: { dots: CONFIG.dots, size: CONFIG.size, glow: CONFIG.look.glow, tilt: CONFIG.camera.tilt },
  mini: { dots: 2, size: 0.94, glow: false, tilt: 0 }
}

function createEngine(
  canvas: HTMLCanvasElement,
  onMove: (m: CubeMove) => void,
  opts: EngineOpts
): Engine {
  const ctx = canvas.getContext('2d')!
  const cubies = buildCubies(opts.dots)
  const STEP = 1 / opts.dots

  const motionQuery = reducedMotionQuery()
  let reducedMotion = motionQuery.matches
  let tm = reducedMotion ? CALM : T

  // --- camera (recomputed when the pointer tilts the view) ------------
  const baseZ = normalize(CONFIG.camera.direction)
  let VIEW: Mat = I3
  let TAN_HALF_FOV = Math.tan((CONFIG.camera.fov * Math.PI) / 360)
  let DIST = 1
  let EYE: Vec = [0, 0, 0]
  let W = 0
  let H = 0
  let DPR = 1
  let scale = 1
  let glyphSize = 4

  let tiltX = 0
  let tiltY = 0
  let tiltTX = 0
  let tiltTY = 0

  function setCamera(tx: number, ty: number) {
    // Yaw about world up, then pitch about the camera's right axis.
    const yaw = rotAbout(normalize(CONFIG.camera.up), -tx * opts.tilt)
    let camZ = mulMV(yaw, baseZ)
    let camX = normalize(cross(CONFIG.camera.up, camZ))
    const pitch = rotAbout(camX, ty * opts.tilt)
    camZ = mulMV(pitch, camZ)
    camX = normalize(cross(CONFIG.camera.up, camZ))
    const camY = cross(camZ, camX)
    VIEW = [...camX, ...camY, ...camZ]
    TAN_HALF_FOV = Math.tan((CONFIG.camera.fov * Math.PI) / 360)

    // Eye distance so the resting cube's projected height is opts.size
    // of the canvas: a*(1/(D+c) + 1/(D-c)) = 2*size*tanHalfFov.
    let a = 0
    let c = 0
    for (let sx = -1; sx <= 1; sx += 2)
      for (let sy = -1; sy <= 1; sy += 2)
        for (let sz = -1; sz <= 1; sz += 2) {
          const [, y, z] = mulMV(VIEW, [sx * HALF, sy * HALF, sz * HALF])
          if (y > a) {
            a = y
            c = Math.abs(z)
          }
        }
    const s = 2 * opts.size * TAN_HALF_FOV
    DIST = (a + Math.sqrt(a * a + s * s * c * c)) / s
    EYE = camZ.map((v) => v * DIST)

    scale = H / 2 / TAN_HALF_FOV
    let pitchPx = Infinity
    for (const f of FACES) {
      if (mulMV(VIEW, f.n)[2] <= 0) continue
      for (const ax of [f.u, f.v]) {
        const [x, y] = mulMV(VIEW, ax)
        pitchPx = Math.min(pitchPx, (Math.hypot(x, y) * STEP * scale) / DIST)
      }
    }
    glyphSize = Math.max(1, pitchPx * CONFIG.dotSize)
  }

  function currentDpr() {
    return Math.min(CONFIG.look.maxDpr, window.devicePixelRatio || 1)
  }

  function resize() {
    DPR = currentDpr()
    const rect = canvas.getBoundingClientRect()
    W = Math.round(rect.width)
    H = Math.round(rect.height)
    canvas.width = Math.round(W * DPR)
    canvas.height = Math.round(H * DPR)
    setCamera(tiltX, tiltY)
    if (swirl) layoutSwirl(swirl)
    needsDraw = true
  }

  function project(p: Vec): [number, number] {
    const [x, y, z] = mulMV(VIEW, p)
    const k = scale / (DIST - z)
    return [W / 2 + x * k, H / 2 - y * k]
  }

  // --- moves ----------------------------------------------------------
  let turn: Turn | null = null
  let swirl: Swirl | null = null
  let nextMoveAt = 0
  let turnsUntilSwirl = tm.swirlEvery - 1
  let moveCount = 0

  function randomTurn(now: number): Turn {
    const axis = Math.floor(Math.random() * 3)
    const r = Math.random()
    let layers: number[]
    if (r < tm.tripleChance) layers = [-1, 0, 1]
    else if (r < tm.tripleChance + tm.doubleChance) layers = Math.random() < 0.5 ? [-1, 0] : [0, 1]
    else layers = [Math.floor(Math.random() * 3) - 1]
    if (Math.random() < 0.5) layers.reverse()
    const dir = Math.random() < 0.5 ? 1 : -1
    const starts = layers.map((_, i) => now + i * tm.layerLag)
    return { axis, layers, dir, starts, start: now, end: starts[starts.length - 1] + tm.turn }
  }
  const layerIndex = (c: Cubie) => (turn ? turn.layers.indexOf(c.pos[turn.axis]) : -1)
  const layerProg = (i: number, now: number) => clamp01((now - turn!.starts[i]) / tm.turn)
  const layerAngle = (i: number, now: number) => (turn!.dir * easeInOut(layerProg(i, now)) * Math.PI) / 2
  const angleOfLayer = (l: number, now: number) => {
    const i = turn ? turn.layers.indexOf(l) : -1
    return i < 0 ? 0 : layerAngle(i, now)
  }

  function commitTurn(t: Turn) {
    const R = roundM(rotAxis(t.axis, (t.dir * Math.PI) / 2))
    for (const c of cubies) {
      if (!t.layers.includes(c.pos[t.axis])) continue
      c.pos = roundM(mulMV(R, c.pos))
      c.rot = roundM(mulMM(R, c.rot))
    }
  }

  function innerExposed(c: Cubie, nWorldInt: Vec, now: number) {
    if (!turn) return false
    const a = turn.axis
    if (nWorldInt[a] === 0) return false
    const l1 = c.pos[a]
    const l2 = l1 + nWorldInt[a]
    if (Math.abs(l2) > 1) return false
    return Math.abs(angleOfLayer(l1, now) - angleOfLayer(l2, now)) > 1e-9
  }

  // Swirl: the three concentric hexagon bands around the centre corner
  // counter-rotate by 120 degrees like hexagonal conveyor belts.
  const toRing = (sx: number, sy: number): [number, number] => {
    const x = sx - W / 2
    const y = H / 2 - sy
    const th = Math.atan2(y, x)
    const k = Math.round(th / (Math.PI / 3))
    const delta = th - (k * Math.PI) / 3
    const h = Math.hypot(x, y) * Math.cos(delta)
    const f = (Math.tan(delta) / Math.tan(Math.PI / 6) + 1) / 2
    const phi = ((((k + 6) % 6) + f) / 6) % 1
    return [h, phi]
  }
  const fromRing = (h: number, phi: number): [number, number] => {
    const p = ((phi % 1) + 1) % 1
    const k = Math.floor(p * 6)
    const f = p * 6 - k
    const delta = Math.atan((2 * f - 1) * Math.tan(Math.PI / 6))
    const th = (k * Math.PI) / 3 + delta
    const r = h / Math.cos(delta)
    return [W / 2 + r * Math.cos(th), H / 2 - r * Math.sin(th)]
  }
  const bandOf = (pos: Vec) => (Math.max(...pos) === 1 ? 1 - Math.min(...pos) : 0)

  function startSwirl(now: number): Swirl {
    // The swirl is laid out around the body diagonal, so ease the camera
    // back to it first; the pointer tilt resumes after the swirl.
    const P: Mat = Math.random() < 0.5 ? [0, 0, 1, 1, 0, 0, 0, 1, 0] : [0, 1, 0, 0, 0, 1, 1, 0, 0]
    const Pinv = transpose(P)
    const rotFor = (c: Cubie) => (bandOf(c.pos) % 2 === 0 ? P : Pinv)
    const dots: SwirlDot[] = []
    for (const c of cubies) {
      const R = rotFor(c)
      for (const f of c.faces) {
        if (!f.outer) continue
        const n = mulMV(c.rot, f.n)
        const centre = [0, 1, 2].map((k) => c.pos[k] + n[k] * 0.5)
        if (dot3(n, [EYE[0] - centre[0], EYE[1] - centre[1], EYE[2] - centre[2]]) <= 0) continue
        for (const d of f.dots) {
          const p0 = mulMV(c.rot, d.local).map((v, k) => v + c.pos[k])
          dots.push({ glyph: d.glyph, color: d.color, p0, p1: mulMV(R, p0), h0: 0, phi0: 0, h1: 0, dphi: 0 })
        }
      }
    }
    const s: Swirl = { rotFor, dots, start: now, end: now + tm.swirl }
    layoutSwirl(s)
    return s
  }

  function layoutSwirl(s: Swirl) {
    for (const d of s.dots) {
      const [h0, phi0] = toRing(...project(d.p0))
      const [h1, phi1] = toRing(...project(d.p1))
      let dphi = phi1 - phi0
      if (dphi > 0.5) dphi -= 1
      if (dphi < -0.5) dphi += 1
      Object.assign(d, { h0, phi0, h1, dphi })
    }
  }

  function commitSwirl(s: Swirl) {
    for (const c of cubies) {
      const R = s.rotFor(c)
      c.pos = roundM(mulMV(R, c.pos))
      c.rot = roundM(mulMM(R, c.rot))
    }
  }

  function report(label: string) {
    moveCount++
    onMove({ label, count: moveCount })
  }

  // A swirl only looks right from the body diagonal, so it waits until the
  // tilt has eased back to zero.
  let swirlPending = false
  const tiltSettled = () => Math.abs(tiltX) < 0.01 && Math.abs(tiltY) < 0.01

  function advance(now: number) {
    if (turn && now >= turn.end) {
      commitTurn(turn)
      turn = null
      nextMoveAt = now + tm.pause
      needsDraw = true
    }
    if (swirl && now >= swirl.end) {
      commitSwirl(swirl)
      swirl = null
      nextMoveAt = now + tm.pause
      needsDraw = true
    }
    if (!turn && !swirl && now >= nextMoveAt) {
      if (turnsUntilSwirl <= 0 || swirlPending) {
        if (tiltSettled()) {
          swirlPending = false
          swirl = startSwirl(now)
          turnsUntilSwirl = tm.swirlEvery - 1
          report('swirl')
        } else {
          swirlPending = true
        }
      } else {
        turn = randomTurn(now)
        turnsUntilSwirl--
        report(notation(turn))
      }
    }
    return !!(turn || swirl)
  }

  function settle() {
    if (turn) {
      commitTurn(turn)
      turn = null
    }
    if (swirl) {
      commitSwirl(swirl)
      swirl = null
    }
    needsDraw = true
  }

  // --- drawing --------------------------------------------------------
  function clear() {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, W, H)
    ctx.lineJoin = 'miter'
    if (opts.glow) {
      const r = Math.min(W, H) * 0.55
      const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, r)
      g.addColorStop(0, 'rgba(45,212,191,0.16)')
      g.addColorStop(0.55, 'rgba(96,165,250,0.07)')
      g.addColorStop(1, 'rgba(96,165,250,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
    }
  }

  function drawCube(now: number) {
    const Rts = turn ? turn.layers.map((_, i) => rotAxis(turn!.axis, layerAngle(i, now))) : []

    type Vis = { f: Face; M: Mat; Tr: Vec; dist: number; moving: boolean; centre: Vec; prog: number }
    const visible: Vis[] = []
    for (const c of cubies) {
      const li = layerIndex(c)
      const moving = li >= 0
      const M = moving ? mulMM(Rts[li], c.rot) : c.rot
      const Tr = moving ? mulMV(Rts[li], c.pos) : c.pos
      for (const f of c.faces) {
        const nInt = mulMV(c.rot, f.n)
        if (!f.outer && !innerExposed(c, nInt, now)) continue
        const n = mulMV(M, f.n)
        const centre = [Tr[0] + n[0] * 0.5, Tr[1] + n[1] * 0.5, Tr[2] + n[2] * 0.5]
        const toEye = [EYE[0] - centre[0], EYE[1] - centre[1], EYE[2] - centre[2]]
        const dist = Math.hypot(toEye[0], toEye[1], toEye[2])
        const cos = dot3(n, toEye) / dist
        if (cos <= 0) continue
        let prog = 0
        if (turn) {
          if (moving) prog = layerProg(li, now)
          else if (!f.outer) {
            const j = turn.layers.indexOf(c.pos[turn.axis] + nInt[turn.axis])
            if (j >= 0) prog = layerProg(j, now)
          }
        }
        visible.push({ f, M, Tr, dist, moving, centre, prog })
      }
    }
    visible.sort((a, b) => b.dist - a.dist)

    const fw = CONFIG.look.filmWidth
    const axisVec = turn ? [0, 1, 2].map((k) => (k === turn!.axis ? turn!.dir : 0)) : null

    clear()
    ctx.globalAlpha = 1
    for (const v of visible) {
      const { f, M, Tr } = v
      const world = (l: Vec) => {
        const p = mulMV(M, l)
        return [p[0] + Tr[0], p[1] + Tr[1], p[2] + Tr[2]]
      }
      const tracePath = () => {
        ctx.beginPath()
        f.corners.forEach((cn, i) => {
          const [x, y] = project(world(cn))
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.closePath()
      }

      const size = f.outer ? glyphSize : glyphSize * CONFIG.look.innerSize
      ctx.lineWidth = Math.max(1, (size * (1 - CONFIG.ringHole)) / 2)
      for (const d of f.dots) {
        const [x, y] = project(world(d.local))
        drawGlyph(ctx, d.glyph, x, y, size, d.color)
      }

      const filmAlpha = CONFIG.look.filmPeak * Math.sin(Math.PI * v.prog)
      const sweep = -fw + (1 + 2 * fw) * easeInOut(v.prog)
      if (turn && axisVec && filmAlpha > 0.003 && (v.moving || !f.outer)) {
        const tangent = cross(axisVec, v.centre)
        const uW = mulMV(M, f.u)
        const vW = mulMV(M, f.v)
        const du = dot3(uW, tangent)
        const dv = dot3(vW, tangent)
        const ax = Math.abs(du) >= Math.abs(dv) ? f.u : f.v
        const sgn = (Math.abs(du) >= Math.abs(dv) ? du : dv) < 0 ? -1 : 1
        const cl = f.n.map((x) => x * 0.5)
        const [x0, y0] = project(world(cl.map((x, k) => x - ax[k] * sgn * 0.5)))
        const [x1, y1] = project(world(cl.map((x, k) => x + ax[k] * sgn * 0.5)))
        const g = ctx.createLinearGradient(x0, y0, x1, y1)
        const band = (s: number) => Math.max(0, 1 - Math.abs(s - sweep) / fw)
        const stops = [0, sweep - fw, sweep, sweep + fw, 1].filter((s) => s >= 0 && s <= 1).sort((a, b) => a - b)
        for (const s of stops) g.addColorStop(s, rgba(CONFIG.look.filmColor, band(s)))
        ctx.globalAlpha = filmAlpha
        ctx.fillStyle = g
        tracePath()
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }
  }

  function drawSwirl(now: number) {
    const u = clamp01((now - swirl!.start) / (swirl!.end - swirl!.start))
    const s = easeInOut(u)
    clear()
    ctx.lineWidth = Math.max(1, (glyphSize * (1 - CONFIG.ringHole)) / 2)
    for (const d of swirl!.dots) {
      const [x, y] = fromRing(d.h0 + (d.h1 - d.h0) * s, d.phi0 + d.dphi * s)
      drawGlyph(ctx, d.glyph, x, y, glyphSize, d.color)
    }
  }

  function draw(now: number) {
    if (swirl) drawSwirl(now)
    else drawCube(now)
    needsDraw = false
  }

  // --- loop -----------------------------------------------------------
  let needsDraw = true
  let rafId = 0
  let pausedOffset = 0
  let hiddenAt = 0
  let active = false
  const clock = () => performance.now() - pausedOffset


  function stepTilt() {
    // Freeze the tilt during a swirl (its path is fixed in screen space),
    // and pull it home while one is pending.
    if (swirl) return
    const tx = swirlPending ? 0 : tiltTX
    const ty = swirlPending ? 0 : tiltTY
    const nx = tiltX + (tx - tiltX) * 0.1
    const ny = tiltY + (ty - tiltY) * 0.1
    if (Math.abs(nx - tiltX) > 1e-4 || Math.abs(ny - tiltY) > 1e-4) {
      tiltX = nx
      tiltY = ny
      setCamera(tiltX, tiltY)
      needsDraw = true
    }
  }

  function frame() {
    rafId = requestAnimationFrame(frame)
    if (W === 0 || H === 0 || currentDpr() !== DPR) resize()
    if (H === 0) return
    const now = clock()
    if (!reducedMotion) stepTilt()
    const animating = advance(now)
    if (animating || needsDraw) draw(now)
  }

  function start() {
    if (!rafId) rafId = requestAnimationFrame(frame)
  }
  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }

  let visible = !document.hidden
  function sync() {
    const on = active && visible
    if (on && !rafId) {
      if (hiddenAt) pausedOffset += performance.now() - hiddenAt
      hiddenAt = 0
      needsDraw = true
      start()
    } else if (!on && rafId) {
      hiddenAt = performance.now()
      stop()
    }
  }
  const onVisibility = () => {
    visible = !document.hidden
    sync()
  }
  document.addEventListener('visibilitychange', onVisibility)

  const onMotion = (e: MediaQueryListEvent) => {
    reducedMotion = e.matches
    settle()
    tm = reducedMotion ? CALM : T
    turnsUntilSwirl = tm.swirlEvery - 1
    swirlPending = false
    if (reducedMotion) setCamera((tiltX = 0), (tiltY = 0))
    nextMoveAt = clock() + tm.pause
    needsDraw = true
  }
  motionQuery.addEventListener('change', onMotion)

  resize()
  nextMoveAt = clock() + tm.pause
  draw(clock())

  return {
    resize,
    setActive(on) {
      active = on
      sync()
    },
    setPointer(x, y) {
      tiltTX = x ?? 0
      tiltTY = y ?? 0
    },
    swirlNow() {
      // Under Reduce Motion a tap asks for one calm turn instead.
      if (reducedMotion) {
        if (!turn && !swirl) nextMoveAt = clock()
        return
      }
      swirlPending = true
      if (!turn && !swirl) nextMoveAt = clock()
      needsDraw = true
    },
    destroy() {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
      motionQuery.removeEventListener('change', onMotion)
    }
  }
}

// =====================================================================
//  Component
// =====================================================================
function useCubeEngine(
  variant: 'full' | 'mini',
  onMove: (m: CubeMove) => void
) {
  const wrapRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const engine = createEngine(canvas, onMove, VARIANTS[variant])
    engineRef.current = engine

    const ro = new ResizeObserver(() => engine.resize())
    ro.observe(wrap)

    // Several entries can arrive in one batch during a fast flick; the
    // last one is the current state.
    const io = new IntersectionObserver(
      (entries) => engine.setActive(entries[entries.length - 1]?.isIntersecting ?? false),
      { rootMargin: '80px' }
    )
    io.observe(wrap)

    return () => {
      ro.disconnect()
      io.disconnect()
      engine.destroy()
      engineRef.current = null
    }
    // onMove is a state setter or a no-op; the engine is built once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant])

  return { wrapRef, canvasRef, engineRef }
}

const noop = () => {}

// A tiny cube for the navbar, next to the name. Hovering the name swirls it.
export function MiniCube({ className }: { className?: string }) {
  const { wrapRef, canvasRef, engineRef } = useCubeEngine('mini', noop)

  useEffect(() => {
    const host = wrapRef.current?.closest('a') ?? wrapRef.current
    if (!host) return
    const swirl = () => engineRef.current?.swirlNow()
    host.addEventListener('mouseenter', swirl)
    return () => host.removeEventListener('mouseenter', swirl)
  }, [wrapRef, engineRef])

  return (
    <span
      ref={wrapRef as React.RefObject<HTMLSpanElement>}
      aria-hidden="true"
      className={`relative inline-block shrink-0 ${className ?? 'h-7 w-7'}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </span>
  )
}

export function IdleCube({ className }: { className?: string }) {
  const [move, setMove] = useState<CubeMove>({ label: '--', count: 0 })
  const { wrapRef, canvasRef, engineRef } = useCubeEngine('full', setMove)
  const touchDown = useRef(false)

  const aim = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 2 - 1
    const y = ((e.clientY - r.top) / r.height) * 2 - 1
    engineRef.current?.setPointer(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)))
  }
  const release = () => {
    touchDown.current = false
    engineRef.current?.setPointer(null, null)
  }

  return (
    <div className={className ?? 'glass rounded-3xl p-2 sm:p-3'}>
      <div
        ref={wrapRef as React.RefObject<HTMLDivElement>}
        role="img"
        aria-label="An animated Rubik's cube made of small coloured glyphs, turning on its own"
        // Mouse: hover to tilt. Touch: drag sideways to tilt; vertical
        // drags still scroll the page.
        onPointerDown={(e) => {
          if (e.pointerType === 'touch') {
            touchDown.current = true
            aim(e)
          }
        }}
        onPointerMove={(e) => {
          if (e.pointerType !== 'touch' || touchDown.current) aim(e)
        }}
        onPointerUp={(e) => e.pointerType === 'touch' && release()}
        onPointerCancel={release}
        onPointerLeave={release}
        onClick={() => engineRef.current?.swirlNow()}
        className="relative aspect-[4/3] w-full cursor-pointer touch-pan-y select-none overflow-hidden rounded-2xl border border-white/10 bg-[rgb(var(--surface))]/60 sm:aspect-[16/9]"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 font-pixel text-[9px] tracking-wider text-white/45">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
          IDLE
        </div>
        <div className="pointer-events-none absolute right-4 top-4 font-pixel text-[9px] tracking-wider text-white/45">
          MOVE {String(move.count).padStart(3, '0')}
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 font-pixel text-[10px] tracking-wider text-accent/80">
          {move.label === 'swirl' ? '⟳ SWIRL' : move.label}
        </div>
        <div className="pointer-events-none absolute bottom-4 right-4 font-pixel text-[8px] tracking-wider text-white/30">
          <span className="hidden sm:inline">HOVER TO TILT · </span>CLICK TO SWIRL
        </div>
      </div>
    </div>
  )
}
