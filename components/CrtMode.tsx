'use client'

import { useEffect, useState } from 'react'

export function CrtMode() {
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('crt') === '1') setOn(true)
    const onToggle = () =>
      setOn((v) => {
        localStorage.setItem('crt', v ? '0' : '1')
        return !v
      })
    window.addEventListener('crt:toggle', onToggle)
    return () => window.removeEventListener('crt:toggle', onToggle)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event('crt:toggle'))}
        className="fixed bottom-4 right-4 z-[160] rounded-full border border-white/15 bg-black/60 px-3 py-1.5 font-mono text-[11px] text-white/60 backdrop-blur transition hover:text-white"
        aria-pressed={on}
      >
        CRT {on ? 'ON' : 'OFF'}
      </button>

      {on ? (
        <>
          <div
            className="pointer-events-none fixed inset-0 z-[150]"
            style={{
              backdropFilter: 'sepia(0.55) hue-rotate(-18deg) saturate(1.45) contrast(1.06)',
              WebkitBackdropFilter: 'sepia(0.55) hue-rotate(-18deg) saturate(1.45) contrast(1.06)'
            }}
          />
          <div
            className="pointer-events-none fixed inset-0 z-[151] opacity-[0.08]"
            style={{
              background:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 1px, transparent 1px, transparent 3px)'
            }}
          />
          <div
            className="pointer-events-none fixed inset-0 z-[151]"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)'
            }}
          />
        </>
      ) : null}
    </>
  )
}
