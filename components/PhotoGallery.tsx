type GalleryPhoto = { src: string; alt: string }

const photos: GalleryPhoto[] = [
  {
    src: '/photos/gallery/chicago-night.jpg',
    alt: 'Chicago skyline and river at night from above'
  },
  {
    src: '/photos/gallery/mirror-pond.jpg',
    alt: 'Trees reflected perfectly in still water at sunrise'
  },
  {
    src: '/photos/gallery/times-square.jpg',
    alt: 'Times Square billboards and traffic'
  },
  {
    src: '/photos/gallery/cloud-rainbow.jpg',
    alt: 'Cloud iridescence over the open sea'
  },
  {
    src: '/photos/gallery/lego-tumbler.jpg',
    alt: 'LEGO Batman Tumbler held in one hand'
  },
  {
    src: '/photos/gallery/winter-sunset.jpg',
    alt: 'Bright orange sunset over a snowy parking lot'
  },
  {
    src: '/photos/gallery/hearst-tower.jpg',
    alt: 'Diagrid glass facade of Hearst Tower against a blue sky'
  },
  {
    src: '/photos/gallery/golden-park.jpg',
    alt: 'Golden storm light over a park path lined with daffodils'
  },
  {
    src: '/photos/gallery/chapel.jpg',
    alt: 'Cathedral nave with hanging banners and stained glass'
  },
  {
    src: '/photos/gallery/line-out.jpg',
    alt: 'Fishing rod pointing over blue water toward a forested island'
  },
  {
    src: '/photos/gallery/chicago-day.jpg',
    alt: 'Chicago street with vintage lamps and towers'
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
        </div>
      ))}
    </div>
  )
}
