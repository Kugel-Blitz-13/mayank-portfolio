'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const SEQ = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
]

export function GridEvent() {
  const [stage, setStage] = useState<'idle' | 'blackout' | 'restore'>('idle')
  const pos = useRef(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const trigger = () => {
    timers.current.forEach(clearTimeout)
    setStage('blackout')
    timers.current = [
      setTimeout(() => setStage('restore'), 2800),
      setTimeout(() => setStage('idle'), 4800)
    ]
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (k === SEQ[pos.current]) {
        pos.current += 1
        if (pos.current === SEQ.length) {
          pos.current = 0
          trigger()
        }
      } else {
        pos.current = k === SEQ[0] ? 1 : 0
      }
    }
    const onEvent = () => trigger()
    window.addEventListener('keydown', onKey)
    window.addEventListener('grid:blackout', onEvent)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('grid:blackout', onEvent)
      timers.current.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence>
      {stage !== 'idle' ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={
            stage === 'blackout'
              ? { opacity: [0, 1, 0.65, 1, 0.8, 1] }
              : { opacity: 1 }
          }
          exit={{ opacity: 0 }}
          transition={{ duration: stage === 'blackout' ? 0.9 : 0.4 }}
        >
          <div className="max-w-md px-6 font-mono text-sm leading-7">
            {stage === 'blackout' ? (
              <>
                <p className="text-red-400">⚠ grid event detected</p>
                <p className="text-white/70">&gt; frequency falling: 59.21 Hz</p>
                <p className="text-white/70">&gt; shedding non critical load</p>
                <p className="text-white/40">&gt; do not panic. this is what the forecast is for.</p>
              </>
            ) : (
              <>
                <p className="text-accent">&gt; rerouting power</p>
                <p className="text-white/70">&gt; frequency stable: 60.00 Hz</p>
                <p className="text-emerald-300">&gt; back online</p>
              </>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
