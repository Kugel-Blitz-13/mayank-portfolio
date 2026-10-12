import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Container } from '@/components/Container'
import { VideoHero } from '@/components/VideoHero'
import { featuredProjects, moreProjects } from '@/data/projects'

const ALL = [...featuredProjects, ...moreProjects]

function getProject(slug: string) {
  return ALL.find((p) => p.slug === slug)
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug)
  if (!p) notFound()
  const next = ALL[(ALL.indexOf(p) + 1) % ALL.length]

  return (
    <main className="pt-14 pb-20 sm:pt-20">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/projects"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            ← All projects
          </Link>

          {p.links && p.links.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {p.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
                >
                  {l.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <h1 className="mt-7 text-balance font-space text-4xl font-semibold leading-[1.05] sm:text-5xl">
          {p.title}
        </h1>
        <p className="mt-3 max-w-3xl text-pretty text-white/70">{p.subtitle}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
            >
              {t}
            </span>
          ))}
        </div>

        {p.hero ? (
          <div className="glass mt-10 overflow-hidden rounded-3xl p-2">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              {p.hero.kind === 'video' ? (
                <VideoHero src={p.hero.src} poster={p.hero.poster} />
              ) : (
                <div className="relative aspect-[16/9]">
                  <Image
                    src={p.hero.src}
                    alt={p.hero.alt || p.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="glass mt-10 max-w-3xl rounded-3xl p-6 sm:p-8">
          <p className="text-base leading-relaxed text-white/80">{p.summary}</p>

          <p className="mt-8 text-xs font-medium uppercase tracking-[0.22em] text-white/50">
            What I did
          </p>
          <ul className="mt-4 space-y-4 text-sm leading-relaxed text-white/70 sm:text-[15px]">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={`/projects/${next.slug}`}
          className="group mt-6 flex max-w-3xl items-center justify-between gap-4 rounded-3xl border border-white/10 px-6 py-5 transition hover:border-white/25 hover:bg-white/[0.03] sm:px-8"
        >
          <span>
            <span className="block text-xs font-medium uppercase tracking-[0.22em] text-white/45">
              Next project
            </span>
            <span className="mt-1 block text-base font-semibold text-white">{next.title}</span>
          </span>
          <span className="text-accent transition group-hover:translate-x-1">→</span>
        </Link>
      </Container>
    </main>
  )
}
