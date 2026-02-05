import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Container } from '@/components/Container'
import { VideoHero } from '@/components/VideoHero'
import { featuredProjects, moreProjects } from '@/data/projects'

function getProject(slug: string) {
  return [...featuredProjects, ...moreProjects].find((p) => p.slug === slug)
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug)
  if (!p) notFound()

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
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2">
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

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:col-span-2">
            <p className="text-sm text-white/75">{p.summary}</p>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-white/50">
              Highlights
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {p.highlights.map((h) => (
                <li key={h}>• {h}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Why it matters</p>
            <p className="mt-3 text-sm text-white/70">
              This is written for a fast scan. If you want, I can expand any project into a
              full case study (problem, approach, system design, results, lessons learned).
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/60">Next</p>
              <p className="mt-2 text-sm text-white/75">
                Add a short “Results” block per project once you have metrics (accuracy,
                latency, cost, throughput, or user outcomes).
              </p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
