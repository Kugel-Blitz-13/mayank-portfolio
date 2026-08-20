import Link from 'next/link'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { PhotoMosaic } from '@/components/PhotoMosaic'
import { MusicCard } from '@/components/MusicCard'
import { Reveal } from '@/components/Reveal'

export const metadata = {
  title: 'Beyond Work | Mayank Dixit'
}

export default function BeyondPage() {
  return (
    <main className="pt-14 pb-20 sm:pt-20">
      <Container>
        <SectionHeading
          kicker="Beyond work"
          title="Things I do when I’m not coding"
          right={
            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Back home
            </Link>
          }
        />
        <p className="mt-4 max-w-2xl text-sm text-white/70">
          I like building prototypes, traveling for conferences, getting out on the water, and as of this summer, racing triathlons. If you want to talk fishing spots or split times, my inbox is open.
        </p>

        <div className="mt-8">
          <Reveal>
            <PhotoMosaic />
          </Reveal>
        </div>

        <div className="mt-4">
          <Reveal delay={0.1}>
            <MusicCard />
          </Reveal>
        </div>
      </Container>
    </main>
  )
}
