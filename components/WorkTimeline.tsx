type EntryType = 'Internship' | 'Full time' | 'Research' | 'Education'

type Entry = {
  role: string
  org: string
  meta?: string
  note: string
  type: EntryType
}

type Band = {
  period: string
  entries: Entry[]
}

const styles: Record<EntryType, { bar: string; chip: string; dot: string }> = {
  Internship: {
    bar: 'bg-teal-400 shadow-[0_0_14px_rgba(45,212,191,0.8)]',
    chip: 'border-teal-400/30 bg-teal-400/10 text-teal-300',
    dot: 'bg-teal-400'
  },
  'Full time': {
    bar: 'bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]',
    chip: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    dot: 'bg-emerald-400'
  },
  Research: {
    bar: 'bg-violet-400 shadow-[0_0_14px_rgba(167,139,250,0.8)]',
    chip: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
    dot: 'bg-violet-400'
  },
  Education: {
    bar: 'bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,0.8)]',
    chip: 'border-blue-400/30 bg-blue-400/10 text-blue-300',
    dot: 'bg-blue-400'
  }
}

const bands: Band[] = [
  {
    period: 'Summer 2026',
    entries: [
      {
        role: 'Quantitative Analyst Intern, Load Forecasting',
        org: 'Five Dimensions Energy',
        meta: 'Princeton, NJ',
        note: 'Four projects on my own on the PJM load forecasting desk, including a better day-ahead model and a real-time forecast for every zone.',
        type: 'Internship'
      }
    ]
  },
  {
    period: '2025 to now',
    entries: [
      {
        role: 'M.S. Artificial Intelligence Engineering',
        org: 'Carnegie Mellon University',
        meta: 'GPA 3.92, Pittsburgh, PA',
        note: 'Energy Science, Technology and Policy track. Graduating in December 2026.',
        type: 'Education'
      },
      {
        role: 'Graduate Research Assistant',
        org: 'CMU Design Research Collective',
        meta: 'Boeing funded',
        note: 'Building MCP tools that let AI agents run aircraft design software. The code is open source under cmudrc.',
        type: 'Research'
      }
    ]
  },
  {
    period: '2023 to 2025',
    entries: [
      {
        role: 'Data Scientist, then Senior Data Scientist',
        org: 'Gentari (PETRONAS)',
        meta: 'Gurgaon, India',
        note: 'Built a solar forecast that beat the vendor’s, a private RAG chatbot, and automation for 40 renewable plants. Promoted to senior in 2024.',
        type: 'Full time'
      }
    ]
  },
  {
    period: '2022 to 2023',
    entries: [
      {
        role: 'Research Assistant, B.Tech thesis',
        org: 'NSUT Delhi',
        note: 'Thesis on bearing fault detection with Vision Transformers. It turned into two papers.',
        type: 'Research'
      },
      {
        role: 'Research Intern',
        org: 'IIT Kharagpur',
        note: 'Worked on making driving models harder to fool. Published at CVIP 2022.',
        type: 'Research'
      }
    ]
  },
  {
    period: '2019 to 2023',
    entries: [
      {
        role: 'B.Tech, Electrical Engineering',
        org: 'NSUT Delhi',
        meta: 'IAFBA national scholar',
        note: 'Minor in ML and Data Science. My team won the IIT Ropar Hackathon out of 110 teams.',
        type: 'Education'
      }
    ]
  }
]

function EntryCard({ e }: { e: Entry }) {
  const s = styles[e.type]
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-4 pl-6">
      <span className={`absolute bottom-3 left-2 top-3 w-1 rounded-full ${s.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{e.role}</h3>
          <p className="mt-0.5 text-sm text-white/65">
            {e.org}
            {e.meta ? <span className="text-white/40"> · {e.meta}</span> : null}
          </p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${s.chip}`}>
          {e.type}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{e.note}</p>
    </div>
  )
}

export function WorkTimeline() {
  return (
    <div className="relative pl-6 sm:pl-8">
      <span className="absolute bottom-2 left-1.5 top-2 w-px bg-gradient-to-b from-teal-400/70 via-blue-400/40 to-transparent sm:left-2" />
      <div className="space-y-10">
        {bands.map((band) => (
          <div key={band.period} className="relative">
            <span
              className={`absolute -left-6 top-1 h-3 w-3 rounded-full ring-4 ring-black/60 sm:-left-7 ${styles[band.entries[0].type].dot} shadow-[0_0_12px_rgba(255,255,255,0.35)]`}
              style={{ transform: 'translateX(-1px)' }}
            />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">{band.period}</p>
            <div className={band.entries.length > 1 ? 'mt-3 grid gap-3 md:grid-cols-2' : 'mt-3'}>
              {band.entries.map((e) => (
                <EntryCard key={e.role} e={e} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
