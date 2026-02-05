import Image from 'next/image'

const photos = [
  { src: '/photos/cmu.jpg', alt: 'At Carnegie Mellon University' },
  { src: '/photos/cvip.jpg', alt: 'Conference moment' },
  { src: '/photos/hobbies/fishing_05___PM_png.jpg', alt: 'Angling adventure' },
  { src: '/photos/hobbies/fishing_18___PM_png.jpg', alt: 'Catch of the day' },
  { src: '/photos/hobbies/fishing_32___PM_png.jpg', alt: 'On the water' }
]

export function PhotoMosaic() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:col-span-2">
        <Image
          src={photos[0].src}
          alt={photos[0].alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 66vw"
        />
      </div>

      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <Image
          src={photos[1].src}
          alt={photos[1].alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 34vw"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:col-span-3">
        {photos.slice(2).map((p) => (
          <div
            key={p.src}
            className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="33vw" />
          </div>
        ))}
      </div>
    </div>
  )
}
