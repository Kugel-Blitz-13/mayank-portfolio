'use client'

import { useState } from 'react'
import { PeakGame } from '@/components/PeakGame'
import { TechWordle } from '@/components/TechWordle'
import { BitFlip } from '@/components/BitFlip'

type Tab = 'wordle' | 'bitflip' | 'forecast'

const TABS: { id: Tab; label: string }[] = [
  { id: 'wordle', label: 'TECH WORDLE' },
  { id: 'bitflip', label: 'BIT FLIP' },
  { id: 'forecast', label: 'BEAT THE FORECAST' }
]

export function GameArcade() {
  const [tab, setTab] = useState<Tab>('wordle')

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? 'rounded-full border border-accent/50 bg-accent/10 px-4 py-2 font-pixel text-[9px] text-accent'
                : 'rounded-full border border-white/10 bg-white/5 px-4 py-2 font-pixel text-[9px] text-white/50 transition hover:text-white'
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'wordle' ? <TechWordle /> : tab === 'bitflip' ? <BitFlip /> : <PeakGame plain />}
    </div>
  )
}
