import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { PhotoMosaic } from '@/components/PhotoMosaic'
import { PhotoGallery } from '@/components/PhotoGallery'
import { MusicCard } from '@/components/MusicCard'
import { GameArcade } from '@/components/GameArcade'
import { IdleCube } from '@/components/IdleCube'
import { PixelDrift } from '@/components/PixelDrift'
import { Reveal } from '@/components/Reveal'
import { CareerCurve } from '@/components/CareerCurve'
import { OffTheClockShapes } from '@/components/GlyphShapes'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Off the clock | Mayank Dixit',
  description:
    'Games I made, photos I’ve taken, and what I’m listening to.'
}

export default function PersonalPage() {
  return (
    <main>
      <section className="relative overflow-x-clip pt-14 sm:pt-20">
        <PixelDrift />
        <OffTheClockShapes />
        <Container>
          <p className="font-pixel text-[10px] tracking-wider text-accent/70">PLAYER TWO</p>
          <h1 className="mt-4 text-balance font-space text-4xl font-semibold leading-[1.1] sm:text-5xl">
            Off the clock
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
            The fun stuff. A few games I made, a cube that turns itself, photos I&apos;ve taken, and
            what I&apos;m listening to. The work is on the{' '}
            <Link href="/" className="text-accent underline decoration-dotted hover:text-white">
              home page
            </Link>
            .
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#arcade"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
              Play a game
            </a>
            <a
              href="#beyond"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Photos and music
            </a>
            <Link
              href="/projects"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Back to the work
            </Link>
          </div>
        </Container>
      </section>

      <section id="arcade" className="relative pt-16 sm:pt-24">
        <PixelDrift />
        <Container>
          <Reveal>
            <p className="font-pixel text-[10px] tracking-wider text-accent/70">INSERT COIN</p>
            <SectionHeading title="The arcade" />
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Tech Wordle is Wordle with programming words, plus hints if you get stuck. Bit Flip has
              you match binary numbers against the clock. Beat the Forecast puts you up against a
              forecasting model for five days.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <GameArcade />
          </Reveal>
        </Container>
      </section>

      <section id="cube" className="relative pt-16 sm:pt-24">
        <PixelDrift />
        <Container>
          <Reveal>
            <p className="font-pixel text-[10px] tracking-wider text-accent/70">IDLE HANDS</p>
            <SectionHeading title="The idle cube" />
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <IdleCube />
          </Reveal>
        </Container>
      </section>

      <section id="career" className="relative pt-16 sm:pt-24">
        <PixelDrift />
        <Container>
          <Reveal>
            <SectionHeading kicker="My story" title="The career graph" />
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Years across, ambition up. Hover a peak or pick a year.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <CareerCurve />
          </Reveal>
        </Container>
      </section>

      <section id="beyond" className="relative pt-16 pb-20 sm:pt-24">
        <PixelDrift />
        <Container>
          <SectionHeading kicker="Away from the desk" title="Outside of work" />
          <p className="mt-4 max-w-2xl text-sm text-white/70">
            I fish, race triathlons, snowboard, and travel whenever I get the chance.
          </p>
          <div className="mt-8">
            <Reveal>
              <PhotoMosaic />
            </Reveal>
          </div>
          <div className="mt-10">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Photos I’ve taken</p>
              <div className="mt-4">
                <PhotoGallery />
              </div>
            </Reveal>
          </div>
          <div className="mt-10">
            <Reveal delay={0.1}>
              <MusicCard />
            </Reveal>
          </div>
        </Container>
      </section>

      <SiteFooter arcade />
    </main>
  )
}
