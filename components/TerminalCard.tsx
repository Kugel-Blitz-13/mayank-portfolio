'use client'

import { useEffect, useState } from 'react'

export function TerminalCard({ lastShip }: { lastShip?: string | null }) {
  const [now, setNow] = useState<Date | null>(null)
  const [hz, setHz] = useState('60.00')

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => {
      setNow(new Date())
      setHz((60 + (Math.random() - 0.5) * 0.04).toFixed(2))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const et = now
    ? new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(now)
    : '··:··:··'

  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-4 font-mono text-xs backdrop-blur-xl">
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-2.5">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
        <span className="h-2 w-2 rounded-full bg-green-400/70" />
        <span className="pl-2 text-white/40">mayank@desk ~ status</span>
      </div>
      <div className="space-y-1.5 pt-3 text-white/70">
        <p>
          <span className="text-accent">&gt;</span> location: Pittsburgh, PA
        </p>
        <p>
          <span className="text-accent">&gt;</span> desk time: {et} ET
        </p>
        <p className="flex items-center gap-2">
          <span className="text-accent">&gt;</span> status:
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-emerald-300">open to full time roles, Dec 2026</span>
        </p>
        <p>
          <span className="text-accent">&gt;</span> current: CMU + Boeing funded MCP research
        </p>
        <p>
          <span className="text-accent">&gt;</span> grid frequency: {hz} Hz
        </p>
        {lastShip ? (
          <p>
            <span className="text-accent">&gt;</span> last shipped: {lastShip}
          </p>
        ) : null}
        <p>
          <span className="text-accent">&gt;</span> uptime: 3 publications, 0 unhandled exceptions
          <span className="caret text-accent">▊</span>
        </p>
      </div>
    </div>
  )
}
