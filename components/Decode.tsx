'use client'

import { useEffect, useRef, useState } from 'react'

const CHARS = '!<>[]$#%&*+=/01'

export function Decode({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text)
  const ref = useRef<HTMLSpanElement>(null)
  const played = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let intervalId: ReturnType<typeof setInterval> | null = null
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || played.current) return
        played.current = true
        obs.disconnect()
        let frame = 0
        const total = Math.max(text.length * 2, 18)
        intervalId = setInterval(() => {
          frame++
          const resolved = Math.floor((frame / total) * text.length)
          let out = ''
          for (let i = 0; i < text.length; i++) {
            if (i < resolved || text[i] === ' ') out += text[i]
            else out += CHARS[Math.floor(Math.random() * CHARS.length)]
          }
          setDisplay(out)
          if (resolved >= text.length) {
            if (intervalId) clearInterval(intervalId)
            setDisplay(text)
          }
        }, 30)
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      if (intervalId) clearInterval(intervalId)
    }
  }, [text])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
