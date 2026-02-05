import type { MetadataRoute } from "next";
import { projects } from "@/data/projects"; // adjust if your export name differs

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayank-portfolio-13.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/projects`, lastModified: new Date() },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p: any) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...projectRoutes];
}
