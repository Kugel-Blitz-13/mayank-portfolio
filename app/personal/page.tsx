import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { PhotoMosaic } from '@/components/PhotoMosaic'
import { PhotoGallery } from '@/components/PhotoGallery'
import { MusicCard } from '@/components/MusicCard'
import { GameArcade } from '@/components/GameArcade'
import { PixelDrift } from '@/components/PixelDrift'
import { Reveal } from '@/components/Reveal'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Off the clock | Mayank Dixit',
  description:
    'Games I built, photos I took, music I loop: the parts of Mayank Dixit that are not on the resume.'
}

export default function PersonalPage() {
  return (
    <main>
      <section className="relative pt-14 sm:pt-20">
        <PixelDrift />
        <Container>
          <p className="font-pixel text-[10px] tracking-wider text-accent/70">PLAYER TWO</p>
          <h1 className="mt-4 text-balance font-space text-4xl font-semibold leading-[1.1] sm:text-5xl">
            Off the clock
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
            The work lives on the{' '}
            <Link href="/" className="text-accent underline decoration-dotted hover:text-white">
              home page
            </Link>
            . This is everything else: three games I built because the idea would not leave me alone,
            photos from wherever I happened to be standing, and what is on loop while I code.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#arcade"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
              Play something
            </a>
            <a
              href="#beyond"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Photos + music
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
            <SectionHeading kicker="Interactive" title="The arcade" />
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Three games. Tech wordle: six tries at a five letter word from code and AI, with hints when you struggle. Bit flip: match the binary before the clock runs out. Beat the forecast: five days against the model, the game I played all summer minus the money.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <GameArcade />
          </Reveal>
        </Container>
      </section>

      <section id="beyond" className="relative pt-16 pb-20 sm:pt-24">
        <PixelDrift />
        <Container>
          <SectionHeading kicker="Beyond work" title="Things I do when I’m not coding" />
          <p className="mt-4 max-w-2xl text-sm text-white/70">
            I like building prototypes, traveling for conferences, getting out on the water, racing triathlons, and pointing snowboards down hills.
          </p>
          <div className="mt-8">
            <Reveal>
              <PhotoMosaic />
            </Reveal>
          </div>
          <div className="mt-10">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Through the lens</p>
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

      <SiteFooter />
    </main>
  )
}
