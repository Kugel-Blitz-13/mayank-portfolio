import type { MetadataRoute } from "next";
import { featuredProjects, moreProjects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://mayank-portfolio.vercel.app";

  const all = [...featuredProjects, ...moreProjects];

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/projects`, lastModified: new Date() },
  ];

  const projectRoutes: MetadataRoute.Sitemap = all.map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...projectRoutes];
}
