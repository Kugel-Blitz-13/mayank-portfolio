const artifacts = [
  { t: '✳', top: '6%', size: 18, dur: 46, delay: -12, color: 'text-accent/30' },
  { t: '+', top: '20%', size: 15, dur: 38, delay: -30, color: 'text-accent2/30' },
  { t: '1UP', top: '33%', size: 10, dur: 54, delay: -8, color: 'text-emerald-300/25' },
  { t: '▲', top: '48%', size: 12, dur: 42, delay: -22, color: 'text-violet-300/25' },
  { t: '✦', top: '60%', size: 16, dur: 35, delay: -5, color: 'text-accent/25' },
  { t: 'PRESS START', top: '74%', size: 9, dur: 62, delay: -40, color: 'text-white/15' },
  { t: '*', top: '88%', size: 15, dur: 44, delay: -18, color: 'text-accent2/25' },
  { t: '<>', top: '14%', size: 11, dur: 50, delay: -35, color: 'text-white/15' },
  { t: '◆', top: '42%', size: 10, dur: 40, delay: -15, color: 'text-yellow-300/20' },
  { t: 'ERR:0', top: '68%', size: 9, dur: 58, delay: -27, color: 'text-white/12' },
  { t: '▚', top: '82%', size: 13, dur: 47, delay: -33, color: 'text-accent/20' }
]

export function PixelDrift() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {artifacts.map((a, i) => (
        <span
          key={i}
          className={`pixel-drift absolute font-pixel ${a.color}`}
          style={{
            top: a.top,
            fontSize: `${a.size}px`,
            animationDuration: `${a.dur}s`,
            animationDelay: `${a.delay}s`
          }}
        >
          {a.t}
        </span>
      ))}
    </div>
  )
}
