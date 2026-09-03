'use client'

import { useEffect, useState } from 'react'
import { track } from '@vercel/analytics'

export const RESUME_PDF = '/docs/Mayank_Dixit_Resume.pdf'

/**
 * Counts a resume download, then hands the visitor straight to the PDF.
 *
 * The visit to /resume is itself a page view, which is what makes downloads
 * countable on every Vercel plan; the custom event adds the click source and
 * only records on plans where custom events are enabled.
 *
 * location.replace keeps /resume out of history so Back does not bounce the
 * visitor through the redirect again.
 */
export function ResumeHandoff({ source }: { source: string }) {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    track('resume_download', { source })
    const go = window.setTimeout(() => window.location.replace(RESUME_PDF), 400)
    const nudge = window.setTimeout(() => setSlow(true), 2200)
    return () => {
      window.clearTimeout(go)
      window.clearTimeout(nudge)
    }
  }, [source])

  return (
    <p className="pt-3 text-white/70">
      <span className="text-accent">&gt;</span>{' '}
      {slow ? (
        <a className="text-accent underline decoration-dotted" href={RESUME_PDF}>
          open the PDF directly
        </a>
      ) : (
        <>
          opening resume
          <span className="caret text-accent">▊</span>
        </>
      )}
    </p>
  )
}
