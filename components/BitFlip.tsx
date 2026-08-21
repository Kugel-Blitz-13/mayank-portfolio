'use client'

import { useEffect, useState } from 'react'

const START_TENTHS = 150
const BONUS_TENTHS = 45
const MAX_TENTHS = 220

function bitCountFor(score: number) {
  return Math.min(8, 4 + Math.floor(score / 4))
}

function randTarget(bits: number, avoid: number) {
  const max = Math.pow(2, bits) - 1
  let t = avoid
  while (t === avoid) {
    t = 1 + Math.floor(Math.random() * max)
  }
  return t
}

export function BitFlip() {
  const [running, setRunning] = useState(false)
  const [over, setOver] = useState(false)
  const [bits, setBits] = useState<boolean[]>([])
  const [target, setTarget] = useState(0)
  const [score, setScore] = useState(0)
  const [tenths, setTenths] = useState(START_TENTHS)
  const [best, setBest] = useState(0)

  useEffect(() => {
    setBest(parseInt(localStorage.getItem('bf-best') || '0', 10))
  }, [])

  const start = () => {
    setScore(0)
    setBits(Array(4).fill(false))
    setTarget(randTarget(4, 0))
    setTenths(START_TENTHS)
    setOver(false)
    setRunning(true)
  }

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setTenths((t) => {
        if (t <= 1) {
          setRunning(false)
          setOver(true)
          return 0
        }
        return t - 1
      })
    }, 100)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => {
    if (over) {
      setBest((b) => {
        const nb = Math.max(b, score)
        localStorage.setItem('bf-best', String(nb))
        return nb
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over])

  const value = bits.reduce((acc, b, i) => acc + (b ? Math.pow(2, bits.length - 1 - i) : 0), 0)

  const toggle = (i: number) => {
    if (!running) return
    const next = [...bits]
    next[i] = !next[i]
    const v = next.reduce((acc, b, j) => acc + (b ? Math.pow(2, next.length - 1 - j) : 0), 0)
    if (v === target) {
      const ns = score + 1
      const nBits = bitCountFor(ns)
      const grown =
        nBits > next.length ? [...Array(nBits - next.length).fill(false), ...next] : next
      setScore(ns)
      setBits(grown)
      setTarget(randTarget(nBits, v))
      setTenths((t) => Math.min(MAX_TENTHS, t + BONUS_TENTHS))
    } else {
      setBits(next)
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 font-pixel text-[9px]">
        <span className="rounded border border-white/15 bg-white/5 px-2.5 py-1.5 text-white/60">
          SCORE {score}
        </span>
        <span className="rounded border border-white/15 bg-white/5 px-2.5 py-1.5 text-white/40">
          BEST {best}
        </span>
        <span className="text-white/30">FLIP BITS. HIT THE NUMBER. BEAT THE CLOCK.</span>
      </div>

      {!running && !over ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-4">
          <p className="max-w-sm text-center text-sm text-white/60">
            A target number appears. Flip the bits until the binary matches it. Every hit adds time and the numbers get bigger. Classic desk downtime material.
          </p>
          <button
            type="button"
            onClick={start}
            className="rounded-full bg-white px-6 py-2 font-pixel text-[10px] text-black transition hover:opacity-90"
          >
            INSERT COIN
          </button>
        </div>
      ) : over ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-3">
          <p className="font-pixel text-lg text-accent">GAME OVER</p>
          <p className="text-sm text-white/65">
            {score} numbers hit.{' '}
            {score >= best && score > 0 ? 'New personal best.' : `Best is ${best}.`}{' '}
            {score >= 12 ? 'You think in binary. Respect.' : score >= 6 ? 'Solid clock speed.' : 'The clock is undefeated.'}
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-1 rounded-full bg-white px-6 py-2 font-pixel text-[10px] text-black transition hover:opacity-90"
          >
            RUN IT BACK
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-[width] duration-100 ${
                tenths < 40 ? 'bg-red-400' : 'bg-gradient-to-r from-accent to-accent2'
              }`}
              style={{ width: `${Math.min(100, (tenths / MAX_TENTHS) * 100)}%` }}
            />
          </div>

          <div className="text-center">
            <p className="font-pixel text-[9px] text-white/40">TARGET</p>
            <p className="font-pixel text-4xl text-white">{target}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {bits.map((b, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                className={`flex h-12 w-12 items-center justify-center rounded-lg border font-pixel text-base transition sm:h-14 sm:w-14 ${
                  b
                    ? 'border-accent/60 bg-accent/20 text-accent shadow-[0_0_14px_rgba(45,212,191,0.5)]'
                    : 'border-white/15 bg-white/5 text-white/40 hover:bg-white/10'
                }`}
              >
                {b ? 1 : 0}
              </button>
            ))}
          </div>

          <p className="font-pixel text-[10px] text-white/45">
            CURRENT: <span className="text-accent2">{value}</span>
          </p>
        </div>
      )}
    </div>
  )
}
