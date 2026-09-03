# Mayank Dixit — portfolio

Next.js 14 (App Router) + Tailwind.

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Pages

| Route | What lives there |
| --- | --- |
| `/` | Hero (doubles as About: intro, how I build, resume + LinkedIn + GitHub), experience timeline, career graph, featured projects, publications |
| `/personal` | The arcade (tech wordle, bit flip, beat the forecast), photos, gallery, music |
| `/projects`, `/projects/[slug]` | Full project list and detail pages |
| `/resume` | Records the download, then serves the PDF — see `ANALYTICS.md` |

## Edit content

- Projects: `data/projects.ts`
- Hero / about copy: `app/page.tsx`
- Games, photos, music: `app/personal/page.tsx`
- Experience timeline: `components/WorkTimeline.tsx`
- Media: `public/media` and `public/photos`
- Resume PDF: `public/docs/Mayank_Dixit_Resume.pdf` (keep the filename — links point at it)

## Visitor data

See [ANALYTICS.md](./ANALYTICS.md) for what Vercel records, where to find it,
and which parts need the Pro plan.

## Deploy

Import the repo into Vercel and deploy. Set `NEXT_PUBLIC_SITE_URL` to the real
domain in the project's environment variables so `sitemap.ts` and `robots.ts`
emit correct URLs.
