'use client'

import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { VideoHero } from '@/components/VideoHero'
import type { Project } from '@/data/projects'

function Pill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/75">
      {children}
    </span>
  )
}

export function ProjectCard({ project, compact }: { project: Project; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={clsx(
        'glass group relative flex h-full flex-col overflow-hidden rounded-2xl transition hover:border-white/25',
        compact ? 'p-5' : 'p-5'
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(45,212,191,0.10), transparent 65%)'
        }}
      />

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

      {project.hero?.kind === 'video' && !compact ? (
        <div className="relative mb-4 overflow-hidden rounded-xl border border-white/10">
          <VideoHero src={project.hero.src} poster={project.hero.poster} />
        </div>
      ) : null}

      <div className="relative flex flex-1 flex-col">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-start justify-between gap-3 text-left"
        >
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-white/70">{project.subtitle}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {project.year ? <span className="text-xs text-white/50">{project.year}</span> : null}
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="pt-3 text-sm leading-relaxed text-white/75">{project.summary}</p>
              <Link
                href={`/projects/${project.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
              >
                Full project →
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {project.tags.slice(0, compact ? 4 : 6).map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
      </div>
    </div>
  )
}
