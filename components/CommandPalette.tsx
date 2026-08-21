'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

type Action = { label: string; hint: string; href: string; external?: boolean }

const ACTIONS: Action[] = [
  { label: 'Go home', hint: 'page', href: '/' },
  { label: 'Experience: the career load curve', hint: 'section', href: '/#experience' },
  { label: 'All projects', hint: 'page', href: '/projects' },
  { label: 'About: how I build', hint: 'section', href: '/#about' },
  { label: 'Beyond work: photos + music', hint: 'section', href: '/#beyond' },
  { label: 'Download resume', hint: 'pdf', href: '/docs/Mayank_Dixit_Resume.pdf', external: true },
  { label: 'Email Mayank', hint: 'contact', href: 'mailto:mayankdixit132001@gmail.com', external: true },
  { label: 'LinkedIn', hint: 'link', href: 'https://www.linkedin.com/in/mayank-dixit-max007/', external: true },
  { label: 'GitHub', hint: 'link', href: 'https://github.com/Kugel-Blitz-13', external: true },
  { label: 'Listening stats on stats.fm', hint: 'link', href: 'https://stats.fm/kugelblitz', external: true },
  { label: 'Simulate a grid event', hint: 'easter egg', href: '#grid-event' }
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return ACTIONS
    return ACTIONS.filter(
      (a) => a.label.toLowerCase().includes(s) || a.hint.toLowerCase().includes(s)
    )
  }, [q])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('cmdk:open', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('cmdk:open', onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQ('')
      setSel(0)
      const t = setTimeout(() => inputRef.current?.focus(), 40)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    setSel(0)
  }, [q])

  const run = (a: Action) => {
    setOpen(false)
    if (a.href === '#grid-event') {
      window.dispatchEvent(new Event('grid:blackout'))
      return
    }
    if (a.external) {
      if (a.href.startsWith('mailto:')) {
        window.location.href = a.href
      } else {
        window.open(a.href, '_blank', 'noreferrer')
      }
    } else {
      router.push(a.href)
    }
  }

  const onInputKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSel((v) => Math.min(v + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel((v) => Math.max(v - 1, 0))
    } else if (e.key === 'Enter' && results[sel]) {
      run(results[sel])
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[18vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-[rgb(var(--surface))] shadow-glow"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4">
              <span className="font-mono text-sm text-accent">&gt;</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Jump anywhere..."
                className="w-full bg-transparent py-3.5 text-sm text-white placeholder:text-white/35 focus:outline-none"
              />
              <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/45">
                esc
              </kbd>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-white/40">
                  Nothing matches. The forecast did not see this coming.
                </p>
              ) : (
                results.map((a, i) => (
                  <button
                    key={a.href}
                    type="button"
                    onClick={() => run(a)}
                    onMouseEnter={() => setSel(i)}
                    className={
                      i === sel
                        ? 'flex w-full items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 text-left text-sm text-white'
                        : 'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-white/70'
                    }
                  >
                    <span>{a.label}</span>
                    <span className="text-xs uppercase tracking-wider text-white/35">
                      {a.hint}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
