type GalleryPhoto = { src: string; alt: string; caption: string }

const photos: GalleryPhoto[] = [
  {
    src: '/photos/gallery/chicago-night.jpg',
    alt: 'Chicago skyline and river at night from above',
    caption: 'Chicago after dark'
  },
  {
    src: '/photos/gallery/mirror-pond.jpg',
    alt: 'Trees reflected perfectly in still water at sunrise',
    caption: 'Still water working as a mirror'
  },
  {
    src: '/photos/gallery/times-square.jpg',
    alt: 'Times Square billboards and traffic',
    caption: 'Sensory overload, Times Square'
  },
  {
    src: '/photos/gallery/cloud-rainbow.jpg',
    alt: 'Cloud iridescence over the open sea',
    caption: 'A rainbow that skipped the rain'
  },
  {
    src: '/photos/gallery/lego-tumbler.jpg',
    alt: 'LEGO Batman Tumbler held in one hand',
    caption: 'The Tumbler, built brick by brick'
  },
  {
    src: '/photos/gallery/winter-sunset.jpg',
    alt: 'Bright orange sunset over a snowy parking lot',
    caption: 'Sky on fire, ground in snow'
  },
  {
    src: '/photos/gallery/hearst-tower.jpg',
    alt: 'Diagrid glass facade of Hearst Tower against a blue sky',
    caption: 'Clean geometry on a clean sky'
  },
  {
    src: '/photos/gallery/golden-park.jpg',
    alt: 'Golden storm light over a park path lined with daffodils',
    caption: 'Golden hour after a storm'
  },
  {
    src: '/photos/gallery/chapel.jpg',
    alt: 'Cathedral nave with hanging banners and stained glass',
    caption: 'Stone, stained glass, perfect light'
  },
  {
    src: '/photos/gallery/line-out.jpg',
    alt: 'Fishing rod pointing over blue water toward a forested island',
    caption: 'Line out, waiting on a story'
  },
  {
    src: '/photos/gallery/chicago-day.jpg',
    alt: 'Chicago street with vintage lamps and towers',
    caption: 'Chicago in its afternoon best'
  }
]

export function PhotoGallery() {
  return (
    <div className="columns-2 gap-3 sm:columns-3">
      {photos.map((p) => (
        <div
          key={p.src}
          className="relative mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.src} alt={p.alt} loading="lazy" className="block w-full" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3 pb-2.5 pt-10">
            <p className="text-xs font-medium text-white/90">{p.caption}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
