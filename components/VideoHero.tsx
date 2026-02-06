'use client'

type Props = {
  src: string
  poster?: string
  className?: string
}

export function VideoHero({ src, poster }: { src: string; poster?: string }) {
  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
    />
  )
}