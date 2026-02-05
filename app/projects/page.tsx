import Link from 'next/link'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { ProjectCard } from '@/components/ProjectCard'
import { featuredProjects, moreProjects } from '@/data/projects'

export default function ProjectsPage() {
  return (
    <main className="pt-14 pb-20 sm:pt-20">
      <Container>
        <SectionHeading
          kicker="Projects"
          title="Work across clean-tech, ML infra, and applied research"
          right={
            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Back home
            </Link>
          }
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>

        <div className="mt-12">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">More</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {moreProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} compact />
            ))}
          </div>
        </div>
      </Container>
    </main>
  )
}
