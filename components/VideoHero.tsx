'use client'

export function VideoHero({
  src,
  poster,
  className = '',
}: {
  src: string
  poster?: string
  className?: string
}) {
  return (
    <video
      className={`absolute inset-0 h-full w-full object-cover block ${className}`}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  )
}
