import { ReactNode } from 'react'

export function SectionHeading({
  title,
  kicker,
  right
}: {
  title: string
  kicker?: string
  right?: ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        {kicker ? (
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
            {kicker}
          </p>
        ) : null}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}
