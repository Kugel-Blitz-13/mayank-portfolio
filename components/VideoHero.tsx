'use client'

import { useEffect, useRef } from 'react'

export function VideoHero({
  src,
  poster,
  className
}: {
  src: string
  poster?: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    // iOS Safari can be picky—try a best-effort autoplay.
    const v = ref.current
    if (!v) return
    const play = async () => {
      try {
        await v.play()
      } catch {
        // ignore
      }
    }
    play()
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
    />
  )
}
