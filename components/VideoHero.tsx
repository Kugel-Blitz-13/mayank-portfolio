'use client'

type Props = {
  src: string
  poster?: string
  className?: string
}

export function VideoHero({ src, poster, className }: Props) {
  return (
    <div className={`relative w-full overflow-hidden rounded-2xl ${className ?? ''}`}>
      {/* Hard clamp to 16:9 */}
      <div className="relative aspect-video w-full overflow-hidden">
        <video
          className="block h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  )
}
