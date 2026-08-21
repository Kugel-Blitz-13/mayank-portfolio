'use client'

import { useState } from 'react'
import { PeakGame } from '@/components/PeakGame'
import { TechWordle } from '@/components/TechWordle'

export function GameArcade() {
  const [tab, setTab] = useState<'forecast' | 'wordle'>('forecast')

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab('forecast')}
          className={
            tab === 'forecast'
              ? 'rounded-full border border-accent/50 bg-accent/10 px-4 py-2 font-pixel text-[9px] text-accent'
              : 'rounded-full border border-white/10 bg-white/5 px-4 py-2 font-pixel text-[9px] text-white/50 transition hover:text-white'
          }
        >
          BEAT THE FORECAST
        </button>
        <button
          type="button"
          onClick={() => setTab('wordle')}
          className={
            tab === 'wordle'
              ? 'rounded-full border border-accent/50 bg-accent/10 px-4 py-2 font-pixel text-[9px] text-accent'
              : 'rounded-full border border-white/10 bg-white/5 px-4 py-2 font-pixel text-[9px] text-white/50 transition hover:text-white'
          }
        >
          TECH WORDLE
        </button>
      </div>
      {tab === 'forecast' ? <PeakGame plain /> : <TechWordle />}
    </div>
  )
}
