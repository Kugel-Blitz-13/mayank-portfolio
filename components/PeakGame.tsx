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
const MW_MAX = 115
const ROUNDS = 5

function hourToX(h: number) {
  return X0 + ((X1 - X0) * h) / 23
}
function mwToY(mw: number) {
  return Y0 - ((Y0 - Y1) * (mw - MW_MIN)) / (MW_MAX - MW_MIN)
}
function yToMw(y: number) {
  return MW_MIN + ((Y0 - y) * (MW_MAX - MW_MIN)) / (Y0 - Y1)
}

function genCurve(heat: number, round: number): number[] {
  const out: number[] = []
  for (let h = 0; h < 24; h++) {
    const base = 68 + 3 * Math.sin((h / 24) * Math.PI * 2)
    const morning = 7 * Math.exp(-Math.pow(h - 8, 2) / 7)
    const evening = 19 * heat * Math.exp(-Math.pow(h - 18.5, 2) / 7)
    const noise = (Math.random() - 0.5) * (1.2 + round * 0.3)
    out.push(Math.min(MW_MAX - 2, base + morning + evening + noise))
  }
  return out
}

function weatherNote(delta: number): string {
  if (delta > 0.12) return 'wx desk: noticeably hotter than yesterday'
  if (delta > 0.03) return 'wx desk: a touch hotter than yesterday'
  if (delta < -0.12) return 'wx desk: noticeably cooler than yesterday'
  if (delta < -0.03) return 'wx desk: a touch cooler than yesterday'
  return 'wx desk: about the same as yesterday'
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
type Phase = 'guess' | 'revealed' | 'done'

export function PeakGame({ plain }: { plain?: boolean }) {
  const [round, setRound] = useState(1)
  const [yesterday, setYesterday] = useState<number[] | null>(null)
  const [today, setToday] = useState<number[] | null>(null)
  const [modelErr, setModelErr] = useState(1)
  const [guess, setGuess] = useState<Guess | null>(null)
  const [phase, setPhase] = useState<Phase>('guess')
  const [userTotal, setUserTotal] = useState(0)
  const [modelTotal, setModelTotal] = useState(0)
  const [lastUserErr, setLastUserErr] = useState(0)
  const [best, setBest] = useState<number | null>(null)
  const [wx, setWx] = useState('')

  const newDay = (r: number) => {
    const heatY = 0.7 + Math.random() * (0.45 + r * 0.08)
    const delta = (Math.random() - 0.5) * (0.28 + r * 0.08)
    const heatT = Math.min(1.5, Math.max(0.55, heatY + delta))
    setYesterday(genCurve(heatY, r))
    setToday(genCurve(heatT, r))
    setWx(weatherNote(delta))
    setModelErr(0.8 + Math.random() * (1.3 + r * 0.3))
    setGuess(null)
    setPhase('guess')
  }

  const restart = () => {
    setRound(1)
    setUserTotal(0)
    setModelTotal(0)
    newDay(1)
  }

  useEffect(() => {
    const stored = localStorage.getItem('peak-game-best')
    if (stored) setBest(parseFloat(stored))
    newDay(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClick = (e: MouseEvent<SVGSVGElement>) => {
    if (phase !== 'guess' || !today) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * W
    const y = ((e.clientY - r.top) / r.height) * H
    setGuess({
      x: Math.min(X1, Math.max(X0, x)),
      y: Math.min(Y0, Math.max(Y1, y))
    })
  }

  const reveal = () => {
    if (!today || !guess) return
    const peak = Math.max(...today)
    const err = (Math.abs(yToMw(guess.y) - peak) / peak) * 100
    setLastUserErr(err)
    setUserTotal((t) => t + err)
    setModelTotal((t) => t + modelErr)
    setPhase('revealed')
  }

  const next = () => {
    if (round >= ROUNDS) {
      const finalUser = userTotal
      if (best === null || finalUser < best) {
        setBest(finalUser)
        localStorage.setItem('peak-game-best', finalUser.toFixed(1))
      }
      setPhase('done')
      return
    }
    const r = round + 1
    setRound(r)
    newDay(r)
  }

  const peakMW = today ? Math.max(...today) : 0
  const peakHour = today ? today.indexOf(peakMW) : 0
  const modelMW = peakMW * (1 + modelErr / 100)

  return (
    <div className={plain ? undefined : 'glass rounded-3xl p-4 sm:p-6'}>
      <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/70">
          day {Math.min(round, ROUNDS)} / {ROUNDS}
        </span>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-accent">
          you {userTotal.toFixed(1)}
        </span>
        <span className="rounded-full border border-accent2/30 bg-accent2/10 px-3 py-1 text-accent2">
          model {modelTotal.toFixed(1)}
        </span>
        {best !== null ? (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/45">
            best run {best.toFixed(1)}
          </span>
        ) : null}
        <span className="text-white/35">lower is better</span>
        {phase === 'guess' && wx ? (
          <span className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-yellow-200/80">
            {wx}
          </span>
        ) : null}
      </div>

      {phase === 'done' ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-center">
          <p className="font-space text-2xl font-semibold text-white">
            {userTotal < modelTotal ? 'You beat the model over a full week.' : 'The model takes the week.'}
          </p>
          <p className="max-w-md text-sm text-white/65">
            {userTotal < modelTotal
              ? `Total error ${userTotal.toFixed(1)} vs the model's ${modelTotal.toFixed(1)}. Genuinely impressive. My inbox is open.`
              : `Your total error: ${userTotal.toFixed(1)}. The model: ${modelTotal.toFixed(1)}. Braver souls have tried. It remains undefeated in production.`}
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-2 rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Run it back
          </button>
        </div>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className={phase === 'guess' ? 'w-full cursor-crosshair' : 'w-full'}
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

            {phase === 'revealed' && today ? (
              <>
                <motion.path
                  d={curvePath(today)}
                  fill="none"
                  stroke="rgb(45 212 191)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
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
                <circle
                  cx={hourToX(peakHour)}
                  cy={mwToY(modelMW)}
                  r={5}
                  fill="none"
                  stroke="rgb(96 165 250)"
                  strokeWidth={2}
                />
                <text x={hourToX(peakHour) + 12} y={mwToY(modelMW) + 4} fontSize={11} fill="rgba(96,165,250,0.9)">
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
                {phase === 'guess' ? (
                  <text x={guess.x} y={guess.y - 12} textAnchor="middle" fontSize={11} fill="rgba(255,255,255,0.7)">
                    your call
                  </text>
                ) : null}
              </>
            ) : null}
          </svg>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {phase === 'guess' ? (
              <button
                type="button"
                onClick={reveal}
                disabled={!guess}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Lock it in
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90"
              >
                {round >= ROUNDS ? 'Final score' : 'Next day →'}
              </button>
            )}
            <p className="text-sm text-white/65">
              {phase === 'guess'
                ? guess
                  ? 'Locked on target. Commit.'
                  : 'Dashed line is yesterday. Click where today peaks. Weather gets wilder each day.'
                : lastUserErr < modelErr
                  ? `You took this day: ${lastUserErr.toFixed(1)}% vs the model's ${modelErr.toFixed(1)}%.`
                  : `Model's day: ${modelErr.toFixed(1)}% vs your ${lastUserErr.toFixed(1)}%.`}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
