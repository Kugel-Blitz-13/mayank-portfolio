import Link from 'next/link'
import { Reveal } from '@/components/Reveal'
import { selectedWork } from '@/data/projects'

export function SelectedWork() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {selectedWork.map((w, i) => (
        <Reveal key={w.slug} delay={i * 0.08} className="h-full">
          <Link
            href={`/projects/${w.slug}`}
            className="glass group flex h-full flex-col rounded-3xl p-6 transition hover:border-white/25"
          >
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">{w.kicker}</p>
            <p className="mt-5 bg-gradient-to-r from-accent to-accent2 bg-clip-text font-space text-4xl font-semibold tracking-tight text-transparent sm:text-[2.6rem]">
              {w.metric}
            </p>
            <p className="mt-2 text-sm font-medium leading-snug text-white/85">{w.metricLabel}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/65">{w.result}</p>
            <span className="mt-auto pt-5 text-sm font-semibold text-accent transition group-hover:underline">
              Case study →
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  )
}
