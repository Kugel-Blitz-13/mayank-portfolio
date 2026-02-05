import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import type { Project } from '@/data/projects'

function Pill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/75">
      {children}
    </span>
  )
}

export function ProjectCard({ project, compact }: { project: Project; compact?: boolean }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={clsx(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-[rgb(var(--card))] shadow-glow transition hover:border-white/20',
        compact && 'p-5',
        !compact && 'p-6'
      )}
    >
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="glow" />
      </div>

      {project.hero?.kind === 'image' && !compact ? (
        <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl border border-white/10">
          <Image
            src={project.hero.src}
            alt={project.hero.alt || project.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 720px"
          />
        </div>
      ) : null}

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-white/70">{project.subtitle}</p>
          </div>
          {project.year ? (
            <span className="shrink-0 text-xs text-white/50">{project.year}</span>
          ) : null}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/75">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, compact ? 4 : 6).map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
      </div>
    </Link>
  )
}
