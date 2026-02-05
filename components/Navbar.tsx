'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const nav = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/#about', label: 'About' },
  { href: '/#beyond', label: 'Beyond Work' }
]

export function Navbar() {
  const pathname = usePathname()
  return (
    <div className="sticky top-0 z-50 border-b border-white/5 bg-bg/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_18px_rgba(45,212,191,0.7)]" />
          <span className="text-sm font-medium tracking-wide text-white/90 group-hover:text-white">
            Mayank Dixit
          </span>
        </Link>
        <nav className="hidden gap-1 sm:flex">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'rounded-full px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white',
                  active && 'bg-white/5 text-white'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <Link
          href="/docs/Mayank_Dixit_Resume.pdf"
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/85 transition hover:bg-white/10"
        >
          Resume
        </Link>
      </div>
    </div>
  )
}
