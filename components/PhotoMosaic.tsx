import Image from 'next/image'

type Photo = { src: string; alt: string; caption?: string }

const gridPhotos: Photo[] = [
  {
    src: '/photos/hobbies/triathlon.jpg',
    alt: 'Finish area of the Supertri New Jersey triathlon',
    caption: 'Swim, bike, run. First triathlon in the books'
  },
  {
    src: '/photos/hobbies/fishing_05___PM_png.jpg',
    alt: 'Holding a moon tailed grouper on a boat',
    caption: 'Moon tailed grouper'
  },
  {
    src: '/photos/hobbies/fishing_18___PM_png.jpg',
    alt: 'Holding a king mackerel on a boat',
    caption: 'King mackerel'
  },
  {
    src: '/photos/hobbies/fishing_32___PM_png.jpg',
    alt: 'Holding a giant trevally on a boat',
    caption: 'Giant trevally'
  }
]

function Caption({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3 pb-2.5 pt-10">
      <p className="text-xs font-medium text-white/90">{text}</p>
    </div>
  )
}

export function PhotoMosaic() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:col-span-2 sm:aspect-auto">
        <Image
          src="/photos/cmu.jpg"
          alt="Standing in front of the Carnegie Mellon University sign"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>

      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <Image
          src="/photos/cvip.jpg"
          alt="At the CVIP 2022 conference"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 25vw"
        />
      </div>

      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <Image
          src="/photos/hobbies/snowboard.jpg"
          alt="Sitting on a snowy slope with a snowboard strapped in"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 25vw"
        />
        <Caption text="All the gear, some idea" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:col-span-4 sm:grid-cols-4">
        {gridPhotos.map((p) => (
          <div
            key={p.src}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
            {p.caption ? <Caption text={p.caption} /> : null}
          </div>
        ))}
      </div>
    </div>
  )
}
