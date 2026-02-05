import type { MetadataRoute } from "next"
import { featuredProjects, moreProjects } from "@/data/projects"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://mayank-portfolio.vercel.app"

  const projectUrls = [...featuredProjects, ...moreProjects].map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    lastModified: new Date(),
  }))

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/projects`, lastModified: new Date() },
    { url: `${siteUrl}/about`, lastModified: new Date() },
    { url: `${siteUrl}/beyond-work`, lastModified: new Date() },
    ...projectUrls,
  ]
}
