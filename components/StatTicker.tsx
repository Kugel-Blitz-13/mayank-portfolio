const stats: { value: string; label: string }[] = [
  { value: '20', label: 'PJM zones forecast in real time' },
  { value: '15 of 16', label: 'utilities improved across two held out years' },
  { value: '3', label: 'peer reviewed publications' },
  { value: '~2,680', label: 'data center facilities mapped to grid zones' },
  { value: '1st of 110', label: 'teams at the IIT Ropar Hackathon' },
  { value: '40', label: 'renewable plants automated' },
  { value: '1,500', label: 'model configurations benchmarked' },
  { value: '100', label: 'man hours saved every week' },
  { value: '98.7%', label: 'bearing fault classification accuracy' }
]

function Row() {
  return (
    <div className="flex w-max shrink-0 items-center">
      {stats.map((s) => (
        <div key={s.label} className="flex items-baseline">
          <span className="font-space text-sm font-semibold text-accent">{s.value}</span>
          <span className="pl-2 text-xs uppercase tracking-[0.18em] text-white/55">{s.label}</span>
          <span className="px-6 text-xs text-white/25">◆</span>
        </div>
      ))}
    </div>
  )
}

export function StatTicker() {
  return (
    <div className="ticker-mask overflow-hidden py-3" aria-hidden="true">
      <div className="ticker-track flex w-max">
        <Row />
        <Row />
      </div>
    </div>
  )
}
