import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { ProjectCard } from '@/components/ProjectCard'
import { VideoHero } from '@/components/VideoHero'
import { PhotoMosaic } from '@/components/PhotoMosaic'
import { featuredProjects } from '@/data/projects'

export default function HomePage() {
  return (
    <main>
      <section className="pt-14 sm:pt-20">
        <Container>
          <div className="grid items-start gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                Agentic AI • ML Platforms • Clean-Tech Optimization
              </p>

              <h1 className="mt-4 text-balance font-space text-4xl font-semibold leading-[1.05] sm:text-6xl">
                AI Engineer building agentic systems + ML platforms.
              </h1>

              <p className="mt-5 max-w-xl text-pretty text-base text-white/70 sm:text-lg">
                I build agentic AI workflows and scalable ML platforms, from data pipelines to model training, evaluation, and production deployment. Recent work spans grid-aware siting optimization, GCP-based ML pipelines, and industry-sponsored research on reliable tool interfaces for AI agents.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:opacity-20"
                >
                  View projects
                </Link>
                <a
                  href="/docs/Mayank_Dixit_Resume.pdf"
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Download resume
                </a>
                <a
                  href="mailto:mayankdixit132001@gmail.com"
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Contact
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Focus</p>
                  <p className="mt-2 text-sm text-white/75">
                    LLM agents, RAG, evaluation, data engineering, cloud deployment
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Stack</p>
                  <p className="mt-2 text-sm text-white/75">
                    Python, Spark, GCP, PostgreSQL, Docker, Next.js, Mapbox
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Now</p>
                  <p className="mt-2 text-sm text-white/75">
                    Research Assistant (MCP servers) + building grid-aware ML products
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2">
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
              <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <VideoHero src="/media/gridscout_hero.mp4" poster="/media/gridscout_poster.jpg" />
                </div>
                <p className="mt-3 text-xs text-white/60">
                  Demo clip: Grid-Scout (smart siting engine).
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pt-16 sm:pt-24">
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
            {featuredProjects.slice(0, 4).map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </Container>
      </section>

      <section className="pt-16 sm:pt-24">
        <Container>
          <SectionHeading kicker="Publications" title="Selected papers" />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <a
              href="https://www.researchgate.net/publication/370587091_Structure-Based_Learning_for_Robust_Defense_Against_Adversarial_Attacks_in_Autonomous_Driving_Agents"
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Robotics • Adversarial ML</p>
              <h3 className="mt-2 text-base font-semibold text-white">
                Structure-Based Learning for Robust Defense Against Adversarial Attacks in Autonomous Driving Agents
              </h3>
              <p className="mt-2 text-sm text-white/70">Read on ResearchGate →</p>
            </a>

            <a
              href="https://ieeexplore.ieee.org/document/10306508/"
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Signal Processing • ViT</p>
              <h3 className="mt-2 text-base font-semibold text-white">
                Bearing Fault Detection (IEEE Xplore)
              </h3>
              <p className="mt-2 text-sm text-white/70">Read on IEEE Xplore →</p>
            </a>
          </div>
        </Container>
      </section>

      <section id="about" className="pt-16 sm:pt-24">
        <Container>
          <SectionHeading kicker="About" title="How I build" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:col-span-2">
              <p className="text-white/75">
                I like projects where the hard part is the system: messy data, real-time constraints,
                ambiguous objectives, and shipping something that holds up in production.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                <li>• Build pipelines that are reproducible (tests, schemas, deterministic outputs)</li>
                <li>• Optimize for reliability first, then performance (profiling, caching, batching)</li>
                <li>• Measure quality with evals, not vibes (benchmarks, offline + online metrics)</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  'Agentic AI',
                  'RAG',
                  'Spark',
                  'GCP',
                  'PostgreSQL',
                  'Docker',
                  'MCP',
                  'Time-series forecasting'
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Links</p>
              <div className="mt-4 space-y-2 text-sm">
                <a className="block text-white/80 hover:text-white" href="https://www.linkedin.com/in/mayank-dixit-max007/" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a className="block text-white/80 hover:text-white" href="https://github.com/Kugel-Blitz-13" target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a className="block text-white/80 hover:text-white" href="/docs/Mayank_Dixit_Resume.pdf">
                  Resume (PDF)
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="beyond" className="pt-16 pb-20 sm:pt-24">
        <Container>
          <SectionHeading kicker="Beyond work" title="Things I do when I’m not coding" />
          <p className="mt-4 max-w-2xl text-sm text-white/70">
            I like building prototypes, traveling for conferences, and getting out on the water.
          </p>
          <div className="mt-8">
            <PhotoMosaic />
          </div>
        </Container>
      </section>

      <footer className="border-t border-white/10 py-10">
        <Container>
          <div className="flex flex-col gap-2 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Mayank Dixit</p>
            <p className="text-white/50">Built with Next.js + Tailwind</p>
          </div>
        </Container>
      </footer>
    </main>
  )
}
