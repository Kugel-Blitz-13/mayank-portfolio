'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { motion } from 'framer-motion'

const W = 600
const H = 300
const X0 = 44
const X1 = 584
const Y0 = 264
const Y1 = 36
const MW_MIN = 55
const MW_MAX = 105

function hourToX(h: number) {
  return X0 + ((X1 - X0) * h) / 23
}
function mwToY(mw: number) {
  return Y0 - ((Y0 - Y1) * (mw - MW_MIN)) / (MW_MAX - MW_MIN)
}
function yToMw(y: number) {
  return MW_MIN + ((Y0 - y) * (MW_MAX - MW_MIN)) / (Y0 - Y1)
}

function genCurve(): number[] {
  const heat = 0.75 + Math.random() * 0.55
  const out: number[] = []
  for (let h = 0; h < 24; h++) {
    const base = 68 + 3 * Math.sin((h / 24) * Math.PI * 2)
    const morning = 7 * Math.exp(-Math.pow(h - 8, 2) / 7)
    const evening = 19 * heat * Math.exp(-Math.pow(h - 18.5, 2) / 7)
    const noise = (Math.random() - 0.5) * 1.6
    out.push(base + morning + evening + noise)
  }
  return out
}

function curvePath(curve: number[]): string {
  const pts = curve.map((mw, h) => ({ x: hourToX(h), y: mwToY(mw) }))
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, pts.length - 1)]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

type Guess = { x: number; y: number }

export function PeakGame() {
  const [yesterday, setYesterday] = useState<number[] | null>(null)
  const [today, setToday] = useState<number[] | null>(null)
  const [modelErr, setModelErr] = useState(1)
  const [guess, setGuess] = useState<Guess | null>(null)
  const [revealed, setRevealed] = useState(false)

  const reset = () => {
    setYesterday(genCurve())
    setToday(genCurve())
    setModelErr(0.4 + Math.random() * 1.4)
    setGuess(null)
    setRevealed(false)
  }

  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClick = (e: MouseEvent<SVGSVGElement>) => {
    if (revealed || !today) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * W
    const y = ((e.clientY - r.top) / r.height) * H
    setGuess({
      x: Math.min(X1, Math.max(X0, x)),
      y: Math.min(Y0, Math.max(Y1, y))
    })
  }

  let verdict: string | null = null
  let userErrPct = 0
  let peakMW = 0
  let peakHour = 0
  if (today) {
    peakMW = Math.max(...today)
    peakHour = today.indexOf(peakMW)
    if (guess) {
      userErrPct = (Math.abs(yToMw(guess.y) - peakMW) / peakMW) * 100
    }
    if (revealed && guess) {
      verdict =
        userErrPct < modelErr
          ? `You beat the model (${userErrPct.toFixed(1)}% vs ${modelErr.toFixed(1)}%). Unsettling. Email me.`
          : `The model wins: ${modelErr.toFixed(1)}% error vs your ${userErrPct.toFixed(1)}%. Feature engineering remains undefeated.`
    }
  }

  const modelMW = peakMW * (1 + modelErr / 100)

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={revealed ? 'w-full' : 'w-full cursor-crosshair'}
        onClick={onClick}
        role="img"
        aria-label="Load forecasting game chart"
      >
        {[80, 135, 190, 245].map((y) => (
          <line key={y} x1={X0} y1={y} x2={X1} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        ))}
        <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
        {[0, 6, 12, 18, 23].map((h) => (
          <text key={h} x={hourToX(h)} y={Y0 + 18} textAnchor="middle" fontSize={11} fill="rgba(255,255,255,0.4)">
            {h}:00
          </text>
        ))}
        <text x={X0 - 6} y={Y1 + 8} textAnchor="end" fontSize={11} fill="rgba(255,255,255,0.4)">
          GW
        </text>

        {yesterday ? (
          <path
            d={curvePath(yesterday)}
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        ) : null}

        {revealed && today ? (
          <>
            <motion.path
              d={curvePath(today)}
              fill="none"
              stroke="rgb(45 212 191)"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
            <circle cx={hourToX(peakHour)} cy={mwToY(peakMW)} r={6} fill="rgb(45 212 191)" />
            <text
              x={hourToX(peakHour)}
              y={mwToY(peakMW) - 12}
              textAnchor="middle"
              fontSize={11}
              fill="rgba(255,255,255,0.75)"
            >
              actual peak
            </text>
            <circle cx={hourToX(peakHour)} cy={mwToY(modelMW)} r={5} fill="none" stroke="rgb(96 165 250)" strokeWidth={2} />
            <text
              x={hourToX(peakHour) + 12}
              y={mwToY(modelMW) + 4}
              fontSize={11}
              fill="rgba(96,165,250,0.9)"
            >
              model
            </text>
          </>
        ) : null}

        {guess ? (
          <>
            <line
              x1={guess.x - 7}
              y1={guess.y - 7}
              x2={guess.x + 7}
              y2={guess.y + 7}
              stroke="rgb(96 165 250)"
              strokeWidth={2.5}
            />
            <line
              x1={guess.x - 7}
              y1={guess.y + 7}
              x2={guess.x + 7}
              y2={guess.y - 7}
              stroke="rgb(96 165 250)"
              strokeWidth={2.5}
            />
            {!revealed ? (
              <text x={guess.x} y={guess.y - 12} textAnchor="middle" fontSize={11} fill="rgba(255,255,255,0.7)">
                your call
              </text>
            ) : null}
          </>
        ) : null}
      </svg>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setRevealed(true)}
          disabled={!guess || revealed}
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Reveal the actual
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          New day
        </button>
        <p className="text-sm text-white/65">
          {verdict ?? (guess ? 'Locked in. Reveal when ready.' : 'Dashed line is yesterday. Click where today peaks.')}
        </p>
      </div>
    </div>
  )
}
