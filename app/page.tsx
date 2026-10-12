import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { TypedWords } from '@/components/TypedWords'
import { TerminalCard } from '@/components/TerminalCard'
import { WorkTimeline } from '@/components/WorkTimeline'
import { Tilt } from '@/components/Tilt'
import { Reveal } from '@/components/Reveal'
import { TrackedLink } from '@/components/TrackedLink'
import { SiteFooter } from '@/components/SiteFooter'
import { SelectedWork } from '@/components/SelectedWork'

type GitHubEvent = { type: string; repo?: { name?: string }; created_at: string }


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
      <section id="about" className="relative pt-14 sm:pt-20">
        <Container>
          <div className="grid items-start gap-10 md:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <div>
              <div className="flex items-center gap-3">
                {/* Phones get a small avatar here instead of the big portrait. */}
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/15 md:hidden">
                  <Image src="/photos/headshot.jpg" alt="" fill className="object-cover" sizes="44px" />
                </span>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                  ML engineer · Pittsburgh
                </p>
              </div>

              <h1 className="mt-4 text-balance font-space text-4xl font-semibold leading-[1.1] sm:text-6xl">
                Machine learning for{' '}
                <span className="block min-h-[1.2em] bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
                  <TypedWords
                    words={['power markets.', 'trading desks.', 'solar farms.', 'aircraft design.']}
                  />
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
                I&apos;m Mayank. I&apos;m finishing my master&apos;s in AI Engineering at Carnegie
                Mellon. This summer I built load forecasts for a power trading desk, and before CMU I
                spent two years as a data scientist at Gentari, PETRONAS&apos;s clean energy company.
                I also do Boeing-funded research on AI agents for aircraft design.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-4">
                <Link
                  href="#work"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  See my work
                </Link>
                <Link
                  href="/resume?from=hero"
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Resume
                </Link>
                <div className="flex items-center gap-5 text-sm font-medium text-white/60 sm:pl-2">
                  <TrackedLink
                    href="mailto:mayankdixit132001@gmail.com"
                    event="contact_click"
                    data={{ source: 'hero' }}
                    className="underline-offset-4 transition hover:text-white hover:underline"
                  >
                    Email
                  </TrackedLink>
                  <TrackedLink
                    href="https://www.linkedin.com/in/mayank-dixit-max007/"
                    event="outbound_click"
                    data={{ destination: 'linkedin', source: 'hero' }}
                    className="underline-offset-4 transition hover:text-white hover:underline"
                  >
                    LinkedIn
                  </TrackedLink>
                  <TrackedLink
                    href="https://github.com/Kugel-Blitz-13"
                    event="outbound_click"
                    data={{ destination: 'github', source: 'hero' }}
                    className="underline-offset-4 transition hover:text-white hover:underline"
                  >
                    GitHub
                  </TrackedLink>
                </div>
              </div>

              <div className="mt-10 max-w-xl">
                <TerminalCard lastShip={lastShip} />
              </div>
            </div>

            <Tilt className="hidden md:block">
              <div className="glass relative overflow-hidden rounded-3xl p-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <Image
                    src="/photos/headshot.jpg"
                    alt="Mayank Dixit"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>
            </Tilt>
          </div>

          <div className="mt-14 flex justify-center">
            <a
              href="#work"
              aria-label="Scroll to selected work"
              className="group flex flex-col items-center gap-1.5 text-white/40 transition hover:text-accent"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.3em]">my work</span>
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

      <section id="work" className="pt-12 sm:pt-16">
        <Container>
          <Reveal>
            <SectionHeading
              kicker="Selected work"
              title="A few things I've built"
              right={
                <Link
                  href="/projects"
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  All projects
                </Link>
              }
            />
          </Reveal>
          <div className="mt-8">
            <SelectedWork />
          </div>
        </Container>
      </section>

      <section id="experience" className="pt-16 sm:pt-24">
        <Container>
          <Reveal>
            <SectionHeading kicker="Experience" title="Where I've worked and studied" />
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <WorkTimeline />
          </Reveal>
        </Container>
      </section>

      <section className="pt-16 sm:pt-24">
        <Container>
          <SectionHeading kicker="Research" title="Papers" />

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

      {/* Everything playful lives on /personal. */}
      <section className="pb-20 pt-16 sm:pt-24">
        <Container>
          <Reveal>
            <Link
              href="/personal"
              className="group flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/55 transition hover:text-white"
            >
              <span>Off the clock: a few games I made, some photos, and what I&apos;m listening to.</span>
              <span className="font-semibold text-accent">Take a look →</span>
            </Link>
          </Reveal>
        </Container>
      </section>

      <SiteFooter />
    </main>
  )
}
