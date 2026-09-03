import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import { ResumeHandoff, RESUME_PDF } from '@/components/ResumeHandoff'

export const metadata: Metadata = {
  title: 'Resume | Mayank Dixit',
  robots: { index: false, follow: false }
}

/**
 * Every "resume" link on the site points here rather than at the PDF, so the
 * download shows up in Vercel Web Analytics as a page view on /resume.
 * ?from=<place> records which button was clicked.
 */
export default function ResumePage({
  searchParams
}: {
  searchParams?: { from?: string | string[] }
}) {
  const raw = searchParams?.from
  const from = Array.isArray(raw) ? raw[0] : raw
  const source = (from ?? 'direct').replace(/[^a-z0-9_-]/gi, '').slice(0, 32) || 'direct'

  return (
    <main className="pb-20 pt-24">
      <Container>
        <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-black/40 p-6 font-mono text-sm leading-7 backdrop-blur-xl">
          <div className="flex items-center gap-1.5 border-b border-white/10 pb-2.5">
            <span className="h-2 w-2 rounded-full bg-red-400/70" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
            <span className="h-2 w-2 rounded-full bg-green-400/70" />
            <span className="pl-2 text-white/40">mayank@desk ~ cat resume.pdf</span>
          </div>
          <ResumeHandoff source={source} />
          <noscript>
            <p className="pt-3 text-white/70">
              <a className="text-accent underline" href={RESUME_PDF}>
                Download the resume (PDF)
              </a>
            </p>
          </noscript>
        </div>
      </Container>
    </main>
  )
}
