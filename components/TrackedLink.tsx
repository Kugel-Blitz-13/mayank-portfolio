'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import type { ReactNode } from 'react'

type EventData = Record<string, string | number | boolean | null>

/**
 * A link that reports a custom event to Vercel Web Analytics on click.
 *
 * External links open in a new tab, so the page is never unloaded before the
 * beacon leaves. Internal links route through next/link as usual.
 */
export function TrackedLink({
  href,
  event,
  data,
  className,
  children,
  newTab
}: {
  href: string
  event: string
  data?: EventData
  className?: string
  children: ReactNode
  newTab?: boolean
}) {
  const isMail = href.startsWith('mailto:')
  const isExternal = isMail || /^https?:/.test(href)
  const onClick = () => track(event, data)

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        target={isMail ? undefined : '_blank'}
        rel={isMail ? undefined : 'noreferrer'}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onClick={onClick} target={newTab ? '_blank' : undefined}>
      {children}
    </Link>
  )
}
