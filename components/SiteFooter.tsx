import { Container } from '@/components/Container'
import { PixelDrift } from '@/components/PixelDrift'

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 pb-10 pt-14">
      <PixelDrift />
      <Container>
        <p className="text-outline select-none whitespace-nowrap text-center font-space text-[11.5vw] font-bold leading-none tracking-tight sm:text-[7.5vw]">
          MAYANK DIXIT
        </p>
        <div className="mt-10 flex flex-col gap-2 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Mayank Dixit</p>
          <p className="text-white/50">Built with Next.js + Tailwind</p>
        </div>
      </Container>
    </footer>
  )
}
