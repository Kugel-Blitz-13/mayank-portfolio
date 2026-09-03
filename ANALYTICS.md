# Reading the visitor data

Vercel Web Analytics and Speed Insights are both mounted in `app/layout.tsx`, so
data starts flowing as soon as a deploy goes out. Dashboard:

**Vercel → your project → Analytics**

## What you get on any plan (including Hobby)

These come from page views alone, no extra setup:

| Question | Where to look |
| --- | --- |
| How many people came, and when | **Visitors / Page Views** graph |
| Which links they came from | **Referrers** panel (google.com, linkedin.com, x.com, direct, …) |
| Which pages they actually read | **Pages** panel |
| Country, browser, device, OS | the panels under the graph |
| Did anyone open the resume | **Pages** panel → count of **`/resume`** |

That last row is the trick worth knowing about. Every resume link on the site
(hero button, navbar, command palette) points at `/resume`, not straight at the
PDF. `/resume` is a real page that records the visit and then hands the browser
to `public/docs/Mayank_Dixit_Resume.pdf`. So the `/resume` row in the Pages
panel *is* your download count, on any plan.

The query string says which button they used: `/resume?from=hero`,
`?from=nav`, `?from=palette`.

## What needs the Pro plan

Custom events are a paid feature. The calls are already in the code and cost
nothing while they are inactive — they simply do not record on Hobby. Upgrade
and they light up in the **Events** panel with no code changes:

| Event | Fires when | Properties |
| --- | --- | --- |
| `resume_download` | someone lands on `/resume` | `source` (hero, nav, palette, direct) |
| `outbound_click` | LinkedIn, GitHub, ResearchGate, IEEE | `destination`, `source` |
| `contact_click` | the Contact / email button | `source` |
| `game_opened` | an arcade tab is selected on `/personal` | `game` (wordle, bitflip, forecast) |

Two notes on plan limits:

- Hobby includes 50,000 events/month and a **1 month** reporting window; Pro
  extends that to 12 months.
- Custom events allow **2** properties per event on Pro, 8 with the Web
  Analytics Plus add-on. Every event above stays within 2.

UTM parameters (`?utm_source=…`, useful if you want to tag a link in a job
application) need Pro **plus** the Web Analytics Plus add-on. Without it, plain
referrers still work.

## One-time setup on Vercel

1. Project → **Analytics** tab → **Enable** (once per project).
2. Project → **Settings → Environment Variables** → set `NEXT_PUBLIC_SITE_URL`
   to the real domain. `.env.local` still holds the placeholder
   `https://YOUR-VERCEL-URL.vercel.app`, which is what `sitemap.ts` and
   `robots.ts` hand to Google.

## Adding a new tracked link

Use `TrackedLink` instead of `<a>`:

```tsx
<TrackedLink
  href="https://scholar.google.com/..."
  event="outbound_click"
  data={{ destination: 'scholar', source: 'publications' }}
  className="..."
>
  Google Scholar
</TrackedLink>
```

It opens external links in a new tab, so the beacon always has time to leave
before the page changes.
