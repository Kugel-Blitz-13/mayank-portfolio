'use client'

import { useEffect, useRef } from 'react'

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = ref.current
      if (!el) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      el.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 top-0 z-[90] h-[2px] origin-left bg-gradient-to-r from-accent to-accent2"
      style={{ transform: 'scaleX(0)' }}
      aria-hidden="true"
    />
  )
}
