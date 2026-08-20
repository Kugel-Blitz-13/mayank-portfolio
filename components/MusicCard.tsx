const STATSFM_PROFILE = 'https://stats.fm/kugelblitz'
const REVALIDATE_SECONDS = 604800 // refreshed weekly

type TopArtist = {
  position: number
  streams: number
  artist: {
    name: string
    image?: string
    genres?: string[]
  }
}

// keeps the panel recruiter safe: artist names containing these words are skipped
const EXPLICIT_WORDS = /\b(fuck|sex|shit|bitch|cunt|porn|nigga|whore|slut|dick)\b/i

async function getTopArtists(range: 'weeks' | 'lifetime'): Promise<TopArtist[] | null> {
  try {
    const res = await fetch(
      `https://api.stats.fm/api/v1/users/kugelblitz/top/artists?range=${range}&limit=12`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    )
    if (!res.ok) return null
    const data = await res.json()
    if (!Array.isArray(data?.items) || data.items.length === 0) return null
    const items = data.items as TopArtist[]
    return items.filter((a) => !EXPLICIT_WORDS.test(a.artist.name)).slice(0, 6)
  } catch {
    return null
  }
}

function ArtistGrid({ artists }: { artists: TopArtist[] }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {artists.map((a) => (
        <div
          key={a.artist.name}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center"
        >
          {a.artist.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={a.artist.image}
              alt={a.artist.name}
              className="mx-auto h-16 w-16 rounded-full border border-white/10 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white/40">
              ♪
            </div>
          )}
          <p className="mt-2 truncate text-sm font-medium text-white">{a.artist.name}</p>
          <p className="mt-0.5 text-xs text-white/45">{a.streams.toLocaleString('en-US')} plays</p>
        </div>
      ))}
    </div>
  )
}

export async function MusicCard() {
  const [recent, lifetime] = await Promise.all([
    getTopArtists('weeks'),
    getTopArtists('lifetime')
  ])

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
            The soundtrack
          </p>
          <h3 className="mt-2 text-base font-semibold text-white">On repeat, last 4 weeks</h3>
        </div>
        <a
          href={STATSFM_PROFILE}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          Full stats on stats.fm →
        </a>
      </div>

      {recent ? (
        <ArtistGrid artists={recent} />
      ) : (
        <p className="mt-4 text-sm text-white/60">
          Live listening data is taking a break. The full picture lives on my stats.fm page.
        </p>
      )}

      <div className="mt-7 border-t border-white/10 pt-6">
        <h3 className="text-base font-semibold text-white">All time heavy rotation</h3>
        {lifetime ? (
          <ArtistGrid artists={lifetime} />
        ) : (
          <p className="mt-4 text-sm text-white/60">
            Lifetime numbers are hiding right now. They live on my stats.fm page too.
          </p>
        )}
      </div>

      <p className="mt-5 text-xs text-white/40">
        Pulled from my Spotify history via stats.fm, refreshed weekly.
      </p>
    </div>
  )
}
