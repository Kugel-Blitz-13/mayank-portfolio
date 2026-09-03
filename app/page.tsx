import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { ProjectCard } from '@/components/ProjectCard'
import { TypedWords } from '@/components/TypedWords'
import { StatTicker } from '@/components/StatTicker'
import { CareerCurve } from '@/components/CareerCurve'
import { TerminalCard } from '@/components/TerminalCard'
import { PixelDrift } from '@/components/PixelDrift'
import { WorkTimeline } from '@/components/WorkTimeline'
import { Tilt } from '@/components/Tilt'
import { Reveal } from '@/components/Reveal'
import { TrackedLink } from '@/components/TrackedLink'
import { SiteFooter } from '@/components/SiteFooter'
import { featuredProjects } from '@/data/projects'

type GitHubEvent = { type: string; repo?: { name?: string }; created_at: string }

const SKILLS = [
  'Agentic AI',
  'RAG',
  'Evals',
  'Python',
  'Spark',
  'GCP',
  'PostgreSQL',
  'Docker',
  'MCP',
  'Time-series forecasting'
]

async function getLastShip(): Promise<string | null> {
  try {
    const res = await fetch('https://api.github.com/users/Kugel-Blitz-13/events/public', {
      next: { revalidate: 3600 }
    })
    if (!res.ok) return null
    const events = (await res.json()) as GitHubEvent[]
    if (!Array.isArray(events)) return null
    const push = events.find((e) => e.type === 'PushEvent')
    if (!push) return null
    const repo = push.repo?.name?.split('/')[1] ?? 'github'
    const hours = Math.max(1, Math.round((Date.now() - new Date(push.created_at).getTime()) / 3600000))
    const when = hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`
    return `${when}, ${repo}`
  } catch {
    return null
  }
}

export default async function HomePage() {
  const lastShip = await getLastShip()
  return (
    <main>
      {/* Hero doubles as the about section: intro, how I build, and every link. */}
      <section id="about" className="relative pt-14 sm:pt-20">
        <PixelDrift />
        <Container>
          <div className="grid items-start gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                Agentic AI • ML Systems • Quantitative Modeling
              </p>

              <h1 className="mt-4 text-balance font-space text-4xl font-semibold leading-[1.1] sm:text-6xl">
                Machine learning for{' '}
                <span className="block min-h-[1.2em] bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
                  <TypedWords
                    words={[
                      'trading desks.',
                      'agentic systems.',
                      'applied research.',
                      'production pipelines.',
                      'power markets.'
                    ]}
                  />
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-pretty text-base text-white/70 sm:text-lg">
                I build ML systems that survive contact with production: demand forecasting on a proprietary trading desk, Boeing funded research on agentic AI for engineering design, and pipelines that run end to end from raw data to deployment. The domains vary; the standard does not. Evidence over vibes, tests over demos.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:opacity-90"
                >
                  View projects
                </Link>
                <Link
                  href="/resume?from=hero"
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Download resume
                </Link>
                <TrackedLink
                  href="mailto:mayankdixit132001@gmail.com"
                  event="contact_click"
                  data={{ source: 'hero' }}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Contact
                </TrackedLink>
                <TrackedLink
                  href="https://www.linkedin.com/in/mayank-dixit-max007/"
                  event="outbound_click"
                  data={{ destination: 'linkedin', source: 'hero' }}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  LinkedIn
                </TrackedLink>
                <TrackedLink
                  href="https://github.com/Kugel-Blitz-13"
                  event="outbound_click"
                  data={{ destination: 'github', source: 'hero' }}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  GitHub
                </TrackedLink>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="glass rounded-2xl p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                    How I build
                  </p>
                  <p className="mt-3 text-sm text-white/75">
                    I like projects where the hard part is the system: messy data, real-time
                    constraints, ambiguous objectives, and shipping something that holds up in
                    production.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-white/70">
                    <li>• Pipelines that are reproducible (tests, schemas, deterministic outputs)</li>
                    <li>• Reliability first, then performance (profiling, caching, batching)</li>
                    <li>• Quality measured with evals, not vibes (offline + online metrics)</li>
                  </ul>
                </div>

                <div className="glass rounded-2xl p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Now</p>
                  <p className="mt-3 text-sm text-white/75">
                    Quant work in power markets + Boeing funded research on MCP agent tooling.
                  </p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                    Focus
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    LLM agents, RAG, evaluation, data engineering, cloud deployment.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {SKILLS.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Tilt>
                <div className="glass relative overflow-hidden rounded-3xl p-2">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                    <Image
                      src="/photos/headshot.jpg"
                      alt="Headshot"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  </div>
                </div>
              </Tilt>
              <TerminalCard lastShip={lastShip} />
            </div>
          </div>

          <div className="mt-14 flex justify-center">
            <a
              href="#experience"
              aria-label="Scroll to experience"
              className="group flex flex-col items-center gap-1.5 text-white/40 transition hover:text-accent"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.3em]">the work</span>
              <svg
                className="h-6 w-6 animate-bounce"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 4v14m0 0 6-6m-6 6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </Container>
      </section>

      <section className="mt-14 border-y border-white/10 bg-white/[0.02] sm:mt-20">
        <StatTicker />
      </section>

      <section id="experience" className="pt-16 sm:pt-24">
        <Container>
          <Reveal>
            <SectionHeading kicker="Experience" title="My work through the years" />
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Most recent first. Parallel bars mean parallel lives.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <WorkTimeline />
          </Reveal>
        </Container>
      </section>

      <section className="pt-16 sm:pt-24">
        <Container>
          <Reveal>
            <SectionHeading kicker="Same story, as a chart" title="The career graph" />
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              x axis: years. y axis: ambition. Hover the peaks or pick a year.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <CareerCurve />
          </Reveal>
        </Container>
      </section>

      <section className="relative pt-16 sm:pt-24">
        <PixelDrift />
        <Container>
          <SectionHeading
            kicker="A few work examples"
            title="Projects with real systems, data, and constraints"
            right={
              <Link
                href="/projects"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                See all
              </Link>
            }
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featuredProjects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.08} className="h-full">
              <ProjectCard project={p} />
            </Reveal>
          ))}
          </div>
        </Container>
      </section>

      <section className="relative pt-16 sm:pt-24">
        <PixelDrift />
        <Container>
          <SectionHeading kicker="Publications" title="Selected papers" />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <TrackedLink
              href="https://www.researchgate.net/publication/370587091_Structure-Based_Learning_for_Robust_Defense_Against_Adversarial_Attacks_in_Autonomous_Driving_Agents"
              event="outbound_click"
              data={{ destination: 'researchgate', source: 'publications' }}
              className="glass rounded-3xl p-6 transition hover:border-white/25"
            >
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Robotics • Adversarial ML</p>
              <h3 className="mt-2 text-base font-semibold text-white">
                Structure-Based Learning for Robust Defense Against Adversarial Attacks in Autonomous Driving Agents
              </h3>
              <p className="mt-2 text-sm text-white/70">Read on ResearchGate →</p>
            </TrackedLink>

            <TrackedLink
              href="https://ieeexplore.ieee.org/document/10306508/"
              event="outbound_click"
              data={{ destination: 'ieee', source: 'publications' }}
              className="glass rounded-3xl p-6 transition hover:border-white/25"
            >
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Signal Processing • ViT</p>
              <h3 className="mt-2 text-base font-semibold text-white">
                Bearing Fault Detection (IEEE Xplore)
              </h3>
              <p className="mt-2 text-sm text-white/70">Read on IEEE Xplore →</p>
            </TrackedLink>
          </div>
        </Container>
      </section>

      {/* The arcade, photos, and music now live on /personal. */}
      <section className="relative pb-20 pt-16 sm:pt-24">
        <PixelDrift />
        <Container>
          <Reveal>
            <Link
              href="/personal"
              className="glass group block rounded-3xl p-6 transition hover:border-white/25 sm:p-8"
            >
              <p className="font-pixel text-[10px] tracking-wider text-accent/70">INSERT COIN</p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Off the clock
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-white/70">
                    Three games I built (tech wordle, bit flip, beat the forecast), photos from
                    wherever I was standing, and what is on loop while I code.
                  </p>
                </div>
                <span className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition group-hover:bg-white/10">
                  Open the arcade →
                </span>
              </div>
            </Link>
          </Reveal>
        </Container>
      </section>

      <SiteFooter />
    </main>
  )
}
